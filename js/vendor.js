// Dados do painel do vendedor (simulação)
const vendorData = {
    stats: {
        properties: 12,
        views: 1254,
        messages: 24,
        revenue: 2500000
    },
    recentProperties: [
        {
            id: 1,
            title: "Casa Alto Padrão",
            location: "Jardins, SP",
            price: "R$ 1.250.000",
            status: "active",
            views: 245,
            date: "15/10/2023",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&q=80&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Sobrado Moderno",
            location: "Vila Mariana, SP",
            price: "R$ 790.000",
            status: "active",
            views: 189,
            date: "12/10/2023",
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=100&q=80&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Apartamento Centro",
            location: "Centro, SP",
            price: "R$ 420.000",
            status: "inactive",
            views: 76,
            date: "10/10/2023",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&q=80&auto=format&fit=crop"
        }
    ]
};

// Dados de chat (simulação)
const chatData = {
    conversations: [
        {
            id: 1,
            name: 'Joana Pereira',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            last: 'Olá, tenho interesse no imóvel.',
            messages: [
                { from: 'client', text: 'Olá, tenho interesse no imóvel.', time: '10:02' },
                { from: 'vendor', text: 'Olá Joana! Pode me dizer qual imóvel?', time: '10:05' }
            ]
        },
        {
            id: 2,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:17' },
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:21' }
            ]
        },
                {
            id: 3,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:17' }
            ]
        },
              {
            id: 4,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:15' }
            ]
        },
              {
            id: 5,
            name: 'Rafael Souza',
            avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
            last: 'Quando posso visitar?',
            messages: [
                { from: 'client', text: 'Quando posso visitar?', time: '09:15' },
                { from: 'vendor', text: 'Sábado às 10h funciona?', time: '09:17' }
            ]
        }
    ]
};


function countNotification(chatData){
    
    return chatData.conversations.length;
}


// Variável temporária de anexo na conversa atual
let currentChatAttachment = null;

// Inicialização do painel do vendedor
document.addEventListener('DOMContentLoaded', () => {
    // Toggle da sidebar em dispositivos móveis
    const sidebarToggle = document.getElementById('sidebarToggle');
    const vendorSidebar = document.querySelector('.vendor-sidebar');
    
    if (sidebarToggle && vendorSidebar) {
        sidebarToggle.addEventListener('click', () => {
            vendorSidebar.classList.toggle('active');
        });
    }
    
    // Botão para colapsar/expandir a sidebar (desktop)
    const vendorCollapseBtn = document.getElementById('vendorSidebarCollapse');
    const vendorMain = document.querySelector('.vendor-main');

    if (vendorCollapseBtn && vendorSidebar && vendorMain) {
        vendorCollapseBtn.addEventListener('click', () => {
            const icon = vendorCollapseBtn.querySelector('i');
            vendorSidebar.classList.toggle('collapsed');
            vendorMain.classList.toggle('sidebar-compact');
            if (vendorSidebar.classList.contains('collapsed')) {
                if (icon) {
                    icon.classList.remove('fa-angle-left');
                    icon.classList.add('fa-angle-right');
                }
            } else {
                if (icon) {
                    icon.classList.remove('fa-angle-right');
                    icon.classList.add('fa-angle-left');
                }
            }
        });
    }
    
    // Navegação entre seções
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover classe active de todos os itens
            navItems.forEach(i => i.classList.remove('active'));
            // Adicionar classe active ao item clicado
            item.classList.add('active');
            
            // Atualizar o título da página
            const pageTitle = document.querySelector('.vendor-header h1');
            const linkText = item.querySelector('span').textContent;
            if (pageTitle) {
                pageTitle.textContent = linkText;
            }
            
            // Carregar conteúdo da seção
            const section = item.querySelector('a').getAttribute('href').substring(1);
            loadSectionContent(section);
        });
    });
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Configurar busca
    setupVendorSearch();
});

