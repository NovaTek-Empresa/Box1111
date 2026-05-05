// Lógica de Relatórios
let mainChart = null;
let distributionChart = null;

window.loadReportsSection = function() {
    setupReportTypeSelector();
    setupReportFilters();
    setupExportButtons();
    generateReport('financeiro');
};

function setupReportTypeSelector() {
    const reportTypeOptions = document.querySelectorAll('.report-type-option');

    reportTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            reportTypeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            const reportType = option.getAttribute('data-report-type');
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            generateReport(reportType);
        });
    });
}

function setupReportFilters() {
    const generateBtn = document.getElementById('generateReportBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const selectedReport = document.querySelector('input[name="reportType"]:checked').value;
            generateReport(selectedReport);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('filterStartDate').value = '';
            document.getElementById('filterEndDate').value = '';
            const filterProperty = document.getElementById('filterProperty');
            if (filterProperty) filterProperty.value = '';
            const filterOwner = document.getElementById('filterOwner');
            if (filterOwner) filterOwner.value = '';
            const filterCity = document.getElementById('filterCity');
            if (filterCity) filterCity.value = '';
            const filterStatus = document.getElementById('filterStatus');
            if (filterStatus) filterStatus.value = '';
            generateReport(appState.currentReport);
        });
    }
}

function showReportLoading() {
    const tableBody = document.querySelector('#reportTableBody');
    const statsContainer = document.getElementById('reportStatsContainer');
    if (statsContainer) {
        statsContainer.innerHTML = '<div style="padding:16px;color:#888;">Carregando...</div>';
    }
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:#888;">Carregando dados...</td></tr>';
    }
}

function showReportError(msg) {
    const tableBody = document.querySelector('#reportTableBody');
    const statsContainer = document.getElementById('reportStatsContainer');
    if (statsContainer) {
        statsContainer.innerHTML = '<div style="padding:16px;color:#ef4444;">Erro ao carregar relatório.</div>';
    }
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:#ef4444;">${msg || 'Erro ao carregar dados.'}</td></tr>`;
    }
}

async function generateReport(reportType) {
    appState.currentReport = reportType;

    if (mainChart) { mainChart.destroy(); mainChart = null; }
    if (distributionChart) { distributionChart.destroy(); distributionChart = null; }

    showReportLoading();

    try {
        switch(reportType) {
            case 'financeiro':
                await generateFinancialReport();
                break;
            case 'reservas':
                await generateReservationReport();
                break;
            case 'imoveis':
                await generatePropertiesReport();
                break;
            case 'usuarios':
                await generateUsersReport();
                break;
            case 'avaliacoes':
                await generateReviewsReport();
                break;
            case 'operacional':
                await generateOperationalReport();
                break;
        }
    } catch (err) {
        console.error('Erro ao gerar relatório:', err);
        showReportError('Falha ao carregar relatório. Tente novamente.');
    }
}

// ─── FINANCEIRO ──────────────────────────────────────────────────────────────

