// Dados dos coanfitriões simulados
const cohosts = [
    {
        id: 1,
        name: "Marina Santos",
        username: "@marinasantos",
        email: "marina.santos@email.com",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        bio: "Gerenciadora de propriedades com 5 anos de experiência. Especialista em imóveis residenciais.",
        rating: 4.9,
        reviews: 127,
        category: "imovel",
        availability: "imediata",
        description: "Marina é uma profissional dedicada com excelente histórico de gerenciamento de imóveis. Oferece suporte completo aos anfitriões."
    },
    {
        id: 2,
        name: "Carlos Lima",
        username: "@carloslima",
        email: "carlos.lima@email.com",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Especialista em imóveis comerciais com 8 anos no mercado. Focado em maximizar lucro.",
        rating: 4.7,
        reviews: 95,
        category: "comercial",
        availability: "imediata",
        description: "Carlos tem vasta experiência com propriedades comerciais e oferece estratégias inovadoras de gestão."
    },
    {
        id: 3,
        name: "Juliana Costa",
        username: "@julianacosta",
        email: "juliana.costa@email.com",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        bio: "Gerenciadora de imóveis multifamiliares. Experiência com condomínios e edifícios.",
        rating: 4.8,
        reviews: 156,
        category: "multifamiliar",
        availability: "2-semanas",
        description: "Juliana especializa-se em gerenciar imóveis multifamiliares com excelentes resultados para seus clientes."
    },
    {
        id: 4,
        name: "Roberto Alves",
        username: "@robertoalves",
        email: "roberto.alves@email.com",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        bio: "Gestor de terrenos e propriedades rurais. Desenvolvimento e investimento imobiliário.",
        rating: 4.6,
        reviews: 72,
        category: "terreno",
        availability: "1-mes",
        description: "Roberto é especialista em gestão de terrenos com foco em desenvolvimento sustentável."
    },
    {
        id: 5,
        name: "Amanda Silva",
        username: "@amandasilva",
        email: "amanda.silva@email.com",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        bio: "Gerenciadora full-service de imóveis residenciais de alto padrão.",
        rating: 4.95,
        reviews: 203,
        category: "imovel",
        availability: "imediata",
        description: "Amanda oferece gerenciamento premium com atendimento personalizado e resultados excepcionais."
    },
    {
        id: 6,
        name: "Felipe Mendes",
        username: "@felipemendes",
        email: "felipe.mendes@email.com",
        avatar: "https://randomuser.me/api/portraits/men/6.jpg",
        bio: "Especialista em imóveis comerciais e shopping centers. Gestão de aluguéis premium.",
        rating: 4.5,
        reviews: 68,
        category: "comercial",
        availability: "imediata",
        description: "Felipe tem expertise em imóveis comerciais de alto valor com rentabilidade garantida."
    },
    {
        id: 7,
        name: "Beatriz Oliveira",
        username: "@beatrizolive",
        email: "beatriz.oliveira@email.com",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
        bio: "Gerenciadora de propriedades com foco em sustentabilidade e inovação tecnológica.",
        rating: 4.85,
        reviews: 134,
        category: "imovel",
        availability: "2-semanas",
        description: "Beatriz utiliza tecnologia avançada para maximizar a rentabilidade e satisfação dos clientes."
    },
    {
        id: 8,
        name: "Gustavo Costa",
        username: "@gustavocosta",
        email: "gustavo.costa@email.com",
        avatar: "https://randomuser.me/api/portraits/men/8.jpg",
        bio: "Gerente imobiliário com experiência em portfólios diversificados. Crescimento garantido.",
        rating: 4.7,
        reviews: 91,
        category: "multifamiliar",
        availability: "imediata",
        description: "Gustavo tem excelente track record em gestão de múltiplas propriedades simultaneamente."
    },
    {
        id: 9,
        name: "Fernanda Rocha",
        username: "@fernandarocha",
        email: "fernanda.rocha@email.com",
        avatar: "https://randomuser.me/api/portraits/women/9.jpg",
        bio: "Especialista em imóveis residenciais para aluguéis de curta duração e temporada.",
        rating: 4.92,
        reviews: 189,
        category: "imovel",
        availability: "imediata",
        description: "Fernanda domina o mercado de aluguel temporário com estratégias eficientes de marketing."
    },
    {
        id: 10,
        name: "Marcos Gomes",
        username: "@marcosgomes",
        email: "marcos.gomes@email.com",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        bio: "Gestor de propriedades com foco em automação e eficiência operacional.",
        rating: 4.65,
        reviews: 110,
        category: "comercial",
        availability: "2-semanas",
        description: "Marcos utiliza sistemas automatizados para reduzir custos e melhorar a experiência do hóspede."
    },
    {
        id: 11,
        name: "Carolina Dias",
        username: "@carolinadias",
        email: "carolina.dias@email.com",
        avatar: "https://randomuser.me/api/portraits/women/11.jpg",
        bio: "Gerenciadora especializada em imóveis de luxo e propriedades premium em localidades chave.",
        rating: 4.88,
        reviews: 167,
        category: "imovel",
        availability: "1-mes",
        description: "Carolina oferece gerenciamento de elite para propriedades de alto padrão com resultados premium."
    },
    {
        id: 12,
        name: "Thiago Souza",
        username: "@thiagosouza",
        email: "thiago.souza@email.com",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
        bio: "Especialista em terrenos para desenvolvimento imobiliário e investimento de longo prazo.",
        rating: 4.6,
        reviews: 84,
        category: "terreno",
        availability: "imediata",
        description: "Thiago ajuda a maximizar o potencial de desenvolvimento de terrenos e propriedades rurais."
    }
];