// Carregar dados do dashboard
function loadDashboardData() {
    // Atualizar estatísticas
    updateStats();
    
    // Carregar imóveis recentes
    loadRecentProperties();
}

// Atualizar estatísticas
function updateStats() {
    const stats = vendorData.stats;
    
    // Formatar números
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };
    
    // Atualizar cards de estatística
    const statCards = document.querySelectorAll('.stat-info h3');
    if (statCards.length >= 4) {
        statCards[0].textContent = formatNumber(stats.properties);
        statCards[1].textContent = formatNumber(stats.views);
        statCards[2].textContent = formatNumber(stats.messages);
        statCards[3].textContent = 'R$ ' + formatNumber(stats.revenue);
    }
}

// Carregar imóveis recentes
function loadRecentProperties() {
    const propertiesTable = document.querySelector('.properties-table tbody');
    if (!propertiesTable) return;
    
    propertiesTable.innerHTML = '';
    
    vendorData.recentProperties.forEach(property => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="property-cell">
                    <div class="property-image">
                        <img src="${property.image}" alt="${property.title}">
                    </div>
                    <div class="property-info">
                        <h4>${property.title}</h4>
                        <span class="property-location">${property.location}</span>
                    </div>
                </div>
            </td>
            <td class="price-cell">${property.price}</td>
            <td>
                <span class="status-badge ${property.status}">${property.status === 'active' ? 'Ativo' : 'Inativo'}</span>
            </td>
            <td>${property.views}</td>
            <td>${property.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="Editar" onclick="editProperty(${property.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Promover" onclick="promoteProperty(${property.id})">
                        <i class="fas fa-bullhorn"></i>
                    </button>
                    <button class="btn-icon" title="${property.status === 'active' ? 'Desativar' : 'Ativar'}" onclick="togglePropertyStatus(${property.id})">
                        <i class="fas ${property.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                </div>
            </td>
        `;
        
        propertiesTable.appendChild(row);
    });
}

// Configurar busca do vendedor
function setupVendorSearch() {
    const searchInput = document.querySelector('.vendor-search input');
    const searchButton = document.querySelector('.vendor-search button');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            // Recarregar dados originais
            loadDashboardData();
        } else {
            // Filtrar dados baseados na busca
            filterProperties(query);
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

// Filtrar propriedades baseadas na busca
function filterProperties(query) {
    const filteredProperties = vendorData.recentProperties.filter(property => 
        property.title.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query)
    );
    
    // Atualizar tabela com propriedades filtradas
    updatePropertiesTable(filteredProperties);
}

// Atualizar tabela de propriedades
function updatePropertiesTable(properties) {
    const propertiesTable = document.querySelector('.properties-table tbody');
    if (!propertiesTable) return;
    
    propertiesTable.innerHTML = '';
    
    if (properties.length === 0) {
        propertiesTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <p>Nenhum imóvel encontrado</p>
                </td>
            </tr>
        `;
    } else {
        properties.forEach(property => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="property-cell">
                        <div class="property-image">
                            <img src="${property.image}" alt="${property.title}">
                        </div>
                        <div class="property-info">
                            <h4>${property.title}</h4>
                            <span class="property-location">${property.location}</span>
                        </div>
                    </div>
                </td>
                <td class="price-cell">${property.price}</td>
                <td>
                    <span class="status-badge ${property.status}">${property.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                </td>
                <td>${property.views}</td>
                <td>${property.date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" title="Editar" onclick="editProperty(${property.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" title="Promover" onclick="promoteProperty(${property.id})">
                            <i class="fas fa-bullhorn"></i>
                        </button>
                        <button class="btn-icon" title="${property.status === 'active' ? 'Desativar' : 'Ativar'}" onclick="togglePropertyStatus(${property.id})">
                            <i class="fas ${property.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                        </button>
                    </div>
                </td>
            `;
            
            propertiesTable.appendChild(row);
        });
    }
}

// Carregar conteúdo da seção
function loadSectionContent(section) {
    const contentArea = document.querySelector('.vendor-content');
    
    // Simulação de carregamento de conteúdo
    switch(section) {
        case 'dashboard':
            contentArea.innerHTML = `
                <div class="stats-grid">
                    <!-- Conteúdo do dashboard será carregado aqui -->
                </div>
                <div class="actions-grid">
                    <!-- Ações rápidas -->
                </div>
                <div class="content-card">
                    <!-- Imóveis recentes -->
                </div>
            `;
            loadDashboardData();
            break;
            
        case 'properties':
            contentArea.innerHTML = `
                <div class="content-card">
                    <div class="card-header">
                        <h3>Meus Imóveis</h3>
                        <a href="#add-property" class="btn">Adicionar Imóvel</a>
                    </div>
                    <div class="card-body">
                        <div class="properties-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Imóvel</th>
                                        <th>Preço</th>
                                        <th>Status</th>
                                        <th>Visualizações</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Imóveis serão carregados aqui -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            loadRecentProperties();
            break;
            
        case 'add-property':
            contentArea.innerHTML = `
                <div class="content-card">
                    <div class="card-header">
                        <h3>Adicionar Novo Imóvel</h3>
                    </div>
                    <div class="card-body">
                        <form id="addPropertyForm" class="property-form">
                            <div class="form-section">
                                <h4>Informações Básicas</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label" for="propertyTitle">Título do Anúncio</label>
                                        <input type="text" id="propertyTitle" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label" for="propertyType">Tipo de Imóvel</label>
                                        <select id="propertyType" class="form-control" required>
                                            <option value="">Selecione...</option>
                                            <option value="casa">Casa</option>
                                            <option value="apartamento">Apartamento</option>
                                            <option value="comercial">Comercial</option>
                                            <option value="terreno">Terreno</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="propertyTransaction">Tipo de Transação</label>
                                        <select id="propertyTransaction" class="form-control" required>
                                            <option value="">Selecione...</option>
                                            <option value="venda">Venda</option>
                                            <option value="aluguel">Aluguel</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label" for="propertyPrice">Preço</label>
                                        <input type="text" id="propertyPrice" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="propertyArea">Área (m²)</label>
                                        <input type="number" id="propertyArea" class="form-control">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Localização</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label" for="propertyAddress">Endereço</label>
                                        <input type="text" id="propertyAddress" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label" for="propertyCity">Cidade</label>
                                        <input type="text" id="propertyCity" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="propertyState">Estado</label>
                                        <input type="text" id="propertyState" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Descrição e Características</h4>
                                <div class="form-group">
                                    <label class="form-label" for="propertyDescription">Descrição</label>
                                    <textarea id="propertyDescription" class="form-control" rows="4"></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Características</label>
                                    <div class="features-grid">
                                        <label class="checkbox">
                                            <input type="checkbox" name="features" value="quartos">
                                            <span class="checkmark"></span>
                                            Quartos
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox" name="features" value="banheiros">
                                            <span class="checkmark"></span>
                                            Banheiros
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox" name="features" value="garagem">
                                            <span class="checkmark"></span>
                                            Garagem
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox" name="features" value="piscina">
                                            <span class="checkmark"></span>
                                            Piscina
                                        </label>
                                        <!-- Mais características podem ser adicionadas -->
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Imagens</h4>
                                <div class="image-upload">
                                    <div class="upload-area" id="uploadArea">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <p>Arraste imagens aqui ou clique para selecionar</p>
                                        <input type="file" id="imageInput" multiple accept="image/*" style="display: none;">
                                    </div>
                                    <div class="image-preview" id="imagePreview"></div>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn">Publicar Imóvel</button>
                                <button type="button" class="btn btn-outline">Salvar como Rascunho</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            setupPropertyForm();
            break;
            
        case 'messages':
            contentArea.innerHTML = `
                <div class="content-card chat-card">
                    <aside class="chat-sidebar">
                        <div style="padding:16px;border-bottom:1px solid var(--border);font-weight:700;">Mensagens</div>
                        <ul class="chat-list" id="chatList"></ul>
                    </aside>
                    <section class="chat-panel">
                        <div class="chat-header" id="chatHeader">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" style="width:44px;height:44px;border-radius:50%;object-fit:cover;">
                            <div>
                                <div id="chatName" style="font-weight:700;">Selecione uma conversa</div>
                                <div id="chatStatus" style="font-size:0.85rem;color:var(--text-light);">Online</div>
                            </div>
                        </div>
                        <div class="chat-messages" id="chatMessages">
                            <p style="color:var(--text-light);">Selecione uma conversa à esquerda para começar a conversar.</p>
                        </div>
                        <div class="chat-input-area">
                            <button id="chatAttach" class="btn btn-outline" title="Anexar arquivo" style="padding:8px 10px;height:40px;">📎</button>
                            <input id="chatFileInput" type="file" style="display:none;">
                            <input id="chatInput" class="chat-input" placeholder="Escreva uma mensagem...">
                            <button id="chatSend" class="chat-send">Enviar</button>
                        </div>
                        <div style="padding:0 16px 16px 16px;">
                            <div id="chatAttachmentPreview" style="font-size:0.9rem;color:var(--text-light);"></div>
                        </div>
                    </section>
                </div>
            `;
            // Inicializar chat
            initChat();
            break;
            
        default:
            // Carregar dashboard por padrão
            loadSectionContent('dashboard');
    }
}

// Configurar formulário de adição de imóvel
function setupPropertyForm() {
    const form = document.getElementById('addPropertyForm');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Imóvel adicionado com sucesso!');
            // Em uma aplicação real, isso enviaria os dados para a API
        });
    }
    
    if (uploadArea && imageInput) {
        uploadArea.addEventListener('click', () => {
            imageInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleImageFiles(files);
        });
        
        imageInput.addEventListener('change', (e) => {
            const files = e.target.files;
            handleImageFiles(files);
        });
    }
}

// Manipular arquivos de imagem
function handleImageFiles(files) {
    const imagePreview = document.getElementById('imagePreview');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-item');
                imageItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imagePreview.appendChild(imageItem);
            };
            
            reader.readAsDataURL(file);
        }
    }
}

// Funções de ação
function editProperty(id) {
    alert(`Editando propriedade ID: ${id}`);
    // Em uma aplicação real, isso abriria um formulário de edição
}

function promoteProperty(id) {
    alert(`Promovendo propriedade ID: ${id}`);
    // Em uma aplicação real, isso abriria opções de promoção
}

function togglePropertyStatus(id) {
    const property = vendorData.recentProperties.find(p => p.id === id);
    if (property) {
        property.status = property.status === 'active' ? 'inactive' : 'active';
        loadRecentProperties();
        alert(`Status da propriedade ID: ${id} alterado para ${property.status}`);
    }
}

/* Chat functions */
function initChat() {
    renderConversations();
    const first = chatData.conversations[0];
    if (first) openConversation(first.id);

    const sendBtn = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    const attachBtn = document.getElementById('chatAttach');
    const fileInput = document.getElementById('chatFileInput');
    const attachPreview = document.getElementById('chatAttachmentPreview');

    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            // create temporary URL for download/preview
            const url = URL.createObjectURL(file);
            currentChatAttachment = { file, url, name: file.name, type: file.type };
            if (attachPreview) {
                attachPreview.innerHTML = `<span style="background:var(--bg);padding:6px 10px;border-radius:8px;display:inline-flex;align-items:center;gap:8px;">
                    <strong style="font-weight:600;color:var(--text);">${file.name}</strong>
                    <button id="removeAttachmentBtn" style="background:transparent;border:none;cursor:pointer;color:var(--text-light);">✕</button>
                </span>`;
                const removeBtn = document.getElementById('removeAttachmentBtn');
                if (removeBtn) removeBtn.addEventListener('click', () => {
                    if (currentChatAttachment && currentChatAttachment.url) URL.revokeObjectURL(currentChatAttachment.url);
                    currentChatAttachment = null;
                    fileInput.value = '';
                    attachPreview.innerHTML = '';
                });
            }
        });
    }

    if (sendBtn && input) {
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function renderConversations() {
    const list = document.getElementById('chatList');
    if (!list) return;
    list.innerHTML = '';
    // determine active conversation id (if any)
    const activeId = parseInt(document.getElementById('chatInput')?.dataset.convId || '0', 10);
    chatData.conversations.forEach(conv => {
        const li = document.createElement('li');
        li.className = 'chat-item';
        li.dataset.id = conv.id;
        li.innerHTML = `
            <img src="${conv.avatar}" alt="${conv.name}">
            <div class="meta">
                <div class="name">${conv.name}</div>
                <div class="last">${conv.last}</div>
            </div>
        `;
        li.addEventListener('click', () => openConversation(conv.id));
        if (conv.id === activeId) li.classList.add('active');
        list.appendChild(li);
    });
}

function openConversation(id) {
    const conv = chatData.conversations.find(c => c.id === id);
    if (!conv) return;

    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    const el = document.querySelector(`.chat-item[data-id="${id}"]`);
    if (el) el.classList.add('active');

    const name = document.getElementById('chatName');
    const messagesEl = document.getElementById('chatMessages');
    if (name) name.textContent = conv.name;
    if (messagesEl) {
        messagesEl.innerHTML = '';
        renderMessages(conv.messages, messagesEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    const input = document.getElementById('chatInput');
    if (input) input.dataset.convId = id;
}

function renderMessages(messages, container) {
    if (!container) return;
    messages.forEach(m => {
        const div = document.createElement('div');
        div.className = 'message ' + (m.from === 'vendor' ? 'sent' : 'received');
        // build inner content: text optionally and file optionally
        let inner = '';
        if (m.text && m.text.trim() !== '') {
            inner += `<div class="text">${m.text}</div>`;
        }
        if (m.file) {
            inner += `<a class="file" href="${m.file.url}" download="${m.file.name}">${m.file.name}</a>`;
        }
        inner += `<span class="time">${m.time || formatTime(new Date())}</span>`;
        div.innerHTML = inner;
        container.appendChild(div);
    });
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    // allow sending if there's text OR an attachment
    if (text === '' && !currentChatAttachment) return;
    const convId = parseInt(input.dataset.convId, 10);
    const conv = chatData.conversations.find(c => c.id === convId);
    if (!conv) return;

    const time = formatTime(new Date());
    const message = { from: 'vendor', text, time };
    if (currentChatAttachment) {
        message.file = { name: currentChatAttachment.name, url: currentChatAttachment.url, type: currentChatAttachment.type };
    }
    conv.messages.push(message);
    conv.last = message.file ? (`Arquivo: ${message.file.name}`) : text;

    const messagesEl = document.getElementById('chatMessages');
    if (messagesEl) {
        renderMessages([message], messagesEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    renderConversations();
    input.value = '';
    input.focus();

    // clear attachment preview (do not revoke URL so link remains usable)
    const fileInput = document.getElementById('chatFileInput');
    const attachPreview = document.getElementById('chatAttachmentPreview');
    if (fileInput) fileInput.value = '';
    if (attachPreview) attachPreview.innerHTML = '';
    currentChatAttachment = null;

    setTimeout(() => {
        const reply = { from: 'client', text: 'Obrigado! Recebi sua mensagem.', time: formatTime(new Date()) };
        conv.messages.push(reply);
        const messagesEl2 = document.getElementById('chatMessages');
        if (messagesEl2) {
            renderMessages([reply], messagesEl2);
            messagesEl2.scrollTop = messagesEl2.scrollHeight;
        }
        conv.last = reply.text;
        renderConversations();
    }, 800);
}

function formatTime(date) {
    const d = new Date(date);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}