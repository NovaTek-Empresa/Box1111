// Dados dos imóveis (simulação de banco de dados)
let properties = [
    {
        id: 1,
        title: "Casa Alto Padrão — Condomínio Fechado",
        price: "R$ 1.250.000",
        description: "Mansão moderna com 5 suítes, piscina, área gourmet, 980 m². Acabamento de alto padrão e automação residencial. Localizada em condomínio fechado com segurança 24h, área de lazer completa e proximidade com escolas e comércio.",
        location: "Jardins, São Paulo - SP",
        type: "casa",
        transaction: "venda",
        features: ["5 suítes", "Piscina", "Área gourmet", "5 vagas", "980 m²", "Condomínio fechado"],
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448071-7fae0bad0f1b?w=800&q=80&auto=format&fit=crop"
        ],
        seller: {
            id: 1,
            name: "Carlos Mendes",
            type: "Corretor",
            avatar: "https://randomuser.me/api/portraits/men/46.jpg",
            rating: 4.9,
            phone: "+5511999999999",
            email: "carlos.mendes@imobiliaria.com"
        },
        date: "2023-10-15"
    },
    {
        id: 2,
        title: "Sobrado Moderno — Bairro Tranquilo",
        price: "R$ 790.000",
        description: "Sobrado reformado com 3 dormitórios, suíte, cozinha planejada e quintal. Localização próxima ao comércio e áreas de lazer. Excelente oportunidade para famílias que buscam conforto e praticidade.",
        location: "Vila Mariana, São Paulo - SP",
        type: "casa",
        transaction: "venda",
        features: ["3 dormitórios", "2 banheiros", "2 vagas", "180 m²", "Quintal", "Reformado"],
        images: [
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448071-7fae0bad0f1b?w=800&q=80&auto=format&fit=crop"
        ],
        seller: {
            id: 2,
            name: "Ana Silva",
            type: "Proprietário",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg",
            rating: 4.7,
            phone: "+5511988888888",
            email: "ana.silva@email.com"
        },
        date: "2023-10-12"
    },
    {
        id: 3,
        title: "Apartamento de 2 Quartos no Centro",
        price: "R$ 420.000",
        description: "Apartamento bem localizado no centro da cidade, próximo a tudo. Prédio com portaria 24h e área de lazer. Excelente opção para quem busca praticidade e localização.",
        location: "Centro, São Paulo - SP",
        type: "apartamento",
        transaction: "venda",
        features: ["2 quartos", "2 banheiros", "1 vaga", "75 m²", "Centro", "Portaria 24h"],
        images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448071-7fae0bad0f1b?w=800&q=80&auto=format&fit=crop"
        ],
        seller: {
            id: 3,
            name: "Fernando Lima",
            type: "Corretor",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
            rating: 4.9,
            phone: "+5511977777777",
            email: "fernando.lima@imobiliaria.com"
        },
        date: "2023-10-10"
    },
    {
        id: 4,
        title: "Casa com Piscina e Churrasqueira",
        price: "R$ 3.500/mês",
        description: "Casa espaçosa com piscina, churrasqueira e área de lazer completa. Ideal para quem busca conforto e entretenimento. Localizada em condomínio fechado com segurança.",
        location: "Morumbi, São Paulo - SP",
        type: "casa",
        transaction: "aluguel",
        features: ["4 quartos", "3 banheiros", "Piscina", "Churrasqueira", "220 m²", "Condomínio"],
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448071-7fae0bad0f1b?w=800&q=80&auto=format&fit=crop"
        ],
        seller: {
            id: 4,
            name: "Patrícia Santos",
            type: "Proprietário",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            rating: 4.8,
            phone: "+5511966666666",
            email: "patricia.santos@email.com"
        },
        date: "2023-10-08"
    },
    {
        id: 5,
        title: "Loja Comercial em Localização Privilegiada",
        price: "R$ 850.000",
        description: "Loja comercial em ponto estratégico, com alto fluxo de pessoas. Ideal para diversos tipos de negócio. Reformada recentemente com ótimo acabamento.",
        location: "Moema, São Paulo - SP",
        type: "comercial",
        transaction: "venda",
        features: ["120 m²", "2 banheiros", "Reformada", "Ponto comercial", "Alto fluxo"],
        images: [
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448071-7fae0bad0f1b?w=800&q=80&auto=format&fit=crop"
        ],
        seller: {
            id: 5,
            name: "Roberto Almeida",
            type: "Corretor",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
            rating: 4.6,
            phone: "+5511955555555",
            email: "roberto.almeida@imobiliaria.com"
        },
        date: "2023-10-05"
    },
    {
        id: 6,
        title: "Terreno para Construção — 500 m²",
        price: "R$ 350.000",
        description: "Terreno plano e regular, ideal para construção residencial ou comercial. Localizado em bairro em desenvolvimento com boa infraestrutura e facilidade de acesso.",
        location: "Interlagos, São Paulo - SP",
        type: "terreno",
        transaction: "venda",
        features: ["500 m²", "Plano", "Regular", "Boa localização", "Infraestrutura"],
        images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448071-7fae0bad0f1b?w=800&q=80&auto=format&fit=crop"
        ],
        seller: {
            id: 6,
            name: "Mariana Costa",
            type: "Proprietário",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 4.5,
            phone: "+5511944444444",
            email: "mariana.costa@email.com"
        },
        date: "2023-10-01"
    }
];