async function generateFinancialReport() {
    const [statsRes, chartRes, reservationsRes] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/chart-data'),
        apiFetch('/reservations?per_page=100'),
    ]);

    const stats     = statsRes.data || statsRes;
    const chartData = chartRes.data || chartRes;
    const reservations = (reservationsRes.data?.data || reservationsRes.data || []);

    const totalRevenue   = stats.revenue?.total   ?? stats.total_revenue   ?? 0;
    const monthlyRevenue = stats.revenue?.monthly ?? 0;
    const totalTx        = stats.reservations?.total ?? reservations.length;
    const avgRevenue     = totalTx > 0 ? (totalRevenue / Math.max(totalTx, 1)) : 0;

    displayStatsCards([
        { title: 'Receita Total',      value: formatCurrency(totalRevenue),   trend: 'up',   percentage: '' },
        { title: 'Receita Mensal',     value: formatCurrency(monthlyRevenue), trend: 'up',   percentage: '' },
        { title: 'Ticket Médio',       value: formatCurrency(avgRevenue),     trend: 'up',   percentage: '' },
        { title: 'Total Transações',   value: String(totalTx),                trend: 'up',   percentage: '' },
    ]);

    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');

    tableHead.innerHTML = `
        <tr>
            <th>Imóvel</th>
            <th>Hóspede</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Status</th>
        </tr>
    `;

    const rows = reservations.map(r => {
        const title    = r.property?.title ?? r.property_id ?? '—';
        const guest    = r.guest?.name     ?? '—';
        const price    = parseFloat(r.total_price || 0);
        const date     = r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '—';
        const status   = r.status ?? '—';
        const badgeCls = status.toLowerCase().replace(/\s+/g, '');
        return `<tr>
            <td>${escapeHtml(title)}</td>
            <td>${escapeHtml(guest)}</td>
            <td>${formatCurrency(price)}</td>
            <td>${date}</td>
            <td><span class="status-badge ${badgeCls}">${escapeHtml(status)}</span></td>
        </tr>`;
    }).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="5" style="text-align:center;color:#888;">Nenhuma transação encontrada.</td></tr>';

    // Charts
    const labels  = chartData.labels       || [];
    const revenues = (chartData.revenue    || []).map(v => Math.round(v));
    const txCounts = (chartData.reservations || []);

    createFinancialCharts(labels, revenues, txCounts, reservations);
    updateTableInfo(reservations.length);
}

// ─── RESERVAS ─────────────────────────────────────────────────────────────────

async function generateReservationReport() {
    const startDate = document.getElementById('filterStartDate')?.value || '';
    const endDate   = document.getElementById('filterEndDate')?.value   || '';
    const status    = document.getElementById('filterStatus')?.value    || '';

    let url = '/reservations?per_page=100';
    if (status)    url += `&status=${encodeURIComponent(status)}`;
    if (startDate) url += `&start_date=${encodeURIComponent(startDate)}`;
    if (endDate)   url += `&end_date=${encodeURIComponent(endDate)}`;

    const res  = await apiFetch(url);
    const data = res.data?.data || res.data || [];

    const confirmed = data.filter(r => r.status === 'confirmed').length;
    const cancelled = data.filter(r => r.status === 'cancelled').length;
    const pending   = data.filter(r => r.status === 'pending').length;

    displayStatsCards([
        { title: 'Total de Reservas', value: String(data.length), trend: 'up',   percentage: '' },
        { title: 'Confirmadas',       value: String(confirmed),   trend: 'up',   percentage: '' },
        { title: 'Canceladas',        value: String(cancelled),   trend: 'down', percentage: '' },
        { title: 'Pendentes',         value: String(pending),     trend: 'up',   percentage: '' },
    ]);

    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');

    tableHead.innerHTML = `
        <tr>
            <th>Hóspede</th>
            <th>Imóvel</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Valor</th>
            <th>Status</th>
        </tr>
    `;

    const statusMap = {
        confirmed: 'Confirmada', cancelled: 'Cancelada',
        pending: 'Pendente', completed: 'Concluída',
        checked_in: 'Em andamento', checked_out: 'Finalizada',
    };

    const rows = data.map(r => {
        const guest    = r.guest?.name ?? '—';
        const property = r.property?.title ?? '—';
        const checkIn  = r.check_in  ? new Date(r.check_in + 'T00:00').toLocaleDateString('pt-BR')  : '—';
        const checkOut = r.check_out ? new Date(r.check_out + 'T00:00').toLocaleDateString('pt-BR') : '—';
        const price    = parseFloat(r.total_price || 0);
        const statusPt = statusMap[r.status] ?? r.status;
        const badgeCls = (r.status ?? '').replace(/_/g, '');
        return `<tr>
            <td>${escapeHtml(guest)}</td>
            <td>${escapeHtml(property)}</td>
            <td>${checkIn}</td>
            <td>${checkOut}</td>
            <td>${formatCurrency(price)}</td>
            <td><span class="status-badge ${badgeCls}">${escapeHtml(statusPt)}</span></td>
        </tr>`;
    }).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:#888;">Nenhuma reserva encontrada.</td></tr>';

    createReservationCharts(data);
    updateTableInfo(data.length);
}

