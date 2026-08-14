/**
 * profile.js - profile UI for Human-Skill-Tree.
 *
 * Wires the floating #profileButton:
 *   logged out -> auth modal (login / signup tabs)
 *   logged in  -> profile panel (identity, avatar, interest tag cloud, logout)
 *
 * The interest cloud is grouped by the 9 domains. Suggested tags come from the
 * domain's category and skill labels in graph_data.json; freeform tags can be
 * added per domain. Selections persist on the user record via Auth.updateUser.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const profileButton = document.getElementById('profileButton');

    // Fetch graph data for domain colors and suggested interest tags.
    const graphData = await (await fetch('static/data/graph_data.json')).json();
    const domains = graphData.nodes
        .filter(n => n.data.type === 'domain')
        .map(n => ({ id: n.data.id, label: n.data.label, color: n.data.color }));
    // A label can be both a category and a skill in the same domain (e.g.
    // "Writing" in Creative) - dedupe so chips never repeat.
    const suggestionsByDomain = {};
    for (const n of graphData.nodes) {
        if ((n.data.type === 'category' || n.data.type === 'skill') && n.data.domain) {
            const list = suggestionsByDomain[n.data.domain] || (suggestionsByDomain[n.data.domain] = []);
            if (!list.includes(n.data.label)) list.push(n.data.label);
        }
    }

    // ---------- modal shell ----------
    const overlay = document.createElement('div');
    overlay.id = 'profileOverlay';
    overlay.className = 'profile-overlay hidden';
    overlay.innerHTML = `
        <div class="profile-modal" role="dialog" aria-modal="true">
            <button class="profile-close" aria-label="Close">&times;</button>
            <div class="profile-body"></div>
        </div>`;
    document.body.appendChild(overlay);
    const body = overlay.querySelector('.profile-body');

    function openModal() { overlay.classList.remove('hidden'); }
    function closeModal() { overlay.classList.add('hidden'); }
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.querySelector('.profile-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Escape user-controlled strings before they go anywhere near innerHTML.
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function syncInterestCount() {
        const el = body.querySelector('.interest-count');
        const user = Auth.currentUser();
        if (el && user) el.textContent = `${(user.interests || []).length} selected`;
    }

    // ---------- avatar ----------
    function avatarHtml(user, size = 72) {
        if (user && user.avatar) {
            return `<img class="avatar" style="width:${size}px;height:${size}px" src="${user.avatar}" alt="Profile picture">`;
        }
        return `<div class="avatar avatar-placeholder" style="width:${size}px;height:${size}px"><i class="fas fa-user"></i></div>`;
    }

    function refreshProfileButton() {
        const user = Auth.currentUser();
        profileButton.innerHTML = user && user.avatar
            ? `<img class="avatar" style="width:100%;height:100%;border-radius:50%" src="${user.avatar}" alt="">`
            : '<i class="fas fa-user"></i>';
        profileButton.title = user ? user.name : 'Sign in';
    }

    function downscaleImage(file, maxSize = 128) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(img.src);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('Could not read that image.')); };
            img.src = URL.createObjectURL(file);
        });
    }

    // ---------- auth views ----------
    function showAuth(mode = 'login') {
        body.innerHTML = `
            <div class="auth-tabs">
                <button class="auth-tab ${mode === 'login' ? 'active' : ''}" data-mode="login">Log in</button>
                <button class="auth-tab ${mode === 'signup' ? 'active' : ''}" data-mode="signup">Sign up</button>
            </div>
            <form class="auth-form" novalidate>
                ${mode === 'signup' ? '<input type="text" name="name" placeholder="Display name" maxlength="100" required>' : ''}
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password${mode === 'signup' ? ' (min 8 chars)' : ''}" required>
                <p class="auth-error" hidden></p>
                <button type="submit" class="auth-submit">${mode === 'login' ? 'Log in' : 'Create account'}</button>
            </form>
            <p class="auth-note">Accounts are stored locally in this browser.</p>`;

        body.querySelectorAll('.auth-tab').forEach(tab =>
            tab.addEventListener('click', () => showAuth(tab.dataset.mode)));

        const form = body.querySelector('.auth-form');
        const error = body.querySelector('.auth-error');
        form.addEventListener('submit', async e => {
            e.preventDefault();
            error.hidden = true;
            const data = Object.fromEntries(new FormData(form));
            try {
                if (mode === 'signup') await Auth.signup(data);
                else await Auth.login(data.email, data.password);
                refreshProfileButton();
                // The taxonomy overlay is per-user: rebuild the graph so the
                // previous session's categories don't leak into this one.
                if (window.HST_sessionChanged) window.HST_sessionChanged();
                showProfile();
            } catch (err) {
                error.textContent = err.message;
                error.hidden = false;
            }
        });
    }

    // ---------- interest tag cloud ----------
    function renderInterests(user, container) {
        const selected = new Map((user.interests || []).map(i => [i.tag, i.domain]));
        container.innerHTML = '';

        for (const domain of domains) {
            const group = document.createElement('div');
            group.className = 'interest-group';
            group.innerHTML = `<h4 style="border-color:${domain.color}">${domain.label}</h4>`;
            const cloud = document.createElement('div');
            cloud.className = 'interest-cloud';

            const suggested = suggestionsByDomain[domain.id] || [];
            const custom = (user.interests || []).filter(i => i.domain === domain.id && !suggested.includes(i.tag));
            const tags = [...suggested, ...custom.map(c => c.tag)];

            for (const tag of tags) {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'interest-chip' + (selected.has(tag) ? ' selected' : '');
                chip.textContent = tag;
                if (selected.has(tag)) chip.style.background = domain.color;
                chip.addEventListener('click', () => {
                    const u = Auth.currentUser();
                    let interests = u.interests || [];
                    if (selected.has(tag)) {
                        interests = interests.filter(i => i.tag !== tag);
                        selected.delete(tag);
                    } else {
                        interests = [...interests, { tag, domain: domain.id }];
                        selected.set(tag, domain.id);
                    }
                    Auth.updateUser(u.email, { interests });
                    chip.classList.toggle('selected');
                    chip.style.background = chip.classList.contains('selected') ? domain.color : '';
                    syncInterestCount();
                });
                cloud.appendChild(chip);
            }

            const addForm = document.createElement('form');
            addForm.className = 'interest-add';
            addForm.innerHTML = `<input type="text" maxlength="40" placeholder="+ add your own" aria-label="Add a ${domain.label} interest">`;
            addForm.addEventListener('submit', e => {
                e.preventDefault();
                const input = addForm.querySelector('input');
                const tag = input.value.trim();
                if (!tag || selected.has(tag)) { input.value = ''; return; }
                const u = Auth.currentUser();
                const interests = [...(u.interests || []), { tag, domain: domain.id }];
                Auth.updateUser(u.email, { interests });
                selected.set(tag, domain.id);
                renderInterests(Auth.currentUser(), container);
                syncInterestCount();
            });

            group.appendChild(cloud);
            group.appendChild(addForm);
            container.appendChild(group);
        }
    }

    // ---------- profile view ----------
    function showProfile() {
        const user = Auth.currentUser();
        if (!user) { showAuth(); return; }
        const domainLabel = id => (domains.find(d => d.id === id) || {}).label || id;
        const count = (user.interests || []).length;

        body.innerHTML = `
            <div class="profile-header">
                ${avatarHtml(user)}
                <div>
                    <h3 class="profile-name">${escapeHtml(user.name)}</h3>
                    <p class="profile-email">${escapeHtml(user.email)}</p>
                    <p class="profile-since">Member since ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="profile-actions">
                <label class="profile-action">Change picture
                    <input type="file" accept="image/*" hidden>
                </label>
                <button class="profile-action" data-act="edit-name">Edit name</button>
                <button class="profile-action danger" data-act="logout">Log out</button>
            </div>
            <div class="profile-interests">
                <h3>Interests <span class="interest-count">${count} selected</span></h3>
                <p class="hint">Pick from the suggestions or add your own, grouped by domain.</p>
                <div class="interest-groups"></div>
            </div>`;

        body.querySelector('input[type="file"]').addEventListener('change', async e => {
            const file = e.target.files[0];
            if (!file) return;
            const avatar = await downscaleImage(file);
            Auth.updateUser(user.email, { avatar });
            refreshProfileButton();
            showProfile();
        });

        body.querySelector('[data-act="edit-name"]').addEventListener('click', () => {
            const name = prompt('Display name:', user.name);
            if (name && name.trim()) {
                Auth.updateUser(user.email, { name: name.trim().slice(0, 100) });
                refreshProfileButton();
                showProfile();
            }
        });

        body.querySelector('[data-act="logout"]').addEventListener('click', () => {
            Auth.logout();
            refreshProfileButton();
            if (window.HST_sessionChanged) window.HST_sessionChanged();
            closeModal();
        });

        renderInterests(user, body.querySelector('.interest-groups'));
        // keep domainLabel referenced (used by future per-domain summaries)
        void domainLabel;
    }

    // ---------- wire up ----------
    profileButton.addEventListener('click', () => {
        if (Auth.currentUser()) showProfile();
        else showAuth('login');
        openModal();
    });

    refreshProfileButton();
});
