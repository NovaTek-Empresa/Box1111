// Variáveis globais
let currentSection = 'dashboard';
let sidebarActive = false;

// Inicializar quando o DOM está pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSection('dashboard');
});

// Inicializar listeners de eventos
function initializeEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const cohostSidebar = document.querySelector('.cohost-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                loadSection(section);
                updateActiveNavItem(this);
                closeSidebar();
            }
        });
    });

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (notificationBtn && notificationsDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!notificationBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
                notificationsDropdown.classList.remove('show');
            }
        });
    }

    // Mark all as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            markAllReadBtn.textContent = 'Todas marcadas como lidas';
        });
    }

    // Message items click handler
    const mensagemItems = document.querySelectorAll('.mensagem-item');
    mensagemItems.forEach(item => {
        item.addEventListener('click', function() {
            selectMessage(this);
        });
    });

    // Message sending
    const btnSend = document.querySelector('.btn-send');
    const mensagemInput = document.querySelector('.mensagem-input input');
    
    if (btnSend && mensagemInput) {
        btnSend.addEventListener('click', sendMessage);
        mensagemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Search functionality
    const searchBtn = document.querySelector('.cohost-search button');
    const searchInput = document.querySelector('.cohost-search input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.section-actions .btn-outline');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', openFilter);
    });

    // Reserva card actions
    const reservaBtns = document.querySelectorAll('.reserva-actions .btn');
    reservaBtns.forEach(btn => {
        btn.addEventListener('click', handleReservaAction);
    });
}

// Alternar sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.cohost-sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
        sidebarActive = sidebar.classList.contains('active');
        
        if (backdrop) {
            backdrop.classList.toggle('active');
        }
    }
}

// Fechar sidebar
function closeSidebar() {
    const sidebar = document.querySelector('.cohost-sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebar) {
        sidebar.classList.remove('active');
        sidebarActive = false;
        
        if (backdrop) {
            backdrop.classList.remove('active');
        }
    }
}

// Carregar seção
function loadSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar seção selecionada
    const targetSection = document.querySelector(`[data-page="${sectionName}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Atualizar título
    updatePageTitle(sectionName);
    currentSection = sectionName;

    // Scroll para o topo
    const content = document.querySelector('.cohost-content');
    if (content) {
        content.scrollTop = 0;
    }
}

// Atualizar título da página
function updatePageTitle(sectionName) {
    const titles = {
        'dashboard': 'Dashboard',
        'reservas': 'Reservas',
        'calendario': 'Calendário',
        'mensagens': 'Mensagens'
    };

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || 'Dashboard';
    }
}

// Atualizar item de navegação ativo
function updateActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Selecionar mensagem
function selectMessage(messageItem) {
    // Remove active de todas as mensagens
    const allMessages = document.querySelectorAll('.mensagem-item');
    allMessages.forEach(msg => {
        msg.classList.remove('active');
    });
    
    // Adiciona active ao clicado
    messageItem.classList.add('active');
    
    // Remove unread badge
    messageItem.classList.remove('unread');
    
    // Atualiza o header e corpo da conversa
    const contactName = messageItem.querySelector('h4').textContent;
    const contactType = messageItem.querySelector('.mensagem-preview p').textContent;
    const headerInfo = document.querySelector('.mensagem-info');
    const headerTitle = headerInfo.querySelector('h3');
    const headerType = headerInfo.querySelector('.mensagem-tipo');
    
    headerTitle.textContent = contactName.split('(')[0].trim();
    headerType.textContent = contactName.includes('Anfitrião') ? 'Anfitrião' : 'Hóspede';
    
    // Limpa o histórico anterior
    const mensagemCorpo = document.querySelector('.mensagem-corpo');
    mensagemCorpo.innerHTML = '';
    
    // Simula mensagens diferentes por contato
    const conversations = {
        'Carlos Silva': [
            { type: 'received', text: 'Oi Maria, tudo bem?', time: 'Hoje 09:30' },
            { type: 'sent', text: 'Oi Carlos! Tudo bem sim. Em que posso ajudar?', time: 'Hoje 09:45' },
            { type: 'received', text: 'Pode confirmar se a limpeza foi feita corretamente?', time: 'Hoje 14:15' },
            { type: 'sent', text: 'Sim, a limpeza foi feita perfeitamente. Todos os itens do checklist foram verificados.', time: 'Hoje 14:30' }
        ],
        'João Silva': [
            { type: 'received', text: 'Qual é o código da porta? Cheguei antes do previsto.', time: 'Há 2 horas' },
            { type: 'sent', text: 'Oi João! O código é 1234. Bem-vindo!', time: 'Há 1 hora 50 minutos' },
            { type: 'received', text: 'Perfeito, muito obrigado!', time: 'Há 1 hora 40 minutos' }
        ],
        'Marina Costa': [
            { type: 'received', text: 'Tudo bem, saio às 11:00 da manhã. Obrigada pela hospedagem!', time: 'Ontem' },
            { type: 'sent', text: 'Obrigada Marina! Foi um prazer. Aproveite!', time: 'Ontem' }
        ],
        'Pedro Oliveira': [
            { type: 'received', text: 'O Wi-Fi da sala não está funcionando. Podem resolver?', time: '2 dias atrás' },
            { type: 'sent', text: 'Oi Pedro! Vou verificar. Qual é o seu quarto?', time: '2 dias atrás' },
            { type: 'received', text: 'Quarto 301', time: '2 dias atrás' },
            { type: 'sent', text: 'Já estou aqui. Deixa eu reiniciar o roteador.', time: '2 dias atrás' }
        ],
        'Ana Martins': [
            { type: 'received', text: 'Gostaria de confirmar a reserva para 25 de fevereiro', time: '3 dias atrás' },
            { type: 'sent', text: 'Oi Ana! Sua reserva está confirmada para 25 de fevereiro. Esperamos por você!', time: '3 dias atrás' }
        ]
    };
    
    const selectedName = contactName.split('(')[0].trim();
    const messages = conversations[selectedName] || conversations['Carlos Silva'];
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${msg.type}`;
        msgDiv.innerHTML = `
            <p>${escapeHtml(msg.text)}</p>
            <span class="msg-time">${msg.time}</span>
        `;
        mensagemCorpo.appendChild(msgDiv);
    });
    
    // Scroll para o final
    mensagemCorpo.scrollTop = mensagemCorpo.scrollHeight;
    
    // Limpa input
    const input = document.querySelector('.mensagem-input input');
    input.value = '';
    input.focus();
}