// ─── IMÓVEIS ──────────────────────────────────────────────────────────────────

async function generatePropertiesReport() {
    const [activeRes, inactiveRes, pendingRes] = await Promise.all([
        apiFetch('/properties?per_page=100&status=active'),
        apiFetch('/properties?per_page=100&status=inactive'),
        apiFetch('/properties?per_page=100&status=pending'),
    ]);

    const active   = activeRes.data?.data   || activeRes.data   || [];
    const inactive = inactiveRes.data?.data || inactiveRes.data || [];
    const pending  = pendingRes.data?.data  || pendingRes.data  || [];
    const all      = [...active, ...inactive, ...pending];

    displayStatsCards([
        { title: 'Total Cadastrados', value: String(all.length),      trend: 'up',   percentage: '' },
        { title: 'Ativos',            value: String(active.length),   trend: 'up',   percentage: '' },
        { title: 'Inativos',          value: String(inactive.length), trend: 'down', percentage: '' },
        { title: 'Pendentes',         value: String(pending.length),  trend: 'up',   percentage: '' },
    ]);

    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');

    tableHead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Cidade / Estado</th>
            <th>Anfitrião</th>
            <th>Diária</th>
            <th>Status</th>
        </tr>
    `;

    const statusMap = { active: 'Ativo', inactive: 'Inativo', pending: 'Pendente', suspended: 'Suspenso' };

    const rows = all.map(p => {
        const location   = [p.city, p.state].filter(Boolean).join(' - ') || '—';
        const host       = p.host?.user?.name ?? p.owner?.name ?? '—';
        const price      = parseFloat(p.nightly_price || 0);
        const statusPt   = statusMap[p.status] ?? p.status;
        const badgeCls   = (p.status ?? '').toLowerCase();
        return `<tr>
            <td>${escapeHtml(p.title ?? '—')}</td>
            <td>${escapeHtml(location)}</td>
            <td>${escapeHtml(host)}</td>
            <td>${formatCurrency(price)}/noite</td>
            <td><span class="status-badge ${badgeCls}">${escapeHtml(statusPt)}</span></td>
        </tr>`;
    }).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="5" style="text-align:center;color:#888;">Nenhum imóvel encontrado.</td></tr>';

    createPropertiesCharts(all, active.length, inactive.length, pending.length);
    updateTableInfo(all.length);
}

// ─── USUÁRIOS ────────────────────────────────────────────────────────────────

async function generateUsersReport() {
    const res  = await apiFetch('/users?per_page=100');
    const data = res.data?.data || res.data || [];

    const hosts   = data.filter(u => u.role === 'host').length;
    const admins  = data.filter(u => u.role === 'admin').length;
    const guests  = data.length - hosts - admins;

    // New this month
    const now = new Date();
    const newThisMonth = data.filter(u => {
        const d = new Date(u.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    displayStatsCards([
        { title: 'Total de Usuários',  value: String(data.length),   trend: 'up', percentage: '' },
        { title: 'Anfitriões',         value: String(hosts),          trend: 'up', percentage: '' },
        { title: 'Hóspedes',           value: String(guests),         trend: 'up', percentage: '' },
        { title: 'Novos este Mês',     value: String(newThisMonth),   trend: 'up', percentage: '' },
    ]);

    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');

    tableHead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Tipo</th>
            <th>Cadastro</th>
        </tr>
    `;

    const roleMap = { host: 'Anfitrião', admin: 'Admin', guest: 'Hóspede', user: 'Hóspede' };

    const rows = data.map(u => {
        const role    = roleMap[u.role] ?? (u.role ?? 'Hóspede');
        const created = u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—';
        return `<tr>
            <td>${escapeHtml(u.name ?? '—')}</td>
            <td>${escapeHtml(u.email ?? '—')}</td>
            <td>${escapeHtml(role)}</td>
            <td>${created}</td>
        </tr>`;
    }).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="4" style="text-align:center;color:#888;">Nenhum usuário encontrado.</td></tr>';

    createUsersCharts(data, hosts, guests, admins);
    updateTableInfo(data.length);
}

