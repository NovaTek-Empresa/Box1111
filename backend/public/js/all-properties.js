/*
 * ===============================================
 * ALL PROPERTIES PAGE - JavaScript
 * ===============================================
 */

// ============= Data Structure =============
let allPropertiesData = [];
const favoritesMap = new Map();

// ============= Utilities =============
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function getPropertyPriceValue(property) {
    if (typeof property.nightlyPrice === 'number') {
        return property.nightlyPrice;
    }
    if (typeof property.price === 'number') {
        return property.price;
    }
    if (typeof property.price === 'string') {
        return parseInt(property.price.replace(/[^0-9]/g, '')) || 0;
    }
    return 0;
}

function getFilterValues() {
    const types = Array.from(document.querySelectorAll('.property-type-filter:checked'))
        .map(input => input.value);
    const bedrooms = Array.from(document.querySelectorAll('.bedrooms-filter:checked'))
        .map(input => parseInt(input.value));
    
    // Ler valores de preço de forma robusta
    const slider = document.getElementById('priceSlider');
    let priceMax = slider ? parseInt(slider.value) : NaN;
    let priceMin = parseInt(document.getElementById('priceMin')?.value);
    if (isNaN(priceMin)) priceMin = 0;
    if (isNaN(priceMax)) {
        // tentar pelo input max e fallback genérico
        const rawMax = document.getElementById('priceMax')?.value;
        priceMax = rawMax ? parseInt(rawMax) : 10000000;
        if (isNaN(priceMax)) priceMax = 10000000;
    }

    const location = (document.getElementById('locationFilter')?.value || '').toLowerCase().trim();

    return { types, bedrooms, priceMin, priceMax, location };
}



async function loadFavoritesMap() {
    favoritesMap.clear();

    if (typeof apiGetFavorites !== 'function' || !getAuthToken()) {
        return;
    }

    try {
        const response = await apiGetFavorites();
        const favorites = Array.isArray(response) ? response : response?.data || [];
        favorites.forEach((favorite) => {
            if (favorite?.property?.id) {
                favoritesMap.set(Number(favorite.property.id), favorite.id);
            }
        });
    } catch (error) {
        console.warn('Não foi possível carregar favoritos do backend:', error);
    }
}

function isFavorite(propertyId) {
    return favoritesMap.has(Number(propertyId));
}

async function toggleFavorite(propertyId) {
    if (!getAuthToken()) {
        alert('Faça login para usar favoritos.');
        return;
    }

    const existingFavoriteId = favoritesMap.get(Number(propertyId));

    if (existingFavoriteId) {
        try {
            await apiRemoveFavorite(existingFavoriteId);
            favoritesMap.delete(Number(propertyId));
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
            alert('Não foi possível remover o favorito. Tente novamente.');
        }
    } else {
        try {
            const response = await apiAddFavorite(propertyId);
            const favorite = response?.data || response;
            if (favorite?.id && favorite?.property?.id) {
                favoritesMap.set(Number(favorite.property.id), favorite.id);
            } else if (favorite?.id) {
                favoritesMap.set(Number(propertyId), favorite.id);
            }
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error);
            alert('Não foi possível adicionar aos favoritos. Faça login e tente novamente.');
        }
    }
}

