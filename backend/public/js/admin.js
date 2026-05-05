// ============================================================
// ADMIN.JS – Painel Administrativo
// Todos os dados são carregados da API. Zero dados mockados.
// ============================================================

// ------------------------------------------------------------------
// Estado global
// ------------------------------------------------------------------
const adminData = {
    stats: { properties: 0, users: 0, vendors: 0, revenue: 0 },
    recentActivities: [],
    recentProperties: [],
    allProperties: [],
    users: [],
    vendors: [],
    notifications: [],
};

let appState = {
    currentSection: 'dashboard',
    editingProperty: null,
    searchQuery: '',
    currentReport: 'financeiro',
    propertiesPage: 1,
    usersPage: 1,
    vendorsPage: 1,
};

let currentUser = null;

// ------------------------------------------------------------------
// Auth helpers
// ------------------------------------------------------------------
function getAuthToken() { return localStorage.getItem('authToken'); }
function clearAuthToken() { localStorage.removeItem('authToken'); }

function getInitialsFromName(name) {
    if (!name) return 'AD';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || 'AD';
}

function createInitialsAvatar(name, size) {
    size = size || 64;
    const initials = getInitialsFromName(name);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 0, size, size);
    ctx.font = Math.floor(size * 0.45) + 'px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2);
    return canvas.toDataURL('image/png');
}

async function fetchCurrentUser() {
    try {
        const data = await apiGetCurrentUser();
        return data && data.user ? data.user : (data && data.data ? data.data : data || null);
    } catch (e) { return null; }
}

function applyAdminProfileUI(user) {
    if (!user) return;
    const nameEl   = document.getElementById('adminUserName');
    const avatarEl = document.getElementById('adminUserAvatar');
    if (nameEl)   nameEl.textContent = user.name || 'Administrador';
    if (avatarEl) avatarEl.src = user.avatar || createInitialsAvatar(user.name);
}

async function logoutAdmin() {
    try { await apiLogout(); } catch (e) { /* ignore */ }
    clearAuthToken();
    window.location.href = '../index.html';
}

function clearLocalData() {
    ['favorites','currentUser','hostSignupFormData','vendor_profile_payments','reservas','property_reviews'].forEach(function(k){ localStorage.removeItem(k); });
}

async function initAdminAuth() {
    clearLocalData();
    const user = await fetchCurrentUser();
    if (user) { currentUser = user; applyAdminProfileUI(user); }
    var logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) { e.preventDefault(); await logoutAdmin(); });
    }
}

// ------------------------------------------------------------------
// DOM ready
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle (mobile)
    var sidebarToggle   = document.getElementById('sidebarToggle');
    var adminSidebar    = document.querySelector('.admin-sidebar');
    var sidebarBackdrop = document.getElementById('sidebarBackdrop');

    if (sidebarToggle && adminSidebar && sidebarBackdrop) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
            sidebarBackdrop.classList.toggle('active');
        });
        sidebarBackdrop.addEventListener('click', function() {
            adminSidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
        });
        adminSidebar.querySelectorAll('.nav-item a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    adminSidebar.classList.remove('active');
                    sidebarBackdrop.classList.remove('active');
                }
            });
        });
    }

    // Sidebar collapse (desktop)
    var adminCollapseBtn = document.getElementById('adminSidebarCollapse');
    var adminMain        = document.querySelector('.admin-main');
    if (adminCollapseBtn && adminSidebar && adminMain) {
        adminCollapseBtn.addEventListener('click', function() {
            var icon = adminCollapseBtn.querySelector('i');
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('sidebar-compact');
            if (adminSidebar.classList.contains('collapsed')) {
                if (icon) { icon.classList.remove('fa-angle-left'); icon.classList.add('fa-angle-right'); }
            } else {
                if (icon) { icon.classList.remove('fa-angle-right'); icon.classList.add('fa-angle-left'); }
            }
        });
    }

    // Search inputs
    var usersSearch = document.getElementById('usersSearch');
    if (usersSearch) {
        usersSearch.addEventListener('input', function(e) {
            appState.searchQuery = e.target.value.toLowerCase().trim();
            appState.usersPage = 1;
            loadUsersTable();
        });
    }
    var vendorsSearch = document.getElementById('vendorsSearch');
    if (vendorsSearch) {
        vendorsSearch.addEventListener('input', function(e) {
            appState.searchQuery = e.target.value.toLowerCase().trim();
            appState.vendorsPage = 1;
            loadVendorsTable();
        });
    }

    initAdminAuth();
    setupNavigation();
    loadDashboardData();
    setupAdminSearch();
    setupNotifications();
    setupPropertyModal();
    loadPropertiesTable();
    loadUsersTable();
    loadVendorsTable();
});

// ------------------------------------------------------------------
// Navigation
// ------------------------------------------------------------------
function setupNavigation() {
    var navItems        = document.querySelectorAll('.nav-item');
    var contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var section = item.getAttribute('data-section');
            appState.currentSection = section;
            appState.searchQuery = '';

            navItems.forEach(function(i) { i.classList.remove('active'); });
            item.classList.add('active');

            contentSections.forEach(function(s) { s.classList.remove('active'); });
            var target = document.getElementById(section + '-section');
            if (target) target.classList.add('active');

            var pageTitle = document.querySelector('.admin-header h1');
            if (pageTitle) pageTitle.textContent = item.querySelector('span') ? item.querySelector('span').textContent : section;

            loadSectionData(section);
        });
    });
}