// ─── AVALIAÇÕES ───────────────────────────────────────────────────────────────

async function generateReviewsReport() {
    const res  = await apiFetch('/reviews?per_page=100');
    const data = res.data?.data || res.data || [];

    const avgRating = data.length > 0
        ? (data.reduce((s, r) => s + parseFloat(r.rating || 0), 0) / data.length).toFixed(1)
        : '0.0';
    const maxRating = data.length > 0 ? Math.max(...data.map(r => parseFloat(r.rating || 0))).toFixed(1) : '0.0';
    const minRating = data.length > 0 ? Math.min(...data.map(r => parseFloat(r.rating || 0))).toFixed(1) : '0.0';

    displayStatsCards([
        { title: 'Média Geral',       value: avgRating,           trend: 'up',   percentage: '' },
        { title: 'Total Avaliações',  value: String(data.length), trend: 'up',   percentage: '' },
        { title: 'Melhor Nota',       value: maxRating + ' ★',    trend: 'up',   percentage: '' },
        { title: 'Pior Nota',         value: minRating + ' ★',    trend: 'down', percentage: '' },
    ]);

    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');

    tableHead.innerHTML = `
        <tr>
            <th>Imóvel</th>
            <th>Nota</th>
            <th>Comentário</th>
            <th>Autor</th>
            <th>Data</th>
        </tr>
    `;

    const rows = data.map(r => {
        const property = r.property?.title ?? '—';
        const rating   = parseFloat(r.rating || 0).toFixed(1);
        const comment  = r.comment ?? r.body ?? '—';
        const author   = r.reviewer?.name ?? r.user?.name ?? '—';
        const date     = r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '—';
        return `<tr>
            <td>${escapeHtml(property)}</td>
            <td><span style="color:#f59e0b;font-weight:bold;">${rating} ★</span></td>
            <td>${escapeHtml(comment)}</td>
            <td>${escapeHtml(author)}</td>
            <td>${date}</td>
        </tr>`;
    }).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="5" style="text-align:center;color:#888;">Nenhuma avaliação encontrada.</td></tr>';

    createReviewsCharts(data);
    updateTableInfo(data.length);
}

// ─── OPERACIONAL ─────────────────────────────────────────────────────────────

