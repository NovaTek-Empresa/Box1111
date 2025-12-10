// Dados do painel do vendedor (simulação)
const vendorData = {
    stats: {
        properties: 12,
        views: 1254,
        messages: 24,
        revenue: 2500000
    },
    // Dados das propriedades recentes
    recentProperties: [
        {
            id: 1,
            title: "Casa Alto Padrão",
            location: "Jardins, SP",
            price: "R$ 1.250.000",
            status: "active",
            views: 245,
            requests: 18,
            rentals: 6,
            date: "15/10/2023",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&q=80&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Sobrado Moderno",
            location: "Vila Mariana, SP",
            price: "R$ 790.000",
            status: "active",
            views: 189,
            requests: 12,
            rentals: 4,
            date: "12/10/2023",
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=100&q=80&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Apartamento Centro",
            location: "Centro, SP",
            price: "R$ 420.000",
            status: "inactive",
            views: 76,
            requests: 6,
            rentals: 1,
            date: "10/10/2023",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&q=80&auto=format&fit=crop"
        }
    ],
    // Estatísticas detalhadas para a tela de statistics
    statistics: {
        revenueMonth: 35840,
        revenueYear: 412000,
        // séries simples para gráfico (últimos 12 meses)
        revenueSeries: [28000, 30000, 32000, 29000, 35000, 36000, 37000, 34000, 38000, 40000, 42000, 35840],
        // desempenho por anúncio
        adsPerformance: [
            { id: 1, title: 'Casa Alto Padrão', views: 245, requests: 18, rentals: 6 },
            { id: 2, title: 'Sobrado Moderno', views: 189, requests: 12, rentals: 4 },
            { id: 3, title: 'Apartamento Centro', views: 76, requests: 6, rentals: 1 },
            { id: 4, title: 'Loja Centro', views: 52, requests: 5, rentals: 2 },
            { id: 5, title: 'Chácara Verde', views: 34, requests: 3, rentals: 1 }
        ],
        // top produtos (top 5)
        topProducts: [
            { id: 1, title: 'Casa Alto Padrão', rentals: 6, revenue: 1250000 },
            { id: 2, title: 'Sobrado Moderno', rentals: 4, revenue: 790000 },
            { id: 4, title: 'Loja Centro', rentals: 2, revenue: 32000 },
            { id: 3, title: 'Apartamento Centro', rentals: 1, revenue: 420000 },
            { id: 5, title: 'Chácara Verde', rentals: 1, revenue: 5000 }
        ],
        // ocupação
        occupancy: [
            { id: 1, title: 'Casa Alto Padrão', bookings: [5,6,7,15,16,17] },
            { id: 2, title: 'Sobrado Moderno', bookings: [1,2,3,20,21] },
            { id: 3, title: 'Apartamento Centro', bookings: [10,11,12] }
        ],
        // avaliações
        reviews: {
            average: 4.7,
            count: 128,
            recent: [
                { user: 'Ana', comment: 'Ótima hospedagem, recomendo!', rating: 5 },
                { user: 'Pedro', comment: 'Local limpo e bem localizado.', rating: 4 }
            ]
        },
        // pendências
        pending: {
            requests: [ { id: 101, name: 'João', property: 'Sobrado Moderno', date: '04/12/2025' } ],
            upcomingReturns: [ { id: 1, property: 'Casa Alto Padrão', due: '06/12/2025' } ],
            overdue: [ { id: 2, property: 'Sobrado Moderno', due: '28/11/2025', daysLate: 5 } ]
        },
        insights: [
            'Alta demanda às sextas-feiras entre 18h e 21h',
            'Considere aumentar preço em 10% para Casa Alto Padrão em feriados',
            'Itens com baixa taxa de conversão: revisar fotos/descrição'
        ]
    },
    notifications: [
        {
            id: 1,
            title: "Nova solicitação de reserva",
            message: "João Silva solicitou reserva para Casa Alto Padrão",
            time: "Há 5 minutos",
            icon: "fas fa-home",
            read: false
        },
        {
            id: 2,
            title: "Pagamento recebido",
            message: "Pagamento de R$ 2.500 da reserva ID: 456 foi confirmado",
            time: "Há 1 hora",
            icon: "fas fa-dollar-sign",
            read: false
        },
        {
            id: 3,
            title: "Avaliação recebida",
            message: "Ana Costa deixou uma avaliação 5 estrelas em Sobrado Moderno",
            time: "Há 2 horas",
            icon: "fas fa-star",
            read: false
        },
        {
            id: 4,
            title: "Sugestão de melhoria",
            message: "Sistema detectou fotos de baixa qualidade no seu imóvel",
            time: "Há 1 dia",
            icon: "fas fa-lightbulb",
            read: true
        },
        {
            id: 5,
            title: "Nova mensagem de hóspede",
            message: "Pedro Oliveira enviou uma mensagem sobre disponibilidade",
            time: "Há 2 dias",
            icon: "fas fa-envelope",
            read: true
        },
        {
            id: 6,
            title: "Cancelamento de reserva",
            message: "Reserva ID: 123 foi cancelada pelo cliente",
            time: "Há 3 dias",
            icon: "fas fa-times-circle",
            read: true
        },
        {
            id: 7,
            title: "Proprietário solicitou atualização",
            message: "Atualize as fotos do Apartamento Centro para aumentar visualizações",
            time: "Há 4 dias",
            icon: "fas fa-camera",
            read: false
        }
    ]
};

// Dados de chat (simulação)
const chatData = {
    conversations: [
        {
            id: 1,
            name: 'Joana Pereira',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            last: 'Olá, tenho interesse no imóvel.',
            messages: [
                { from: 'client', text: 'Olá, tenho interesse no imóvel.', time: '10:02' },
                { from: 'vendor', text: 'Olá Joana! Pode me dizer qual imóvel?', time: '10:05' }
            ]
        },
        {
            id: 2,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:17' },
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:21' }
            ]
        },
                {
            id: 3,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:17' }
            ]
        },
              {
            id: 4,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:15' }
            ]
        },
              {
            id: 5,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:17' }
            ]
        }
    ]
};

// Chart instances
let revenueChartInstance = null;


function countNotification(chatData){
    return chatData.conversations.length;
}

// preencher o badge
document.querySelector(".badge-on").textContent = countNotification(chatData);


// Variável temporária de anexo na conversa atual
let currentChatAttachment = null;

