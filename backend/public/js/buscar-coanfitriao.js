const hostProfiles = [];
let currentProperties = [];

function parseProfileBio(profile) {
    if (!profile || !profile.bio) {
        return {};
    }

    if (typeof profile.bio === 'object') {
        return profile.bio;
    }

    try {
        return JSON.parse(profile.bio);
    } catch {
        return {};
    }
}

function formatAvailability(value) {
    if (!value) return 'Não informado';
    return value.replace('_', ' ');
}

function formatServices(services) {
    if (!services || !services.length) return 'Não informado';
    return services.join(' • ');
}

function profileRegion(profile) {
    const bio = parseProfileBio(profile);
    return bio.address?.region || profile.region || 'Não informado';
}

function renderCard(profile) {
    const bio = parseProfileBio(profile);
    const rating = profile.average_rating ?? 0;
    const hostName = profile.user?.name || 'Coanfitrião';
    const avatar = profile.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName)}&background=22c55e&color=fff`;
    const region = profileRegion(profile);
    const services = Array.isArray(bio.services) ? bio.services : [];
    const description = bio.experience
        ? `Experiência: ${bio.experience}. Serviços: ${services.join(', ')}`
        : 'Perfil disponível no backend.';

    return `
        <div class="cohost-card">
            <div class="cohost-card-header">
                <img src="${avatar}" alt="${hostName}" class="cohost-avatar">
                <div>
                    <h3>${hostName}</h3>
                    <p>${region}</p>
                </div>
                <div class="cohost-rating">${rating.toFixed(1)} ⭐</div>
            </div>
            <p class="cohost-description">${description}</p>
            <div class="cohost-details">
                <span>${formatAvailability(bio.availability)}</span>
                <span>${formatServices(services)}</span>
            </div>
            <div class="cohost-card-meta">
                <span>${profile.total_reservations ?? 0} reservas</span>
                <span>${profile.average_rating ? `${profile.average_rating.toFixed(1)} de avaliação` : 'Avaliação não disponível'}</span>
            </div>
            <div class="cohost-card-actions">
                <button class="btn btn-outline" data-action="view-profile" data-id="${profile.id}">Ver Perfil</button>
                <button class="btn" data-action="invite" data-id="${profile.id}">Convidar</button>
            </div>
        </div>
    `;
}

function setLoading(isLoading) {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');

    if (loadingState) {
        loadingState.style.display = isLoading ? 'flex' : 'none';
    }

    if (emptyState && isLoading) {
        emptyState.style.display = 'none';
    }
}

function showEmptyState(show) {
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');

    if (emptyState) {
        emptyState.style.display = show ? 'block' : 'none';
    }

    if (resultsCount) {
        resultsCount.textContent = show ? 'Nenhum coanfitrião encontrado' : `${hostProfiles.length} coanfitriões encontrados`;
    }
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} coanfitriões encontrados`;
    }
}

function renderProfiles(profiles) {
    const list = document.getElementById('cohostsList');
    if (!list) return;

    list.innerHTML = '';

    if (!profiles.length) {
        showEmptyState(true);
        updateResultsCount(0);
        return;
    }

    showEmptyState(false);
    updateResultsCount(profiles.length);

    profiles.forEach((profile) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderCard(profile);
        const card = wrapper.firstElementChild;

        card.querySelector('[data-action="view-profile"]').addEventListener('click', () => openProfileModal(profile));
        card.querySelector('[data-action="invite"]').addEventListener('click', () => openInviteModal(profile));

        list.appendChild(card);
    });
}

function normalize(value = '') {
    return value.toString().trim().toLowerCase();
}

function filterProfiles() {
    const query = normalize(document.getElementById('searchInput')?.value || '');
    const region = normalize(document.getElementById('regionFilter')?.value || '');
    const availability = normalize(document.getElementById('availabilityFilter')?.value || '');
    const rating = Number(document.getElementById('ratingFilter')?.value || 0);

    return hostProfiles.filter((profile) => {
        const bio = parseProfileBio(profile);
        const name = normalize(profile.user?.name || '');
        const email = normalize(profile.user?.email || '');
        const profileRegionValue = normalize(profileRegion(profile));
        const profileAvailability = normalize(bio.availability || '');
        const profileRating = Number(profile.average_rating || 0);

        const matchesSearch = !query || name.includes(query) || email.includes(query) || JSON.stringify(profile).toLowerCase().includes(query);
        const matchesRegion = !region || profileRegionValue.includes(region);
        const matchesAvailability = !availability || profileAvailability.includes(availability);
        const matchesRating = !rating || profileRating >= rating;

        return matchesSearch && matchesRegion && matchesAvailability && matchesRating;
    });
}

async function loadHostProfiles() {
    setLoading(true);

    try {
        const result = await apiGetHostProfiles();
        const profiles = Array.isArray(result) ? result : result?.data || [];
        hostProfiles.splice(0, hostProfiles.length, ...profiles);
        renderProfiles(filterProfiles());
    } catch (error) {
        console.error('Erro ao carregar coanfitriões', error);
        showEmptyState(true);
    } finally {
        setLoading(false);
    }
}

