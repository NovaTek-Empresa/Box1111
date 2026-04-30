// Formulário de propriedades para o painel do vendor
class VendorPropertyForm {
    constructor() {
        this.form = null;
        this.currentPropertyId = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listener para o formulário de propriedade
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'propertyForm') {
                e.preventDefault();
                await this.handlePropertySubmit(e);
            }
        });

        // Listener para botões de editar propriedade
        document.addEventListener('click', async (e) => {
            if (e.target.closest('[data-action="edit-property"]')) {
                const propertyId = e.target.closest('[data-action="edit-property"]').dataset.propertyId;
                await this.editProperty(propertyId);
            }
        });

        // Listener para botões de deletar propriedade
        document.addEventListener('click', async (e) => {
            if (e.target.closest('[data-action="delete-property"]')) {
                const propertyId = e.target.closest('[data-action="delete-property"]').dataset.propertyId;
                await this.deleteProperty(propertyId);
            }
        });

        // Listener para toggle de status
        document.addEventListener('click', async (e) => {
            if (e.target.closest('[data-action="toggle-status"]')) {
                const propertyId = e.target.closest('[data-action="toggle-status"]').dataset.propertyId;
                await this.togglePropertyStatus(propertyId);
            }
        });
    }

    async handlePropertySubmit(e) {
        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Desabilitar botão
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            const propertyData = this.formatPropertyData(formData);

            let response;
            if (this.isEditing && this.currentPropertyId) {
                response = await apiUpdateProperty(this.currentPropertyId, propertyData);
            } else {
                response = await apiCreateProperty(propertyData);
            }

            if (response?.data || response?.id) {
                showNotification('Propriedade salva com sucesso!', 'success');
                this.resetForm();
                
                // Recarregar lista de propriedades
                if (typeof loadVendorProperties === 'function') {
                    await loadVendorProperties();
                }
                
                // Voltar para lista de propriedades
                if (typeof loadSectionContent === 'function') {
                    loadSectionContent('properties');
                }
            }
        } catch (error) {
            console.error('Error saving property:', error);
            showNotification('Erro ao salvar propriedade. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    formatPropertyData(formData) {
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            property_type: formData.get('property_type'),
            street_address: formData.get('street_address'),
            neighborhood: formData.get('neighborhood'),
            city: formData.get('city'),
            state: formData.get('state'),
            postal_code: formData.get('postal_code'),
            bedrooms: parseInt(formData.get('bedrooms')) || 1,
            bathrooms: parseInt(formData.get('bathrooms')) || 1,
            guests_capacity: parseInt(formData.get('guests_capacity')) || 1,
            nightly_price: parseFloat(formData.get('nightly_price')) || 0,
            cleaning_fee: parseFloat(formData.get('cleaning_fee')) || 0,
            amenities: JSON.parse(formData.get('amenities') || '[]'),
            rules: JSON.parse(formData.get('rules') || '[]'),
            cancellation_policy: formData.get('cancellation_policy') || 'moderate'
        };

        return data;
    }

    async editProperty(propertyId) {
        try {
            const response = await apiGetProperty(propertyId);
            const property = response?.data || response;

            if (property) {
                this.currentPropertyId = propertyId;
                this.isEditing = true;
                this.populateForm(property);
                
                // Mudar para seção de adicionar propriedade
                if (typeof loadSectionContent === 'function') {
                    loadSectionContent('add-property');
                }
            }
        } catch (error) {
            console.error('Error loading property:', error);
            showNotification('Erro ao carregar propriedade', 'error');
        }
    }

    populateForm(property) {
        const form = document.getElementById('propertyForm');
        if (!form) return;

        // Preencher campos básicos
        form.querySelector('[name="title"]').value = property.title || '';
        form.querySelector('[name="description"]').value = property.description || '';
        form.querySelector('[name="property_type"]').value = property.property_type || '';
        form.querySelector('[name="street_address"]').value = property.street_address || '';
        form.querySelector('[name="neighborhood"]').value = property.neighborhood || '';
        form.querySelector('[name="city"]').value = property.city || '';
        form.querySelector('[name="state"]').value = property.state || '';
        form.querySelector('[name="postal_code"]').value = property.postal_code || '';
        form.querySelector('[name="bedrooms"]').value = property.bedrooms || 1;
        form.querySelector('[name="bathrooms"]').value = property.bathrooms || 1;
        form.querySelector('[name="guests_capacity"]').value = property.guests_capacity || 1;
        form.querySelector('[name="nightly_price"]').value = property.nightly_price || 0;
        form.querySelector('[name="cleaning_fee"]').value = property.cleaning_fee || 0;
        form.querySelector('[name="cancellation_policy"]').value = property.cancellation_policy || 'moderate';

        // Preencher amenities
        const amenitiesField = form.querySelector('[name="amenities"]');
        if (amenitiesField && property.amenities) {
            amenitiesField.value = JSON.stringify(property.amenities);
        }

        // Preencher rules
        const rulesField = form.querySelector('[name="rules"]');
        if (rulesField && property.rules) {
            rulesField.value = JSON.stringify(property.rules);
        }

        // Atualizar título do formulário
        const formTitle = form.querySelector('h2, h3');
        if (formTitle) {
            formTitle.textContent = 'Editar Propriedade';
        }

        // Atualizar texto do botão
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Atualizar Propriedade';
        }
    }

    async deleteProperty(propertyId) {
        if (!confirm('Tem certeza que deseja excluir esta propriedade? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            await apiDeleteProperty(propertyId);
            showNotification('Propriedade excluída com sucesso!', 'success');
            
            // Recarregar lista de propriedades
            if (typeof loadVendorProperties === 'function') {
                await loadVendorProperties();
            }
            
            // Atualizar tabela
            if (typeof loadRecentProperties === 'function') {
                loadRecentProperties();
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            showNotification('Erro ao excluir propriedade', 'error');
        }
    }

    async togglePropertyStatus(propertyId) {
        try {
            const response = await apiGetProperty(propertyId);
            const property = response?.data || response;

            if (property) {
                const newStatus = property.status === 'active' ? 'inactive' : 'active';
                await apiUpdateProperty(propertyId, { status: newStatus });
                
                showNotification(`Propriedade ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso!`, 'success');
                
                // Recarregar lista
                if (typeof loadVendorProperties === 'function') {
                    await loadVendorProperties();
                }
                
                if (typeof loadRecentProperties === 'function') {
                    loadRecentProperties();
                }
            }
        } catch (error) {
            console.error('Error toggling property status:', error);
            showNotification('Erro ao alterar status da propriedade', 'error');
        }
    }

    resetForm() {
        const form = document.getElementById('propertyForm');
        if (form) {
            form.reset();
            
            // Resetar campos hidden
            const amenitiesField = form.querySelector('[name="amenities"]');
            if (amenitiesField) amenitiesField.value = '[]';
            
            const rulesField = form.querySelector('[name="rules"]');
            if (rulesField) rulesField.value = '[]';
        }

        this.currentPropertyId = null;
        this.isEditing = false;

        // Restaurar título e botão
        const formTitle = document.querySelector('#add-property h2, #add-property h3');
        if (formTitle) {
            formTitle.textContent = 'Adicionar Nova Propriedade';
        }

        const submitBtn = document.querySelector('#propertyForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Salvar Propriedade';
        }
    }

    // Funções utilitárias para amenities e rules
    setupAmenitiesToggle() {
        const amenitiesContainer = document.getElementById('amenitiesContainer');
        if (!amenitiesContainer) return;

        const amenities = [
            'wifi', 'kitchen', 'parking', 'pool', 'gym', 'air_conditioning',
            'heating', 'tv', 'washer', 'dryer', 'workspace', 'iron'
        ];

        amenities.forEach(amenity => {
            const checkbox = document.createElement('label');
            checkbox.className = 'checkbox-item';
            checkbox.innerHTML = `
                <input type="checkbox" name="amenity_${amenity}" value="${amenity}">
                <span>${this.formatAmenityName(amenity)}</span>
            `;
            amenitiesContainer.appendChild(checkbox);
        });

        // Listener para atualizar o campo hidden
        amenitiesContainer.addEventListener('change', () => {
            const selected = Array.from(amenitiesContainer.querySelectorAll('input:checked'))
                .map(input => input.value);
            
            const hiddenField = document.querySelector('[name="amenities"]');
            if (hiddenField) {
                hiddenField.value = JSON.stringify(selected);
            }
        });
    }

    setupRulesToggle() {
        const rulesContainer = document.getElementById('rulesContainer');
        if (!rulesContainer) return;

        const rules = [
            'no_pets', 'no_smoking', 'no_parties', 'no_children', 'quiet_hours',
            'shoes_off', 'check_in_time', 'check_out_time'
        ];

        rules.forEach(rule => {
            const checkbox = document.createElement('label');
            checkbox.className = 'checkbox-item';
            checkbox.innerHTML = `
                <input type="checkbox" name="rule_${rule}" value="${rule}">
                <span>${this.formatRuleName(rule)}</span>
            `;
            rulesContainer.appendChild(checkbox);
        });

        // Listener para atualizar o campo hidden
        rulesContainer.addEventListener('change', () => {
            const selected = Array.from(rulesContainer.querySelectorAll('input:checked'))
                .map(input => input.value);
            
            const hiddenField = document.querySelector('[name="rules"]');
            if (hiddenField) {
                hiddenField.value = JSON.stringify(selected);
            }
        });
    }

    formatAmenityName(amenity) {
        const names = {
            wifi: 'Wi-Fi',
            kitchen: 'Cozinha',
            parking: 'Estacionamento',
            pool: 'Piscina',
            gym: 'Academia',
            air_conditioning: 'Ar Condicionado',
            heating: 'Aquecimento',
            tv: 'TV',
            washer: 'Máquina de Lavar',
            dryer: 'Secadora',
            workspace: 'Espaço de Trabalho',
            iron: 'Ferro de Passar'
        };
        return names[amenity] || amenity;
    }

    formatRuleName(rule) {
        const names = {
            no_pets: 'Sem Animais',
            no_smoking: 'Sem Fumar',
            no_parties: 'Sem Festas',
            no_children: 'Sem Crianças',
            quiet_hours: 'Horário de Silêncio',
            shoes_off: 'Tirar Sapatos',
            check_in_time: 'Horário de Check-in',
            check_out_time: 'Horário de Check-out'
        };
        return names[rule] || rule;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new VendorPropertyForm();
});

// Funções globais para compatibilidade
window.editProperty = async function(propertyId) {
    const form = new VendorPropertyForm();
    await form.editProperty(propertyId);
};

window.deleteProperty = async function(propertyId) {
    const form = new VendorPropertyForm();
    await form.deleteProperty(propertyId);
};

window.togglePropertyStatus = async function(propertyId) {
    const form = new VendorPropertyForm();
    await form.togglePropertyStatus(propertyId);
};
