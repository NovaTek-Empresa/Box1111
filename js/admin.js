// Dados do painel administrativo (simulação)
const adminData = {
    stats: {
        properties: 1254,
        users: 3842,
        vendors: 156,
        revenue: 42500000
    },
    recentActivities: [
        {
            user: "Carlos Silva",
            action: "adicionou um novo imóvel",
            time: "Há 2 minutos",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            user: "Mariana Oliveira",
            action: "atualizou seu perfil",
            time: "Há 15 minutos",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            user: "Roberto Santos",
            action: "fechou um negócio",
            time: "Há 1 hora",
            avatar: "https://randomuser.me/api/portraits/men/68.jpg"
        },
        {
            user: "Ana Costa",
            action: "reportou um problema",
            time: "Há 2 horas",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ],
    recentProperties: [
        {
            id: 1,
            title: "Casa Alto Padrão",
            price: "R$ 1.250.000",
            location: "Jardins, SP",
            date: "15/10/2023",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&q=80&auto=format&fit=crop",
            status: "active"
        },
        {
            id: 2,
            title: "Sobrado Moderno",
            price: "R$ 790.000",
            location: "Vila Mariana, SP",
            date: "12/10/2023",
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=150&q=80&auto=format&fit=crop",
            status: "active"
        },
        {
            id: 3,
            title: "Apartamento Centro",
            price: "R$ 420.000",
            location: "Centro, SP",
            date: "10/10/2023",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&q=80&auto=format&fit=crop",
            status: "pending"
        }
    ],
    allProperties: [
        {
            id: 1,
            title: "Casa Alto Padrão",
            price: "R$ 1.250.000",
            location: "Jardins, SP",
            date: "15/10/2023",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&q=80&auto=format&fit=crop",
            status: "active"
        },
        {
            id: 2,
            title: "Sobrado Moderno",
            price: "R$ 790.000",
            location: "Vila Mariana, SP",
            date: "12/10/2023",
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=150&q=80&auto=format&fit=crop",
            status: "active"
        },
        {
            id: 3,
            title: "Apartamento Centro",
            price: "R$ 420.000",
            location: "Centro, SP",
            date: "10/10/2023",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&q=80&auto=format&fit=crop",
            status: "pending"
        },
        {
            id: 4,
            title: "Cobertura Duplex",
            price: "R$ 2.100.000",
            location: "Moema, SP",
            date: "08/10/2023",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150&q=80&auto=format&fit=crop",
            status: "active"
        },
        {
            id: 5,
            title: "Casa com Piscina",
            price: "R$ 1.750.000",
            location: "Alphaville, SP",
            date: "05/10/2023",
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=150&q=80&auto=format&fit=crop",
            status: "inactive"
        }
    ],
    users: [
        {
            id: 1,
            name: "Carlos Silva",
            email: "carlos.silva@email.com",
            phone: "(11) 98765-4321",
            type: "Cliente",
            status: "active",
            registration: "15/10/2023",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            name: "Mariana Oliveira",
            email: "mariana.oliveira@email.com",
            phone: "(11) 99876-5432",
            type: "Anfitrião",
            status: "active",
            registration: "12/10/2023",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 3,
            name: "Roberto Santos",
            email: "roberto.santos@email.com",
            phone: "(11) 97654-3210",
            type: "Cliente",
            status: "active",
            registration: "10/10/2023",
            avatar: "https://randomuser.me/api/portraits/men/68.jpg"
        },
        {
            id: 4,
            name: "Ana Costa",
            email: "ana.costa@email.com",
            phone: "(11) 96543-2109",
            type: "Anfitrião",
            status: "pending",
            registration: "08/10/2023",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        {
            id: 5,
            name: "Fernando Lima",
            email: "fernando.lima@email.com",
            phone: "(11) 95432-1098",
            type: "Cliente",
            status: "inactive",
            registration: "05/10/2023",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        }
    ],
    vendors: [
        {
            id: 1,
            name: "Mariana Oliveira",
            email: "mariana.oliveira@email.com",
            phone: "(11) 98765-4321",
            creci: "123456",
            status: "active",
            registration: "12/10/2023",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Ana Costa",
            email: "ana.costa@email.com",
            phone: "(11) 99876-5432",
            creci: "654321",
            status: "active",
            registration: "08/10/2023",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        {
            id: 3,
            name: "Fernando Lima",
            email: "fernando.lima@email.com",
            phone: "(11) 97654-3210",
            creci: "789456",
            status: "pending",
            registration: "05/10/2023",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
            id: 4,
            name: "Lucas Martins",
            email: "lucas.martins@email.com",
            phone: "(11) 96543-2109",
            creci: "321654",
            status: "active",
            registration: "28/09/2023",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        {
            id: 5,
            name: "Juliana Rocha",
            email: "juliana.rocha@email.com",
            phone: "(11) 95432-1098",
            creci: "456789",
            status: "inactive",
            registration: "25/09/2023",
            avatar: "https://randomuser.me/api/portraits/women/56.jpg"
        },
        {
            id: 6,
            name: "Paulo Gomes",
            email: "paulo.gomes@email.com",
            phone: "(11) 94321-0987",
            creci: "987654",
            status: "active",
            registration: "20/09/2023",
            avatar: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        {
            id: 7,
            name: "Camila Santos",
            email: "camila.santos@email.com",
            phone: "(11) 93210-9876",
            creci: "654987",
            status: "active",
            registration: "18/09/2023",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
            id: 8,
            name: "Ricardo Pereira",
            email: "ricardo.pereira@email.com",
            phone: "(11) 92109-8765",
            creci: "147258",
            status: "pending",
            registration: "15/09/2023",
            avatar: "https://randomuser.me/api/portraits/men/55.jpg"
        }
    ],
    notifications: [
        {
            id: 1,
            title: "Novo imóvel cadastrado",
            message: "Carlos Silva cadastrou um novo imóvel no sistema",
            time: "Há 5 minutos",
            icon: "fas fa-home",
            read: false
        },
        {
            id: 2,
            title: "Pagamento confirmado",
            message: "Pagamento do imóvel ID: 245 foi confirmado",
            time: "Há 1 hora",
            icon: "fas fa-dollar-sign",
            read: false
        },
        {
            id: 3,
            title: "Usuário bloqueado",
            message: "O usuário João Mendes foi bloqueado por violação de termos",
            time: "Há 2 horas",
            icon: "fas fa-user-slash",
            read: true
        },
        {
            id: 4,
            title: "Novo anfitrião aprovado",
            message: "Maria Santos foi aprovada como anfitriã",
            time: "Há 1 dia",
            icon: "fas fa-store",
            read: true
        }
    ],
    reports: {
        financeiro: [
            { id: 1, imovel: "Casa Alto Padrão", proprietario: "João Silva", total: 45000, mes: "Outubro/2023", status: "Confirmado" },
            { id: 2, imovel: "Sobrado Moderno", proprietario: "Maria Santos", total: 32000, mes: "Outubro/2023", status: "Confirmado" },
            { id: 3, imovel: "Apartamento Centro", proprietario: "Pedro Costa", total: 28000, mes: "Outubro/2023", status: "Pendente" },
            { id: 4, imovel: "Cobertura Duplex", proprietario: "Ana Rodrigues", total: 58000, mes: "Setembro/2023", status: "Confirmado" },
            { id: 5, imovel: "Casa com Piscina", proprietario: "Lucas Ferreira", total: 41000, mes: "Setembro/2023", status: "Cancelado" },
        ],
        reservas: [
            { id: 1, cliente: "Carlos Silva", imovel: "Casa Alto Padrão", dataEntrada: "01/11/2023", dataSaida: "08/11/2023", status: "Confirmada" },
            { id: 2, cliente: "Mariana Oliveira", imovel: "Sobrado Moderno", dataEntrada: "05/11/2023", dataSaida: "12/11/2023", status: "Confirmada" },
            { id: 3, cliente: "Roberto Santos", imovel: "Apartamento Centro", dataEntrada: "10/11/2023", dataSaida: "17/11/2023", status: "Pendente" },
            { id: 4, cliente: "Ana Costa", imovel: "Cobertura Duplex", dataEntrada: "15/11/2023", dataSaida: "22/11/2023", status: "Cancelada" },
        ],
        imoveis: [
            { id: 1, nome: "Casa Alto Padrão", cidade: "São Paulo", proprietario: "João Silva", visualizacoes: 1250, ocupacao: "75%" },
            { id: 2, nome: "Sobrado Moderno", cidade: "São Paulo", proprietario: "Maria Santos", visualizacoes: 890, ocupacao: "60%" },
            { id: 3, nome: "Apartamento Centro", cidade: "Rio de Janeiro", proprietario: "Pedro Costa", visualizacoes: 2100, ocupacao: "85%" },
            { id: 4, nome: "Cobertura Duplex", cidade: "São Paulo", proprietario: "Ana Rodrigues", visualizacoes: 650, ocupacao: "40%" },
            { id: 5, nome: "Casa com Piscina", cidade: "Minas Gerais", proprietario: "Lucas Ferreira", visualizacoes: 1450, ocupacao: "90%" },
        ],
        usuarios: [
            { id: 1, nome: "Carlos Silva", tipo: "Cliente", dataCadastro: "15/10/2023", status: "Ativo" },
            { id: 2, nome: "Mariana Oliveira", tipo: "Proprietário", dataCadastro: "12/10/2023", status: "Ativo" },
            { id: 3, nome: "Roberto Santos", tipo: "Cliente", dataCadastro: "10/10/2023", status: "Ativo" },
            { id: 4, nome: "Ana Costa", tipo: "Proprietário", dataCadastro: "08/10/2023", status: "Pendente" },
            { id: 5, nome: "Fernando Lima", tipo: "Cliente", dataCadastro: "05/10/2023", status: "Inativo" },
        ],
        avaliacoes: [
            { id: 1, imovel: "Casa Alto Padrão", nota: 4.8, comentario: "Excelente propriedade!", usuario: "Carlos Silva", data: "20/10/2023" },
            { id: 2, imovel: "Sobrado Moderno", nota: 4.5, comentario: "Muito bom, recomendo", usuario: "Mariana Oliveira", data: "18/10/2023" },
            { id: 3, imovel: "Apartamento Centro", nota: 4.2, comentario: "Bom custo-benefício", usuario: "Roberto Santos", data: "15/10/2023" },
            { id: 4, imovel: "Cobertura Duplex", nota: 4.9, comentario: "Perfeito!", usuario: "Ana Costa", data: "10/10/2023" },
        ],
        operacional: [
            { id: 1, tipo: "Check-in Previsto", data: "01/11/2023", quantidade: 12, status: "Confirmado" },
            { id: 2, tipo: "Check-out Previsto", data: "05/11/2023", quantidade: 8, status: "Confirmado" },
            { id: 3, tipo: "Atrasos", data: "04/11/2023", quantidade: 2, status: "Pendente" },
            { id: 4, tipo: "Pendências Gerais", data: "02/11/2023", quantidade: 5, status: "Pendente" },
        ]
    }
};

// Estado da aplicação
let appState = {
    currentSection: 'dashboard',
    editingProperty: null,
    searchQuery: '',
    currentReport: 'financeiro',
    reportFilters: {}
};

// Inicialização do painel administrativo
document.addEventListener('DOMContentLoaded', () => {
    // Toggle da sidebar em dispositivos móveis
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebarToggle && adminSidebar && sidebarBackdrop) {
        // Abrir/fechar sidebar
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
            sidebarBackdrop.classList.toggle('active');
        });
        
        // Fechar sidebar ao clicar no backdrop
        sidebarBackdrop.addEventListener('click', () => {
            adminSidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
        });
        
        // Fechar sidebar ao clicar em um link de navegação
        const navLinks = adminSidebar.querySelectorAll('.nav-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    adminSidebar.classList.remove('active');
                    sidebarBackdrop.classList.remove('active');
                }
            });
        });
    }

    // Section filters: users and vendors (filter by name or email)
    const usersSearch = document.getElementById('usersSearch');
    if (usersSearch) {
        usersSearch.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.toLowerCase().trim();
            loadUsersTable();
        });
        usersSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                appState.searchQuery = e.target.value.toLowerCase().trim();
                loadUsersTable();
            }
        });
    }

    const vendorsSearch = document.getElementById('vendorsSearch');
    if (vendorsSearch) {
        vendorsSearch.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.toLowerCase().trim();
            loadVendorsTable();
        });
        vendorsSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                appState.searchQuery = e.target.value.toLowerCase().trim();
                loadVendorsTable();
            }
        });
    }
    
    // Botão para colapsar/expandir a sidebar (desktop)
    const adminCollapseBtn = document.getElementById('adminSidebarCollapse');
    const adminMain = document.querySelector('.admin-main');

    if (adminCollapseBtn && adminSidebar && adminMain) {
        adminCollapseBtn.addEventListener('click', () => {
            const icon = adminCollapseBtn.querySelector('i');
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('sidebar-compact');
            // Alternar ícone
            if (adminSidebar.classList.contains('collapsed')) {
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
    setupNavigation();
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Configurar busca
    setupAdminSearch();
    
    // Configurar notificações
    setupNotifications();
    
    // Configurar modal de propriedades
    setupPropertyModal();
    
    // Carregar dados das tabelas
    loadPropertiesTable();
    loadUsersTable();
    loadVendorsTable();
});

// Configurar navegação
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            
            // Atualizar estado
            appState.currentSection = section;
            
            // Remover classe active de todos os itens
            navItems.forEach(i => i.classList.remove('active'));
            // Adicionar classe active ao item clicado
            item.classList.add('active');
            
            // Ocultar todas as seções
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar seção correspondente
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Atualizar o título da página
            const pageTitle = document.querySelector('.admin-header h1');
            const linkText = item.querySelector('span').textContent;
            if (pageTitle) {
                pageTitle.textContent = linkText;
            }
            
            // Carregar dados específicos da seção
            loadSectionData(section);
        });
    });
}

