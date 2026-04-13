const apiBaseUrl = '/api';

function apiGetAuthToken() {
    return localStorage.getItem('authToken');
}

function apiSetAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function apiClearAuthToken() {
    localStorage.removeItem('authToken');
}

async function apiFetch(path, options = {}) {
    const headers = {
        Accept: 'application/json',
        ...(options.headers || {})
    };

    const token = apiGetAuthToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: options.method || 'GET',
        headers,
        body: options.body,
        credentials: options.credentials || 'same-origin'
    };

    if (config.body && !(config.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${apiBaseUrl}${path}`, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const error = new Error(data?.message || `API erro ${response.status}`);
        error.response = response;
        error.data = data;
        throw error;
    }

    return data;
}

function apiLogin(email, password) {
    return apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

function apiRegister(payload) {
    return apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiLogout() {
    return apiFetch('/logout', {
        method: 'POST',
        body: JSON.stringify({})
    });
}

function apiGetCurrentUser() {
    return apiFetch('/user').then((data) => data?.user || data?.data || data);
}

function apiUpdateCurrentUser(payload) {
    return apiFetch('/user', {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiGetProperties(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/properties${query ? `?${query}` : ''}`);
}

function apiGetProperty(id) {
    return apiFetch(`/properties/${id}`);
}

function apiGetHostProfiles(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/host-profiles${query ? `?${query}` : ''}`);
}

function apiGetHostProfile(id) {
    return apiFetch(`/host-profiles/${id}`);
}

function apiCreateHostProfile(payload) {
    return apiFetch('/host-profiles', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiRequestCohost(payload) {
    return apiFetch('/cohosts', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiCreateReservation(payload) {
    return apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiCreatePayment(payload) {
    return apiFetch('/payments', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiGetFavorites() {
    return apiFetch('/favorites');
}

function apiAddFavorite(propertyId) {
    return apiFetch('/favorites', {
        method: 'POST',
        body: JSON.stringify({ property_id: propertyId })
    });
}

function apiRemoveFavorite(favoriteId) {
    return apiFetch(`/favorites/${favoriteId}`, {
        method: 'DELETE'
    });
}

function apiCheckFavorite(propertyId) {
    return apiFetch(`/favorites/check?property_id=${propertyId}`);
}