function loadSectionData(section) {
    switch (section) {
        case 'dashboard':  loadDashboardData();            break;
        case 'properties': loadPropertiesTable();          break;
        case 'users':      loadUsersTable();               break;
        case 'vendors':    loadVendorsTable();             break;
        case 'reports':    if (window.loadReportsSection) window.loadReportsSection(); break;
    }
}

// ------------------------------------------------------------------
// Dashboard
// ------------------------------------------------------------------
async function loadDashboardData() {
    try {
        var results = await Promise.all([
            apiFetch('/admin/stats'),
            apiFetch('/admin/recent-activities'),
            apiFetch('/admin/recent-properties'),
        ]);
        var stats  = results[0];
        var recent = results[1];
        var props  = results[2];

        adminData.stats = {
            properties: stats.total_properties || 0,
            users:      stats.total_users      || 0,
            vendors:    stats.total_vendors    || 0,
            revenue:    stats.total_revenue    || 0,
        };
        adminData.recentActivities = recent.data || [];
        adminData.recentProperties = props.data  || [];

        updateStats();
        loadRecentActivities();
        loadRecentProperties();
    } catch (err) {
        console.error('loadDashboardData error:', err);
    }
}

function updateStats() {
    function fmt(n) {
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
        return String(n);
    }
    var cards = document.querySelectorAll('.stat-info h3');
    if (cards.length >= 4) {
        cards[0].textContent = fmt(adminData.stats.properties);
        cards[1].textContent = fmt(adminData.stats.users);
        cards[2].textContent = fmt(adminData.stats.vendors);
        cards[3].textContent = 'R$ ' + fmt(adminData.stats.revenue);
    }
}

function loadRecentActivities() {
    var list = document.getElementById('activityList');
    if (!list) return;
    list.innerHTML = '';
    if (!adminData.recentActivities.length) {
        list.innerHTML = '<p class="no-results">Nenhuma atividade recente</p>';
        return;
    }
    adminData.recentActivities.forEach(function(a) {
        var el = document.createElement('div');
        el.className = 'activity-item';
        var avatarSrc = a.avatar || createInitialsAvatar(a.user, 40);
        el.innerHTML = '<div class="activity-avatar"><img src="' + avatarSrc + '" alt="' + escapeHtml(a.user) + '"></div>' +
            '<div class="activity-content"><p><strong>' + escapeHtml(a.user) + '</strong> ' + escapeHtml(a.action) + '</p>' +
            '<span class="activity-time">' + escapeHtml(a.time) + '</span></div>';
        list.appendChild(el);
    });
}

function loadRecentProperties() {
    var list = document.getElementById('propertyList');
    if (!list) return;
    list.innerHTML = '';
    if (!adminData.recentProperties.length) {
        list.innerHTML = '<p class="no-results">Nenhum imóvel encontrado</p>';
        return;
    }
    adminData.recentProperties.forEach(function(p) {
        var el = document.createElement('div');
        el.className = 'property-item';
        el.innerHTML =
            '<div class="property-image"><img src="' + p.image + '" alt="' + escapeHtml(p.title) + '"></div>' +
            '<div class="property-info">' +
                '<h4>' + escapeHtml(p.title) + '</h4>' +
                '<p class="property-price">' + escapeHtml(p.price) + '</p>' +
                '<div class="property-meta">' +
                    '<span class="property-location">' + escapeHtml(p.location) + '</span>' +
                    '<span class="property-date">' + escapeHtml(p.date) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="property-actions">' +
                '<button class="btn-icon edit" title="Editar" onclick="editProperty(' + p.id + ')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-icon delete" title="Excluir" onclick="deleteProperty(' + p.id + ')"><i class="fas fa-trash"></i></button>' +
            '</div>';
        list.appendChild(el);
    });
}

// ------------------------------------------------------------------
// Search
// ------------------------------------------------------------------
function setupAdminSearch() {
    var searchInput  = document.getElementById('globalSearch');
    var searchButton = document.querySelector('.admin-search button');

    function perform() {
        appState.searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();
        switch (appState.currentSection) {
            case 'properties': loadPropertiesTable(); break;
            case 'users':      loadUsersTable();      break;
            case 'vendors':    loadVendorsTable();    break;
        }
    }

    if (searchButton) searchButton.addEventListener('click', perform);
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') perform(); });
        searchInput.addEventListener('input', function() {
            if (!searchInput.value) { appState.searchQuery = ''; loadSectionData(appState.currentSection); }
        });
    }
}

// ------------------------------------------------------------------
// Notifications
// ------------------------------------------------------------------
function setupNotifications() {
    var btn      = document.getElementById('notificationBtn');
    var dropdown = document.getElementById('notificationsDropdown');
    var markAll  = document.querySelector('.mark-all-read');

    if (btn && dropdown) {
        btn.setAttribute('aria-haspopup', 'dialog');
        btn.setAttribute('aria-controls', 'notificationsDropdown');
        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = dropdown.classList.toggle('show');
            btn.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) fetchAndRenderNotifications();
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
        document.addEventListener('click', function() {
            dropdown.classList.remove('show');
            btn.setAttribute('aria-expanded', 'false');
        });
        dropdown.addEventListener('click', function(e) { e.stopPropagation(); });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
                btn.focus();
            }
        });
    }

    if (markAll) {
        markAll.addEventListener('click', async function() {
            try {
                await apiMarkAllNotificationsAsRead();
                adminData.notifications.forEach(function(n) { n.read = true; });
                renderNotifications();
            } catch (e) { console.error(e); }
        });
    }
}