// Carregar dados específicos da seção
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'properties':
            loadPropertiesTable();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'vendors':
            loadVendorsTable();
            break;
        case 'categories':
            // Carregar dados de categorias
            break;
        case 'reports':
            loadReportsSection();
            break;
    }
}

// Carregar dados do dashboard
function loadDashboardData() {
    // Atualizar estatísticas
    updateStats();
    
    // Carregar atividades recentes
    loadRecentActivities();
    
    // Carregar imóveis recentes
    loadRecentProperties();
}

// Atualizar estatísticas
function updateStats() {
    const stats = adminData.stats;
    
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
        statCards[1].textContent = formatNumber(stats.users);
        statCards[2].textContent = formatNumber(stats.vendors);
        statCards[3].textContent = 'R$ ' + formatNumber(stats.revenue);
    }
}

// Carregar atividades recentes
function loadRecentActivities() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    adminData.recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.classList.add('activity-item');
        
        activityItem.innerHTML = `
            <div class="activity-avatar">
                <img src="${activity.avatar}" alt="${activity.user}">
            </div>
            <div class="activity-content">
                <p><strong>${activity.user}</strong> ${activity.action}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Carregar imóveis recentes
function loadRecentProperties() {
    const propertyList = document.getElementById('propertyList');
    if (!propertyList) return;
    
    propertyList.innerHTML = '';
    
    adminData.recentProperties.forEach(property => {
        const propertyItem = document.createElement('div');
        propertyItem.classList.add('property-item');
        
        propertyItem.innerHTML = `
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="property-info">
                <h4>${property.title}</h4>
                <p class="property-price">${property.price}</p>
                <div class="property-meta">
                    <span class="property-location">${property.location}</span>
                    <span class="property-date">${property.date}</span>
                </div>
            </div>
            <div class="property-actions">
                <button class="btn-icon edit" title="Editar" onclick="editProperty(${property.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" title="Excluir" onclick="deleteProperty(${property.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        propertyList.appendChild(propertyItem);
    });
}