// Inicialização do painel do vendedor
document.addEventListener('DOMContentLoaded', () => {
    // Toggle da sidebar em dispositivos móveis
    const sidebarToggle = document.getElementById('sidebarToggle');
    const vendorSidebar = document.querySelector('.vendor-sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebarToggle && vendorSidebar && sidebarBackdrop) {
        // Abrir/fechar sidebar
        sidebarToggle.addEventListener('click', () => {
            vendorSidebar.classList.toggle('active');
            sidebarBackdrop.classList.toggle('active');
        });
        
        // Fechar sidebar ao clicar no backdrop
        sidebarBackdrop.addEventListener('click', () => {
            vendorSidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
        });
        
        // Fechar sidebar ao clicar em um link de navegação
        const navLinks = vendorSidebar.querySelectorAll('.nav-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    vendorSidebar.classList.remove('active');
                    sidebarBackdrop.classList.remove('active');
                }
            });
        });
    }
    
    // Botão para colapsar/expandir a sidebar (desktop)
    const vendorCollapseBtn = document.getElementById('vendorSidebarCollapse');
    const vendorMain = document.querySelector('.vendor-main');

    if (vendorCollapseBtn && vendorSidebar && vendorMain) {
        vendorCollapseBtn.addEventListener('click', () => {
            const icon = vendorCollapseBtn.querySelector('i');
            vendorSidebar.classList.toggle('collapsed');
            vendorMain.classList.toggle('sidebar-compact');
            if (vendorSidebar.classList.contains('collapsed')) {
                if (icon) {
                    icon.classList.remove('fa-angle-left');
                    icon.classList.add('fa-angle-right');
                }
            } else {
                if (icon) {
                    icon.classList.remove('fa-angle-right');
                    icon.classList.add('fa-angle-left');
                }
            }
        });
    }
    
    // Navegação entre seções
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover classe active de todos os itens
            navItems.forEach(i => i.classList.remove('active'));
            // Adicionar classe active ao item clicado
            item.classList.add('active');
            
            // Atualizar o título da página
            const pageTitle = document.querySelector('.vendor-header h1');
            const linkText = item.querySelector('span').textContent;
            if (pageTitle) {
                pageTitle.textContent = linkText;
            }
            
            // Carregar conteúdo da seção
            const section = item.querySelector('a').getAttribute('href').substring(1);
            loadSectionContent(section);
        });
    });
    
    // Configurar busca
    setupVendorSearch();
    
    // Configurar notificações
    setupNotifications();
    
    // Carregar dashboard por padrão na primeira carga
    loadSectionContent('dashboard');
});

// Carregar dados do dashboard
function loadDashboardData() {
    // Atualizar estatísticas
    updateStats();
    
    // Carregar imóveis recentes
    loadRecentProperties();
}

// Atualizar estatísticas
function updateStats() {
    const stats = vendorData.stats;
    
    // Formatar números
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };
    
    // Atualizar cards de estatística
    const statCards = document.querySelectorAll('.stat-info h3');
    if (statCards.length >= 4) {
        statCards[0].textContent = formatNumber(stats.properties);
        statCards[1].textContent = formatNumber(stats.views);
        statCards[2].textContent = formatNumber(stats.messages);
        statCards[3].textContent = 'R$ ' + formatNumber(stats.revenue);
    }
}