async function fetchAndRenderNotifications() {
    try {
        var resp   = await apiGetNotifications({ per_page: 15 });
        adminData.notifications = resp && resp.data ? resp.data : [];
        renderNotifications();
        var unread = await apiGetUnreadNotificationsCount();
        updateNotificationBadge(unread && unread.unread_count ? unread.unread_count : 0);
    } catch (e) { console.error('fetchAndRenderNotifications:', e); }
}

function renderNotifications() {
    var list = document.querySelector('.notification-list');
    if (!list) return;
    list.innerHTML = '';
    updateNotificationBadge(adminData.notifications.filter(function(n){ return !n.read; }).length);
    if (!adminData.notifications.length) {
        list.innerHTML = '<div class="no-results">Nenhuma notificação</div>';
        return;
    }
    adminData.notifications.forEach(function(n) {
        var el = document.createElement('div');
        el.className = 'notification-item' + (n.read ? '' : ' unread');
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.innerHTML =
            '<div class="notification-icon" aria-hidden="true"><i class="' + escapeHtml(n.icon || 'fas fa-bell') + '"></i></div>' +
            '<div class="notification-content">' +
                '<p><strong>' + escapeHtml(n.title) + '</strong> ' + escapeHtml(n.message) + '</p>' +
                '<span class="notification-time">' + escapeHtml(n.time) + '</span>' +
            '</div>';
        var act = function() { markNotificationRead(n.id); };
        el.addEventListener('click', act);
        el.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
        list.appendChild(el);
    });
}