// Configurar busca administrativa
function setupAdminSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchButton = document.querySelector('.admin-search button');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        appState.searchQuery = query;
        
        // Aplicar filtro baseado na seção atual
        switch(appState.currentSection) {
            case 'dashboard':
                filterDashboardData(query);
                break;
            case 'properties':
                filterPropertiesTable(query);
                break;
            case 'users':
                filterUsersTable(query);
                break;
            case 'vendors':
                filterVendorsTable(query);
                break;
            // Adicionar outros casos conforme necessário
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
        
        // Limpar busca quando o campo estiver vazio
        searchInput.addEventListener('input', () => {
            if (searchInput.value === '') {
                appState.searchQuery = '';
                loadSectionData(appState.currentSection);
            }
        });
    }
}

// Filtrar dados do dashboard
function filterDashboardData(query) {
    // Filtrar atividades
    const filteredActivities = adminData.recentActivities.filter(activity => 
        activity.user.toLowerCase().includes(query) || 
        activity.action.toLowerCase().includes(query)
    );
    
    // Filtrar propriedades
    const filteredProperties = adminData.recentProperties.filter(property => 
        property.title.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query)
    );
    
    // Atualizar interface com dados filtrados
    updateFilteredDashboardData(filteredActivities, filteredProperties);
}

