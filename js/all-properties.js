/**
 * ===============================================
 * ALL PROPERTIES PAGE - JavaScript
 * ===============================================
 */

// ============= Data Structure =============
const properties = [
    { 
        id: 1, 
        title: "Casa Alto Padrão — Condomínio Fechado", 
        price: 1250000, 
        location: "Jardins, São Paulo - SP",
        neighborhood: "Jardins",
        type: "casa", 
        bathrooms: 5,
        features: ["5 suítes", "Piscina", "Área gourmet", "5 vagas", "980 m²", "Condomínio fechado"], 
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop"],
        bedrooms: 5,
        parking: 5,
        size: 980,
        badge: "novo",
        seller: { rating: 4.9 },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    { 
        id: 2, 
        title: "Sobrado Moderno — Bairro Tranquilo", 
        price: 790000, 
        location: "Vila Mariana, São Paulo - SP",
        neighborhood: "Vila Mariana",
        type: "casa", 
        bathrooms: 2,
        features: ["3 dormitórios", "2 banheiros", "2 vagas", "180 m²", "Quintal", "Reformado"],
        images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80&auto=format&fit=crop"],
        bedrooms: 3,
        parking: 2,
        size: 180,
        badge: "destaque",
        seller: { rating: 4.7 },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    { 
        id: 3, 
        title: "Apartamento de 2 Quartos no Centro", 
        price: 420000, 
        location: "Centro, São Paulo - SP",
        neighborhood: "Centro",
        type: "apartamento", 
        bathrooms: 2,
        features: ["2 quartos", "2 banheiros", "1 vaga", "75 m²", "Centro", "Portaria 24h"],
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80&auto=format&fit=crop"],
        bedrooms: 2,
        parking: 1,
        size: 75,
        badge: null,
        seller: { rating: 4.9 },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    { 
        id: 4, 
        title: "Casa com Piscina e Churrasqueira", 
        price: 3500, 
        location: "Morumbi, São Paulo - SP",
        neighborhood: "Morumbi",
        type: "casa",
        isPriceMonthly: true,
        bathrooms: 3,
        features: ["4 quartos", "3 banheiros", "Piscina", "Churrasqueira", "220 m²", "Condomínio"],
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop"],
        bedrooms: 4,
        parking: 2,
        size: 220,
        badge: "novo",
        seller: { rating: 4.8 },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    { 
        id: 5, 
        title: "Loja Comercial em Localização Privilegiada", 
        price: 850000, 
        location: "Moema, São Paulo - SP",
        neighborhood: "Moema",
        type: "comercial", 
        bathrooms: 2,
        features: ["120 m²", "2 banheiros", "Reformada", "Ponto comercial", "Alto fluxo"],
        images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80&auto=format&fit=crop"],
        bedrooms: 0,
        parking: 1,
        size: 120,
        badge: null,
        seller: { rating: 4.6 },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    { 
        id: 6, 
        title: "Terreno para Construção — 500 m²", 
        price: 350000, 
        location: "Interlagos, São Paulo - SP",
        neighborhood: "Interlagos",
        type: "terreno", 
        bathrooms: 0,
        features: ["500 m²", "Plano", "Regular", "Boa localização", "Infraestrutura"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop"],
        bedrooms: 0,
        parking: 0,
        size: 500,
        badge: "destaque",
        seller: { rating: 4.5 },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
];

// ============= Utilities =============
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function getFilterValues() {
    const types = Array.from(document.querySelectorAll('.property-type-filter:checked'))
        .map(input => input.value);
    const bedrooms = Array.from(document.querySelectorAll('.bedrooms-filter:checked'))
        .map(input => parseInt(input.value));
    const priceMin = parseInt(document.getElementById('priceMin')?.value || 0);
    const priceMax = parseInt(document.getElementById('priceMax')?.value || 10000000);
    const location = document.getElementById('locationFilter')?.value.toLowerCase().trim() || '';
    
    return { types, bedrooms, priceMin, priceMax, location };
}

function applyFilters() {
    const { types, bedrooms, priceMin, priceMax, location } = getFilterValues();
    
    let filtered = properties.filter(p => {
        // Type filter (show all if none selected)
        if (types.length > 0 && !types.includes(p.type)) return false;
        
        // Price filter
        if (p.price < priceMin || p.price > priceMax) return false;
        
        // Bedrooms filter (show all if none selected)
        if (bedrooms.length > 0 && !bedrooms.some(b => p.bedrooms >= b)) return false;
        
        // Location filter
        if (location && !p.neighborhood.toLowerCase().includes(location) && 
            !p.location.toLowerCase().includes(location)) return false;
        
        return true;
    });
    
    updateResultsCount(filtered.length);
    sortProperties(filtered);
    renderProperties(filtered);
    updateEmptyState(filtered.length === 0);
}

function sortProperties(list) {
    const sortValue = document.getElementById('sortSelect')?.value || 'recent';
    
    switch (sortValue) {
        case 'recent':
            list.sort((a, b) => b.createdAt - a.createdAt);
            break;
        case 'price-low':
            list.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            list.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            list.sort((a, b) => b.seller.rating - a.seller.rating);
            break;
    }
    
    return list;
}

function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = count === 1 
            ? '1 imóvel encontrado' 
            : `${count} imóveis encontrados`;
    }
}

function updateEmptyState(isEmpty) {
    const emptyState = document.getElementById('emptyState');
    const grid = document.getElementById('allPropertiesGrid');
    
    if (isEmpty) {
        if (emptyState) emptyState.style.display = 'flex';
        if (grid) grid.style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }
}

function renderProperties(list) {
    const grid = document.getElementById('allPropertiesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    list.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    // Load image with lazy loading
    const imgElement = document.createElement('img');
    imgElement.className = 'card-image lazy';
    imgElement.alt = property.title;
    imgElement.src = property.images[0];
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        imgElement.dataset.src = property.images[0];
        imgElement.src = '';
        observer.observe(imgElement);
    } else {
        imgElement.classList.remove('lazy');
        imgElement.classList.add('loaded');
    }
    
    // Badge
    let badgeHTML = '';
    if (property.badge) {
        const badgeText = property.badge === 'novo' ? 'Novo' : 
                         property.badge === 'destaque' ? 'Destaque' : 
                         property.badge === 'alugado' ? 'Alugado' : '';
        badgeHTML = `<div class="card-badge ${property.badge}">${badgeText}</div>`;
    }
    
    // Favorite button
    const isFavorited = isFavorite(property.id);
    
    // Price display
    const priceText = property.isPriceMonthly 
        ? `R$ ${property.price.toLocaleString('pt-BR')}`
        : formatCurrency(property.price);
    const periodText = property.isPriceMonthly ? '/mês' : '';
    
    // Features display (4-6 icons)
    let featuresHTML = '';
    if (property.bedrooms > 0) {
        featuresHTML += `
            <div class="feature-item">
                <i class="fas fa-bed"></i>
                <strong>${property.bedrooms}</strong> <span>quartos</span>
            </div>
        `;
    }
    if (property.bathrooms > 0) {
        featuresHTML += `
            <div class="feature-item">
                <i class="fas fa-bath"></i>
                <strong>${property.bathrooms}</strong> <span>banheiros</span>
            </div>
        `;
    }
    if (property.parking > 0) {
        featuresHTML += `
            <div class="feature-item">
                <i class="fas fa-car"></i>
                <strong>${property.parking}</strong> <span>vagas</span>
            </div>
        `;
    }
    if (property.size > 0) {
        featuresHTML += `
            <div class="feature-item">
                <i class="fas fa-ruler-combined"></i>
                <strong>${property.size}</strong> <span>m²</span>
            </div>
        `;
    }
    
    const [neighborhood, city] = property.location.split(', ').slice(0, 2);
    
    card.innerHTML = `
        <div class="card-image-wrapper">
            ${badgeHTML}
            <button class="card-favorite ${isFavorited ? 'active' : ''}" data-id="${property.id}">
                <i class="fas fa-heart"></i>
            </button>
            <img class="card-image loaded" src="${property.images[0]}" alt="${property.title}">
        </div>
        <div class="card-content">
            <div class="card-price">
                ${priceText}<span class="card-price-period">${periodText}</span>
            </div>
            <h3 class="card-title">${property.title}</h3>
            <div class="card-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${neighborhood || city}</span>
            </div>
            <div class="card-features">
                ${featuresHTML}
            </div>
            <div class="card-cta">
                <button class="card-cta-btn" data-id="${property.id}">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `;
    
    // Event Listeners
    const favoriteBtn = card.querySelector('.card-favorite');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
            favoriteBtn.classList.toggle('active');
        });
    }
    
    const ctaBtn = card.querySelector('.card-cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `property-details.html?id=${property.id}`;
        });
    }
    
    card.addEventListener('click', () => {
        window.location.href = `property-details.html?id=${property.id}`;
    });
    
    return card;
}

