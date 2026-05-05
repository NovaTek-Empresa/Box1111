// Controle de acesso por perfil de usuário

document.addEventListener('DOMContentLoaded', async () => {
    await updateUIBasedOnUserRole();
});

async function updateUIBasedOnUserRole() {
    try {
        const user = await apiGetCurrentUser();
        if (!user) return;
        
        const role = user.role || 'user';
        
        // Ocultar todos os botões de área restrita inicialmente
        hideAllRestrictedButtons();
        
        // Mostrar botões conforme o perfil do usuário
        switch(role) {
            case 'master':
                showAdminButtons();
                showVendorButtons();
                showCohostButtons();
                break;
            case 'host':
                showVendorButtons();
                showCohostButtons();
                break;
            case 'cohost':
                showCohostButtons();
                break;
            case 'user':
                // Usuário comum não vê nenhum botão de área restrita
                break;
        }
    } catch (error) {
        console.error('Erro ao verificar perfil do usuário:', error);
    }
}

function hideAllRestrictedButtons() {
    const buttons = [
        '.btn-admin',
        '.btn-vendor', 
        '.btn-cohost',
        'a[href*="admin/"]',
        'a[href*="vendor/"]',
        'a[href*="cohost/"]'
    ];
    
    buttons.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'none');
    });
}

function showAdminButtons() {
    const buttons = [
        '.btn-admin',
        'a[href*="admin/"]'
    ];
    
    buttons.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'inline-flex');
    });
}

function showVendorButtons() {
    const buttons = [
        '.btn-vendor',
        'a[href*="vendor/"]'
    ];
    
    buttons.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'inline-flex');
    });
}

function showCohostButtons() {
    const buttons = [
        '.btn-cohost',
        'a[href*="cohost/"]'
    ];
    
    buttons.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'inline-flex');
    });
}

// Verificar acesso a páginas restritas
async function checkPageAccess() {
    try {
        const user = await apiGetCurrentUser();
        if (!user) {
            window.location.href = '/index.html';
            return false;
        }
        
        const role = user.role || 'user';
        const currentPath = window.location.pathname;
        
        // Verificar se o usuário tem acesso à página atual
        if (currentPath.includes('/admin/') && role !== 'master') {
            alert('Acesso restrito para administradores');
            window.location.href = '/index.html';
            return false;
        }
        
        if (currentPath.includes('/vendor/') && !['master', 'host'].includes(role)) {
            alert('Acesso restrito para anfitriões');
            window.location.href = '/index.html';
            return false;
        }
        
        if (currentPath.includes('/cohost/') && !['master', 'host', 'cohost'].includes(role)) {
            alert('Acesso restrito para coanfitriões');
            window.location.href = '/index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        window.location.href = '/index.html';
        return false;
    }
}

// Exportar funções para uso em outros arquivos
window.roleAccess = {
    updateUIBasedOnUserRole,
    checkPageAccess
};
