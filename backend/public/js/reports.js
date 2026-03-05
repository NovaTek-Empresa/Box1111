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
            document.getElementById('filterProperty').value = '';
            document.getElementById('filterOwner').value = '';
            document.getElementById('filterCity').value = '';
            document.getElementById('filterStatus').value = '';
            generateReport(appState.currentReport);
        });
    }
}

function generateReport(reportType) {
    appState.currentReport = reportType;
    
    // Limpar gráficos anteriores
    if (mainChart) mainChart.destroy();
    if (distributionChart) distributionChart.destroy();
    
    switch(reportType) {
        case 'financeiro':
            generateFinancialReport();
            break;
        case 'reservas':
            generateReservationReport();
            break;
        case 'imoveis':
            generatePropertiesReport();
            break;
        case 'usuarios':
            generateUsersReport();
            break;
        case 'avaliacoes':
            generateReviewsReport();
            break;
        case 'operacional':
            generateOperationalReport();
            break;
    }
}

function generateFinancialReport() {
    const data = adminData.reports.financeiro;
    
    // Stats Cards
    const stats = [
        {
            title: "Total Recebido",
            value: "R$ 204.000",
            trend: "up",
            percentage: "12%"
        },
        {
            title: "Total Anual",
            value: "R$ 2.456.000",
            trend: "up",
            percentage: "8%"
        },
        {
            title: "Faturamento Médio",
            value: "R$ 40.800",
            trend: "up",
            percentage: "5%"
        },
        {
            title: "Transações",
            value: "5",
            trend: "down",
            percentage: "2%"
        }
    ];
    
    displayStatsCards(stats);
    
    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');
    
    tableHead.innerHTML = `
        <tr>
            <th>Imóvel</th>
            <th>Proprietário</th>
            <th>Total Ganho</th>
            <th>Mês</th>
            <th>Status</th>
        </tr>
    `;
    
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.imovel}</td>
            <td>${item.proprietario}</td>
            <td>R$ ${item.total.toLocaleString('pt-BR')}</td>
            <td>${item.mes}</td>
            <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
        </tr>
    `).join('');
    
    // Charts
    createFinancialCharts();
    
    updateTableInfo(data.length);
}

function generateReservationReport() {
    const data = adminData.reports.reservas;
    
    // Stats Cards
    const stats = [
        {
            title: "Total de Reservas",
            value: data.length.toString(),
            trend: "up",
            percentage: "15%"
        },
        {
            title: "Confirmadas",
            value: data.filter(r => r.status === 'Confirmada').length.toString(),
            trend: "up",
            percentage: "12%"
        },
        {
            title: "Canceladas",
            value: data.filter(r => r.status === 'Cancelada').length.toString(),
            trend: "down",
            percentage: "5%"
        },
        {
            title: "Pendentes",
            value: data.filter(r => r.status === 'Pendente').length.toString(),
            trend: "up",
            percentage: "8%"
        }
    ];
    
    displayStatsCards(stats);
    
    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');
    
    tableHead.innerHTML = `
        <tr>
            <th>Cliente</th>
            <th>Imóvel</th>
            <th>Data de Entrada</th>
            <th>Data de Saída</th>
            <th>Status</th>
        </tr>
    `;
    
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.cliente}</td>
            <td>${item.imovel}</td>
            <td>${item.dataEntrada}</td>
            <td>${item.dataSaida}</td>
            <td><span class="status-badge ${item.status.toLowerCase().replace(' ', '')}">${item.status}</span></td>
        </tr>
    `).join('');
    
    // Charts
    createReservationCharts();
    
    updateTableInfo(data.length);
}

function generatePropertiesReport() {
    const data = adminData.reports.imoveis;
    
    // Stats Cards
    const stats = [
        {
            title: "Total Cadastrados",
            value: data.length.toString(),
            trend: "up",
            percentage: "10%"
        },
        {
            title: "Ativos",
            value: "4",
            trend: "up",
            percentage: "8%"
        },
        {
            title: "Inativos",
            value: "1",
            trend: "down",
            percentage: "5%"
        },
        {
            title: "Taxa de Ocupação",
            value: "73%",
            trend: "up",
            percentage: "12%"
        }
    ];
    
    displayStatsCards(stats);
    
    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');
    
    tableHead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Cidade</th>
            <th>Proprietário</th>
            <th>Visualizações</th>
            <th>Ocupação</th>
        </tr>
    `;
    
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.nome}</td>
            <td>${item.cidade}</td>
            <td>${item.proprietario}</td>
            <td>${item.visualizacoes.toLocaleString('pt-BR')}</td>
            <td>${item.ocupacao}</td>
        </tr>
    `).join('');
    
    // Charts
    createPropertiesCharts(data);
    
    updateTableInfo(data.length);
}

