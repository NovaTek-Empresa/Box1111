// Dados dos imóveis (simulação de banco de dados)
let properties = [
    {
        id: 1,
        title: "Casa Alto Padrão — Condomínio Fechado",
        price: "R$ 1.250.000",
        description: "Mansão moderna com 5 suítes, piscina, área gourmet, 980 m². Acabamento de alto padrão e automação residencial. Localizada em condomínio fechado com segurança 24h, área de lazer completa e proximidade com escolas e comércio.",
        location: "Jardins, São Paulo - SP",
        type: "casa",
        transaction: "aluguel",
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
        transaction: "aluguel",
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
        transaction: "aluguel",
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
        transaction: "aluguel",
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
        transaction: "aluguel",
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
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const submitBtn = document.getElementById('loginSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Validar campos
        let isValid = true;
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showLoginError('loginEmail', 'E-mail inválido');
            isValid = false;
        } else {
            clearLoginError('loginEmail');
        }
        
        if (!password || password.length < 6) {
            showLoginError('loginPassword', 'Senha deve ter no mínimo 6 caracteres');
            isValid = false;
        } else {
            clearLoginError('loginPassword');
        }
        
        if (!isValid) return;
        
        // Mostrar loader
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        
        // Simular requisição (2s)
        setTimeout(() => {
            // Simulação de login
            appState.currentUser = {
                id: 1,
                name: 'Usuário Teste',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Usuário Teste')}&background=0D8ABC&color=fff&rounded=true`,
                email: email,
                type: 'user'
            };
            
            // Resetar botão
            submitBtn.disabled = false;
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            
            // Fechar modal e limpar
            loginModal.style.display = 'none';
            document.body.style.overflow = '';
            loginForm.reset();
            
            // Atualizar interface
            updateUIForLoggedUser();
            
            // Mensagem de sucesso
            showNotification('✓ Login realizado com sucesso!', 'success');
        }, 1500);
    });

    // Toggle senha
    const toggleBtn = document.getElementById('toggleLoginPassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const passwordInput = document.getElementById('loginPassword');
            const icon = toggleBtn.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Toggle senha do registro
    const toggleRegisterPasswordBtn = document.getElementById('toggleRegisterPassword');
    if (toggleRegisterPasswordBtn) {
        toggleRegisterPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const passwordInput = document.getElementById('registerPassword');
            const icon = toggleRegisterPasswordBtn.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Toggle confirmar senha do registro
    const toggleRegisterConfirmPasswordBtn = document.getElementById('toggleRegisterConfirmPassword');
    if (toggleRegisterConfirmPasswordBtn) {
        toggleRegisterConfirmPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const passwordInput = document.getElementById('registerConfirmPassword');
            const icon = toggleRegisterConfirmPasswordBtn.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Validação em tempo real
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showLoginError('loginEmail', 'E-mail inválido');
            } else {
                clearLoginError('loginEmail');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            clearLoginError('loginPassword');
        });
    }
}

function showLoginError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) {
        input.classList.add('error');
    }
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function clearLoginError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) {
        input.classList.remove('error');
    }
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
    }
}

