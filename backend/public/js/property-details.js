// property-details.js — Lógica da página de detalhes do imóvel

// Utilities
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function parsePrice(priceStr) {
    return parseInt(priceStr.replace(/[^0-9]/g, ''));
}

// DOM Elements
const mainImage = document.getElementById('mainImage');
const galleryThumbnails = document.getElementById('galleryThumbnails');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const fullscreenModal = document.getElementById('fullscreenModal');
const fullscreenImage = document.getElementById('fullscreenImage');
const closeFullscreen = document.getElementById('closeFullscreen');
const fullscreenPrevBtn = document.getElementById('fullscreenPrevBtn');
const fullscreenNextBtn = document.getElementById('fullscreenNextBtn');
const currentImageIndex = document.getElementById('currentImageIndex');
const totalImageCount = document.getElementById('totalImageCount');
const fullscreenCurrentIndex = document.getElementById('fullscreenCurrentIndex');
const fullscreenTotalCount = document.getElementById('fullscreenTotalCount');
const favoriteBtn = document.getElementById('favoriteBtn');
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');
const contactModal = document.getElementById('contactModal');
const closeContactModal = document.getElementById('closeContactModal');
const contactForm = document.getElementById('contactForm');
const rentBtn = document.getElementById('rentBtn');
const contactHostBtn = document.getElementById('contactHostBtn');
const sidebarRentBtn = document.getElementById('sidebarRentBtn');
const sidebarContactBtn = document.getElementById('sidebarContactBtn');
const skeletonMain = document.getElementById('skeletonMain');

// Gallery state
let currentIndex = 0;
let galleryImages = [];
let currentProperty = null;

// Initialize
function clearLocalData() {
    ['favorites', 'currentUser', 'hostSignupFormData', 'vendor_profile_payments', 'reservas', 'property_reviews'].forEach(key => {
        localStorage.removeItem(key);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    clearLocalData();
    await loadProperty();
    await setupEventListeners();
});

// Load property data from URL or main.js
async function loadProperty() {
    const propertyId = parseInt(getQueryParam('id')) || 1;
    let property = null;

    if (typeof apiGetProperty === 'function') {
        try {
            const data = await apiGetProperty(propertyId);
            if (data && data.id) {
                property = normalizeProperty(data);
                currentProperty = property;
                renderProperty(property);
                return;
            }
        } catch (error) {
            console.warn('Erro ao carregar imóvel da API:', error);
        }
    }

    // Get property from main.js properties array
    if (typeof properties !== 'undefined' && properties.length > 0) {
        property = properties.find(p => p.id === propertyId);
        if (property) {
            currentProperty = property;
            renderProperty(property);
            return;
        }
    }

    // Fallback
    showSkeletonLoading();
}

// Render property details
function renderProperty(property) {
    currentProperty = property;
    
    // Images
    galleryImages = property.images || [];
    totalImageCount.textContent = galleryImages.length;
    fullscreenTotalCount.textContent = galleryImages.length;
    
    if (galleryImages.length > 0) {
        loadImage(0);
    }
    
    renderThumbnails();
    
    // Title and location
    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('locationText').textContent = property.location;
    document.getElementById('propertyDescription').textContent = property.description;
    document.getElementById('sidebarTitle').textContent = property.title;
    
    // Price
    const price = parsePrice(property.price);
    document.getElementById('propertyPrice').textContent = formatCurrency(price);
    document.getElementById('sidebarNightly').textContent = formatCurrency(price);
    document.getElementById('monthlyFee').textContent = formatCurrency(price);
    
    // Features
    renderFeatures(property.features);
    
    // Seller info
    if (property.seller) {
        renderSeller(property.seller);
    }
    
    // Set map address
    document.getElementById('mapAddressText').textContent = property.location;
    
    // Parse features for quick summary
    parseAndDisplayFeatures(property.features);
    
    hideSkeletonLoading();
}

// Load image with lazy loading
function loadImage(index) {
    if (index < 0 || index >= galleryImages.length) return;
    
    currentIndex = index;
    const imgUrl = galleryImages[index];
    
    showSkeletonLoading();
    
    const img = new Image();
    img.onload = () => {
        mainImage.src = imgUrl;
        mainImage.classList.add('loaded');
        updateCounters();
        hideSkeletonLoading();
    };
    img.onerror = () => {
        mainImage.src = 'https://via.placeholder.com/1000x600?text=Erro+ao+carregar';
        hideSkeletonLoading();
    };
    img.src = imgUrl;
    
    // Update fullscreen image
    fullscreenImage.src = imgUrl;
    fullscreenCurrentIndex.textContent = index + 1;
}

// Render thumbnails
function renderThumbnails() {
    galleryThumbnails.innerHTML = '';
    
    galleryImages.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = `Foto ${index + 1}`;
        
        thumbnail.appendChild(imgElement);
        thumbnail.addEventListener('click', () => {
            loadImage(index);
            updateActiveThumbnail();
        });
        
        galleryThumbnails.appendChild(thumbnail);
    });
}