// Carregar imóveis recentes
function loadRecentProperties() {
    const propertiesTable = document.querySelector('.properties-table tbody');
    // Se não houver tabela de propriedades (página dashboard), apenas retornar
    if (!propertiesTable) return;
    
    propertiesTable.innerHTML = '';
    
    vendorData.recentProperties.forEach(property => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="property-cell">
                    <div class="property-image">
                        <img src="${property.image}" alt="${property.title}">
                    </div>
                    <div class="property-info">
                        <h4>${property.title}</h4>
                        <span class="property-location">${property.location}</span>
                    </div>
                </div>
            </td>
            <td class="price-cell">${property.price}</td>
            <td>
                <span class="status-badge ${property.status}">${property.status === 'active' ? 'Ativo' : 'Inativo'}</span>
            </td>
            <td>${property.views}</td>
            <td>${property.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="Editar" onclick="editProperty(${property.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Promover" onclick="promoteProperty(${property.id})">
                        <i class="fas fa-bullhorn"></i>
                    </button>
                    <button class="btn-icon" title="${property.status === 'active' ? 'Desativar' : 'Ativar'}" onclick="togglePropertyStatus(${property.id})">
                        <i class="fas ${property.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                </div>
            </td>
        `;
        
        propertiesTable.appendChild(row);
    });
}

// Configurar busca do vendedor
function setupVendorSearch() {
    const searchInput = document.querySelector('.vendor-search input');
    const searchButton = document.querySelector('.vendor-search button');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            // Recarregar dados originais
            loadDashboardData();
        } else {
            // Filtrar dados baseados na busca
            filterProperties(query);
        }
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Filtrar propriedades baseadas na busca
function filterProperties(query) {
    const filteredProperties = vendorData.recentProperties.filter(property => 
        property.title.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query)
    );
    
    // Atualizar tabela com propriedades filtradas
    updatePropertiesTable(filteredProperties);
}

// Atualizar tabela de propriedades
function updatePropertiesTable(properties) {
    const propertiesTable = document.querySelector('.properties-table tbody');
    if (!propertiesTable) return;
    
    propertiesTable.innerHTML = '';
    
    if (properties.length === 0) {
        propertiesTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <p>Nenhum imóvel encontrado</p>
                </td>
            </tr>
        `;
    } else {
        properties.forEach(property => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="property-cell">
                        <div class="property-image">
                            <img src="${property.image}" alt="${property.title}">
                        </div>
                        <div class="property-info">
                            <h4>${property.title}</h4>
                            <span class="property-location">${property.location}</span>
                        </div>
                    </div>
                </td>
                <td class="price-cell">${property.price}</td>
                <td>
                    <span class="status-badge ${property.status}">${property.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                </td>
                <td>${property.views}</td>
                <td>${property.date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" title="Editar" onclick="editProperty(${property.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" title="Promover" onclick="promoteProperty(${property.id})">
                            <i class="fas fa-bullhorn"></i>
                        </button>
                        <button class="btn-icon" title="${property.status === 'active' ? 'Desativar' : 'Ativar'}" onclick="togglePropertyStatus(${property.id})">
                            <i class="fas ${property.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                        </button>
                    </div>
                </td>
            `;
            
            propertiesTable.appendChild(row);
        });
    }
}

// Carregar conteúdo da seção
function loadSectionContent(section) {
    // Primeiro, ocultar todas as seções
    hideAllSections();
    
    // Lidar com cada seção
    switch(section) {
        case 'dashboard':
            const dashboardDiv = document.querySelector('[data-section="dashboard"]');
            if (dashboardDiv) {
                dashboardDiv.style.display = 'block';
            }
            loadDashboardData();
            break;
            
        case 'add-property':
            const addPropertySection = document.getElementById('add-property');
            if (addPropertySection) {
                addPropertySection.style.display = 'block';
            }
            setupPropertyForm();
            break;
            
        case 'properties':
            // Buscar ou criar seção de propriedades
            let propertiesSection = document.getElementById('my-properties');
            if (!propertiesSection) {
                propertiesSection = document.createElement('div');
                propertiesSection.id = 'my-properties';
                propertiesSection.className = 'content-section';
                propertiesSection.innerHTML = `
                    <div class="vendor-content">
                        <div class="content-card">
                            <div class="card-header">
                                <h3>Meus Imóveis</h3>
                                <a href="#add-property" class="btn">Adicionar Imóvel</a>
                            </div>
                            <div class="card-body">
                                <div class="properties-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Imóvel</th>
                                                <th>Preço</th>
                                                <th>Status</th>
                                                <th>Visualizações</th>
                                                <th>Data</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Imóveis serão carregados aqui -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.querySelector('.vendor-main').appendChild(propertiesSection);
            }
            propertiesSection.style.display = 'block';
            loadRecentProperties();
            break;
            
        case 'messages':
            // Buscar ou criar seção de mensagens
            let messagesSection = document.getElementById('my-messages');
            if (!messagesSection) {
                messagesSection = document.createElement('div');
                messagesSection.id = 'my-messages';
                messagesSection.className = 'content-section';
                messagesSection.innerHTML = `
                    <div class="vendor-content">
                        <div class="content-card chat-card">
                            <aside class="chat-sidebar">
                                <div style="padding:16px;border-bottom:1px solid var(--border);font-weight:700;">Mensagens</div>
                                <ul class="chat-list" id="chatList"></ul>
                            </aside>
                            <section class="chat-panel">
                                <div class="chat-header" id="chatHeader">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" style="width:44px;height:44px;border-radius:50%;object-fit:cover;">
                                    <div>
                                        <div id="chatName" style="font-weight:700;">Selecione uma conversa</div>
                                        <div id="chatStatus" style="font-size:0.85rem;color:var(--text-light);">Online</div>
                                    </div>
                                </div>
                                <div class="chat-messages" id="chatMessages">
                                    <p style="color:var(--text-light);">Selecione uma conversa à esquerda para começar a conversar.</p>
                                </div>
                                <div class="chat-input-area">
                                    <button id="chatAttach" class="btn btn-outline" title="Anexar arquivo" style="padding:8px 10px;height:40px;">📎</button>
                                    <input id="chatFileInput" type="file" style="display:none;">
                                    <input id="chatInput" class="chat-input" placeholder="Escreva uma mensagem...">
                                    <button id="chatSend" class="chat-send">Enviar</button>
                                </div>
                                <div style="padding:0 16px 16px 16px;">
                                    <div id="chatAttachmentPreview" style="font-size:0.9rem;color:var(--text-light);"></div>
                                </div>
                            </section>
                        </div>
                    </div>
                `;
                document.querySelector('.vendor-main').appendChild(messagesSection);
            }
            messagesSection.style.display = 'block';
            initChat();
            break;
            
        case 'statistics':
            // Criar/mostrar seção de estatísticas completa
            let statisticsSection = document.getElementById('my-statistics');
            if (!statisticsSection) {
                statisticsSection = document.createElement('div');
                statisticsSection.id = 'my-statistics';
                statisticsSection.className = 'content-section';
                statisticsSection.innerHTML = `
                    <div class="vendor-content">
                        <div class="section-header">
                            <h2>Estatísticas de Desempenho</h2>
                            <p>Visão rápida para maximizar receita e ocupação</p>
                        </div>

                        <div class="statistics-grid">
                            <div class="revenue-card content-card">
                                <div class="card-header"><h3>Faturamento</h3></div>
                                <div class="card-body">
                                    <div class="revenue-cards">
                                        <div class="rev-item">
                                            <div class="rev-label">Total alugado no mês</div>
                                            <div class="rev-value" id="revenueTotalMonth">R$ 0</div>
                                        </div>
                                        <div class="rev-item">
                                            <div class="rev-label">Total acumulado no ano</div>
                                            <div class="rev-value" id="revenueTotalYear">R$ 0</div>
                                        </div>
                                    </div>
                                    <div class="small-chart" id="revenueChart"></div>
                                </div>
                            </div>

                            <div class="ads-performance content-card">
                                <div class="card-header"><h3>Desempenho dos Anúncios</h3></div>
                                <div class="card-body">
                                    <div class="table-container">
                                        <table class="data-table" id="adsPerformanceTable">
                                            <thead>
                                                <tr>
                                                    <th>Anúncio</th>
                                                    <th>Visualizações</th>
                                                    <th>Solicitações</th>
                                                    <th>Aluguéis</th>
                                                    <th>Conversão</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="analytics-grid">
                            <div class="content-card">
                                <div class="card-header"><h3>Produtos com Melhor Desempenho</h3></div>
                                <div class="card-body">
                                    <div id="topProductsList" class="top-products-list"></div>
                                </div>
                            </div>

                            <div class="content-card">
                                <div class="card-header"><h3>Calendário de Ocupação</h3></div>
                                <div class="card-body">
                                    <div id="occupancyCalendar" class="occupancy-calendar"></div>
                                </div>
                            </div>
                        </div>

                        <div class="statistics-grid">
                            <div class="metrics-card content-card">
                                <div class="card-header"><h3>Métricas do Usuário</h3></div>
                                <div class="card-body" id="userMetrics"></div>
                            </div>

                            <div class="pending-card content-card">
                                <div class="card-header"><h3>Situações Pendentes</h3></div>
                                <div class="card-body" id="pendingList"></div>
                            </div>
                        </div>

                        <div class="content-card">
                            <div class="card-header"><h3>Insights Importantes</h3></div>
                            <div class="card-body" id="insightsList"></div>
                        </div>
                    </div>
                `;
                document.querySelector('.vendor-main').appendChild(statisticsSection);
            }
            statisticsSection.style.display = 'block';
            // Renderizar conteúdo dinâmico
            renderStatistics();
            break;
            
        case 'profile':
            // Tela de Meu Perfil (mais completa)
            let profileSection = document.getElementById('my-profile');
            if (!profileSection) {
                profileSection = document.createElement('div');
                profileSection.id = 'my-profile';
                profileSection.className = 'content-section';
                profileSection.innerHTML = `
                    <div class="vendor-content">
                        <div class="section-header">
                            <h2>Meu Perfil</h2>
                            <p>Gerencie suas informações, métodos de pagamento e segurança</p>
                        </div>

                        <div class="profile-grid">
                            <div class="profile-left">
                                <div class="content-card profile-summary">
                                    <div class="card-header"><h3>Resumo</h3></div>
                                    <div class="card-body center">
                                        <div class="profile-avatar-wrap">
                                            <img id="avatarPreview" class="profile-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar">
                                            <label class="avatar-change">
                                                <input id="profileAvatarInput" type="file" accept="image/*" style="display:none">
                                                <button type="button" class="btn btn-outline">Alterar Foto</button>
                                            </label>
                                        </div>
                                        <h3 id="profileName">Carlos Silva</h3>
                                        <p class="muted">Vendedor • Conta verificada</p>
                                        <div class="profile-actions">
                                            <button id="btnEditProfile" class="btn">Editar Perfil</button>
                                            <button id="btnViewPublic" class="btn btn-outline">Ver Perfil Público</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="content-card">
                                    <div class="card-header"><h3>Documentos</h3></div>
                                    <div class="card-body">
                                        <p class="muted">Envie documentos para verificação (CPF/CNPJ, comprovante de endereço).</p>
                                                                <div class="doc-list">
                                                                    <div class="doc-item">
                                                                        <div class="doc-main">
                                                                            <strong>CPF/CNPJ:</strong>
                                                                            <div class="doc-value">123.456.789-00</div>
                                                                            <div class="doc-actions">
                                                                                <span class="status ok">Verificado</span>
                                                                                <button class="btn btn-outline small">Atualizar</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="doc-item">
                                                                        <div class="doc-main">
                                                                            <strong>Comprovante:</strong>
                                                                            <div class="doc-value">Não enviado</div>
                                                                            <div class="doc-actions">
                                                                                <span class="status missing">Não enviado</span>
                                                                                <button class="btn btn-outline small">Enviar</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                    </div>
                                </div>
                            </div>

                            <div class="profile-right">
                                <div class="content-card">
                                    <div class="card-header"><h3>Informações de Contato</h3></div>
                                    <div class="card-body">
                                        <form id="profileForm" class="profile-form">
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label for="profileFullName">Nome completo</label>
                                                    <input id="profileFullName" type="text" value="Carlos Silva">
                                                </div>
                                                <div class="form-group">
                                                    <label for="profileEmail">E-mail</label>
                                                    <input id="profileEmail" type="email" value="carlos@example.com">
                                                </div>
                                            </div>

                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label for="profilePhone">Telefone</label>
                                                    <input id="profilePhone" type="text" value="(11) 99999-9999">
                                                </div>
                                                <div class="form-group">
                                                    <label for="profileCompany">Empresa / CPF</label>
                                                    <input id="profileCompany" type="text" value="Autônomo">
                                                </div>
                                            </div>

                                            <div class="form-row">
                                                <div class="form-group" style="flex:1">
                                                    <label for="profileAddress">Endereço</label>
                                                    <input id="profileAddress" type="text" value="Rua das Flores, 123">
                                                </div>
                                            </div>

                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label for="profileCity">Cidade</label>
                                                    <input id="profileCity" type="text" value="São Paulo">
                                                </div>
                                                <div class="form-group">
                                                    <label for="profileState">Estado</label>
                                                    <input id="profileState" type="text" value="SP">
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label for="profileAbout">Sobre você</label>
                                                <textarea id="profileAbout" rows="4">Anfitrião experiente, respondo rapidamente às mensagens.</textarea>
                                            </div>

                                            <div class="form-actions">
                                                <button type="submit" class="btn btn-accent">Salvar Alterações</button>
                                                <button type="button" id="btnCancelProfile" class="btn btn-outline">Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div class="content-card">
                                    <div class="card-header"><h3>Métodos de Pagamento</h3></div>
                                    <div class="card-body">
                                        <p class="muted">Adicione cartões ou contas para receber pagamentos.</p>
                                        <div id="paymentsList" class="payments-list" style="margin-top:10px"></div>

                                        <form id="addPaymentForm" class="small-form" style="margin-top:12px">
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label for="paymentType">Tipo</label>
                                                    <select id="paymentType">
                                                        <option value="credit">Cartão de Crédito</option>
                                                        <option value="debit">Cartão de Débito</option>
                                                        <option value="pix">PIX</option>
                                                        <option value="boleto">Boleto</option>
                                                        <option value="cash">Pago na Entrada (Dinheiro)</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="paymentLabel">Apelido</label>
                                                    <input id="paymentLabel" type="text" placeholder="Ex: Conta PJ / Visa Corporativo">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="paymentValue">Número / Chave</label>
                                                <input id="paymentValue" type="text" placeholder="Número do cartão (xxxx xxxx xxxx xxxx) ou chave PIX">
                                            </div>
                                            <div class="form-actions">
                                                <button type="submit" class="btn btn-accent">Adicionar Método</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div class="content-card">
                                    <div class="card-header"><h3>Segurança</h3></div>
                                    <div class="card-body">
                                        <form id="changePasswordForm" class="small-form">
                                            <div class="form-group">
                                                <label for="currentPassword">Senha atual</label>
                                                <input id="currentPassword" type="password">
                                            </div>
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label for="newPassword">Nova senha</label>
                                                    <input id="newPassword" type="password">
                                                </div>
                                                <div class="form-group">
                                                    <label for="confirmPassword">Confirmar senha</label>
                                                    <input id="confirmPassword" type="password">
                                                </div>
                                            </div>
                                            <div class="form-actions">
                                                <button type="submit" class="btn btn-accent">Atualizar Senha</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.querySelector('.vendor-main').appendChild(profileSection);
            }
            profileSection.style.display = 'block';
            // Inicializar interações do perfil
            setupProfileInteractions();
            break;
            
        default:
            // Não fazer nada para seções desconhecidas
            break;
    }
}

// Helper para ocultar todas as seções
function hideAllSections() {
    // Ocultar dashboard
    const dashboardDiv = document.querySelector('[data-section="dashboard"]');
    if (dashboardDiv) dashboardDiv.style.display = 'none';
    
    // Ocultar add-property
    const addPropertySection = document.getElementById('add-property');
    if (addPropertySection) addPropertySection.style.display = 'none';
    
    // Ocultar properties
    const propertiesSection = document.getElementById('my-properties');
    if (propertiesSection) propertiesSection.style.display = 'none';
    
    // Ocultar messages
    const messagesSection = document.getElementById('my-messages');
    if (messagesSection) messagesSection.style.display = 'none';
    
    // Ocultar statistics
    const statisticsSection = document.getElementById('my-statistics');
    if (statisticsSection) statisticsSection.style.display = 'none';
    
    // Ocultar profile
    const profileSection = document.getElementById('my-profile');
    if (profileSection) profileSection.style.display = 'none';
}

// Configurar formulário de adição de imóvel
function setupPropertyForm() {
    const form = document.getElementById('addPropertyForm');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Imóvel adicionado com sucesso!');
            // Em uma aplicação real, isso enviaria os dados para a API
        });
    }
    
    if (uploadArea && imageInput) {
        uploadArea.addEventListener('click', () => {
            imageInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleImageFiles(files);
        });
        
        imageInput.addEventListener('change', (e) => {
            const files = e.target.files;
            handleImageFiles(files);
        });
    }
}

// Manipular arquivos de imagem
function handleImageFiles(files) {
    const imagePreview = document.getElementById('imagePreview');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-item');
                imageItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imagePreview.appendChild(imageItem);
            };
            
            reader.readAsDataURL(file);
        }
    }
}

// Setup interactions for profile screen (avatar preview, form submits)
function setupProfileInteractions() {
    const avatarInput = document.getElementById('profileAvatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const profileForm = document.getElementById('profileForm');
    const btnCancel = document.getElementById('btnCancelProfile');
    const btnEdit = document.getElementById('btnEditProfile');

    if (avatarInput && avatarPreview) {
        // catch clicks on the visible button to trigger file input
        const avatarChangeBtn = avatarInput.closest('label');
        if (avatarChangeBtn) avatarChangeBtn.addEventListener('click', () => avatarInput.click());

        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => { avatarPreview.src = ev.target.result; };
            reader.readAsDataURL(file);
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Perfil salvo com sucesso!');
        });
    }

    if (btnCancel && profileForm) {
        btnCancel.addEventListener('click', () => profileForm.reset());
    }

    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            const el = document.getElementById('profileFullName');
            if (el) el.focus();
        });
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        function showFieldError(el, msg) {
            if (!el) return;
            el.classList.add('input-error');
            let next = el.nextElementSibling;
            if (!next || !next.classList || !next.classList.contains('error-text')) {
                next = document.createElement('div');
                next.className = 'error-text';
                el.parentNode.insertBefore(next, el.nextSibling);
            }
            next.textContent = msg;
        }

        function clearFieldError(el) {
            if (!el) return;
            el.classList.remove('input-error');
            const next = el.nextElementSibling;
            if (next && next.classList && next.classList.contains('error-text')) next.remove();
        }

        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nw = document.getElementById('newPassword');
            const conf = document.getElementById('confirmPassword');
            let ok = true;
            clearFieldError(nw);
            clearFieldError(conf);
            if (!nw.value || nw.value.length < 8) {
                showFieldError(nw, 'Senha precisa ter ao menos 8 caracteres.');
                ok = false;
            }
            if (nw.value !== conf.value) {
                showFieldError(conf, 'As senhas não coincidem.');
                ok = false;
            }
            if (!ok) return;
            alert('Senha atualizada com sucesso!');
            changePasswordForm.reset();
        });
    }

    // Payment methods management (localStorage)
    (function(){
        const paymentsKey = 'vendor_profile_payments';
        let payments = [];

        function loadPayments() {
            try { payments = JSON.parse(localStorage.getItem(paymentsKey) || '[]'); } catch(e){ payments = []; }
        }
        function savePayments() { localStorage.setItem(paymentsKey, JSON.stringify(payments)); }

        function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

        function renderPayments(){
            const list = document.getElementById('paymentsList');
            if (!list) return;
            list.innerHTML = '';
            if (payments.length === 0) { list.innerHTML = '<div class="muted">Nenhum método cadastrado.</div>'; return; }
        payments.forEach((p, idx) => {
            const item = document.createElement('div');
            item.className = 'payment-item';
            // format value per type
            let displayValue = '';
            if (p.type === 'credit' || p.type === 'debit') {
                // mask card number, show last 4
                const digits = String(p.value).replace(/\D/g, '');
                const last4 = digits.slice(-4);
                displayValue = digits ? `•••• •••• •••• ${last4}` : p.value;
            } else if (p.type === 'pix') {
                const v = String(p.value);
                displayValue = v.length > 12 ? v.slice(0,6) + '…' + v.slice(-4) : v;
            } else if (p.type === 'boleto') {
                const v = String(p.value).replace(/\s+/g,'');
                displayValue = v.length > 8 ? '...'+v.slice(-8) : v;
            } else if (p.type === 'cash') {
                displayValue = 'Pago na entrada (dinheiro)';
            } else {
                displayValue = p.value;
            }

            const typeLabel = (p.type === 'credit' && 'Crédito') || (p.type === 'debit' && 'Débito') || (p.type === 'pix' && 'PIX') || (p.type === 'boleto' && 'Boleto') || (p.type === 'cash' && 'Dinheiro') || p.type;

            item.innerHTML = `
                <div class="payment-main">
                    <div class="payment-type-badge ${p.type}">${escapeHtml(typeLabel)}</div>
                    <div class="payment-label">${escapeHtml(p.label)}</div>
                    <div class="payment-value">${escapeHtml(displayValue)}</div>
                </div>
                <div class="payment-actions">
                    <button class="btn btn-outline btn-sm" data-idx="${idx}">Remover</button>
                </div>`;
            list.appendChild(item);
        });
            list.querySelectorAll('button[data-idx]').forEach(btn=>btn.addEventListener('click', ()=>{
                const i = Number(btn.getAttribute('data-idx'));
                payments.splice(i,1); savePayments(); renderPayments();
            }));
        }

        loadPayments(); renderPayments();

        const addPaymentForm = document.getElementById('addPaymentForm');
        if (addPaymentForm) {
            addPaymentForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                const type = document.getElementById('paymentType').value || 'card';
                const label = document.getElementById('paymentLabel').value.trim();
                const value = document.getElementById('paymentValue').value.trim();
                if (!label || !value) { alert('Preencha apelido e número/chave do método.'); return; }
                payments.push({ type, label, value }); savePayments(); renderPayments(); addPaymentForm.reset();
            });
        }
    })();
}

// Funções de ação
function editProperty(id) {
    alert(`Editando propriedade ID: ${id}`);
    // Em uma aplicação real, isso abriria um formulário de edição
}

function promoteProperty(id) {
    alert(`Promovendo propriedade ID: ${id}`);
    // Em uma aplicação real, isso abriria opções de promoção
}

function togglePropertyStatus(id) {
    const property = vendorData.recentProperties.find(p => p.id === id);
    if (property) {
        property.status = property.status === 'active' ? 'inactive' : 'active';
        loadRecentProperties();
        alert(`Status da propriedade ID: ${id} alterado para ${property.status}`);
    }
}

/* Chat functions */
function initChat() {
    renderConversations();
    const first = chatData.conversations[0];
    if (first) openConversation(first.id);

    const sendBtn = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    const attachBtn = document.getElementById('chatAttach');
    const fileInput = document.getElementById('chatFileInput');
    const attachPreview = document.getElementById('chatAttachmentPreview');

    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            // create temporary URL for download/preview
            const url = URL.createObjectURL(file);
            currentChatAttachment = { file, url, name: file.name, type: file.type };
            if (attachPreview) {
                attachPreview.innerHTML = `<span style="background:var(--bg);padding:6px 10px;border-radius:8px;display:inline-flex;align-items:center;gap:8px;">
                    <strong style="font-weight:600;color:var(--text);">${file.name}</strong>
                    <button id="removeAttachmentBtn" style="background:transparent;border:none;cursor:pointer;color:var(--text-light);">✕</button>
                </span>`;
                const removeBtn = document.getElementById('removeAttachmentBtn');
                if (removeBtn) removeBtn.addEventListener('click', () => {
                    if (currentChatAttachment && currentChatAttachment.url) URL.revokeObjectURL(currentChatAttachment.url);
                    currentChatAttachment = null;
                    fileInput.value = '';
                    attachPreview.innerHTML = '';
                });
            }
        });
    }

    if (sendBtn && input) {
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function renderConversations() {
    const list = document.getElementById('chatList');
    if (!list) return;
    list.innerHTML = '';
    // determine active conversation id (if any)
    const activeId = parseInt(document.getElementById('chatInput')?.dataset.convId || '0', 10);
    chatData.conversations.forEach(conv => {
        const li = document.createElement('li');
        li.className = 'chat-item';
        li.dataset.id = conv.id;
        li.innerHTML = `
            <img src="${conv.avatar}" alt="${conv.name}">
            <div class="meta">
                <div class="name">${conv.name}</div>
                <div class="last">${conv.last}</div>
            </div>
        `;
        li.addEventListener('click', () => openConversation(conv.id));
        if (conv.id === activeId) li.classList.add('active');
        list.appendChild(li);
    });
}

function openConversation(id) {
    const conv = chatData.conversations.find(c => c.id === id);
    if (!conv) return;

    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    const el = document.querySelector(`.chat-item[data-id="${id}"]`);
    if (el) el.classList.add('active');

    const name = document.getElementById('chatName');
    const messagesEl = document.getElementById('chatMessages');
    if (name) name.textContent = conv.name;
    if (messagesEl) {
        messagesEl.innerHTML = '';
        renderMessages(conv.messages, messagesEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    const input = document.getElementById('chatInput');
    if (input) input.dataset.convId = id;
}

function renderMessages(messages, container) {
    if (!container) return;
    messages.forEach(m => {
        const div = document.createElement('div');
        div.className = 'message ' + (m.from === 'vendor' ? 'sent' : 'received');
        // build inner content: text optionally and file optionally
        let inner = '';
        if (m.text && m.text.trim() !== '') {
            inner += `<div class="text">${m.text}</div>`;
        }
        if (m.file) {
            inner += `<a class="file" href="${m.file.url}" download="${m.file.name}">${m.file.name}</a>`;
        }
        inner += `<span class="time">${m.time || formatTime(new Date())}</span>`;
        div.innerHTML = inner;
        container.appendChild(div);
    });
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    // allow sending if there's text OR an attachment
    if (text === '' && !currentChatAttachment) return;
    const convId = parseInt(input.dataset.convId, 10);
    const conv = chatData.conversations.find(c => c.id === convId);
    if (!conv) return;

    const time = formatTime(new Date());
    const message = { from: 'vendor', text, time };
    if (currentChatAttachment) {
        message.file = { name: currentChatAttachment.name, url: currentChatAttachment.url, type: currentChatAttachment.type };
    }
    conv.messages.push(message);
    conv.last = message.file ? (`Arquivo: ${message.file.name}`) : text;

    const messagesEl = document.getElementById('chatMessages');
    if (messagesEl) {
        renderMessages([message], messagesEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    renderConversations();
    input.value = '';
    input.focus();

    // clear attachment preview (do not revoke URL so link remains usable)
    const fileInput = document.getElementById('chatFileInput');
    const attachPreview = document.getElementById('chatAttachmentPreview');
    if (fileInput) fileInput.value = '';
    if (attachPreview) attachPreview.innerHTML = '';
    currentChatAttachment = null;

    setTimeout(() => {
        const reply = { from: 'client', text: 'Obrigado! Recebi sua mensagem.', time: formatTime(new Date()) };
        conv.messages.push(reply);
        const messagesEl2 = document.getElementById('chatMessages');
        if (messagesEl2) {
            renderMessages([reply], messagesEl2);
            messagesEl2.scrollTop = messagesEl2.scrollHeight;
        }
        conv.last = reply.text;
        renderConversations();
    }, 800);
}

function formatTime(date) {
    const d = new Date(date);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

// ===== Add Property Form Functionality =====

// Store selected tags
let selectedPropertyTags = [];

// Initialize Add Property Form
function initAddPropertyForm() {
    const form = document.getElementById('addPropertyForm');
    if (!form) return;

    // File upload handling
    const fileInput = document.getElementById('propertyImages');
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(34, 197, 94, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = 'rgba(34, 197, 94, 0.02)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(34, 197, 94, 0.02)';
            if (e.dataTransfer.files) {
                handleImageFiles(e.dataTransfer.files);
            }
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleImageFiles(e.target.files);
        });
    }

    // Character counter for description
    const descriptionInput = document.getElementById('propertyDescription');
    const charCount = document.getElementById('charCount');
    
    if (descriptionInput) {
        descriptionInput.addEventListener('input', () => {
            const count = descriptionInput.value.length;
            if (charCount) {
                charCount.textContent = `${count} / 2000 caracteres`;
            }
            if (count > 2000) {
                descriptionInput.value = descriptionInput.value.substring(0, 2000);
            }
        });
    }

    // Tags functionality
    const tagCheckboxes = document.querySelectorAll('.tag-checkbox input[type="checkbox"]');
    
    tagCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedTags);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAddPropertyForm();
    });
}

function handleImageFiles(files) {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;

    let existingImages = preview.querySelectorAll('.preview-item').length;
    
    Array.from(files).forEach((file, index) => {
        if (existingImages + index >= 20) return; // Max 20 images
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            const removeBtn = div.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => div.remove());
            
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function updateSelectedTags() {
    const tagCheckboxes = document.querySelectorAll('.tag-checkbox input[type="checkbox"]:checked');
    const tagsDisplay = document.getElementById('tagsDisplay');
    
    if (!tagsDisplay) return;
    
    selectedPropertyTags = Array.from(tagCheckboxes).map(checkbox => {
        const label = checkbox.parentElement;
        return label.querySelector('span').textContent.trim();
    });
    
    tagsDisplay.innerHTML = '';
    
    selectedPropertyTags.forEach(tag => {
        const badge = document.createElement('div');
        badge.className = 'tag-badge';
        badge.innerHTML = `
            ${tag}
            <button type="button" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        tagsDisplay.appendChild(badge);
    });
}

function submitAddPropertyForm() {
    const form = document.getElementById('addPropertyForm');
    if (!form) return;

    // Get form data
    const formData = new FormData(form);
    const propertyData = {
        title: formData.get('title'),
        type: formData.get('type'),
        transaction: 'aluguel',
        price: formData.get('price'),
        location: formData.get('location'),
        city: formData.get('city'),
        state: formData.get('state'),
        description: formData.get('description'),
        bedrooms: formData.get('bedrooms'),
        bathrooms: formData.get('bathrooms'),
        garages: formData.get('garages'),
        area: formData.get('area'),
        access: formData.get('access'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        features: formData.getAll('features'),
        tags: selectedPropertyTags,
        images: document.getElementById('imagePreview').querySelectorAll('img').length
    };

    // Validate required fields
    if (!propertyData.title || !propertyData.type || !propertyData.price ||
        !propertyData.location || !propertyData.area || !propertyData.description) {
        alert('Por favor, preencha todos os campos obrigatórios (marcados com *)');
        return;
    }

    // Mock submit - in production, send to server
    console.log('Imóvel para publicar:', propertyData);
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        ">
            <i class="fas fa-check-circle"></i> Imóvel publicado com sucesso!
        </div>
    `;
    document.body.appendChild(successMsg);
    
    // Clear form
    form.reset();
    selectedPropertyTags = [];
    const tagsDisplay = document.getElementById('tagsDisplay');
    if (tagsDisplay) tagsDisplay.innerHTML = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('charCount').textContent = '0 / 2000 caracteres';
    
    // Uncheck all checkboxes
    document.querySelectorAll('.tag-checkbox input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.feature-checkbox input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Remove success message after 4 seconds
    setTimeout(() => successMsg.remove(), 4000);
}

// Renderers para tela de estatísticas
function formatCurrency(value) {
    return 'R$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function renderRevenueChart(series, containerId) {
    const container = document.getElementById(containerId.replace('#','')) || document.getElementById(containerId);
    if (!container) return;
    // Use Chart.js if available (creates/upserts a canvas-based line chart)
    // Ensure the container has a canvas to render into
    container.innerHTML = `<canvas id="revenueChartCanvas"></canvas>`;
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = series.map((_, i) => `M${i+1}`);

    // If Chart is not loaded, fallback to a simple SVG line chart
    if (typeof Chart === 'undefined') {
        const width = 600;
        const height = 180;
        const max = Math.max(...series);
        const stepX = width / (series.length - 1);
        let points = series.map((v,i) => `${i*stepX},${height - (v / max) * (height - 20)}`).join(' ');
        container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:180px"><polyline points="${points}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        return;
    }

    // If an existing chart instance exists, destroy it and recreate on the new canvas
    if (revenueChartInstance) {
        try { revenueChartInstance.destroy(); } catch(e){}
        revenueChartInstance = null;
    }

    // Create new Chart.js line chart
    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Faturamento',
                data: series,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.08)',
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: '#16a34a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    ticks: { callback: function(value) { return formatCurrency(value); } },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                }
            }
        }
    });
}

function renderAdsPerformanceTable(list) {
    const tbody = document.querySelector('#adsPerformanceTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach(ad => {
        const conv = ad.requests > 0 ? ((ad.rentals / ad.requests) * 100).toFixed(1) + '%' : (ad.views > 0 ? ((ad.rentals / ad.views) * 100).toFixed(1) + '%' : '0%');
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${ad.title}</td><td>${ad.views}</td><td>${ad.requests}</td><td>${ad.rentals}</td><td>${conv}</td>`;
        tbody.appendChild(tr);
    });
}

function renderTopProducts(list) {
    const container = document.getElementById('topProductsList');
    if (!container) return;
    container.innerHTML = '';
    list.slice(0,5).forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = 'top-product-item';
        item.innerHTML = `<div class="rank">${idx+1}</div><div class="info"><h4>${p.title}</h4><div class="meta">${p.rentals} alugueis</div></div><div class="rev">${formatCurrency(p.revenue)}</div>`;
        container.appendChild(item);
    });
}

function renderOccupancyCalendar(occupancy) {
    const container = document.getElementById('occupancyCalendar');
    if (!container) return;
    // Use days 1..30 for simplicity
    const days = Array.from({length:30}, (_,i) => i+1);
    container.innerHTML = '';
    occupancy.forEach(item => {
        const row = document.createElement('div');
        row.className = 'occupancy-row';
        const title = document.createElement('div');
        title.className = 'occ-title';
        title.textContent = item.title;
        const strip = document.createElement('div');
        strip.className = 'occ-strip';
        days.forEach(d => {
            const cell = document.createElement('span');
            cell.className = item.bookings.includes(d) ? 'occ-day booked' : 'occ-day free';
            cell.textContent = d;
            strip.appendChild(cell);
        });
        row.appendChild(title);
        row.appendChild(strip);
        container.appendChild(row);
    });
}

function renderUserMetrics(reviews) {
    const container = document.getElementById('userMetrics');
    if (!container) return;
    container.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'user-metrics-header';
    header.innerHTML = `<div class="rating">${reviews.average} <small>★</small></div><div class="count">${reviews.count} avaliações</div>`;
    container.appendChild(header);
    const list = document.createElement('div');
    list.className = 'recent-comments';
    reviews.recent.forEach(r => {
        const c = document.createElement('div');
        c.className = 'comment-item';
        c.innerHTML = `<strong>${r.user}</strong><div class="comment-text">${r.comment}</div><div class="comment-rating">${r.rating}★</div>`;
        list.appendChild(c);
    });
    container.appendChild(list);
}

function renderPending(pending) {
    const container = document.getElementById('pendingList');
    if (!container) return;
    container.innerHTML = '';
    const reqs = document.createElement('div');
    reqs.innerHTML = `<h4>Solicitações pendentes (${pending.requests.length})</h4>`;
    pending.requests.forEach(r => {
        const it = document.createElement('div');
        it.className = 'pending-item';
        it.innerHTML = `<strong>${r.name}</strong> - ${r.property} <span class="muted">(${r.date})</span>`;
        reqs.appendChild(it);
    });
    container.appendChild(reqs);

    const upcoming = document.createElement('div');
    upcoming.innerHTML = `<h4>Próximas devoluções (${pending.upcomingReturns.length})</h4>`;
    pending.upcomingReturns.forEach(u => {
        const it = document.createElement('div');
        it.className = 'pending-item';
        it.innerHTML = `${u.property} — ${u.due}`;
        upcoming.appendChild(it);
    });
    container.appendChild(upcoming);

    const overdue = document.createElement('div');
    overdue.innerHTML = `<h4>Atrasos (${pending.overdue.length})</h4>`;
    pending.overdue.forEach(o => {
        const it = document.createElement('div');
        it.className = 'pending-item overdue';
        it.innerHTML = `${o.property} — ${o.due} <strong>${o.daysLate} dias</strong>`;
        overdue.appendChild(it);
    });
    container.appendChild(overdue);
}

function renderInsights(list) {
    const container = document.getElementById('insightsList');
    if (!container) return;
    container.innerHTML = '';
    list.forEach(i => {
        const it = document.createElement('div');
        it.className = 'insight-item';
        it.innerHTML = `<i class="fas fa-lightbulb"></i> ${i}`;
        container.appendChild(it);
    });
}

// Função principal que prepara a tela de statistics usando vendorData
function renderStatistics() {
    const s = vendorData.statistics;
    if (!s) return;
    // Faturamento
    const monthEl = document.getElementById('revenueTotalMonth');
    const yearEl = document.getElementById('revenueTotalYear');
    if (monthEl) monthEl.textContent = formatCurrency(s.revenueMonth);
    if (yearEl) yearEl.textContent = formatCurrency(s.revenueYear);
    renderRevenueChart(s.revenueSeries, '#revenueChart');
    // Ads
    renderAdsPerformanceTable(s.adsPerformance);
    // Top products
    renderTopProducts(s.topProducts);
    // Occupancy
    renderOccupancyCalendar(s.occupancy);
    // User metrics
    renderUserMetrics(s.reviews);
    // Pending
    renderPending(s.pending);
    // Insights
    renderInsights(s.insights);
}

// Navigation between sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navLink = document.querySelector(`.nav-item a[href="#${sectionId}"]`);
    if (navLink) {
        navLink.parentElement.classList.add('active');
    }
}

// Configurar notificações
function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    if (notificationBtn && notificationsDropdown) {
        // Acessibilidade: atributos ARIA
        notificationBtn.setAttribute('aria-haspopup', 'dialog');
        notificationBtn.setAttribute('aria-controls', 'notificationsDropdown');
        notificationBtn.setAttribute('aria-expanded', 'false');

        // Carregar notificações na primeira vez
        loadNotifications();

        // Toggle do dropdown de notificações (click)
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = notificationsDropdown.classList.toggle('show');
            notificationBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            loadNotifications();

            // se abriu, focar o primeiro item focável
            if (isOpen) {
                const first = notificationsDropdown.querySelector('.notification-item[tabindex]');
                if (first) first.focus();
            }
        });

        // Toggle via teclado (Enter / Space)
        notificationBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                notificationBtn.click();
            }
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', () => {
            if (notificationsDropdown.classList.contains('show')) {
                notificationsDropdown.classList.remove('show');
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Prevenir fechamento ao clicar dentro do dropdown
        notificationsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Fechar com Escape e gerenciar foco
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && notificationsDropdown.classList.contains('show')) {
                notificationsDropdown.classList.remove('show');
                notificationBtn.setAttribute('aria-expanded', 'false');
                notificationBtn.focus();
            }
        });
    }
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
}