function showRegisterError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) {
        input.classList.add('error');
    }
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function clearRegisterError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) {
        input.classList.remove('error');
    }
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
    }
}
// Notificação toast melhorada
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#22c55e' : type === 'warning' ? '#eab308' : '#dc2626';
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : '✕';
    
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${bgColor};
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        z-index: 3000;
        animation: slideUpNotif 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        word-break: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOutNotif 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validações
        let hasErrors = false;
        
        if (!name.trim()) {
            showRegisterError('registerName', 'Nome é obrigatório');
            hasErrors = true;
        } else {
            clearRegisterError('registerName');
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showRegisterError('registerEmail', 'E-mail inválido');
            hasErrors = true;
        } else {
            clearRegisterError('registerEmail');
        }
        
        if (!phone.trim()) {
            showRegisterError('registerPhone', 'Telefone é obrigatório');
            hasErrors = true;
        } else {
            clearRegisterError('registerPhone');
        }
        
        if (password.length < 6) {
            showRegisterError('registerPassword', 'Senha deve ter no mínimo 6 caracteres');
            hasErrors = true;
        } else {
            clearRegisterError('registerPassword');
        }
        
        if (password !== confirmPassword) {
            showRegisterError('registerConfirmPassword', 'Senhas não conferem');
            hasErrors = true;
        } else {
            clearRegisterError('registerConfirmPassword');
        }
        
        if (hasErrors) return;
        
        // Simulação de registro
        const submitBtn = document.getElementById('registerSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        
        setTimeout(() => {
            appState.currentUser = {
                id: Date.now(),
                name: name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&rounded=true`,
                email: email,
                phone: phone,
                type: 'user' // user, vendor, admin
            };
            
            showNotification('✓ Conta criada com sucesso!', 'success');
            registerModal.style.display = 'none';
            document.body.style.overflow = '';
            registerForm.reset();
            
            // Atualizar interface para usuário logado
            updateUIForLoggedUser();
            
            // Reset do botão
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }, 1500);
    });
    
    // Validação em tempo real para registro
    const registerNameInput = document.getElementById('registerName');
    const registerEmailInput = document.getElementById('registerEmail');
    const registerPhoneInput = document.getElementById('registerPhone');
    const registerPasswordInput = document.getElementById('registerPassword');
    const registerConfirmPasswordInput = document.getElementById('registerConfirmPassword');
    
    if (registerNameInput) {
        registerNameInput.addEventListener('blur', () => {
            if (registerNameInput.value.trim()) {
                clearRegisterError('registerName');
            }
        });
        registerNameInput.addEventListener('input', () => {
            clearRegisterError('registerName');
        });
    }
    
    if (registerEmailInput) {
        registerEmailInput.addEventListener('blur', () => {
            const email = registerEmailInput.value.trim();
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showRegisterError('registerEmail', 'E-mail inválido');
            } else {
                clearRegisterError('registerEmail');
            }
        });
        registerEmailInput.addEventListener('input', () => {
            clearRegisterError('registerEmail');
        });
    }
    
    if (registerPhoneInput) {
        registerPhoneInput.addEventListener('blur', () => {
            if (registerPhoneInput.value.trim()) {
                clearRegisterError('registerPhone');
            }
        });
        registerPhoneInput.addEventListener('input', () => {
            clearRegisterError('registerPhone');
        });
    }
    
    if (registerPasswordInput) {
        registerPasswordInput.addEventListener('input', () => {
            clearRegisterError('registerPassword');
        });
    }
    
    if (registerConfirmPasswordInput) {
        registerConfirmPasswordInput.addEventListener('input', () => {
            clearRegisterError('registerConfirmPassword');
        });
    }
}

function updateUIForLoggedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && appState.currentUser) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span class="user-name" id="userNameDisplay" data-action="toggle-dropdown">${appState.currentUser.name}</span>
                <button class="user-avatar" id="userAvatarBtn" title="${appState.currentUser.name}" data-action="toggle-dropdown">
                    <img src="${appState.currentUser.avatar || ''}" alt="${appState.currentUser.name}">
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="vendor/index.html" class="dropdown-item" id="menuMyListings">
                        <i class="fas fa-store"></i>
                        Meus Anúncios
                    </a>
                    <a href="#" class="dropdown-item" id="menuFavorites">
                        <i class="fas fa-heart"></i>
                        Favoritos
                    </a>
                    <a href="#" class="dropdown-item" id="menuSettings">
                        <i class="fas fa-cog"></i>
                        Configurações
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="host-signup.html" class="dropdown-item" id="menuBeHost">
                        <i class="fas fa-user-shield"></i>
                        Seja um anfitrião
                    </a>
                    <a href="#" class="dropdown-item" id="menuBeCoHost">
                        <i class="fas fa-users"></i>
                        Seja um coanfitrião
                    </a>
                    <a href="#" class="dropdown-item" id="menuFindCoHost">
                        <i class="fas fa-search"></i>
                        Buscar um coanfitrião
                    </a>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-button">
                        <button id="menuConversations" style="background: linear-gradient(135deg, var(--accent), #16a34a); color: #000; border: none; border-radius: 8px; padding: 10px 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fas fa-comments"></i>
                            Ver Conversas
                        </button>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        Sair
                    </a>
                </div>
            </div>
        `;
        
        // Adicionar eventos para o menu do usuário
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        const userDropdown = document.getElementById('userDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        const menuBeHost = document.getElementById('menuBeHost');
        const menuBeCoHost = document.getElementById('menuBeCoHost');
        const menuFindCoHost = document.getElementById('menuFindCoHost');
        const menuFavorites = document.getElementById('menuFavorites');
        const menuSettings = document.getElementById('menuSettings');
        const menuMyListings = document.getElementById('menuMyListings');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (userAvatarBtn && userDropdown) {
            const toggleDropdown = (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            };
            
            userAvatarBtn.addEventListener('click', toggleDropdown);
            
            // Também permite clicar no nome para abrir o menu
            if (userNameDisplay) {
                userNameDisplay.addEventListener('click', toggleDropdown);
            }

            // Fechar dropdown ao clicar fora
            window.addEventListener('click', (e) => {
                if (!e.target.closest('#userAvatarBtn') && !e.target.closest('#userNameDisplay')) {
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

        if (menuBeHost) {
            menuBeHost.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.remove('show');
                window.location.href = 'host-signup.html';
            });
        }

        if (menuBeCoHost) {
            menuBeCoHost.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.remove('show');
                if (appState.currentUser) window.location.href = 'be-cohost.html';
                else { registerModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
            });
        }

        if (menuFindCoHost) {
            menuFindCoHost.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.remove('show');
                window.location.href = 'buscar-coanfitriao.html';
            });
        }

        const menuConversations = document.getElementById('menuConversations');
        if (menuConversations) {
            menuConversations.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.remove('show');
                if (appState.currentUser) {
                    window.location.href = 'conversations.html';
                } else {
                    showNotification('Faça login para acessar suas conversas', 'warning');
                    registerModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        if (menuFavorites) {
            menuFavorites.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.remove('show');
                // implementar redirecionamento para favoritos
                window.location.href = 'favorites.html';
            });
        }

        if (menuSettings) {
            menuSettings.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.remove('show');
                window.location.href = 'account-settings.html';
            });
        }

        if (menuMyListings) {
            menuMyListings.addEventListener('click', (e) => {
                // link já aponta para vendor/index.html, apenas fechar dropdown
                userDropdown.classList.remove('show');
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
                <div class="property-badge">${property.transaction === 'aluguel' ? 'Aluguel' : 'aluguel'}</div>
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
                <button class="btn btn-outline view-details-btn" style="width: 100%;">Ver Detalhes</button>
            </div>
        `;
        
        propertiesGrid.appendChild(propertyCard);
        
        // Adicionar evento de clique no botão de detalhes para ir para página premium
        const viewDetailsBtn = propertyCard.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `property-details.html?id=${property.id}`;
            });
        }
        
        // Adicionar evento de clique no card para ir para página premium também
        propertyCard.addEventListener('click', () => {
            window.location.href = `property-details.html?id=${property.id}`;
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
            } else if (filter === 'aluguel' || filter === 'aluguel') {
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

        // Ir para seção de imóveis (mostrar resultados)
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
            window.scrollTo({
                top: propertiesSection.offsetTop - 80,
                behavior: 'smooth'
            });
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