function updateNotificationBadge(count) {
    var badge = document.querySelector('.notification-badge');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

async function markNotificationRead(id) {
    var n = adminData.notifications.find(function(x){ return x.id === id; });
    if (n && !n.read) {
        try { await apiMarkNotificationAsRead(id); n.read = true; renderNotifications(); } catch (e) { console.error(e); }
    }
}

// ------------------------------------------------------------------
// Properties table
// ------------------------------------------------------------------
async function loadPropertiesTable() {
    var tbody = document.querySelector('#propertiesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" class="no-results">Carregando...</td></tr>';

    try {
        var params = { per_page: 50, page: appState.propertiesPage };
        if (appState.searchQuery) params.search = appState.searchQuery;

        // Fetch all statuses for admin view
        var results = await Promise.all([
            apiFetch('/properties?' + new URLSearchParams(Object.assign({}, params, { status: 'active' }))),
            apiFetch('/properties?' + new URLSearchParams(Object.assign({}, params, { status: 'inactive' }))),
            apiFetch('/properties?' + new URLSearchParams(Object.assign({}, params, { status: 'pending' }))),
        ]);

        var all = (results[0] && results[0].data ? results[0].data : [])
            .concat(results[1] && results[1].data ? results[1].data : [])
            .concat(results[2] && results[2].data ? results[2].data : []);

        var filtered = appState.searchQuery
            ? all.filter(function(p) {
                var q = appState.searchQuery;
                return (p.title && p.title.toLowerCase().includes(q)) ||
                       (p.city  && p.city.toLowerCase().includes(q))  ||
                       (p.neighborhood && p.neighborhood.toLowerCase().includes(q));
              })
            : all;

        adminData.allProperties = filtered;
        renderPropertiesTable(filtered);
    } catch (err) {
        console.error('loadPropertiesTable:', err);
        tbody.innerHTML = '<tr><td colspan="7" class="no-results">Erro ao carregar imóveis</td></tr>';
    }
}

function renderPropertiesTable(properties) {
    var tbody = document.querySelector('#propertiesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!properties.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-results">Nenhum imóvel encontrado</td></tr>';
        return;
    }

    properties.forEach(function(p) {
        var row      = document.createElement('tr');
        var location = [p.neighborhood, p.city, p.state].filter(Boolean).join(', ');
        var price    = 'R$ ' + Number(p.nightly_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '/noite';
        var date     = new Date(p.created_at).toLocaleDateString('pt-BR');
        var img      = p.image_url || 'https://via.placeholder.com/40x40?text=Im%C3%B3vel';

        row.innerHTML =
            '<td><input type="checkbox" class="property-checkbox" value="' + p.id + '"></td>' +
            '<td><div class="property-info-table">' +
                '<div class="property-image-table"><img src="' + img + '" alt="' + escapeHtml(p.title) + '"></div>' +
                '<div class="property-details"><strong>' + escapeHtml(p.title) + '</strong></div>' +
            '</div></td>' +
            '<td>' + price + '</td>' +
            '<td>' + escapeHtml(location) + '</td>' +
            '<td><span class="status-badge ' + p.status + '">' + getStatusText(p.status) + '</span></td>' +
            '<td>' + date + '</td>' +
            '<td><div class="table-actions">' +
                '<button class="btn-icon edit" title="Editar" onclick="editProperty(' + p.id + ')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-icon delete" title="Excluir" onclick="deleteProperty(' + p.id + ')"><i class="fas fa-trash"></i></button>' +
            '</div></td>';
        tbody.appendChild(row);
    });

    var selectAll = document.getElementById('selectAllProperties');
    if (selectAll) {
        var fresh = selectAll.cloneNode(true);
        selectAll.parentNode.replaceChild(fresh, selectAll);
        fresh.addEventListener('change', function() {
            document.querySelectorAll('.property-checkbox').forEach(function(cb){ cb.checked = fresh.checked; });
        });
    }
}

// ------------------------------------------------------------------
// Users table
// ------------------------------------------------------------------
async function loadUsersTable() {
    var tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" class="no-results">Carregando...</td></tr>';

    try {
        var params = { per_page: 15, page: appState.usersPage };
        if (appState.searchQuery) params.search = appState.searchQuery;
        var resp = await apiGetUsers(params);
        adminData.users = resp && resp.data ? resp.data : [];
        renderUsersTable(adminData.users);
    } catch (err) {
        console.error('loadUsersTable:', err);
        tbody.innerHTML = '<tr><td colspan="7" class="no-results">Erro ao carregar usuários</td></tr>';
    }
}

function renderUsersTable(users) {
    var tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-results">Nenhum usuário encontrado</td></tr>';
        return;
    }

    users.forEach(function(u) {
        var row    = document.createElement('tr');
        var avatar = u.avatar || createInitialsAvatar(u.name, 40);
        var date   = new Date(u.created_at).toLocaleDateString('pt-BR');
        var status = u.deleted_at ? 'inactive' : 'active';

        row.innerHTML =
            '<td data-label="Selecionar"><input type="checkbox" class="user-checkbox" value="' + u.id + '"></td>' +
            '<td data-label="Usuário"><div class="user-info-table">' +
                '<div class="user-avatar-table"><img src="' + avatar + '" alt="' + escapeHtml(u.name) + '"></div>' +
                '<div class="user-details"><strong>' + escapeHtml(u.name) + '</strong></div>' +
            '</div></td>' +
            '<td data-label="Email"><span class="td-value">' + escapeHtml(u.email || '-') + '</span></td>' +
            '<td data-label="Telefone"><span class="td-value">' + escapeHtml(u.phone || '-') + '</span></td>' +
            '<td data-label="Status"><span class="status-badge ' + status + '">' + getStatusText(status) + '</span></td>' +
            '<td data-label="Registro"><span class="td-value">' + date + '</span></td>' +
            '<td data-label="Ações"><div class="table-actions">' +
                '<button class="btn-icon edit" title="Editar" onclick="editUser(' + u.id + ')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-icon delete" title="Excluir" onclick="deleteUser(' + u.id + ')"><i class="fas fa-trash"></i></button>' +
            '</div></td>';
        tbody.appendChild(row);
    });

    var selectAll = document.getElementById('selectAllUsers');
    if (selectAll) {
        var fresh = selectAll.cloneNode(true);
        selectAll.parentNode.replaceChild(fresh, selectAll);
        fresh.addEventListener('change', function() {
            document.querySelectorAll('.user-checkbox').forEach(function(cb){ cb.checked = fresh.checked; });
        });
    }
}

// ------------------------------------------------------------------
// Vendors (Hosts) table
// ------------------------------------------------------------------
async function loadVendorsTable() {
    var tbody = document.querySelector('#vendorsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" class="no-results">Carregando...</td></tr>';

    try {
        var params = { per_page: 15, page: appState.vendorsPage, all: 1 };
        if (appState.searchQuery) params.q = appState.searchQuery;
        var resp = await apiGetHostProfiles(params);
        adminData.vendors = resp && resp.data ? resp.data : [];
        renderVendorsTable(adminData.vendors);
    } catch (err) {
        console.error('loadVendorsTable:', err);
        tbody.innerHTML = '<tr><td colspan="8" class="no-results">Erro ao carregar anfitriões</td></tr>';
    }
}

function renderVendorsTable(vendors) {
    var tbody = document.querySelector('#vendorsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!vendors.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-results">Nenhum anfitrião encontrado</td></tr>';
        return;
    }

    vendors.forEach(function(v) {
        var row    = document.createElement('tr');
        var user   = v.user || {};
        var avatar = user.avatar || createInitialsAvatar(user.name || 'H', 40);
        var date   = new Date(v.created_at).toLocaleDateString('pt-BR');
        var creci  = v.creci || '-';
        var approveBtn = v.status === 'pending'
            ? '<button class="btn-icon approve" title="Aprovar" onclick="approveVendor(' + v.id + ')"><i class="fas fa-check"></i></button>'
            : '';

        row.innerHTML =
            '<td data-label="Selecionar"><input type="checkbox" class="vendor-checkbox" value="' + v.id + '"></td>' +
            '<td data-label="Anfitrião"><div class="user-info-table">' +
                '<div class="user-avatar-table"><img src="' + avatar + '" alt="' + escapeHtml(user.name || '') + '"></div>' +
                '<div class="user-details"><strong>' + escapeHtml(user.name || '-') + '</strong></div>' +
            '</div></td>' +
            '<td data-label="Email"><span class="td-value">' + escapeHtml(user.email || '-') + '</span></td>' +
            '<td data-label="Telefone"><span class="td-value">' + escapeHtml(user.phone || '-') + '</span></td>' +
            '<td data-label="CRECI"><span class="td-value">' + escapeHtml(creci) + '</span></td>' +
            '<td data-label="Status"><span class="status-badge ' + v.status + '">' + getStatusText(v.status) + '</span></td>' +
            '<td data-label="Registro"><span class="td-value">' + date + '</span></td>' +
            '<td data-label="Ações"><div class="table-actions">' +
                approveBtn +
                '<button class="btn-icon edit" title="Editar" onclick="editVendor(' + v.id + ')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-icon delete" title="Excluir" onclick="deleteVendor(' + v.id + ')"><i class="fas fa-trash"></i></button>' +
            '</div></td>';
        tbody.appendChild(row);
    });

    var selectAll = document.getElementById('selectAllVendors');
    if (selectAll) {
        var fresh = selectAll.cloneNode(true);
        selectAll.parentNode.replaceChild(fresh, selectAll);
        fresh.addEventListener('change', function() {
            document.querySelectorAll('.vendor-checkbox').forEach(function(cb){ cb.checked = fresh.checked; });
        });
    }
}

// ------------------------------------------------------------------
// Filter helpers
// ------------------------------------------------------------------
function filterPropertiesTable() { loadPropertiesTable(); }
function filterUsersTable()       { loadUsersTable(); }
function filterVendorsTable()     { loadVendorsTable(); }

// ------------------------------------------------------------------
// Status text helper
// ------------------------------------------------------------------
function getStatusText(status) {
    var map = { active:'Ativo', inactive:'Inativo', pending:'Pendente', approved:'Aprovado', rejected:'Rejeitado', suspended:'Suspenso', blocked:'Bloqueado' };
    return map[status] || status || '-';
}

// ------------------------------------------------------------------
// Property CRUD
// ------------------------------------------------------------------
function setupPropertyModal() {
    var modal     = document.getElementById('propertyModal');
    var addBtn    = document.getElementById('addPropertyBtn');
    var closeBtn  = document.getElementById('modalClose');
    var cancelBtn = document.getElementById('modalCancel');
    var saveBtn   = document.getElementById('modalSave');
    var form      = document.getElementById('propertyForm');

    if (addBtn)    addBtn.addEventListener('click',   function(){ openPropertyModal(); });
    if (closeBtn)  closeBtn.addEventListener('click',  closePropertyModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closePropertyModal);
    if (saveBtn)   saveBtn.addEventListener('click',   saveProperty);
    if (form)      form.addEventListener('submit', function(e){ e.preventDefault(); saveProperty(); });
    if (modal)     modal.addEventListener('click', function(e){ if (e.target === modal) closePropertyModal(); });
}

function openPropertyModal(propertyId) {
    propertyId = propertyId || null;
    var modal = document.getElementById('propertyModal');
    var title = document.getElementById('modalTitle');
    var form  = document.getElementById('propertyForm');

    appState.editingProperty = propertyId;

    if (propertyId) {
        if (title) title.textContent = 'Editar Imóvel';
        var p = adminData.allProperties.find(function(x){ return x.id === propertyId; });
        if (p) {
            var tf = document.getElementById('propertyTitle');    if (tf) tf.value = p.title || '';
            var pf = document.getElementById('propertyPrice');    if (pf) pf.value = p.nightly_price || '';
            var lf = document.getElementById('propertyLocation'); if (lf) lf.value = p.city || '';
            var tyf = document.getElementById('propertyType');    if (tyf) tyf.value = p.property_type || '';
        }
    } else {
        if (title) title.textContent = 'Adicionar Imóvel';
        if (form) form.reset();
    }
    if (modal) modal.classList.add('show');
}

function closePropertyModal() {
    var modal = document.getElementById('propertyModal');
    if (modal) modal.classList.remove('show');
    appState.editingProperty = null;
}

async function saveProperty() {
    var titleEl    = document.getElementById('propertyTitle');
    var priceEl    = document.getElementById('propertyPrice');
    var locationEl = document.getElementById('propertyLocation');
    var typeEl     = document.getElementById('propertyType');

    var title    = titleEl    ? titleEl.value.trim()    : '';
    var price    = priceEl    ? priceEl.value            : '';
    var location = locationEl ? locationEl.value.trim() : '';
    var type     = typeEl     ? typeEl.value             : '';

    if (!title || !price || !location || !type) {
        showToast('Preencha todos os campos obrigatórios.', 'error');
        return;
    }

    try {
        if (appState.editingProperty) {
            await apiFetch('/properties/' + appState.editingProperty, {
                method: 'PUT',
                body: JSON.stringify({ title: title, nightly_price: price, city: location, property_type: type }),
            });
            showToast('Imóvel atualizado com sucesso!', 'success');
        } else {
            await apiFetch('/properties', {
                method: 'POST',
                body: JSON.stringify({ title: title, nightly_price: price, city: location, property_type: type,
                    description: title, state: 'SP', bedrooms: 1, bathrooms: 1, guests_capacity: 2 }),
            });
            showToast('Imóvel criado com sucesso!', 'success');
        }
        closePropertyModal();
        loadPropertiesTable();
        if (appState.currentSection === 'dashboard') loadDashboardData();
    } catch (err) {
        showToast((err.data && err.data.message) || 'Erro ao salvar imóvel.', 'error');
    }
}

function editProperty(id) { openPropertyModal(id); }

async function deleteProperty(id) {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
    try {
        await apiFetch('/properties/' + id, { method: 'DELETE' });
        showToast('Imóvel excluído com sucesso!', 'success');
        loadPropertiesTable();
        if (appState.currentSection === 'dashboard') loadDashboardData();
    } catch (err) {
        showToast((err.data && err.data.message) || 'Erro ao excluir imóvel.', 'error');
    }
}

// ------------------------------------------------------------------
// Vendor (Host) actions
// ------------------------------------------------------------------
async function approveVendor(id) {
    try {
        await apiFetch('/host-profiles/' + id, { method: 'PUT', body: JSON.stringify({ status: 'approved' }) });
        showToast('Anfitrião aprovado com sucesso!', 'success');
        loadVendorsTable();
        if (appState.currentSection === 'dashboard') loadDashboardData();
    } catch (err) {
        showToast((err.data && err.data.message) || 'Erro ao aprovar anfitrião.', 'error');
    }
}

async function deleteVendor(id) {
    if (!confirm('Tem certeza que deseja excluir este anfitrião?')) return;
    var vendor = adminData.vendors.find(function(v){ return v.id === id; });
    if (!vendor) return;
    try {
        await apiDeleteUser(vendor.user_id || (vendor.user && vendor.user.id));
        showToast('Anfitrião excluído com sucesso!', 'success');
        loadVendorsTable();
        if (appState.currentSection === 'dashboard') loadDashboardData();
    } catch (err) {
        showToast((err.data && err.data.message) || 'Erro ao excluir anfitrião.', 'error');
    }
}

// ------------------------------------------------------------------
// User actions
// ------------------------------------------------------------------
async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
        await apiDeleteUser(id);
        showToast('Usuário desativado com sucesso!', 'success');
        loadUsersTable();
        if (appState.currentSection === 'dashboard') loadDashboardData();
    } catch (err) {
        showToast((err.data && err.data.message) || 'Erro ao excluir usuário.', 'error');
    }
}

// ------------------------------------------------------------------
// User modal
// ------------------------------------------------------------------
var currentUserId  = null;
var isUserEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeUserModal();
    initializeVendorModal();
});