// Atualizar dashboard com dados filtrados
function updateFilteredDashboardData(activities, properties) {
    // Atualizar atividades
    const activityList = document.getElementById('activityList');
    if (activityList) {
        activityList.innerHTML = '';
        
        if (activities.length === 0) {
            activityList.innerHTML = '<p class="no-results">Nenhuma atividade encontrada</p>';
        } else {
            activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.classList.add('activity-item');
                
                activityItem.innerHTML = `
                    <div class="activity-avatar">
                        <img src="${activity.avatar}" alt="${activity.user}">
                    </div>
                    <div class="activity-content">
                        <p><strong>${activity.user}</strong> ${activity.action}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                `;
                
                activityList.appendChild(activityItem);
            });
        }
    }
    
    // Atualizar propriedades
    const propertyList = document.getElementById('propertyList');
    if (propertyList) {
        propertyList.innerHTML = '';
        
        if (properties.length === 0) {
            propertyList.innerHTML = '<p class="no-results">Nenhum imóvel encontrado</p>';
        } else {
            properties.forEach(property => {
                const propertyItem = document.createElement('div');
                propertyItem.classList.add('property-item');
                
                propertyItem.innerHTML = `
                    <div class="property-image">
                        <img src="${property.image}" alt="${property.title}">
                    </div>
                    <div class="property-info">
                        <h4>${property.title}</h4>
                        <p class="property-price">${property.price}</p>
                        <div class="property-meta">
                            <span class="property-location">${property.location}</span>
                            <span class="property-date">${property.date}</span>
                        </div>
                    </div>
                    <div class="property-actions">
                        <button class="btn-icon edit" title="Editar" onclick="editProperty(${property.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" title="Excluir" onclick="deleteProperty(${property.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                propertyList.appendChild(propertyItem);
            });
        }
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
    
    const unreadCount = adminData.notifications.filter(n => !n.read).length;
    updateNotificationBadge(unreadCount);
    
    if (adminData.notifications.length === 0) {
        notificationList.innerHTML = '<div class="no-results">Nenhuma notificação</div>';
        return;
    }
    
    adminData.notifications.forEach(notification => {
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
    const notification = adminData.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
        notification.read = true;
        loadNotifications();
    }
}

// Marcar todas as notificações como lidas
function markAllNotificationsAsRead() {
    adminData.notifications.forEach(notification => {
        notification.read = true;
    });
    loadNotifications();
}

// Configurar modal de propriedades
function setupPropertyModal() {
    const modal = document.getElementById('propertyModal');
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalSave = document.getElementById('modalSave');
    const propertyForm = document.getElementById('propertyForm');
    
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', () => {
            openPropertyModal();
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closePropertyModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closePropertyModal);
    }
    
    if (modalSave) {
        modalSave.addEventListener('click', saveProperty);
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePropertyModal();
            }
        });
    }
    
    // Prevenir envio do formulário
    if (propertyForm) {
        propertyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProperty();
        });
    }
}

// Abrir modal de propriedade
function openPropertyModal(propertyId = null) {
    const modal = document.getElementById('propertyModal');
    const modalTitle = document.getElementById('modalTitle');
    const propertyForm = document.getElementById('propertyForm');
    
    if (propertyId) {
        // Modo edição
        appState.editingProperty = propertyId;
        modalTitle.textContent = 'Editar Imóvel';
        
        // Preencher formulário com dados existentes
        const property = adminData.allProperties.find(p => p.id === propertyId);
        if (property) {
            document.getElementById('propertyTitle').value = property.title;
            document.getElementById('propertyPrice').value = property.price.replace('R$ ', '');
            document.getElementById('propertyLocation').value = property.location;
            // Preencher outros campos conforme necessário
        }
    } else {
        // Modo adição
        appState.editingProperty = null;
        modalTitle.textContent = 'Adicionar Imóvel';
        propertyForm.reset();
    }
    
    modal.classList.add('show');
}

// Fechar modal de propriedade
function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.remove('show');
    appState.editingProperty = null;
}

// Salvar propriedade
function saveProperty() {
    const title = document.getElementById('propertyTitle').value;
    const price = document.getElementById('propertyPrice').value;
    const location = document.getElementById('propertyLocation').value;
    const type = document.getElementById('propertyType').value;
    
    if (!title || !price || !location || !type) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (appState.editingProperty) {
        // Atualizar propriedade existente
        const propertyIndex = adminData.allProperties.findIndex(p => p.id === appState.editingProperty);
        if (propertyIndex !== -1) {
            adminData.allProperties[propertyIndex].title = title;
            adminData.allProperties[propertyIndex].price = `R$ ${price}`;
            adminData.allProperties[propertyIndex].location = location;
            // Atualizar outros campos conforme necessário
        }
        
        // Mostrar mensagem de sucesso
        showMessage('Imóvel atualizado com sucesso!', 'success');
    } else {
        // Adicionar nova propriedade
        const newId = Math.max(...adminData.allProperties.map(p => p.id)) + 1;
        const newProperty = {
            id: newId,
            title: title,
            price: `R$ ${price}`,
            location: location,
            date: new Date().toLocaleDateString('pt-BR'),
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&q=80&auto=format&fit=crop',
            status: 'active'
        };
        
        adminData.allProperties.unshift(newProperty);
        
        // Mostrar mensagem de sucesso
        showMessage('Imóvel adicionado com sucesso!', 'success');
    }
    
    // Fechar modal e atualizar dados
    closePropertyModal();
    loadPropertiesTable();
    
    // Se estiver no dashboard, atualizar também a lista de imóveis recentes
    if (appState.currentSection === 'dashboard') {
        loadRecentProperties();
    }
}

// Mostrar mensagem
function showMessage(message, type) {
    // Remover mensagens existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(`${type}-message`);
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Adicionar ao conteúdo
    const adminContent = document.querySelector('.admin-content');
    if (adminContent) {
        adminContent.insertBefore(messageDiv, adminContent.firstChild);
        
        // Remover após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Carregar tabela de propriedades
function loadPropertiesTable() {
    const tableBody = document.querySelector('#propertiesTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    let propertiesToShow = adminData.allProperties;
    
    // Aplicar filtro de busca se existir
    if (appState.searchQuery) {
        propertiesToShow = propertiesToShow.filter(property => 
            property.title.toLowerCase().includes(appState.searchQuery) ||
            property.location.toLowerCase().includes(appState.searchQuery) ||
            property.price.toLowerCase().includes(appState.searchQuery)
        );
    }
    
    if (propertiesToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-results">Nenhum imóvel encontrado</td>
            </tr>
        `;
        return;
    }
    
    propertiesToShow.forEach(property => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><input type="checkbox" class="property-checkbox" value="${property.id}"></td>
            <td>
                <div class="property-info-table">
                    <div class="property-image-table">
                        <img src="${property.image}" alt="${property.title}">
                    </div>
                    <div class="property-details">
                        <strong>${property.title}</strong>
                    </div>
                </div>
            </td>
            <td>${property.price}</td>
            <td>${property.location}</td>
            <td><span class="status-badge ${property.status}">${getStatusText(property.status)}</span></td>
            <td>${property.date}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit" title="Editar" onclick="editProperty(${property.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" title="Excluir" onclick="deleteProperty(${property.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Configurar seleção de todos
    const selectAll = document.getElementById('selectAllProperties');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.property-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// Carregar tabela de usuários
function loadUsersTable() {
    const tableBody = document.querySelector('#usersTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    let usersToShow = adminData.users;
    
    // Aplicar filtro de busca se existir
    if (appState.searchQuery) {
        usersToShow = usersToShow.filter(user => 
            user.name.toLowerCase().includes(appState.searchQuery) ||
            user.email.toLowerCase().includes(appState.searchQuery) ||
            user.type.toLowerCase().includes(appState.searchQuery)
        );
    }
    
    if (usersToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-results">Nenhum usuário encontrado</td>
            </tr>
        `;
        return;
    }
    
    usersToShow.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td data-label="Selecionar"><input type="checkbox" class="user-checkbox" value="${user.id}"></td>
            <td data-label="Usuário">
                <div class="user-info-table">
                    <div class="user-avatar-table">
                        <img src="${user.avatar}" alt="${user.name}">
                    </div>
                    <div class="user-details">
                        <strong>${user.name}</strong>
                    </div>
                </div>
            </td>
            <td data-label="Email"><span class="td-value">${user.email}</span></td>
            <td data-label="Telefone"><span class="td-value">${user.phone || '-'}</span></td>
            <td data-label="Status"><span class="status-badge ${user.status}">${getStatusText(user.status)}</span></td>
            <td data-label="Registro"><span class="td-value">${user.registration}</span></td>
            <td data-label="Ações">
                <div class="table-actions">
                    <button class="btn-icon edit" title="Editar" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" title="Excluir" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Configurar seleção de todos
    const selectAll = document.getElementById('selectAllUsers');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// Filtrar tabela de propriedades
function filterPropertiesTable(query) {
    loadPropertiesTable();
}

// Filtrar tabela de usuários
function filterUsersTable(query) {
    loadUsersTable();
}

// Filtrar tabela de anfitriões
function filterVendorsTable(query) {
    loadVendorsTable();
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'active': 'Ativo',
        'inactive': 'Inativo',
        'pending': 'Pendente'
    };
    
    return statusMap[status] || status;
}

// Funções de ação
function editProperty(id) {
    openPropertyModal(id);
}

function deleteProperty(id) {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
        const propertyIndex = adminData.allProperties.findIndex(p => p.id === id);
        if (propertyIndex !== -1) {
            adminData.allProperties.splice(propertyIndex, 1);
            showMessage('Imóvel excluído com sucesso!', 'success');
            loadPropertiesTable();
            
            // Se estiver no dashboard, atualizar também a lista de imóveis recentes
            if (appState.currentSection === 'dashboard') {
                loadRecentProperties();
            }
        }
    }
}

function editUser(id) {
    alert(`Editando usuário ID: ${id}`);
    // Em uma aplicação real, isso abriria um modal de edição de usuário
}

function deleteUser(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const userIndex = adminData.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            adminData.users.splice(userIndex, 1);
            showMessage('Usuário excluído com sucesso!', 'success');
            loadUsersTable();
        }
    }
}

// Carregar tabela de anfitriões
function loadVendorsTable() {
    const tableBody = document.querySelector('#vendorsTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    let vendorsToShow = adminData.vendors;
    
    // Aplicar filtro de busca se existir
    if (appState.searchQuery) {
        vendorsToShow = vendorsToShow.filter(vendor => 
            vendor.name.toLowerCase().includes(appState.searchQuery) ||
            vendor.email.toLowerCase().includes(appState.searchQuery) ||
            vendor.creci.toLowerCase().includes(appState.searchQuery)
        );
    }
    
    if (vendorsToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-results">Nenhum anfitrião encontrado</td>
            </tr>
        `;
        return;
    }
    
    vendorsToShow.forEach(vendor => {
        const row = document.createElement('tr');
        
        // Mostrar botão de aprovar apenas se status for pending
        const approveButton = vendor.status === 'pending' ? `
            <button class="btn-icon approve" title="Aprovar" onclick="approveVendor(${vendor.id})">
                <i class="fas fa-check"></i>
            </button>
        ` : '';
        
        row.innerHTML = `
            <td data-label="Selecionar"><input type="checkbox" class="vendor-checkbox" value="${vendor.id}"></td>
            <td data-label="Anfitrião">
                <div class="user-info-table">
                    <div class="user-avatar-table">
                        <img src="${vendor.avatar}" alt="${vendor.name}">
                    </div>
                    <div class="user-details">
                        <strong>${vendor.name}</strong>
                    </div>
                </div>
            </td>
            <td data-label="Email"><span class="td-value">${vendor.email}</span></td>
            <td data-label="Telefone"><span class="td-value">${vendor.phone}</span></td>
            <td data-label="CRECI"><span class="td-value">${vendor.creci}</span></td>
            <td data-label="Status"><span class="status-badge ${vendor.status}">${getStatusText(vendor.status)}</span></td>
            <td data-label="Registro"><span class="td-value">${vendor.registration}</span></td>
            <td data-label="Ações">
                <div class="table-actions">
                    ${approveButton}
                    <button class="btn-icon edit" title="Editar" onclick="editVendor(${vendor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" title="Excluir" onclick="deleteVendor(${vendor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Configurar seleção de todos
    const selectAll = document.getElementById('selectAllVendors');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.vendor-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

function editVendor(id) {
    // Abre o modal de edição de anfitrião
    openVendorModal(id);
}

function approveVendor(id) {
    const vendor = adminData.vendors.find(v => v.id === id);
    if (vendor) {
        vendor.status = 'active';
        showMessage(`Anfitrião ${vendor.name} aprovado com sucesso!`, 'success');
        loadVendorsTable();
    }
}

function deleteVendor(id) {
    if (confirm('Tem certeza que deseja excluir este anfitrião?')) {
        const vendorIndex = adminData.vendors.findIndex(v => v.id === id);
        if (vendorIndex !== -1) {
            adminData.vendors.splice(vendorIndex, 1);
            showMessage('Anfitrião excluído com sucesso!', 'success');
            loadVendorsTable();
        }
    }
}

// Adicionar estilos para elementos da tabela
const style = document.createElement('style');
style.textContent = `
    .property-info-table,
    .user-info-table {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .property-image-table,
    .user-avatar-table {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        overflow: hidden;
        flex-shrink: 0;
    }
    
    .property-image-table img,
    .user-avatar-table img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .property-details,
    .user-details {
        flex: 1;
    }
    
    .message {
        padding: 12px 16px;
        border-radius: var(--radius);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideIn 0.3s ease;
    }
    
    .success-message {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid var(--success);
        color: var(--success);
    }
    
    .error-message {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--danger);
        color: var(--danger);
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== MODAL DE USUÁRIOS =====
let currentUserId = null;
let isUserEditMode = false;

// Aguardar o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeUserModal();
    initializeVendorModal();
});

function initializeUserModal() {
    const userModal = document.getElementById('userModal');
    if (!userModal) return;
    
    const userModalTitle = document.getElementById('userModalTitle');
    const userForm = document.getElementById('userForm');
    const closeUserModalBtn = document.getElementById('closeUserModalBtn');
    const cancelUserModalBtn = document.getElementById('cancelUserModalBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const userModalMessage = document.getElementById('userModalMessage');
    
    // Abrir modal para criar novo usuário
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            openUserModal();
        });
    }
    
    // Fechar modal
    closeUserModalBtn.addEventListener('click', closeUserModal);
    cancelUserModalBtn.addEventListener('click', closeUserModal);
    
    // Fechar modal ao clicar no overlay
    userModal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeUserModal();
        }
    });
    
    // Salvar usuário
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateUserForm()) {
            showUserMessage('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        const userData = {
            name: document.getElementById('userName').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            phone: document.getElementById('userPhone').value.trim(),
            status: document.getElementById('userStatus').value,
            registration: document.getElementById('userRegistration').value
        };
        
        if (isUserEditMode) {
            // Editar usuário existente
            const user = adminData.users.find(u => u.id === currentUserId);
            if (user) {
                Object.assign(user, userData);
                showUserMessage(`Usuário ${userData.name} atualizado com sucesso!`, 'success');
            }
        } else {
            // Criar novo usuário
            const newUser = {
                id: Math.max(...adminData.users.map(u => u.id), 0) + 1,
                avatar: 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 70) + '.jpg',
                type: 'Cliente',
                ...userData
            };
            adminData.users.push(newUser);
            showUserMessage(`Usuário ${userData.name} criado com sucesso!`, 'success');
        }
        
        loadUsersTable();
        
        setTimeout(() => {
            closeUserModal();
        }, 1500);
    });
}

function openUserModal(userId = null) {
    const userModal = document.getElementById('userModal');
    const userModalTitle = document.getElementById('userModalTitle');
    const userForm = document.getElementById('userForm');
    
    isUserEditMode = !!userId;
    currentUserId = userId;
    
    // Limpar formulário
    userForm.reset();
    clearUserErrors();
    hideUserMessage();
    
    if (isUserEditMode) {
        const user = adminData.users.find(u => u.id === userId);
        if (!user) return;
        
        // Preencher formulário com dados do usuário
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone;
        document.getElementById('userStatus').value = user.status;
        document.getElementById('userRegistration').value = user.registration;
        
        userModalTitle.textContent = `Editar Usuário - ${user.name}`;
    } else {
        userModalTitle.textContent = 'Adicionar Usuário';
        document.getElementById('userRegistration').value = new Date().toISOString().split('T')[0];
    }
    
    userModal.classList.add('active');
}

function closeUserModal() {
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    
    userModal.classList.remove('active');
    userForm.reset();
    clearUserErrors();
    hideUserMessage();
    currentUserId = null;
    isUserEditMode = false;
}

// Validar email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Limpar todos os erros de usuário
function clearUserErrors() {
    document.querySelectorAll('#userForm .error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    document.querySelectorAll('#userForm input, #userForm select').forEach(el => {
        el.classList.remove('error');
    });
}

// Mostrar erro em um campo de usuário
function showUserError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Validar formulário de usuário
function validateUserForm() {
    clearUserErrors();
    let isValid = true;
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const status = document.getElementById('userStatus').value;
    
    if (!name) {
        showUserError('userName', 'Nome é obrigatório');
        isValid = false;
    }
    
    if (!email) {
        showUserError('userEmail', 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showUserError('userEmail', 'Email inválido');
        isValid = false;
    }
    
    if (!phone) {
        showUserError('userPhone', 'Telefone é obrigatório');
        isValid = false;
    }
    
    if (!status) {
        showUserError('userStatus', 'Status é obrigatório');
        isValid = false;
    }
    
    return isValid;
}

// Mostrar mensagem de usuário
function showUserMessage(message, type = 'success') {
    const userModalMessage = document.getElementById('userModalMessage');
    if (!userModalMessage) return;
    
    userModalMessage.textContent = message;
    userModalMessage.className = `modal-message show ${type}`;
    setTimeout(() => {
        hideUserMessage();
    }, 3000);
}

// Esconder mensagem de usuário
function hideUserMessage() {
    const userModalMessage = document.getElementById('userModalMessage');
    if (!userModalMessage) return;
    
    userModalMessage.className = 'modal-message';
    userModalMessage.textContent = '';
}

// Modificar função editUser para abrir o modal
window.editUser = function(id) {
    openUserModal(id);
};

// ===== MODAL DE ANFITRIÕES =====

function initializeVendorModal() {
    const modal = document.getElementById('vendorModal');
    if (!modal) return; // Se modal não existe, sair
    
    const modalTitle = document.getElementById('modalTitle');
    const vendorForm = document.getElementById('vendorForm');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addVendorBtn = document.getElementById('addVendorBtn');
    const approveBtn = document.getElementById('approveVendorBtn');
    const rejectBtn = document.getElementById('rejectVendorBtn');
    const modalMessage = document.getElementById('modalMessage');
    
    // Abrir modal para criar novo anfitrião
    if (addVendorBtn) {
        addVendorBtn.addEventListener('click', function() {
            openVendorModal();
        });
    }
    
    // Fechar modal
    closeModalBtn.addEventListener('click', closeVendorModal);
    cancelModalBtn.addEventListener('click', closeVendorModal);
    
    // Fechar modal ao clicar no overlay
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVendorModal();
        }
    });
    
    // Salvar anfitrião
    vendorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateVendorForm()) {
            showMessage('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        const vendorData = {
            name: document.getElementById('vendorName').value.trim(),
            email: document.getElementById('vendorEmail').value.trim(),
            phone: document.getElementById('vendorPhone').value.trim(),
            creci: document.getElementById('vendorCreci').value.trim(),
            status: document.getElementById('vendorStatus').value,
            registration: document.getElementById('vendorRegistration').value
        };
        
        if (isEditMode) {
            // Editar anfitrião existente
            const vendor = adminData.vendors.find(v => v.id === currentVendorId);
            if (vendor) {
                Object.assign(vendor, vendorData);
                showMessage(`Anfitrião ${vendorData.name} atualizado com sucesso!`, 'success');
            }
        } else {
            // Criar novo anfitrião
            const newVendor = {
                id: Math.max(...adminData.vendors.map(v => v.id), 0) + 1,
                avatar: 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 70) + '.jpg',
                ...vendorData
            };
            adminData.vendors.push(newVendor);
            showMessage(`Anfitrião ${vendorData.name} criado com sucesso!`, 'success');
        }
        
        loadVendorsTable();
        
        setTimeout(() => {
            closeVendorModal();
        }, 1500);
    });
    
    // Aprovar anfitrião
    approveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateVendorForm()) {
            showMessage('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        const vendor = adminData.vendors.find(v => v.id === currentVendorId);
        if (vendor) {
            vendor.name = document.getElementById('vendorName').value.trim();
            vendor.email = document.getElementById('vendorEmail').value.trim();
            vendor.phone = document.getElementById('vendorPhone').value.trim();
            vendor.creci = document.getElementById('vendorCreci').value.trim();
            vendor.registration = document.getElementById('vendorRegistration').value;
            vendor.status = 'active';
            
            showMessage(`Anfitrião ${vendor.name} aprovado com sucesso!`, 'success');
            loadVendorsTable();
            
            setTimeout(() => {
                closeVendorModal();
            }, 1500);
        }
    });
    
    // Reprovar anfitrião
    rejectBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Tem certeza que deseja reprovar este anfitrião?')) {
            const vendor = adminData.vendors.find(v => v.id === currentVendorId);
            if (vendor) {
                vendor.status = 'inactive';
                showMessage(`Anfitrião ${vendor.name} reprovado!`, 'success');
                loadVendorsTable();
                
                setTimeout(() => {
                    closeVendorModal();
                }, 1500);
            }
        }
    });
}