// Carregar notificações
function loadNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;
    
    notificationList.innerHTML = '';
    
    const unreadCount = vendorData.notifications.filter(n => !n.read).length;
    updateNotificationBadge(unreadCount);
    
    if (vendorData.notifications.length === 0) {
        notificationList.innerHTML = '<div class="no-results">Nenhuma notificação</div>';
        return;
    }
    
    vendorData.notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        if (!notification.read) {
            notificationItem.classList.add('unread');
        }

        // tornar foco acessível
        notificationItem.setAttribute('tabindex', '0');
        notificationItem.setAttribute('role', 'button');

        notificationItem.innerHTML = `
            <div class="notification-icon" aria-hidden="true">
                <i class="${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <p><strong>${notification.title}</strong> ${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        `;

        // click e teclado ativam marcação como lida
        notificationItem.addEventListener('click', () => {
            markNotificationAsRead(notification.id);
        });
        notificationItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                markNotificationAsRead(notification.id);
            }
        });

        notificationList.appendChild(notificationItem);
    });
}

// Atualizar badge de notificações
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Marcar notificação como lida
function markNotificationAsRead(id) {
    const notification = vendorData.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
        notification.read = true;
        loadNotifications();
    }
}

// Marcar todas as notificações como lidas
function markAllNotificationsAsRead() {
    vendorData.notifications.forEach(notification => {
        notification.read = true;
    });
    loadNotifications();
}

// Handle navigation link clicks
document.addEventListener('DOMContentLoaded', () => {
    // Initialize add property form
    initAddPropertyForm();
    
    // Navigation
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                showSection(sectionId);
            }
        });
    });
    
    // Show dashboard by default
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
    }
});