async function generateOperationalReport() {
    const res  = await apiFetch('/reservations?per_page=100');
    const all  = res.data?.data || res.data || [];

    const today    = new Date(); today.setHours(0,0,0,0);
    const todayStr = today.toISOString().slice(0,10);

    const checkinsToday  = all.filter(r => r.check_in  === todayStr).length;
    const checkoutsToday = all.filter(r => r.check_out === todayStr).length;
    const pending        = all.filter(r => r.status === 'pending').length;
    const confirmed      = all.filter(r => r.status === 'confirmed').length;

    displayStatsCards([
        { title: 'Check-ins Hoje',    value: String(checkinsToday),  trend: 'up',   percentage: '' },
        { title: 'Check-outs Hoje',   value: String(checkoutsToday), trend: 'up',   percentage: '' },
        { title: 'Aguardando Confirm',value: String(pending),        trend: 'down', percentage: '' },
        { title: 'Confirmadas',       value: String(confirmed),      trend: 'up',   percentage: '' },
    ]);

    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');

    tableHead.innerHTML = `
        <tr>
            <th>Hóspede</th>
            <th>Imóvel</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
        </tr>
    `;

    const statusMap = {
        confirmed: 'Confirmada', cancelled: 'Cancelada',
        pending: 'Pendente', completed: 'Concluída',
        checked_in: 'Em andamento', checked_out: 'Finalizada',
    };

    const rows = all.map(r => {
        const guest    = r.guest?.name ?? '—';
        const property = r.property?.title ?? '—';
        const checkIn  = r.check_in  ? new Date(r.check_in  + 'T00:00').toLocaleDateString('pt-BR') : '—';
        const checkOut = r.check_out ? new Date(r.check_out + 'T00:00').toLocaleDateString('pt-BR') : '—';
        const statusPt = statusMap[r.status] ?? r.status;
        const badgeCls = (r.status ?? '').replace(/_/g, '');
        return `<tr>
            <td>${escapeHtml(guest)}</td>
            <td>${escapeHtml(property)}</td>
            <td>${checkIn}</td>
            <td>${checkOut}</td>
            <td><span class="status-badge ${badgeCls}">${escapeHtml(statusPt)}</span></td>
        </tr>`;
    }).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="5" style="text-align:center;color:#888;">Nenhuma reserva encontrada.</td></tr>';

    createOperationalCharts(all, checkinsToday, checkoutsToday, pending, confirmed);
    updateTableInfo(all.length);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatCurrency(value) {
    return 'R$ ' + parseFloat(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function displayStatsCards(stats) {
    const container = document.getElementById('reportStatsContainer');
    if (!container) return;
    container.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-chart-bar"></i>
            </div>
            <div class="stat-info">
                <h3>${stat.value}</h3>
                <p>${stat.title}</p>
            </div>
            ${stat.percentage ? `<div class="stat-trend ${stat.trend}">
                <i class="fas fa-arrow-${stat.trend}"></i>
                <span>${stat.percentage}</span>
            </div>` : ''}
        </div>
    `).join('');
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────

function createFinancialCharts(labels, revenues, txCounts, reservations) {
    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctxMain || !ctxDist) return;

    mainChart = new Chart(ctxMain, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita (R$)',
                data: revenues,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => 'R$ ' + v.toLocaleString('pt-BR') }
                }
            }
        }
    });

    const confirmed = reservations.filter(r => r.status === 'confirmed' || r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const pending   = reservations.filter(r => r.status === 'pending').length;
    const other     = reservations.length - confirmed - cancelled - pending;

    distributionChart = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['Confirmada', 'Pendente', 'Cancelada', 'Outros'],
            datasets: [{
                data: [confirmed, pending, cancelled, other > 0 ? other : undefined].filter(v => v != null && v > 0),
                backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createReservationCharts(data) {
    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctxMain || !ctxDist) return;

    // Count reservations per property
    const propertyCounts = {};
    data.forEach(r => {
        const title = r.property?.title ?? ('Imóvel #' + r.property_id);
        propertyCounts[title] = (propertyCounts[title] || 0) + 1;
    });
    const sortedProperties = Object.entries(propertyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: sortedProperties.map(e => e[0]),
            datasets: [{
                label: 'Reservas',
                data: sortedProperties.map(e => e[1]),
                backgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    const confirmed = data.filter(r => r.status === 'confirmed').length;
    const cancelled = data.filter(r => r.status === 'cancelled').length;
    const pending   = data.filter(r => r.status === 'pending').length;
    const completed = data.filter(r => r.status === 'completed').length;

    distributionChart = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['Confirmada', 'Concluída', 'Cancelada', 'Pendente'],
            datasets: [{
                data: [confirmed, completed, cancelled, pending],
                backgroundColor: ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createPropertiesCharts(data, activeCount, inactiveCount, pendingCount) {
    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctxMain || !ctxDist) return;

    // Group by city
    const cityCounts = {};
    data.forEach(p => {
        const city = p.city || 'Outros';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: sortedCities.map(e => e[0]),
            datasets: [{
                label: 'Imóveis',
                data: sortedCities.map(e => e[1]),
                backgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });

    distributionChart = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['Ativos', 'Inativos', 'Pendentes'],
            datasets: [{
                data: [activeCount, inactiveCount, pendingCount],
                backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createUsersCharts(data, hostCount, guestCount, adminCount) {
    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctxMain || !ctxDist) return;

    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Hóspedes', 'Anfitriões', 'Admins'],
            datasets: [{
                label: 'Quantidade',
                data: [guestCount, hostCount, adminCount],
                backgroundColor: ['#22c55e', '#8b6bff', '#3b82f6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Registrations per month (last 6 months)
    const months = [];
    const counts = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        months.push(label);
        counts.push(data.filter(u => {
            const created = new Date(u.created_at);
            return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
        }).length);
    }

    distributionChart = new Chart(ctxDist, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Cadastros',
                data: counts,
                borderColor: '#8b6bff',
                backgroundColor: 'rgba(139,107,255,0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#8b6bff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function createReviewsCharts(data) {
    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctxMain || !ctxDist) return;

    // Average rating per property
    const propertyRatings = {};
    data.forEach(r => {
        const key = r.property?.title ?? ('Imóvel #' + r.property_id);
        if (!propertyRatings[key]) propertyRatings[key] = [];
        propertyRatings[key].push(parseFloat(r.rating || 0));
    });
    const propertyAvg = Object.entries(propertyRatings)
        .map(([name, ratings]) => ({
            name,
            avg: (ratings.reduce((a,b) => a+b, 0) / ratings.length).toFixed(1)
        }))
        .sort((a,b) => b.avg - a.avg)
        .slice(0, 8);

    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: propertyAvg.map(p => p.name),
            datasets: [{
                label: 'Nota Média',
                data: propertyAvg.map(p => p.avg),
                backgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 5 } }
        }
    });

    // Rating distribution
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    data.forEach(r => {
        const floor = Math.min(5, Math.max(1, Math.floor(parseFloat(r.rating || 0))));
        ratingCounts[floor]++;
    });

    distributionChart = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'],
            datasets: [{
                data: [ratingCounts[5], ratingCounts[4], ratingCounts[3], ratingCounts[2], ratingCounts[1]],
                backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444', '#dc2626'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createOperationalCharts(data, checkinsToday, checkoutsToday, pending, confirmed) {
    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    const ctxDist = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctxMain || !ctxDist) return;

    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Check-ins Hoje', 'Check-outs Hoje', 'Aguardando', 'Confirmadas'],
            datasets: [{
                label: 'Quantidade',
                data: [checkinsToday, checkoutsToday, pending, confirmed],
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#8b6bff']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    const cancelled  = data.filter(r => r.status === 'cancelled').length;
    const completed  = data.filter(r => r.status === 'completed').length;
    const checkedIn  = data.filter(r => r.status === 'checked_in').length;
    const other      = data.length - pending - confirmed - cancelled - completed - checkedIn;

    distributionChart = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['Confirmada', 'Pendente', 'Cancelada', 'Concluída', 'Em andamento'],
            datasets: [{
                data: [confirmed, pending, cancelled, completed, checkedIn],
                backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b6bff'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function updateTableInfo(itemCount) {
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        tableInfo.textContent = `Mostrando 1-${Math.min(10, itemCount)} de ${itemCount} registros`;
    }
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

function setupExportButtons() {
    const exportPdfBtn  = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => exportToPDF());
    }

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => exportToExcel());
    }
}

function exportToPDF() {
    if (typeof showMessage === 'function') {
        showMessage('Relatório PDF será gerado com biblioteca PDF', 'success');
    }
}

function exportToExcel() {
    const table = document.getElementById('reportTable');
    const reportType = appState.currentReport;
    let csv = '';

    const headers = Array.from(table.querySelectorAll('thead th')).map(h => h.textContent.trim());
    csv += headers.join(',') + '\n';

    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(cell => {
            let text = cell.textContent.trim().replace(/\n/g,' ');
            if (text.includes(',') || text.includes('"')) {
                text = '"' + text.replace(/"/g, '""') + '"';
            }
            return text;
        });
        csv += cells.join(',') + '\n';
    });

    const link = document.createElement('a');
    link.href     = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `relatorio_${reportType}_${new Date().getTime()}.csv`;
    link.click();

    if (typeof showMessage === 'function') {
        showMessage('Relatório exportado com sucesso!', 'success');
    }
}

function exportToCSV() {
    exportToExcel();
}