// Estado da aplicação
let appState = {
    currentUser: null,
    filteredProperties: [...properties],
    currentFilter: 'all',
    visibleProperties: 6
};

// Menu Mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Alternar ícone do hamburger
        if (hamburger.classList.contains('active')) {
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Modal Functionality
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const propertyModal = document.getElementById('propertyModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const closePropertyModal = document.getElementById('closePropertyModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const sellPropertyBtn = document.getElementById('sellPropertyBtn');

// Abrir modal de login
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
}

// Abrir modal de registro
if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
}

// Fechar modais
if (closeLoginModal) {
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
        document.body.style.overflow = '';
    });
}

if (closeRegisterModal) {
    closeRegisterModal.addEventListener('click', () => {
        registerModal.style.display = 'none';
        document.body.style.overflow = '';
    });
}

if (closePropertyModal) {
    closePropertyModal.addEventListener('click', () => {
        propertyModal.style.display = 'none';
        document.body.style.overflow = '';
    });
}

// Alternar entre login e registro
if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
}

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (e.target === propertyModal) {
        propertyModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Anunciar imóvel
if (sellPropertyBtn) {
    sellPropertyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (appState.currentUser) {
            // Redirecionar para painel do vendedor para adicionar imóvel
            window.location.href = 'vendor/index.html?action=add-property';
        } else {
            // Mostrar modal de registro
            registerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
}

// Form Submission
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulação de login
        appState.currentUser = {
            id: 1,
            name: 'Usuário Teste',
            email: email,
            type: 'user' // user, vendor, admin
        };
        
        alert('Login realizado com sucesso!');
        loginModal.style.display = 'none';
        document.body.style.overflow = '';
        loginForm.reset();
        
        // Atualizar interface para usuário logado
        updateUIForLoggedUser();
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        
        // Simulação de registro
        appState.currentUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            type: 'user' // user, vendor, admin
        };
        
        alert('Conta criada com sucesso!');
        registerModal.style.display = 'none';
        document.body.style.overflow = '';
        registerForm.reset();
        
        // Atualizar interface para usuário logado
        updateUIForLoggedUser();
    });
}

function updateUIForLoggedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && appState.currentUser) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline" id="userMenuBtn">
                    <i class="fas fa-user"></i>
                    ${appState.currentUser.name}
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="vendor/index.html" class="dropdown-item">
                        <i class="fas fa-store"></i>
                        Meus Anúncios
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-heart"></i>
                        Favoritos
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        Configurações
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        Sair
                    </a>
                </div>
            </div>
        `;
        
        // Adicionar eventos para o menu do usuário
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });
            
            // Fechar dropdown ao clicar fora
            window.addEventListener('click', (e) => {
                if (!e.target.matches('#userMenuBtn')) {
                    if (userDropdown.classList.contains('show')) {
                        userDropdown.classList.remove('show');
                    }
                }
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                appState.currentUser = null;
                location.reload();
            });
        }
    }
}

// Carregar propriedades na página
function loadProperties() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    if (!propertiesGrid) return;
    
    propertiesGrid.innerHTML = '';
    
    const propertiesToShow = appState.filteredProperties.slice(0, appState.visibleProperties);
    
    propertiesToShow.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.classList.add('property-card', 'fade-up');
        propertyCard.dataset.id = property.id;
        
        propertyCard.innerHTML = `
            <div class="property-image">
                <img src="${property.images[0]}" alt="${property.title}">
                <div class="property-badge">${property.transaction === 'venda' ? 'Venda' : 'Aluguel'}</div>
            </div>
            <div class="property-content">
                <div class="property-header">
                    <div class="property-price">${property.price}</div>
                    <div class="property-rating">
                        <i class="fas fa-star"></i>
                        <span>${property.seller.rating}</span>
                    </div>
                </div>
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.location}</p>
                <div class="property-features">
                    ${property.features.slice(0, 3).map(feature => `<span class="property-feature">${feature}</span>`).join('')}
                </div>
                <button class="btn btn-outline" style="width: 100%;">Ver Detalhes</button>
            </div>
        `;
        
        propertiesGrid.appendChild(propertyCard);
        
        // Adicionar evento de clique para abrir modal
        propertyCard.addEventListener('click', () => {
            openPropertyModal(property.id);
        });
    });
    
    // Verificar se há mais propriedades para carregar
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (appState.visibleProperties >= appState.filteredProperties.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    // Ativar animações de scroll
    checkScroll();
}

// Abrir modal de propriedade
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Preencher informações do imóvel
    document.getElementById('modalPropertyTitle').textContent = property.title;
    document.getElementById('modalPropertyPrice').textContent = property.price;
    document.getElementById('modalPropertyLocation').textContent = property.location;
    document.getElementById('modalPropertyDescription').textContent = property.description;
    
    // Limpar e preencher features
    const modalPropertyFeatures = document.getElementById('modalPropertyFeatures');
    modalPropertyFeatures.innerHTML = '';
    property.features.forEach(feature => {
        const featureElement = document.createElement('span');
        featureElement.classList.add('modal-feature');
        featureElement.textContent = feature;
        modalPropertyFeatures.appendChild(featureElement);
    });
    
    // Preencher imagens
    const modalMainImage = document.getElementById('modalMainImage');
    modalMainImage.src = property.images[0];
    
    // Preencher imagens laterais
    const sideImages = document.querySelector('.side-images');
    sideImages.innerHTML = '';
    property.images.slice(1).forEach((image, index) => {
        const sideImage = document.createElement('div');
        sideImage.classList.add('side-image');
        sideImage.dataset.img = image;
        sideImage.innerHTML = `<img src="${image}" alt="Imóvel">`;
        sideImages.appendChild(sideImage);
        
        // Adicionar evento de clique para trocar imagem principal
        sideImage.addEventListener('click', () => {
            modalMainImage.src = image;
        });
    });
    
    // Preencher informações do vendedor
    document.getElementById('modalSellerAvatar').src = property.seller.avatar;
    document.getElementById('modalSellerName').textContent = property.seller.name;
    document.getElementById('modalSellerType').textContent = property.seller.type;
    document.getElementById('modalSellerRating').textContent = property.seller.rating;
    
    // Configurar botão de chat — redireciona para a área de vendedores
    const modalChatBtn = document.getElementById('modalChatBtn');
    if (modalChatBtn) {
        modalChatBtn.href = 'vendor/index.html#messages';
        modalChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'vendor/index.html#messages';
        });
    }
    
    // Configurar botão de aluguel — redireciona para a página de reserva com preço por diária
    const modalRentBtn = document.getElementById('modalRentBtn');
    if (modalRentBtn) {
        // tentar extrair número do preço
        let nightly = 200; // valor padrão
        try {
            const raw = property.price || '';
            // extrai números e converte formatação BR (ponto milhares, vírgula decimal)
            const cleaned = raw.replace(/[^0-9.,]/g, '').trim();
            let num = NaN;
            if (cleaned.includes(',')) {
                num = Number(cleaned.replace(/\./g, '').replace(',', '.'));
            } else {
                num = Number(cleaned.replace(/\./g, ''));
            }
            if (!isNaN(num) && num > 0) {
                if (raw.toLowerCase().includes('/mês') || raw.toLowerCase().includes('mês')) {
                    nightly = Math.round(num / 30);
                } else if (property.transaction === 'aluguel') {
                    nightly = Math.round(num / 30);
                } else {
                    nightly = Math.round(num / 100);
                }
            }
        } catch (e) {
            console.warn('Erro ao calcular diária', e);
        }

        // incluir até 3 imagens no link (quando disponíveis)
        const img1 = property.images[0] ? encodeURIComponent(property.images[0]) : '';
        const img2 = property.images[1] ? encodeURIComponent(property.images[1]) : '';
        const img3 = property.images[2] ? encodeURIComponent(property.images[2]) : '';
        const sellerAvatar = property.seller && property.seller.avatar ? encodeURIComponent(property.seller.avatar) : '';
        const sellerPhone = property.seller && property.seller.phone ? encodeURIComponent(property.seller.phone) : '';
        modalRentBtn.href = `reservar.html?propertyId=${property.id}&nightly=${nightly}&title=${encodeURIComponent(property.title)}&img1=${img1}&img2=${img2}&img3=${img3}&sellerAvatar=${sellerAvatar}&sellerPhone=${sellerPhone}`;
        modalRentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = modalRentBtn.href;
        });
    }
    
    // Abrir modal
    propertyModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Filtros de propriedades
function setupFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remover classe active de todos os chips
            filterChips.forEach(c => c.classList.remove('active'));
            // Adicionar classe active ao chip clicado
            chip.classList.add('active');
            
            // Aplicar filtro
            const filter = chip.textContent.toLowerCase();
            appState.currentFilter = filter;
            
            if (filter === 'todos') {
                appState.filteredProperties = [...properties];
            } else if (filter === 'venda' || filter === 'aluguel') {
                appState.filteredProperties = properties.filter(p => p.transaction === filter);
            } else if (filter === 'casas' || filter === 'apartamentos') {
                const type = filter === 'casas' ? 'casa' : 'apartamento';
                appState.filteredProperties = properties.filter(p => p.type === type);
            } else {
                appState.filteredProperties = [...properties];
            }
            
            // Resetar contador de propriedades visíveis
            appState.visibleProperties = 6;
            
            // Recarregar propriedades
            loadProperties();
        });
    });
}

// Carregar mais propriedades
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            appState.visibleProperties += 6;
            loadProperties();
        });
    }
}

// Busca de propriedades
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            appState.filteredProperties = [...properties];
        } else {
            appState.filteredProperties = properties.filter(property => {
                return (
                    property.title.toLowerCase().includes(query) ||
                    property.description.toLowerCase().includes(query) ||
                    property.location.toLowerCase().includes(query) ||
                    property.features.some(feature => feature.toLowerCase().includes(query))
                );
            });
        }
        
        // Resetar contador de propriedades visíveis
        appState.visibleProperties = 6;
        
        // Recarregar propriedades
        loadProperties();
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

// Scroll Animations
function checkScroll() {
    const elements = document.querySelectorAll('.fade-up');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
    setupFilters();
    setupLoadMore();
    setupSearch();
    setupSmoothScrolling();
    
    // Verificar se há usuário logado no localStorage (simulação)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        updateUIForLoggedUser();
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verificar elementos visíveis no carregamento
});