function openVendorModal(vendorId = null) {
    const modal = document.getElementById('vendorModal');
    const modalTitle = document.getElementById('modalTitle');
    const vendorForm = document.getElementById('vendorForm');
    const approveBtn = document.getElementById('approveVendorBtn');
    const rejectBtn = document.getElementById('rejectVendorBtn');
    
    isEditMode = !!vendorId;
    currentVendorId = vendorId;
    
    // Limpar formulário
    vendorForm.reset();
    clearAllErrors();
    hideMessage();
    
    if (isEditMode) {
        const vendor = adminData.vendors.find(v => v.id === vendorId);
        if (!vendor) return;
        
        // Preencher formulário com dados do vendedor
        document.getElementById('vendorId').value = vendor.id;
        document.getElementById('vendorName').value = vendor.name;
        document.getElementById('vendorEmail').value = vendor.email;
        document.getElementById('vendorPhone').value = vendor.phone;
        document.getElementById('vendorCreci').value = vendor.creci;
        document.getElementById('vendorStatus').value = vendor.status;
        document.getElementById('vendorRegistration').value = vendor.registration;
        
        modalTitle.textContent = `Editar Anfitrião - ${vendor.name}`;
        
        // Mostrar botões de aprovar/reprovar se estiver pendente
        if (vendor.status === 'pending') {
            approveBtn.style.display = 'flex';
            rejectBtn.style.display = 'flex';
        } else {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'none';
        }
    } else {
        modalTitle.textContent = 'Adicionar Anfitrião';
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
        document.getElementById('vendorRegistration').value = new Date().toISOString().split('T')[0];
    }
    
    modal.classList.add('active');
}
function closeVendorModal() {
    const modal = document.getElementById('vendorModal');
    const vendorForm = document.getElementById('vendorForm');
    
    modal.classList.remove('active');
    vendorForm.reset();
    clearAllErrors();
    hideMessage();
    currentVendorId = null;
    isEditMode = false;
}