// Enviar mensagem
function sendMessage() {
    const input = document.querySelector('.mensagem-input input');
    const messageText = input.value.trim();

    if (messageText === '') {
        return;
    }

    const messagesContainer = document.querySelector('.mensagem-corpo');
    
    // Criar novo elemento de mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg msg-sent';
    messageDiv.innerHTML = `
        <p>${escapeHtml(messageText)}</p>
        <span class="msg-time">Agora</span>
    `;

    messagesContainer.appendChild(messageDiv);
    input.value = '';
    
    // Scroll para baixo
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simular resposta após 1 segundo
    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'msg msg-received';
        replyDiv.innerHTML = `
            <p>Obrigado pela sua mensagem! Vou verificar isso.</p>
            <span class="msg-time">Agora</span>
        `;
        messagesContainer.appendChild(replyDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// Lidar com ações de reservas
function handleReservaAction(e) {
    const button = e.target.closest('.btn');
    const card = button.closest('.reserva-card');
    const title = card.querySelector('.reserva-header h3').textContent;

    if (button.textContent.includes('Detalhes')) {
        showNotification(`Abrindo detalhes de: ${title}`);
    } else if (button.textContent.includes('Mensagem')) {
        loadSection('mensagens');
        showNotification(`Abrindo conversa sobre: ${title}`);
    }
}

// Pesquisa
function performSearch() {
    const searchInput = document.querySelector('.cohost-search input');
    const query = searchInput.value.trim();

    if (query === '') {
        showNotification('Digite algo para pesquisar');
        return;
    }

    showNotification(`Pesquisando por: "${query}"`);
    // Aqui você poderia implementar a lógica real de busca
}

// Abrir filtro
function openFilter(e) {
    e.preventDefault();
    showNotification('Abrindo filtros...');
    // Aqui você poderia implementar a interface de filtros
}

// Mostrar notificação
function showNotification(message) {
    // Você pode implementar um sistema de notificações aqui
    console.log('Notificação:', message);
}

// Escapar HTML para segurança
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Fechar dropdowns ao clicar fora
document.addEventListener('click', function(e) {
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationsDropdown && !notificationBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.remove('show');
    }

    const profileMenu = document.querySelector('.profile-menu');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (profileMenu && profileBtn && !profileBtn.closest('.profile-dropdown').contains(e.target)) {
        profileMenu.style.display = 'none';
    }
});

// Responsivo: fechar sidebar ao redimensionar
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !href.includes('dashboard') && !href.includes('reservas') && !href.includes('calendario') && !href.includes('mensagens')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Cache de dados (simulado)
const cacheData = {
    reservas: [
        {
            id: 1,
            property: 'Casa com Piscina',
            guest: 'João Silva',
            checkIn: '15/02/2026',
            checkOut: '20/02/2026',
            status: 'confirmada'
        },
        {
            id: 2,
            property: 'Apartamento Centro',
            guest: 'Pedro Oliveira',
            checkIn: '10/02/2026',
            checkOut: '12/02/2026',
            status: 'ativa'
        },
        {
            id: 3,
            property: 'Sobrado Moderno',
            guest: 'Marina Costa',
            checkIn: '08/02/2026',
            checkOut: '10/02/2026',
            status: 'concluida'
        }
    ]
};

// Função auxiliar para formatar datas
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Função para atualizar contadores de notificações
function updateNotificationCounters() {
    const unreadsCount = document.querySelectorAll('.notification-item.unread').length;
    const messageBadge = document.querySelector('.badge-on');
    const notificationBadge = document.querySelector('.notification-badge');

    if (messageBadge && unreadsCount > 0) {
        messageBadge.textContent = unreadsCount;
    }

    if (notificationBadge) {
        notificationBadge.textContent = unreadsCount;
    }
}

// Inicializar contadores
updateNotificationCounters();