function generateUsersReport() {
    const data = adminData.reports.usuarios;
    
    // Stats Cards
    const stats = [
        {
            title: "Total de Usuários",
            value: data.length.toString(),
            trend: "up",
            percentage: "10%"
        },
        {
            title: "Proprietários",
            value: data.filter(u => u.tipo === 'Proprietário').length.toString(),
            trend: "up",
            percentage: "8%"
        },
        {
            title: "Novos no Período",
            value: "3",
            trend: "up",
            percentage: "15%"
        },
        {
            title: "Ativos",
            value: data.filter(u => u.status === 'Ativo').length.toString(),
            trend: "up",
            percentage: "12%"
        }
    ];
    
    displayStatsCards(stats);
    
    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');
    
    tableHead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Data de Cadastro</th>
            <th>Status</th>
        </tr>
    `;
    
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.nome}</td>
            <td>${item.tipo}</td>
            <td>${item.dataCadastro}</td>
            <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
        </tr>
    `).join('');
    
    // Charts
    createUsersCharts(data);
    
    updateTableInfo(data.length);
}

function generateReviewsReport() {
    const data = adminData.reports.avaliacoes;
    
    const avgRating = (data.reduce((sum, item) => sum + item.nota, 0) / data.length).toFixed(1);
    
    // Stats Cards
    const stats = [
        {
            title: "Média Geral",
            value: avgRating,
            trend: "up",
            percentage: "5%"
        },
        {
            title: "Total de Avaliações",
            value: data.length.toString(),
            trend: "up",
            percentage: "20%"
        },
        {
            title: "Melhor Avaliado",
            value: Math.max(...data.map(d => d.nota)).toFixed(1),
            trend: "up",
            percentage: "0%"
        },
        {
            title: "Pior Avaliado",
            value: Math.min(...data.map(d => d.nota)).toFixed(1),
            trend: "down",
            percentage: "0%"
        }
    ];
    
    displayStatsCards(stats);
    
    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');
    
    tableHead.innerHTML = `
        <tr>
            <th>Imóvel</th>
            <th>Nota</th>
            <th>Comentário</th>
            <th>Usuário</th>
            <th>Data</th>
        </tr>
    `;
    
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.imovel}</td>
            <td><span style="color: #f59e0b; font-weight: bold;">${item.nota} ★</span></td>
            <td>${item.comentario}</td>
            <td>${item.usuario}</td>
            <td>${item.data}</td>
        </tr>
    `).join('');
    
    // Charts
    createReviewsCharts(data);
    
    updateTableInfo(data.length);
}

function generateOperationalReport() {
    const data = adminData.reports.operacional;
    
    // Stats Cards
    const stats = [
        {
            title: "Check-ins Previstos",
            value: data.find(d => d.tipo === 'Check-in Previsto')?.quantidade || "0",
            trend: "up",
            percentage: "10%"
        },
        {
            title: "Check-outs Previstos",
            value: data.find(d => d.tipo === 'Check-out Previsto')?.quantidade || "0",
            trend: "up",
            percentage: "8%"
        },
        {
            title: "Atrasos",
            value: data.find(d => d.tipo === 'Atrasos')?.quantidade || "0",
            trend: "down",
            percentage: "5%"
        },
        {
            title: "Pendências Gerais",
            value: data.find(d => d.tipo === 'Pendências Gerais')?.quantidade || "0",
            trend: "up",
            percentage: "12%"
        }
    ];
    
    displayStatsCards(stats);
    
    // Table
    const tableHead = document.querySelector('#reportTableHead');
    const tableBody = document.querySelector('#reportTableBody');
    
    tableHead.innerHTML = `
        <tr>
            <th>Tipo</th>
            <th>Data</th>
            <th>Quantidade</th>
            <th>Status</th>
        </tr>
    `;
    
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.tipo}</td>
            <td>${item.data}</td>
            <td>${item.quantidade}</td>
            <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
        </tr>
    `).join('');
    
    // Charts
    createOperationalCharts(data);
    
    updateTableInfo(data.length);
}

