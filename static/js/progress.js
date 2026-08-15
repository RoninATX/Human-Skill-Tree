/**
 * progress.js - per-user skill progression tracking (Lane 2 / 9ig8).
 *
 * Stored on the account record (via Auth.updateUser):
 *
 *   progress: {
 *     [skillId]: {
 *       level: 0-6,
 *       log: [{ level, at (ISO), note }]   // newest last; self-assessed claims
 *     }
 *   }
 *
 * Levels index the skill's proficiency ladder (taxonomy/mastery framework);
 * 0 = not started. Claims are self-assessment only for now - the log's note
 * field is the seam for evidence/artifacts (URLs, cert references) until a
 * backend exists.
 */
const Progress = (() => {

    function getRecord() {
        const user = Auth.currentUser();
        return (user && user.progress) ? user.progress : {};
    }

    /** The user's current level in a skill, or null if untouched. */
    function getLevel(skillId) {
        const entry = getRecord()[skillId];
        return entry ? entry.level : null;
    }

    function getLog(skillId) {
        const entry = getRecord()[skillId];
        // Tolerate older/corrupted records: an entry without a log array.
        return (entry && Array.isArray(entry.log)) ? entry.log : [];
    }

    /** Count of skills the user has started (level > 0). */
    function startedCount() {
        return Object.values(getRecord()).filter(e => e.level > 0).length;
    }

    /**
     * Claim a level in a skill. Appends to the log (self-assessed claim with
     * optional note/evidence pointer) and updates the current level.
     * Level may move up OR down (decay/refresher honesty) - both are logged.
     */
    function setLevel(skillId, level, note = '') {
        const user = Auth.currentUser();
        if (!user) throw new Error('Sign in to track your progress.');
        level = Math.round(Number(level));
        if (!Number.isFinite(level) || level < 0 || level > 6) {
            throw new Error('Level must be 0-6.');
        }
        const progress = getRecord();
        const entry = progress[skillId] || { level: 0, log: [] };
        if (!Array.isArray(entry.log)) entry.log = []; // corrupted record
        if (level === entry.level) return entry; // no-op, don't spam the log
        entry.log = [...entry.log, {
            level,
            at: new Date().toISOString(),
            note: String(note || '').trim().slice(0, 500)
        }];
        entry.level = level;
        progress[skillId] = entry;
        Auth.updateUser(user.email, { progress });
        return entry;
    }

    return { getLevel, getLog, setLevel, startedCount };
})();