function initializeUserModal() {
    var modal     = document.getElementById('userModal');
    if (!modal) return;
    var form      = document.getElementById('userForm');
    var closeBtn  = document.getElementById('closeUserModalBtn');
    var cancelBtn = document.getElementById('cancelUserModalBtn');
    var addBtn    = document.getElementById('addUserBtn');

    if (addBtn)    addBtn.addEventListener('click', function(){ openUserModal(); });
    if (closeBtn)  closeBtn.addEventListener('click', closeUserModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeUserModal);
    var overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.addEventListener('click', function(e){ if (e.target === e.currentTarget) closeUserModal(); });

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!validateUserForm()) { showUserMessage('Por favor, corrija os erros no formulário.', 'error'); return; }
            var payload = {
                name:  document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                phone: document.getElementById('userPhone').value.trim(),
            };
            try {
                if (isUserEditMode) {
                    await apiUpdateUser(currentUserId, payload);
                    showUserMessage('Usuário ' + payload.name + ' atualizado!', 'success');
                } else {
                    var passwordEl = document.getElementById('userPassword');
                    var password   = passwordEl ? passwordEl.value : 'temp1234';
                    await apiFetch('/users', { method: 'POST', body: JSON.stringify(Object.assign({}, payload, { password: password, password_confirmation: password })) });
                    showUserMessage('Usuário ' + payload.name + ' criado!', 'success');
                }
                setTimeout(function(){ closeUserModal(); loadUsersTable(); }, 1200);
            } catch (err) {
                showUserMessage((err.data && err.data.message) || 'Erro ao salvar usuário.', 'error');
            }
        });
    }
}

