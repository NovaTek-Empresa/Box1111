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

// User Management
function apiGetUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users${query ? `?${query}` : ''}`);
}

function apiGetUser(userId) {
    return apiFetch(`/users/${userId}`);
}

function apiUpdateUser(userId, payload) {
    return apiFetch(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeleteUser(userId) {
    return apiFetch(`/users/${userId}`, {
        method: 'DELETE'
    });
}

// Notifications
function apiGetNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/notifications${query ? `?${query}` : ''}`);
}

function apiGetNotification(notificationId) {
    return apiFetch(`/notifications/${notificationId}`);
}

function apiCreateNotification(payload) {
    return apiFetch('/notifications', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiMarkNotificationAsRead(notificationId) {
    return apiFetch(`/notifications/${notificationId}/read`, {
        method: 'PUT'
    });
}

function apiMarkAllNotificationsAsRead() {
    return apiFetch('/notifications/mark-all-read', {
        method: 'PUT'
    });
}

function apiDeleteNotification(notificationId) {
    return apiFetch(`/notifications/${notificationId}`, {
        method: 'DELETE'
    });
}

function apiGetUnreadNotificationsCount() {
    return apiFetch('/notifications/unread-count');
}

// Bank Accounts
function apiGetBankAccounts() {
    return apiFetch('/bank-accounts');
}

function apiGetBankAccount(accountId) {
    return apiFetch(`/bank-accounts/${accountId}`);
}

function apiCreateBankAccount(payload) {
    return apiFetch('/bank-accounts', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUpdateBankAccount(accountId, payload) {
    return apiFetch(`/bank-accounts/${accountId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeleteBankAccount(accountId) {
    return apiFetch(`/bank-accounts/${accountId}`, {
        method: 'DELETE'
    });
}

function apiSetDefaultBankAccount(accountId) {
    return apiFetch(`/bank-accounts/${accountId}/set-default`, {
        method: 'PUT'
    });
}

// Payouts
function apiGetPayouts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/payouts${query ? `?${query}` : ''}`);
}

function apiGetPayout(payoutId) {
    return apiFetch(`/payouts/${payoutId}`);
}

function apiCreatePayout(payload) {
    return apiFetch('/payouts', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUpdatePayout(payoutId, payload) {
    return apiFetch(`/payouts/${payoutId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeletePayout(payoutId) {
    return apiFetch(`/payouts/${payoutId}`, {
        method: 'DELETE'
    });
}

function apiGetPayoutSummary() {
    return apiFetch('/payouts/summary');
}

// Conversations
function apiGetConversations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/conversations${query ? `?${query}` : ''}`);
}

function apiGetConversation(conversationId) {
    return apiFetch(`/conversations/${conversationId}`);
}

function apiCreateConversation(payload) {
    return apiFetch('/conversations', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUpdateConversation(conversationId, payload) {
    return apiFetch(`/conversations/${conversationId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeleteConversation(conversationId) {
    return apiFetch(`/conversations/${conversationId}`, {
        method: 'DELETE'
    });
}

function apiMarkConversationAsRead(conversationId) {
    return apiFetch(`/conversations/${conversationId}/read`, {
        method: 'PUT'
    });
}

function apiArchiveConversation(conversationId) {
    return apiFetch(`/conversations/${conversationId}/archive`, {
        method: 'PUT'
    });
}

function apiUnarchiveConversation(conversationId) {
    return apiFetch(`/conversations/${conversationId}/unarchive`, {
        method: 'PUT'
    });
}

function apiGetUnreadConversationsCount() {
    return apiFetch('/conversations/unread-count');
}

// Messages
function apiGetMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/messages${query ? `?${query}` : ''}`);
}

function apiGetMessage(messageId) {
    return apiFetch(`/messages/${messageId}`);
}

function apiCreateMessage(payload) {
    return apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUpdateMessage(messageId, payload) {
    return apiFetch(`/messages/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeleteMessage(messageId) {
    return apiFetch(`/messages/${messageId}`, {
        method: 'DELETE'
    });
}

function apiMarkMessageAsRead(messageId) {
    return apiFetch(`/messages/${messageId}/read`, {
        method: 'PUT'
    });
}

function apiDownloadMessageFile(messageId) {
    return apiFetch(`/messages/${messageId}/download`);
}

function apiSendTypingIndicator(payload) {
    return apiFetch('/messages/typing', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

// Promotions
function apiGetPromotions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/promotions${query ? `?${query}` : ''}`);
}

function apiGetPromotion(promotionId) {
    return apiFetch(`/promotions/${promotionId}`);
}

function apiCreatePromotion(payload) {
    return apiFetch('/promotions', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUpdatePromotion(promotionId, payload) {
    return apiFetch(`/promotions/${promotionId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeletePromotion(promotionId) {
    return apiFetch(`/promotions/${promotionId}`, {
        method: 'DELETE'
    });
}

function apiValidatePromotion(payload) {
    return apiFetch('/promotions/validate', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUsePromotion(payload) {
    return apiFetch('/promotions/use', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiGetPromotionUsage(promotionId) {
    return apiFetch(`/promotions/${promotionId}/usage`);
}

// Reports
function apiGetReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reports${query ? `?${query}` : ''}`);
}

function apiGetReport(reportId) {
    return apiFetch(`/reports/${reportId}`);
}

function apiCreateReport(payload) {
    return apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function apiUpdateReport(reportId, payload) {
    return apiFetch(`/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function apiDeleteReport(reportId) {
    return apiFetch(`/reports/${reportId}`, {
        method: 'DELETE'
    });
}

function apiGetMyReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reports/my-reports${query ? `?${query}` : ''}`);
}

function apiGetReportStatistics() {
    return apiFetch('/reports/statistics');
}

function apiBulkUpdateReports(payload) {
    return apiFetch('/reports/bulk-update', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