// ============= Favorite System =============
function isFavorite(propertyId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(propertyId);
}

function toggleFavorite(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(propertyId)) {
        favorites = favorites.filter(id => id !== propertyId);
    } else {
        favorites.push(propertyId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ============= Filter Controls =============
function setupFilterControls() {
    // Type filters
    document.querySelectorAll('.property-type-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Bedrooms filters
    document.querySelectorAll('.bedrooms-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Price inputs
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceSlider = document.getElementById('priceSlider');
    const priceMinDisplay = document.getElementById('priceMinDisplay');
    const priceMaxDisplay = document.getElementById('priceMaxDisplay');
    
    if (priceMin) {
        priceMin.addEventListener('input', (e) => {
            const minVal = parseInt(e.target.value) || 0;
            if (priceMinDisplay) {
                priceMinDisplay.textContent = minVal.toLocaleString('pt-BR');
            }
            applyFilters();
        });
    }
    
    if (priceMax) {
        priceMax.addEventListener('input', (e) => {
            const maxVal = parseInt(e.target.value) || 10000000;
            if (priceMaxDisplay) {
                priceMaxDisplay.textContent = maxVal.toLocaleString('pt-BR');
            }
            if (priceSlider) {
                priceSlider.value = maxVal;
            }
            applyFilters();
        });
    }
    
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (priceMaxDisplay) {
                priceMaxDisplay.textContent = value.toLocaleString('pt-BR');
            }
            if (priceMax) priceMax.value = value;
            applyFilters();
        });
    }
    
    // Location filter
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('input', applyFilters);
    }
}