async function loadPropertyOptions() {
    try {
        const result = await apiGetProperties();
        currentProperties = Array.isArray(result) ? result : result?.data || [];
        const select = document.getElementById('propertySelect');

        if (!select) return;

        select.innerHTML = '<option value="">Sem imóvel específico</option>';
        currentProperties.forEach((property) => {
            const option = document.createElement('option');
            option.value = property.id;
            option.textContent = `${property.title} — ${property.city || property.state || 'Localização'}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.warn('Erro ao carregar imóveis', error);
    }
}

function openProfileModal(profile) {
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    const bio = parseProfileBio(profile);
    const services = Array.isArray(bio.services) ? bio.services.join(', ') : 'Não informado';
    const region = profileRegion(profile);
    const rating = profile.average_rating ?? 0;

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="profile-card modal-profile-card">
            <div class="profile-header">
                <img src="${profile.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.user?.name || 'Perfil')}&background=22c55e&color=fff`}" alt="${profile.user?.name || 'Perfil'}" class="profile-avatar">
                <div>
                    <h2>${profile.user?.name || 'Coanfitrião'}</h2>
                    <p>${profile.user?.email || 'E-mail não informado'}</p>
                    <p>${region}</p>
                </div>
            </div>
            <div class="profile-meta">
                <span>${rating.toFixed(1)} ⭐</span>
                <span>${services}</span>
            </div>
            <div class="profile-bio">
                <p>${bio.experience ? `Experiência: ${bio.experience}.` : 'Nenhuma descrição disponível.'}</p>
                <p>${bio.address ? `Atua na região ${bio.address.region || region}.` : ''}</p>
            </div>
            <div class="profile-contact">
                <p><strong>Telefone:</strong> ${profile.user?.phone || 'Não informado'}</p>
                <p><strong>Região:</strong> ${region}</p>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal')?.classList.remove('active');
}

function openInviteModal(profile) {
    const modal = document.getElementById('inviteModal');
    const inviteUserId = document.getElementById('inviteUserId');
    const inviteMessage = document.getElementById('inviteMessage');
    const propertySelect = document.getElementById('propertySelect');

    if (!modal || !inviteUserId || !inviteMessage || !propertySelect) return;

    inviteUserId.value = profile.id;
    inviteMessage.value = `Olá ${profile.user?.name || 'coanfitrião'}, gostaria de convidá-lo para gerenciar um dos meus imóveis.`;
    modal.classList.add('active');
}

function closeInviteModal() {
    document.getElementById('inviteModal')?.classList.remove('active');
}

function showMessage(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 14px 18px;
        border-radius: 8px;
        color: white;
        background: ${type === 'success' ? '#22c55e' : '#dc2626'};
        z-index: 9999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3200);
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 4000);
    }
}

function showSuccess(message) {
    const successEl = document.getElementById('successMessage');
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = 'block';
        setTimeout(() => {
            successEl.style.display = 'none';
        }, 4000);
    } else {
        showMessage(message, 'success');
    }
}

async function submitInvite(event) {
    event.preventDefault();

    const inviteUserId = Number(document.getElementById('inviteUserId')?.value || 0);
    const propertyId = Number(document.getElementById('propertySelect')?.value || 0);

    if (!inviteUserId || !propertyId) {
        showError('Selecione um imóvel para enviar o convite.');
        return;
    }

    try {
        await apiRequestCohost({
            property_id: propertyId,
            cohost_id: inviteUserId,
            revenue_split_percentage: 20
        });
        showSuccess('Convite enviado com sucesso!');
        closeInviteModal();
    } catch (error) {
        console.error('invite error', error);
        showError(error?.data?.message || error?.message || 'Erro ao enviar convite.');
    }
}

function attachUIEvents() {
    document.getElementById('clearSearch')?.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        renderProfiles(filterProfiles());
    });

    document.getElementById('filtersToggle')?.addEventListener('click', () => {
        document.getElementById('filtersContainer')?.classList.toggle('open');
    });

    document.getElementById('searchInput')?.addEventListener('input', () => renderProfiles(filterProfiles()));
    document.getElementById('regionFilter')?.addEventListener('change', () => renderProfiles(filterProfiles()));
    document.getElementById('availabilityFilter')?.addEventListener('change', () => renderProfiles(filterProfiles()));
    document.getElementById('ratingFilter')?.addEventListener('change', () => renderProfiles(filterProfiles()));
    document.getElementById('clearFilters')?.addEventListener('click', () => {
        document.getElementById('regionFilter').value = '';
        document.getElementById('availabilityFilter').value = '';
        document.getElementById('ratingFilter').value = '';
        renderProfiles(filterProfiles());
    });
    document.getElementById('resetSearch')?.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('regionFilter').value = '';
        document.getElementById('availabilityFilter').value = '';
        document.getElementById('ratingFilter').value = '';
        renderProfiles(filterProfiles());
    });
    document.getElementById('closeModal')?.addEventListener('click', closeProfileModal);
    document.getElementById('closeInviteModal')?.addEventListener('click', closeInviteModal);
    document.getElementById('cancelInvite')?.addEventListener('click', closeInviteModal);
    document.getElementById('inviteForm')?.addEventListener('submit', submitInvite);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeProfileModal();
            closeInviteModal();
        }
    });
}

async function initializePage() {
    attachUIEvents();
    await loadHostProfiles();
    await loadPropertyOptions();
}

window.addEventListener('DOMContentLoaded', initializePage);