function applyFilters() {
    const { types, bedrooms, priceMin, priceMax, location } = getFilterValues();
    
    let filtered = allPropertiesData.filter(p => {
        // Type filter (show all if none selected)
        if (types.length > 0 && !types.includes(p.type)) return false;
        
        // Price filter
        const priceValue = getPropertyPriceValue(p);
        if (priceValue < priceMin || priceValue > priceMax) return false;
        
        // Bedrooms filter (show all if none selected)
        if (bedrooms.length > 0 && !bedrooms.some(b => p.bedrooms >= b)) return false;
        
        // Location filter
        if (location && !p.neighborhood.toLowerCase().includes(location) && 
            !p.location.toLowerCase().includes(location)) return false;
        
        return true;
    });
    
    // Se nenhum filtro está ativo e o resultado ficou vazio, usar fallback para mostrar todos os imóveis
    const noFiltersActive = types.length === 0 && bedrooms.length === 0 && !location &&
        (document.getElementById('priceMin')?.value === '' || document.getElementById('priceMin') == null) &&
        (document.getElementById('priceMax')?.value === '' || document.getElementById('priceMax') == null || document.getElementById('priceSlider') == null);

    if (filtered.length === 0 && noFiltersActive && allPropertiesData.length > 0) {
        filtered = allPropertiesData.slice();
    }

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
            list.sort((a, b) => getPropertyPriceValue(a) - getPropertyPriceValue(b));
            break;
        case 'price-high':
            list.sort((a, b) => getPropertyPriceValue(b) - getPropertyPriceValue(a));
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
    const priceValue = getPropertyPriceValue(property);
    const priceText = property.isPriceMonthly 
        ? `R$ ${priceValue.toLocaleString('pt-BR')}`
        : (typeof property.price === 'string' ? property.price : formatCurrency(priceValue));
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
                <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
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
        favoriteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await toggleFavorite(property.id);
            const icon = favoriteBtn.querySelector('i');

            if (isFavorite(property.id)) {
                favoriteBtn.classList.add('active');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            } else {
                favoriteBtn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            }
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
        // 'input' atualiza enquanto arrasta, 'change' atualiza ao soltar
        priceSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            
            // Atualiza o texto na tela (R$ 10.000.000)
            if (priceMaxDisplay) {
                priceMaxDisplay.textContent = value.toLocaleString('pt-BR');
            }
            
            // Chama a função que filtra a lista
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
            // copy values from mobile modal back to main filters
            syncMobileToMain();
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
        // populate mobile filters with current desktop filters
        populateMobileFilters();
        syncMainToMobile();
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

// ============= Accordions & Mobile Sync =============
function setupAccordions() {
    document.querySelectorAll('.filter-card').forEach(card => {
        const header = card.querySelector('.filter-card-header');
        if (header) {
            header.addEventListener('click', () => {
                card.classList.toggle('collapsed');
            });
        }
    });
}

function populateMobileFilters() {
    const mobileContent = document.getElementById('mobileFiltersContent');
    const desktopContent = document.querySelector('.filters-content');
    if (mobileContent && desktopContent) {
        mobileContent.innerHTML = desktopContent.innerHTML;
    }
}

function syncMainToMobile() {
    const mobileContent = document.getElementById('mobileFiltersContent');
    if (!mobileContent) return;

    // Sync inputs: checkboxes and text/number inputs
    const mainInputs = document.querySelectorAll('.filters-content input');
    mainInputs.forEach(input => {
        const selector = getSelectorForInput(input);
        if (!selector) return;
        const mobileInput = mobileContent.querySelector(selector);
        if (!mobileInput) return;
        if (input.type === 'checkbox') mobileInput.checked = input.checked;
        else mobileInput.value = input.value;
    });
}

function syncMobileToMain() {
    const mobileContent = document.getElementById('mobileFiltersContent');
    if (!mobileContent) return;

    const mobileInputs = mobileContent.querySelectorAll('input');
    mobileInputs.forEach(input => {
        const selector = getSelectorForInput(input);
        if (!selector) return;
        const mainInput = document.querySelector('.filters-content ' + selector);
        if (!mainInput) return;
        if (input.type === 'checkbox') mainInput.checked = input.checked;
        else mainInput.value = input.value;
    });
}

function getSelectorForInput(input) {
    if (!input) return null;
    if (input.id) return `#${input.id}`;
    if (input.name) return `[name="${input.name}"]`;
    if (input.type === 'checkbox' && input.className) {
        // try by class
        const cls = input.className.split(' ').join('.');
        return `.${cls}`;
    }
    return null;
}

async function loadAllPropertiesFromApi() {
    if (typeof apiGetProperties !== 'function') {
        return;
    }

    try {
        const response = await apiGetProperties();
        if (response?.data?.length) {
            allPropertiesData = response.data.map(normalizeProperty);
        }
    } catch (error) {
        console.warn('Não foi possível carregar propriedades da API:', error);
    }
}

// ============= Initialization =============
function clearLocalData() {
    ['currentUser', 'hostSignupFormData', 'vendor_profile_payments', 'reservas', 'property_reviews'].forEach(key => {
        localStorage.removeItem(key);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllPropertiesFromApi();
    await loadFavoritesMap();
    clearLocalData();

    setupFilterControls();
    setupSortControl();
    setupApplyClearButtons();
    setupMobileFilters();
    setupAccordions();

    applyFilters();
});