function openUserModal(userId) {
    userId = userId || null;
    var modal = document.getElementById('userModal');
    if (!modal) return;
    var title = document.getElementById('userModalTitle');
    var form  = document.getElementById('userForm');

    isUserEditMode = !!userId;
    currentUserId  = userId;
    if (form) form.reset();
    clearUserErrors();
    hideUserMessage();

    if (isUserEditMode) {
        var u = adminData.users.find(function(x){ return x.id === userId; });
        if (!u) return;
        var eid = document.getElementById('userId'); if (eid) eid.value = u.id;
        var en  = document.getElementById('userName');  if (en)  en.value  = u.name  || '';
        var ee  = document.getElementById('userEmail'); if (ee)  ee.value  = u.email || '';
        var ep  = document.getElementById('userPhone'); if (ep)  ep.value  = u.phone || '';
        if (title) title.textContent = 'Editar Usuário – ' + u.name;
    } else {
        if (title) title.textContent = 'Adicionar Usuário';
    }
    modal.classList.add('active');
}

function closeUserModal() {
    var modal = document.getElementById('userModal');
    var form  = document.getElementById('userForm');
    if (modal) modal.classList.remove('active');
    if (form)  form.reset();
    clearUserErrors();
    hideUserMessage();
    currentUserId = null;
    isUserEditMode = false;
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function clearUserErrors() {
    document.querySelectorAll('#userForm .error-message').forEach(function(el){ el.textContent = ''; el.classList.remove('show'); });
    document.querySelectorAll('#userForm input, #userForm select').forEach(function(el){ el.classList.remove('error'); });
}

function showUserError(fieldId, msg) {
    var f = document.getElementById(fieldId); if (f) f.classList.add('error');
    var e = document.getElementById(fieldId + 'Error'); if (e) { e.textContent = msg; e.classList.add('show'); }
}

function validateUserForm() {
    clearUserErrors();
    var ok    = true;
    var nameEl  = document.getElementById('userName');
    var emailEl = document.getElementById('userEmail');
    var phoneEl = document.getElementById('userPhone');
    var name    = nameEl  ? nameEl.value.trim()  : '';
    var email   = emailEl ? emailEl.value.trim() : '';
    var phone   = phoneEl ? phoneEl.value.trim() : '';
    if (!name)  { showUserError('userName',  'Nome é obrigatório');     ok = false; }
    if (!email) { showUserError('userEmail', 'Email é obrigatório');    ok = false; }
    else if (!isValidEmail(email)) { showUserError('userEmail', 'Email inválido'); ok = false; }
    if (!phone) { showUserError('userPhone', 'Telefone é obrigatório'); ok = false; }
    return ok;
}

function showUserMessage(msg, type) {
    type = type || 'success';
    var el = document.getElementById('userModalMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = 'modal-message show ' + type;
    setTimeout(function(){ hideUserMessage(); }, 3000);
}

function hideUserMessage() {
    var el = document.getElementById('userModalMessage');
    if (!el) return;
    el.className = 'modal-message';
    el.textContent = '';
}

window.editUser = function(id) { openUserModal(id); };

// ------------------------------------------------------------------
// Vendor modal
// ------------------------------------------------------------------
var currentVendorId = null;
var isEditMode      = false;

function initializeVendorModal() {
    var modal = document.getElementById('vendorModal');
    if (!modal) return;
    var form      = document.getElementById('vendorForm');
    var closeBtn  = document.getElementById('closeModalBtn');
    var cancelBtn = document.getElementById('cancelModalBtn');
    var addBtn    = document.getElementById('addVendorBtn');
    var approveBtn = document.getElementById('approveVendorBtn');
    var rejectBtn  = document.getElementById('rejectVendorBtn');

    if (addBtn)    addBtn.addEventListener('click', function(){ openVendorModal(); });
    if (closeBtn)  closeBtn.addEventListener('click', closeVendorModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeVendorModal);
    var overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.addEventListener('click', function(e){ if (e.target === e.currentTarget) closeVendorModal(); });

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!validateVendorForm()) { showVendorMessage('Por favor, corrija os erros.', 'error'); return; }
            var statusEl = document.getElementById('vendorStatus');
            var creciEl  = document.getElementById('vendorCreci');
            var payload  = { status: statusEl ? statusEl.value : 'pending', creci: creciEl ? creciEl.value.trim() : '' };
            try {
                await apiFetch('/host-profiles/' + currentVendorId, { method: 'PUT', body: JSON.stringify(payload) });
                showVendorMessage('Anfitrião atualizado!', 'success');
                setTimeout(function(){ closeVendorModal(); loadVendorsTable(); }, 1200);
            } catch (err) { showVendorMessage((err.data && err.data.message) || 'Erro ao salvar.', 'error'); }
        });
    }

    if (approveBtn) {
        approveBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await apiFetch('/host-profiles/' + currentVendorId, { method: 'PUT', body: JSON.stringify({ status: 'approved' }) });
                showVendorMessage('Anfitrião aprovado!', 'success');
                setTimeout(function(){ closeVendorModal(); loadVendorsTable(); loadDashboardData(); }, 1200);
            } catch (err) { showVendorMessage((err.data && err.data.message) || 'Erro.', 'error'); }
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            if (!confirm('Tem certeza que deseja reprovar este anfitrião?')) return;
            try {
                await apiFetch('/host-profiles/' + currentVendorId, { method: 'PUT', body: JSON.stringify({ status: 'rejected' }) });
                showVendorMessage('Anfitrião reprovado.', 'success');
                setTimeout(function(){ closeVendorModal(); loadVendorsTable(); }, 1200);
            } catch (err) { showVendorMessage((err.data && err.data.message) || 'Erro.', 'error'); }
        });
    }
}

