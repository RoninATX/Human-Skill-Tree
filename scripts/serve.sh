#!/usr/bin/env bash
# serve.sh - start/stop/status for the Human-Skill-Tree static site.
# No build step, no Docker: serves the repo root over python's http.server.
#
# Usage:
#   scripts/serve.sh start [port]   # default port 8000
#   scripts/serve.sh stop
#   scripts/serve.sh status
#   scripts/serve.sh restart [port]
#
# State lives in .serve.pid / .serve.log at the repo root (both git-ignored).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PIDFILE="$ROOT/.serve.pid"
LOGFILE="$ROOT/.serve.log"
PORT="${2:-8000}"
URL="http://localhost:$PORT"

pick_python() {
    # Accept only interpreters that provide Python 3's http.server module;
    # a bare `python` can still be Python 2 on some systems.
    local c
    for c in python py python3; do
        if command -v "$c" >/dev/null 2>&1 && "$c" -c "import http.server" >/dev/null 2>&1; then
            echo "$c"
            return 0
        fi
    done
    echo "ERROR: no Python 3 interpreter found on PATH (tried: python, py, python3)" >&2
    exit 1
}

require_curl() {
    command -v curl >/dev/null 2>&1 || {
        echo "ERROR: curl is required for health checks but was not found on PATH." >&2
        exit 1
    }
}

is_running() {
    [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null
}

health_check() {
    # Wait up to ~5s for the server to answer, then verify it serves the app.
    for _ in 1 2 3 4 5 6 7 8 9 10; do
        if curl -sf -o /dev/null --max-time 2 "$URL/index.html"; then
            curl -sf -o /dev/null --max-time 2 "$URL/static/data/graph_data.json" \
                && curl -sf -o /dev/null --max-time 2 "$URL/static/js/visualization.js"
            return $?
        fi
        sleep 0.5
    done
    return 1
}

cmd_start() {
    require_curl
    if is_running; then
        if curl -sf -o /dev/null --max-time 1 "$URL/index.html"; then
            echo "Already running (pid $(cat "$PIDFILE")) at $URL"
        else
            echo "Already running (pid $(cat "$PIDFILE")), but on a different port - $URL does not answer." >&2
            echo "       Use 'scripts/serve.sh status', or 'stop' first to move ports." >&2
            return 1
        fi
        return 0
    fi
    if curl -sf -o /dev/null --max-time 1 "$URL/index.html"; then
        echo "ERROR: $URL already answers but no pidfile - something else owns port $PORT." >&2
        echo "       Stop it or pick another port: scripts/serve.sh start 8080" >&2
        exit 1
    fi
    local py; py="$(pick_python)"
    cd "$ROOT"
    "$py" -m http.server "$PORT" --bind 127.0.0.1 >"$LOGFILE" 2>&1 &
    echo $! > "$PIDFILE"
    if health_check; then
        echo "Serving $ROOT at $URL (pid $(cat "$PIDFILE"), log: .serve.log)"
    else
        echo "ERROR: server started (pid $(cat "$PIDFILE")) but failed health check. Last log lines:" >&2
        tail -5 "$LOGFILE" >&2 || true
        cmd_stop || true
        exit 1
    fi
}

cmd_stop() {
    if is_running; then
        kill "$(cat "$PIDFILE")" 2>/dev/null || true
        rm -f "$PIDFILE"
        echo "Stopped."
    else
        rm -f "$PIDFILE"
        echo "Not running."
    fi
}

cmd_status() {
    require_curl
    if is_running; then
        echo "Running (pid $(cat "$PIDFILE")) - probing $URL"
        curl -sf -o /dev/null --max-time 2 "$URL/index.html" && echo "Health: OK" || echo "Health: FAIL (process up, not answering)"
    else
        echo "Not running."
    fi
}

case "${1:-}" in
    start)   cmd_start ;;
    stop)    cmd_stop ;;
    status)  cmd_status ;;
    restart) cmd_stop; cmd_start ;;
    *) echo "Usage: scripts/serve.sh {start|stop|status|restart} [port]" >&2; exit 2 ;;
esac