function displayStatsCards(stats) {
    const container = document.getElementById('reportStatsContainer');
    container.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-chart-bar"></i>
            </div>
            <div class="stat-info">
                <h3>${stat.value}</h3>
                <p>${stat.title}</p>
            </div>
            <div class="stat-trend ${stat.trend}">
                <i class="fas fa-arrow-${stat.trend}"></i>
                <span>${stat.percentage}</span>
            </div>
        </div>
    `).join('');
}

function createFinancialCharts() {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    
    // Gráfico de linha - Faturamento mensal
    mainChart = new Chart(ctxMain, {
        type: 'line',
        data: {
            labels: ['Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro'],
            datasets: [{
                label: 'Faturamento (R$ mil)',
                data: [180, 195, 210, 240, 204],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value + 'k';
                        }
                    }
                }
            }
        }
    });
    
    // Gráfico de pizza - Status de transações
    distributionChart = new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['Confirmado', 'Pendente', 'Cancelado'],
            datasets: [{
                data: [3, 1, 1],
                backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createReservationCharts() {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    
    // Gráfico de barras - Reservas por imóvel
    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Casa Alto Padrão', 'Sobrado Moderno', 'Apt. Centro', 'Cobertura Duplex'],
            datasets: [{
                label: 'Reservas',
                data: [8, 6, 5, 3],
                backgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Gráfico de pizza - Status das reservas
    distributionChart = new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['Confirmada', 'Cancelada', 'Pendente'],
            datasets: [{
                data: [2, 1, 1],
                backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createPropertiesCharts(data) {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    
    // Gráfico de barras - Imóveis mais visualizados
    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: data.map(p => p.nome),
            datasets: [{
                label: 'Visualizações',
                data: data.map(p => p.visualizacoes),
                backgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Gráfico de pizza - Ocupação
    distributionChart = new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['Ocupados', 'Disponíveis'],
            datasets: [{
                data: [73, 27],
                backgroundColor: ['#22c55e', '#e5e5e5'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createUsersCharts(data) {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    
    const clientCount = data.filter(u => u.tipo === 'Cliente').length;
    const ownerCount = data.filter(u => u.tipo === 'Proprietário').length;
    
    // Gráfico de barras - Tipo de usuário
    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Cliente', 'Proprietário'],
            datasets: [{
                label: 'Quantidade',
                data: [clientCount, ownerCount],
                backgroundColor: ['#22c55e', '#8b6bff']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Gráfico de pizza - Status
    const activeCount = data.filter(u => u.status === 'Ativo').length;
    const inactiveCount = data.filter(u => u.status === 'Inativo').length;
    const pendingCount = data.filter(u => u.status === 'Pendente').length;
    
    distributionChart = new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['Ativo', 'Inativo', 'Pendente'],
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
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createReviewsCharts(data) {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    
    // Gráfico de barras - Ranking de imóveis
    const propertyRatings = {};
    data.forEach(item => {
        if (!propertyRatings[item.imovel]) {
            propertyRatings[item.imovel] = [];
        }
        propertyRatings[item.imovel].push(item.nota);
    });
    
    const propertyAvg = Object.entries(propertyRatings).map(([name, ratings]) => ({
        name,
        avg: (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1)
    }));
    
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
    
    // Distribuição de notas
    const ratingCounts = {};
    for (let i = 1; i <= 5; i++) {
        ratingCounts[i] = data.filter(d => Math.floor(d.nota) === i).length;
    }
    
    distributionChart = new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['5★', '4★', '3★', '2★', '1★'],
            datasets: [{
                data: [ratingCounts[5] || 0, ratingCounts[4] || 0, ratingCounts[3] || 0, ratingCounts[2] || 0, ratingCounts[1] || 0],
                backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444', '#dc2626'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createOperationalCharts(data) {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    
    // Gráfico de barras - Operações
    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: data.map(d => d.tipo),
            datasets: [{
                label: 'Quantidade',
                data: data.map(d => d.quantidade),
                backgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Gráfico de pizza - Status
    const confirmed = data.filter(d => d.status === 'Confirmado').length;
    const pending = data.filter(d => d.status === 'Pendente').length;
    
    distributionChart = new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['Confirmado', 'Pendente'],
            datasets: [{
                data: [confirmed, pending],
                backgroundColor: ['#22c55e', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTableInfo(itemCount) {
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        tableInfo.textContent = `Mostrando 1-${Math.min(10, itemCount)} de ${itemCount} registros`;
    }
}

function setupExportButtons() {
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            exportToPDF();
        });
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => {
            exportToExcel();
        });
    }
    
    // CSV button removed from UI; no handler needed
}

function exportToPDF() {
    showMessage('Relatório em PDF será gerado (funcionalidade expandida com biblioteca PDF)', 'success');
}

function exportToExcel() {
    const table = document.getElementById('reportTable');
    const reportType = appState.currentReport;
    let csv = '';
    
    // Headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(h => h.textContent);
    csv += headers.join(',') + '\n';
    
    // Data
    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(cell => {
            let text = cell.textContent.trim();
            if (text.includes(',')) {
                text = '"' + text + '"';
            }
            return text;
        });
        csv += cells.join(',') + '\n';
    });
    
    // Create download link
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `relatorio_${reportType}_${new Date().getTime()}.csv`;
    link.click();
    
    showMessage('Relatório exportado com sucesso!', 'success');
}

function exportToCSV() {
    exportToExcel();
}