// Estado da aplicação
let filteredCohosts = [...cohosts];
let currentFilters = {
    search: '',
    category: '',
    availability: '',
    rating: ''
};

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const filtersToggle = document.getElementById('filtersToggle');
const filtersContainer = document.getElementById('filtersContainer');
const categoryFilter = document.getElementById('categoryFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const ratingFilter = document.getElementById('ratingFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const cohostsList = document.getElementById('cohostsList');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');
const resetSearchBtn = document.getElementById('resetSearch');
const profileModal = document.getElementById('profileModal');
const inviteModal = document.getElementById('inviteModal');
const closeModal = document.getElementById('closeModal');
const closeInviteModal = document.getElementById('closeInviteModal');
const inviteForm = document.getElementById('inviteForm');
const cancelInvite = document.getElementById('cancelInvite');

// Event Listeners
searchInput.addEventListener('input', debounce(handleSearch, 300));
clearSearch.addEventListener('click', clearSearchInput);
filtersToggle.addEventListener('click', toggleFilters);
categoryFilter.addEventListener('change', handleFilterChange);
availabilityFilter.addEventListener('change', handleFilterChange);
ratingFilter.addEventListener('change', handleFilterChange);
clearFiltersBtn.addEventListener('click', clearAllFilters);
resetSearchBtn.addEventListener('click', resetAllSearch);
closeModal.addEventListener('click', closeProfileModal);
closeInviteModal.addEventListener('click', closeInviteModalFunc);
cancelInvite.addEventListener('click', closeInviteModalFunc);
inviteForm.addEventListener('submit', handleInviteSubmit);
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfileModal();
});
inviteModal.addEventListener('click', (e) => {
    if (e.target === inviteModal) closeInviteModalFunc();
});

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Manipuladores de eventos
function handleSearch(e) {
    currentFilters.search = e.target.value.toLowerCase();
    applyFilters();
}

function clearSearchInput() {
    searchInput.value = '';
    currentFilters.search = '';
    applyFilters();
}

function toggleFilters() {
    filtersContainer.classList.toggle('active');
    filtersToggle.classList.toggle('active');
}

function handleFilterChange(e) {
    const filterId = e.target.id;
    const value = e.target.value;

    if (filterId === 'categoryFilter') {
        currentFilters.category = value;
    } else if (filterId === 'availabilityFilter') {
        currentFilters.availability = value;
    } else if (filterId === 'ratingFilter') {
        currentFilters.rating = value;
    }

    applyFilters();
}

function clearAllFilters() {
    currentFilters = {
        search: currentFilters.search,
        category: '',
        availability: '',
        rating: ''
    };
    categoryFilter.value = '';
    availabilityFilter.value = '';
    ratingFilter.value = '';
    applyFilters();
}

function resetAllSearch() {
    currentFilters = {
        search: '',
        category: '',
        availability: '',
        rating: ''
    };
    searchInput.value = '';
    categoryFilter.value = '';
    availabilityFilter.value = '';
    ratingFilter.value = '';
    filtersContainer.classList.remove('active');
    filtersToggle.classList.remove('active');
    applyFilters();
}

// Aplicar filtros
function applyFilters() {
    // Simular delay de carregamento
    loadingState.style.display = 'flex';
    cohostsList.innerHTML = '';
    emptyState.style.display = 'none';

    setTimeout(() => {
        filteredCohosts = cohosts.filter(cohost => {
            // Filtro de busca
            const searchTerm = currentFilters.search.toLowerCase();
            const matchesSearch =
                cohost.name.toLowerCase().includes(searchTerm) ||
                cohost.username.toLowerCase().includes(searchTerm) ||
                cohost.email.toLowerCase().includes(searchTerm);

            // Filtro de categoria
            const matchesCategory =
                !currentFilters.category || cohost.category === currentFilters.category;

            // Filtro de disponibilidade
            const matchesAvailability =
                !currentFilters.availability ||
                cohost.availability === currentFilters.availability;

            // Filtro de avaliação
            const matchesRating =
                !currentFilters.rating ||
                parseFloat(cohost.rating) >= parseFloat(currentFilters.rating);

            return matchesSearch && matchesCategory && matchesAvailability && matchesRating;
        });

        loadingState.style.display = 'none';
        renderCohosts();
        updateResultsCount();
    }, 500);
}