// Update active thumbnail
function updateActiveThumbnail() {
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
    });
}

// Update counters
function updateCounters() {
    currentImageIndex.textContent = currentIndex + 1;
    fullscreenCurrentIndex.textContent = currentIndex + 1;
}

// Skeleton loading
function showSkeletonLoading() {
    skeletonMain.classList.remove('hidden');
}

function hideSkeletonLoading() {
    skeletonMain.classList.add('hidden');
}

// Render features
function renderFeatures(features) {
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = '';
    
    if (!features || features.length === 0) return;
    
    features.forEach(feature => {
        const badge = document.createElement('div');
        badge.className = 'feature-badge';
        badge.innerHTML = `<i class="fas fa-check-circle"></i> ${feature}`;
        featuresList.appendChild(badge);
    });
}

// Parse features and display quick summary
function parseAndDisplayFeatures(features) {
    let bedrooms = 0, suites = 0, bathrooms = 0, parking = 0, sqm = 0;
    
    if (features) {
        features.forEach(feature => {
            const lower = feature.toLowerCase();
            
            if (lower.includes('suíte')) {
                const match = feature.match(/\d+/);
                if (match) suites = parseInt(match[0]);
            } else if (lower.includes('quarto') || lower.includes('dormitório')) {
                const match = feature.match(/\d+/);
                if (match) bedrooms = parseInt(match[0]);
            } else if (lower.includes('banheiro')) {
                const match = feature.match(/\d+/);
                if (match) bathrooms = parseInt(match[0]);
            } else if (lower.includes('vaga') || lower.includes('garagem')) {
                const match = feature.match(/\d+/);
                if (match) parking = parseInt(match[0]);
            } else if (lower.includes('m²')) {
                const match = feature.match(/(\d+)\s*m²/);
                if (match) sqm = parseInt(match[1]);
            }
        });
    }
    
    document.getElementById('bedroomCount').textContent = bedrooms || '—';
    document.getElementById('suitesCount').textContent = suites || '—';
    document.getElementById('bathroomCount').textContent = bathrooms || '—';
    document.getElementById('parkingCount').textContent = parking || '—';
    document.getElementById('propertySize').textContent = sqm > 0 ? `${sqm} m²` : '—';
}

// Render seller info
function renderSeller(seller) {
    document.getElementById('hostName').textContent = seller.name;
    document.getElementById('hostType').textContent = seller.type;
    document.getElementById('hostAvatar').src = seller.avatar;
    
    // Rating stars
    const starsContainer = document.getElementById('hostRating');
    starsContainer.innerHTML = '';
    const rating = Math.round(seller.rating || 4.8);
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerHTML = i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        starsContainer.appendChild(star);
    }
    
    document.getElementById('ratingText').textContent = `${seller.rating || 4.8} (Excelente)`;
}