// Validar email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Limpar todos os erros
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
        el.classList.remove('error');
    });
}

// Mostrar erro em um campo
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Validar formulário
function validateVendorForm() {
    clearAllErrors();
    let isValid = true;
    
    const name = document.getElementById('vendorName').value.trim();
    const email = document.getElementById('vendorEmail').value.trim();
    const phone = document.getElementById('vendorPhone').value.trim();
    const creci = document.getElementById('vendorCreci').value.trim();
    const status = document.getElementById('vendorStatus').value;
    
    if (!name) {
        showError('vendorName', 'Nome é obrigatório');
        isValid = false;
    }
    
    if (!email) {
        showError('vendorEmail', 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('vendorEmail', 'Email inválido');
        isValid = false;
    }
    
    if (!phone) {
        showError('vendorPhone', 'Telefone é obrigatório');
        isValid = false;
    }
    
    if (!creci) {
        showError('vendorCreci', 'CRECI é obrigatório');
        isValid = false;
    }
    
    if (!status) {
        showError('vendorStatus', 'Status é obrigatório');
        isValid = false;
    }
    
    return isValid;
}

// Mostrar mensagem
function showMessage(message, type = 'success') {
    const modalMessage = document.getElementById('modalMessage');
    if (!modalMessage) return;
    
    modalMessage.textContent = message;
    modalMessage.className = `modal-message show ${type}`;
    setTimeout(() => {
        hideMessage();
    }, 3000);
}

// Esconder mensagem
function hideMessage() {
    const modalMessage = document.getElementById('modalMessage');
    if (!modalMessage) return;
    
    modalMessage.className = 'modal-message';
    modalMessage.textContent = '';
}

// Modificar função editVendor para abrir o modal
window.editVendor = function(id) {
    openVendorModal(id);
};