function setupSortControl() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

function setupApplyClearButtons() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');
    const mobileApplyBtn = document.getElementById('mobileApplyBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const clearEmptyBtn = document.getElementById('clearFiltersEmptyBtn');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            closeMobileFilters();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
    
    if (mobileApplyBtn) {
        mobileApplyBtn.addEventListener('click', () => {
            applyFilters();
            closeMobileFilters();
        });
    }
    
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileFilters);
    }
    
    if (clearEmptyBtn) {
        clearEmptyBtn.addEventListener('click', clearAllFilters);
    }
}

function clearAllFilters() {
    // Clear type filters
    document.querySelectorAll('.property-type-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear bedrooms filters
    document.querySelectorAll('.bedrooms-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear price inputs
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceSlider = document.getElementById('priceSlider');
    
    if (priceMin) priceMin.value = '';
    if (priceMax) priceMax.value = '';
    if (priceSlider) priceSlider.value = 10000000;
    
    // Reset display
    const priceMaxDisplay = document.getElementById('priceMaxDisplay');
    if (priceMaxDisplay) priceMaxDisplay.textContent = '10.000.000';
    
    // Clear location
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) locationFilter.value = '';
    
    applyFilters();
    closeMobileFilters();
}

// ============= Mobile Filters Modal =============
function setupMobileFilters() {
    const openBtn = document.getElementById('openFilters');
    const closeBtn = document.getElementById('closeFiltersModal');
    const backdrop = document.getElementById('filtersBackdrop');
    const modal = document.getElementById('filtersModal');
    
    if (openBtn) {
        openBtn.addEventListener('click', openMobileFilters);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileFilters);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeMobileFilters);
    }
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeMobileFilters();
        }
    });
}

function openMobileFilters() {
    const modal = document.getElementById('filtersModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileFilters() {
    const modal = document.getElementById('filtersModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============= Initialization =============
document.addEventListener('DOMContentLoaded', () => {
    // Initial render with skeleton loading
    setupFilterControls();
    setupSortControl();
    setupApplyClearButtons();
    setupMobileFilters();
    
    // Load initial data
    setTimeout(() => {
        applyFilters();
    }, 300);
});