// Setup event listeners
async function setupEventListeners() {
    // Carousel navigation
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        loadImage(currentIndex);
        updateActiveThumbnail();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        loadImage(currentIndex);
        updateActiveThumbnail();
    });
    
    // Fullscreen carousel
    fullscreenPrevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        loadImage(currentIndex);
    });
    
    fullscreenNextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        loadImage(currentIndex);
    });
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        fullscreenModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeFullscreen.addEventListener('click', () => {
        fullscreenModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close fullscreen on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenModal.classList.contains('active')) {
            fullscreenModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Keyboard navigation in fullscreen
    document.addEventListener('keydown', (e) => {
        if (!fullscreenModal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            loadImage(currentIndex);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            loadImage(currentIndex);
        }
    });
    
    // Favorite
    favoriteBtn.addEventListener('click', async () => {
        const icon = favoriteBtn.querySelector('i');
        const propertyId = currentProperty?.id;

        if (!propertyId) {
            return;
        }

        if (favoriteBtn.classList.contains('active')) {
            const removed = await removeFavorite(propertyId);
            if (removed) {
                favoriteBtn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
                showNotification('Removido dos favoritos');
            }
        } else {
            const added = await addFavorite(propertyId);
            if (added) {
                favoriteBtn.classList.add('active');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
                showNotification('Adicionado aos favoritos!');
            }
        }
    });
    
    // Check if already favorited
    const initialFavorite = await loadPropertyFavoriteState(currentProperty?.id);
    if (initialFavorite) {
        favoriteBtn.classList.add('active');
        const icon = favoriteBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    }
    
    // Share
    shareBtn.addEventListener('click', () => {
        shareModal.classList.add('active');
    });
    
    closeShareModal.addEventListener('click', () => {
        shareModal.classList.remove('active');
    });
    
    // Share options
    document.getElementById('shareWhatsapp').addEventListener('click', () => {
        const message = `Confira este imóvel: ${currentProperty.title} - ${currentProperty.location}. ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    });
    
    document.getElementById('shareEmail').addEventListener('click', () => {
        const subject = `Compartilhando: ${currentProperty.title}`;
        const body = `Confira este imóvel: ${currentProperty.location}\n\n${window.location.href}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    
    document.getElementById('shareCopy').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copiado para a área de transferência!');
            shareModal.classList.remove('active');
        });
    });
    
    document.getElementById('shareFacebook').addEventListener('click', () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    });
    
    // Contact modals
    contactHostBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    sidebarContactBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeContactModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const message = document.getElementById('contactMessage').value;
        
        // Simulate sending
        console.log('Mensagem:', { name, email, phone, message });
        
        showNotification('Mensagem enviada com sucesso!');
        contactForm.reset();
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Rent buttons
    rentBtn.addEventListener('click', () => {
        if (currentProperty) {
            const params = new URLSearchParams({
                propertyId: currentProperty.id,
                title: currentProperty.title,
                nightly: parsePrice(currentProperty.price),
                img1: currentProperty.images[0] || '',
                img2: currentProperty.images[1] || '',
                img3: currentProperty.images[2] || '',
                sellerAvatar: currentProperty.seller?.avatar || '',
                sellerPhone: currentProperty.seller?.phone || ''
            });
            window.location.href = `reservar.html?${params.toString()}`;
        }
    });
    
    sidebarRentBtn.addEventListener('click', () => {
        rentBtn.click();
    });
    
    // Close share modal on outside click
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.remove('active');
        }
    });
    
    // Close contact modal on outside click
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

let currentPropertyFavoriteId = null;

async function loadPropertyFavoriteState(propertyId) {
    if (!getAuthToken()) {
        currentPropertyFavoriteId = null;
        return false;
    }

    if (typeof apiGetFavorites !== 'function') {
        currentPropertyFavoriteId = null;
        return false;
    }

    try {
        const response = await apiGetFavorites();
        const favorites = Array.isArray(response) ? response : response?.data || [];
        const favorite = favorites.find(item => Number(item.property?.id) === Number(propertyId));
        currentPropertyFavoriteId = favorite?.id || null;
        return Boolean(currentPropertyFavoriteId);
    } catch (error) {
        console.warn('Erro ao carregar estado de favorito:', error);
        currentPropertyFavoriteId = null;
        return false;
    }
}

async function addFavorite(propertyId) {
    if (!getAuthToken()) {
        alert('Faça login para favoritar este imóvel.');
        return false;
    }

    try {
        const response = await apiAddFavorite(propertyId);
        const favorite = response?.data || response;
        currentPropertyFavoriteId = favorite?.id || currentPropertyFavoriteId;
        return true;
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        alert('Não foi possível adicionar aos favoritos.');
        return false;
    }
}