// Renderizar coanfitriões
function renderCohosts() {
    cohostsList.innerHTML = '';

    if (filteredCohosts.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }

    filteredCohosts.forEach(cohost => {
        const card = createCohostCard(cohost);
        cohostsList.appendChild(card);
    });
}

// Criar card de coanfitrião
function createCohostCard(cohost) {
    const card = document.createElement('div');
    card.className = 'cohost-card';
    card.innerHTML = `
        <img src="${cohost.avatar}" alt="${cohost.name}" class="cohost-avatar">
        <div class="cohost-info">
            <div class="cohost-header">
                <h3 class="cohost-name">${cohost.name}</h3>
                <p class="cohost-username">${cohost.username}</p>
            </div>
            <p class="cohost-bio">${cohost.bio}</p>
            <div class="cohost-rating">
                <div class="stars">
                    ${createStars(cohost.rating)}
                </div>
                <span class="rating-value">${cohost.rating.toFixed(1)} (${cohost.reviews} avaliações)</span>
            </div>
        </div>
        <div class="cohost-actions">
            <button class="btn-profile" onclick="openProfileModal(${cohost.id})">
                <i class="fas fa-user"></i>
                Ver Perfil
            </button>
            <button class="btn-invite" onclick="openInviteModal(${cohost.id})">
                <i class="fas fa-handshake"></i>
                Convidar
            </button>
        </div>
    `;
    return card;
}

// Criar estrelas de rating
function createStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Atualizar contagem de resultados
function updateResultsCount() {
    if (filteredCohosts.length === 0) {
        resultsCount.textContent = 'Nenhum coanfitrião encontrado';
    } else if (filteredCohosts.length === 1) {
        resultsCount.textContent = '1 coanfitrião encontrado';
    } else {
        resultsCount.textContent = `${filteredCohosts.length} coanfitriões encontrados`;
    }
}

// Modal de Perfil
function openProfileModal(cohostId) {
    const cohost = cohosts.find(c => c.id === cohostId);
    if (!cohost) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="profile-modal-header">
            <img src="${cohost.avatar}" alt="${cohost.name}" class="profile-avatar-large">
            <h2>${cohost.name}</h2>
            <p>${cohost.username}</p>
            <div class="cohost-rating">
                <div class="stars">
                    ${createStars(cohost.rating)}
                </div>
                <span class="rating-value">${cohost.rating.toFixed(1)}</span>
            </div>
        </div>

        <div class="profile-details">
            <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${cohost.email}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Bio:</span>
                <span class="detail-value">${cohost.bio}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Descrição:</span>
                <span class="detail-value">${cohost.description}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Avaliações:</span>
                <span class="detail-value">${cohost.reviews} clientes satisfeitos</span>
            </div>
        </div>

        <div class="modal-actions">
            <button class="btn btn-outline" onclick="closeProfileModal()">Fechar</button>
            <button class="btn" onclick="openInviteModal(${cohost.id})">
                <i class="fas fa-handshake"></i>
                Convidar como Coanfitrião
            </button>
        </div>
    `;

    profileModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeProfileModal() {
    profileModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Modal de Convite
function openInviteModal(cohostId) {
    const cohost = cohosts.find(c => c.id === cohostId);
    if (!cohost) return;

    closeProfileModal();

    document.getElementById('inviteUserId').value = cohostId;
    document.getElementById('inviteMessage').value = '';
    document.getElementById('inviteMessage').placeholder = `Descreva por que gostaria de trabalhar com ${cohost.name}...`;

    // Carregar imóveis do usuário (simulado)
    loadUserProperties();

    inviteModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeInviteModalFunc() {
    inviteModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function loadUserProperties() {
    const propertySelect = document.getElementById('propertySelect');
    // Dados simulados de imóveis do usuário
    const userProperties = [
        { id: 1, title: 'Apartamento - Av. Paulista' },
        { id: 2, title: 'Casa - Jardins' },
        { id: 3, title: 'Sobrado - Vila Mariana' }
    ];

    propertySelect.innerHTML = '<option value="">Sem imóvel específico</option>';
    userProperties.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop.id;
        option.textContent = prop.title;
        propertySelect.appendChild(option);
    });
}

function handleInviteSubmit(e) {
    e.preventDefault();

    const cohostId = document.getElementById('inviteUserId').value;
    const message = document.getElementById('inviteMessage').value;
    const propertyId = document.getElementById('propertySelect').value;
    const cohost = cohosts.find(c => c.id == cohostId);

    console.log('Convite enviado:', {
        cohostId,
        cohostName: cohost.name,
        message,
        propertyId: propertyId || 'Nenhuma'
    });

    // Mostrar mensagem de sucesso
    showSuccessMessage('Convite enviado com sucesso!');

    // Fechar modal
    setTimeout(() => {
        closeInviteModalFunc();
    }, 1500);
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success);
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Inicializar página
function init() {
    // Simular carregamento inicial
    loadingState.style.display = 'flex';
    cohostsList.innerHTML = '';

    setTimeout(() => {
        loadingState.style.display = 'none';
        renderCohosts();
        updateResultsCount();
    }, 1000);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