function openVendorModal(vendorId) {
    vendorId = vendorId || null;
    var modal = document.getElementById('vendorModal');
    if (!modal) return;
    var title      = document.getElementById('modalTitle');
    var form       = document.getElementById('vendorForm');
    var approveBtn = document.getElementById('approveVendorBtn');
    var rejectBtn  = document.getElementById('rejectVendorBtn');

    isEditMode      = !!vendorId;
    currentVendorId = vendorId;
    if (form) form.reset();
    clearAllErrors();
    hideVendorMessage();

    if (isEditMode) {
        var v = adminData.vendors.find(function(x){ return x.id === vendorId; });
        if (!v) return;
        var user = v.user || {};
        var eid = document.getElementById('vendorId');     if (eid) eid.value = v.id;
        var en  = document.getElementById('vendorName');   if (en)  en.value  = user.name  || '';
        var ee  = document.getElementById('vendorEmail');  if (ee)  ee.value  = user.email || '';
        var ep  = document.getElementById('vendorPhone');  if (ep)  ep.value  = user.phone || '';
        var ec  = document.getElementById('vendorCreci');  if (ec)  ec.value  = v.creci    || '';
        var es  = document.getElementById('vendorStatus'); if (es)  es.value  = v.status   || 'pending';
        if (title) title.textContent = 'Editar Anfitrião – ' + (user.name || '');
        var isPending = v.status === 'pending';
        if (approveBtn) approveBtn.style.display = isPending ? 'flex' : 'none';
        if (rejectBtn)  rejectBtn.style.display  = isPending ? 'flex' : 'none';
    } else {
        if (title) title.textContent = 'Adicionar Anfitrião';
        if (approveBtn) approveBtn.style.display = 'none';
        if (rejectBtn)  rejectBtn.style.display  = 'none';
    }
    modal.classList.add('active');
}