async function removeFavorite(propertyId) {
    if (!getAuthToken()) {
        alert('Faça login para remover favoritos.');
        return false;
    }

    if (!currentPropertyFavoriteId) {
        const favorited = await loadPropertyFavoriteState(propertyId);
        if (!favorited) {
            return false;
        }
    }

    try {
        await apiRemoveFavorite(currentPropertyFavoriteId);
        currentPropertyFavoriteId = null;
        return true;
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        alert('Não foi possível remover dos favoritos.');
        return false;
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 3000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    if (e.key === 'ArrowLeft' && !fullscreenModal.classList.contains('active')) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && !fullscreenModal.classList.contains('active')) {
        nextBtn.click();
    }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        // Swipe left - next image
        nextBtn.click();
    } else if (touchEndX - touchStartX > 50) {
        // Swipe right - prev image
        prevBtn.click();
    }
}

// ===== AVALIAÇÕES / REVIEWS =====

// DOM Elements para Reviews
const reviewForm = document.getElementById('reviewForm');
const starsInput = document.getElementById('starsInput');
const starButtons = starsInput?.querySelectorAll('.star-btn') || [];
const ratingValue = document.getElementById('ratingValue');
const starsCount = document.getElementById('starsCount');
const reviewText = document.getElementById('reviewText');
const charCount = document.getElementById('charCount');
const reviewsList = document.getElementById('reviewsList');
let currentRating = 0;

function setupReviewForm() {
    if (!reviewForm) {
        return;
    }

    starButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const rating = parseInt(btn.dataset.rating);
            currentRating = rating;
            if (ratingValue) ratingValue.value = rating;
            updateStarUI();
        });

        btn.addEventListener('mouseover', () => {
            const hoverRating = parseInt(btn.dataset.rating);
            starButtons.forEach((b, idx) => {
                if (idx < hoverRating) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
        });
    });

    starsInput?.addEventListener('mouseleave', updateStarUI);

    reviewText?.addEventListener('input', (e) => {
        const length = e.target.value.length;
        if (charCount) charCount.textContent = Math.min(length, 500);
        if (length >= 500) {
            e.target.value = e.target.value.substring(0, 500);
        }
    });

    reviewForm.addEventListener('submit', handleReviewSubmit);

    loadReviews();
}

function updateStarUI() {
    starButtons.forEach((btn, idx) => {
        const icon = btn.querySelector('i');
        if (idx < currentRating) {
            btn.classList.add('active');
            icon?.classList.remove('far');
            icon?.classList.add('fas');
        } else {
            btn.classList.remove('active');
            icon?.classList.remove('fas');
            icon?.classList.add('far');
        }
    });

    if (starsCount) {
        starsCount.textContent = currentRating === 0 ? 'Nenhuma classificação' : `${currentRating} ${currentRating === 1 ? 'estrela' : 'estrelas'}`;
    }
}

function handleReviewSubmit(e) {
    e.preventDefault();

    if (!getAuthToken()) {
        alert('Faça login para enviar avaliações.');
        return;
    }

    alert('Avaliações de imóveis são registradas pelo backend após reservas concluídas. Consulte uma reserva para enviar sua avaliação.');
}

async function loadReviews() {
    if (!reviewsList) return;

    const propertyId = getQueryParam('id');
    if (!propertyId) {
        reviewsList.innerHTML = `
            <div class="reviews-placeholder">
                <p>Não foi possível carregar as avaliações deste imóvel.</p>
            </div>
        `;
        return;
    }

    try {
        const response = await apiFetch(`/reviews?property_id=${encodeURIComponent(propertyId)}`);
        const reviews = Array.isArray(response) ? response : response?.data || [];

        if (!reviews.length) {
            reviewsList.innerHTML = `
                <div class="reviews-placeholder">
                    <p>Nenhuma avaliação ainda. Faça login e reserve para deixar a primeira avaliação.</p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">
                        <span class="review-name">${escapeHtml(review.reviewer?.name || review.name || 'Usuário')}</span>
                        <span class="review-date">${new Date(review.published_at || review.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="review-rating">
                        ${Array.from({ length: 5 }, (_, i) => `
                            <i class="fa${i < review.rating ? 's' : 'r'} fa-star"></i>
                        `).join('')}
                    </div>
                </div>
                <p class="review-text">${escapeHtml(review.comment || review.text || '')}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        reviewsList.innerHTML = `
            <div class="reviews-placeholder">
                <p>Erro ao carregar avaliações do backend.</p>
            </div>
        `;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add keyframe animations if not already in CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar formulário de reviews quando página carregar
document.addEventListener('DOMContentLoaded', () => {
    setupReviewForm();
});
