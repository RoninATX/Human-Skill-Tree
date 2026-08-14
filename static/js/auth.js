/**
 * auth.js - local-first account store for Human-Skill-Tree.
 *
 * The app is static (no backend), so accounts live in localStorage behind a
 * small async API. If a real auth service is adopted later, only this module
 * changes - callers use Auth.* and never touch storage directly.
 *
 * Passwords are salted and hashed with WebCrypto SHA-256; plaintext never
 * touches storage. This is a convenience barrier, not server-grade security.
 *
 * Validation and failure semantics follow the conventions used in
 * goshuin-journey's auth (NextAuth credentials + zod there): name 1-100 chars,
 * real email shape, password >= 8 chars, ONE generic login failure message so
 * the UI never reveals whether an address exists, and a per-email login
 * attempt limiter (5 attempts / 15 min, softening to a short lockout).
 * `emailVerified` exists on the record for future gating; local signup sets
 * it true - a real backend flips this to token-verified email.
 *
 * Storage keys:
 *   hst_users    { [email]: { name, email, passHash, salt, avatar, interests,
 *                             emailVerified, createdAt } }
 *   hst_session  email of the logged-in user (absent when logged out)
 *   hst_login_attempts  { [email]: { count, firstAt, lockedUntil } }
 */
const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const Auth = (() => {
    const USERS_KEY = 'hst_users';
    const SESSION_KEY = 'hst_session';

    function loadUsers() {
        try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
        catch { return {}; }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    function randomSalt() {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }

    async function hashPassword(password, salt) {
        const data = new TextEncoder().encode(`${salt}:${password}`);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    }

    function publicUser(user) {
        if (!user) return null;
        const { passHash, salt, ...rest } = user;
        return rest;
    }

    function loadAttempts() {
        try { return JSON.parse(localStorage.getItem('hst_login_attempts')) || {}; }
        catch { return {}; }
    }

    function recordFailedLogin(email) {
        const attempts = loadAttempts();
        const now = Date.now();
        const rec = attempts[email];
        if (!rec || now - rec.firstAt > LOGIN_WINDOW_MS) {
            attempts[email] = { count: 1, firstAt: now, lockedUntil: 0 };
        } else {
            rec.count += 1;
            if (rec.count >= LOGIN_ATTEMPT_LIMIT) rec.lockedUntil = now + LOCKOUT_MS;
        }
        localStorage.setItem('hst_login_attempts', JSON.stringify(attempts));
    }

    function clearFailedLogins(email) {
        const attempts = loadAttempts();
        delete attempts[email];
        localStorage.setItem('hst_login_attempts', JSON.stringify(attempts));
    }

    function assertNotLocked(email) {
        const rec = loadAttempts()[email];
        if (rec && rec.lockedUntil && Date.now() < rec.lockedUntil) {
            const mins = Math.ceil((rec.lockedUntil - Date.now()) / 60000);
            throw new Error(`Too many failed attempts. Try again in ${mins} min.`);
        }
    }

    async function signup({ name, email, password }) {
        email = normalizeEmail(email);
        name = String(name || '').trim();
        if (!name || name.length > 100) throw new Error('Name is required (max 100 characters).');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.');

        const users = loadUsers();
        if (users[email]) throw new Error('An account with that email already exists.');

        const salt = randomSalt();
        const user = {
            name,
            email,
            salt,
            passHash: await hashPassword(password, salt),
            avatar: null,
            interests: [],
            // Local accounts can't verify email without a backend; a real
            // auth service would set this false until a token is consumed.
            emailVerified: true,
            createdAt: new Date().toISOString()
        };
        users[email] = user;
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, email);
        return publicUser(user);
    }

    async function login(email, password) {
        email = normalizeEmail(email);
        assertNotLocked(email);
        const user = loadUsers()[email];
        // One generic message on every failure branch: the UI must not reveal
        // whether the address exists (same posture as goshuin-journey).
        const GENERIC = 'Invalid email or password.';
        if (!user) { recordFailedLogin(email); throw new Error(GENERIC); }
        const attempt = await hashPassword(password, user.salt);
        if (attempt !== user.passHash) { recordFailedLogin(email); throw new Error(GENERIC); }
        clearFailedLogins(email);
        localStorage.setItem(SESSION_KEY, email);
        return publicUser(user);
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
    }

    function currentUser() {
        const email = localStorage.getItem(SESSION_KEY);
        if (!email) return null;
        return publicUser(loadUsers()[email] || null);
    }

    /** Patch the given user's profile fields (name, avatar, interests). */
    function updateUser(email, patch) {
        email = normalizeEmail(email);
        const users = loadUsers();
        if (!users[email]) throw new Error('Account not found.');
        const allowed = ['name', 'avatar', 'interests'];
        for (const key of allowed) {
            if (key in patch) users[email][key] = patch[key];
        }
        saveUsers(users);
        return publicUser(users[email]);
    }

    return { signup, login, logout, currentUser, updateUser };
})();