function closeVendorModal() {
    var modal = document.getElementById('vendorModal');
    var form  = document.getElementById('vendorForm');
    if (modal) modal.classList.remove('active');
    if (form)  form.reset();
    clearAllErrors();
    hideVendorMessage();
    currentVendorId = null;
    isEditMode = false;
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(function(el){ el.textContent = ''; el.classList.remove('show'); });
    document.querySelectorAll('.form-group input, .form-group select').forEach(function(el){ el.classList.remove('error'); });
}

function showError(fieldId, msg) {
    var f = document.getElementById(fieldId); if (f) f.classList.add('error');
    var e = document.getElementById(fieldId + 'Error'); if (e) { e.textContent = msg; e.classList.add('show'); }
}

function validateVendorForm() {
    clearAllErrors();
    var ok    = true;
    var nameEl  = document.getElementById('vendorName');
    var emailEl = document.getElementById('vendorEmail');
    var phoneEl = document.getElementById('vendorPhone');
    var creciEl = document.getElementById('vendorCreci');
    var name    = nameEl  ? nameEl.value.trim()  : '';
    var email   = emailEl ? emailEl.value.trim() : '';
    var phone   = phoneEl ? phoneEl.value.trim() : '';
    var creci   = creciEl ? creciEl.value.trim() : '';
    if (!name)  { showError('vendorName',  'Nome é obrigatório');     ok = false; }
    if (!email) { showError('vendorEmail', 'Email é obrigatório');    ok = false; }
    else if (!isValidEmail(email)) { showError('vendorEmail', 'Email inválido'); ok = false; }
    if (!phone) { showError('vendorPhone', 'Telefone é obrigatório'); ok = false; }
    if (!creci) { showError('vendorCreci', 'CRECI é obrigatório');    ok = false; }
    return ok;
}

function showVendorMessage(msg, type) {
    type = type || 'success';
    var el = document.getElementById('modalMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = 'modal-message show ' + type;
    setTimeout(function(){ hideVendorMessage(); }, 3000);
}

function hideVendorMessage() {
    var el = document.getElementById('modalMessage');
    if (!el) return;
    el.className = 'modal-message';
    el.textContent = '';
}

window.editVendor = function(id) { openVendorModal(id); };

// ------------------------------------------------------------------
// Toast helper
// ------------------------------------------------------------------
function showToast(message, type) {
    type = type || 'success';
    document.querySelectorAll('.admin-toast').forEach(function(t){ t.remove(); });
    var el = document.createElement('div');
    el.className = 'message admin-toast ' + type + '-message';
    el.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check' : 'exclamation') + '-circle"></i><span>' + escapeHtml(message) + '</span>';
    var content = document.querySelector('.admin-content');
    if (content) content.insertBefore(el, content.firstChild);
    setTimeout(function(){ el.remove(); }, 5000);
}

window.showMessage = showToast;

// ------------------------------------------------------------------
// Utility
// ------------------------------------------------------------------
function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function(m){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
}

// ------------------------------------------------------------------
// Dynamic styles
// ------------------------------------------------------------------
var _adminStyles = document.createElement('style');
_adminStyles.textContent = [
    '.property-info-table,.user-info-table{display:flex;align-items:center;gap:10px}',
    '.property-image-table,.user-avatar-table{width:40px;height:40px;border-radius:6px;overflow:hidden;flex-shrink:0}',
    '.property-image-table img,.user-avatar-table img{width:100%;height:100%;object-fit:cover}',
    '.property-details,.user-details{flex:1}',
    '.admin-toast{padding:12px 16px;border-radius:var(--radius,8px);margin-bottom:20px;display:flex;align-items:center;gap:8px;animation:slideIn .3s ease}',
    '.success-message{background:rgba(16,185,129,.1);border:1px solid var(--success,#10b981);color:var(--success,#10b981)}',
    '.error-message{background:rgba(239,68,68,.1);border:1px solid var(--danger,#ef4444);color:var(--danger,#ef4444)}',
    '@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}',
    '.btn-icon.approve{color:#10b981}',
].join('');
document.head.appendChild(_adminStyles);
