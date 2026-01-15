// Dados (cópia mínima para a página de listagem)
const properties = [
    { id:1, title: "Casa Alto Padrão — Condomínio Fechado", price: "R$ 1.250.000", description: "Mansão moderna...", location: "Jardins, São Paulo - SP", type: "casa", transaction: "aluguel", features: ["5 suítes","Piscina","Área gourmet","5 vagas","980 m²","Condomínio fechado"], images:["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop"], seller:{rating:4.9} },
    { id:2, title: "Sobrado Moderno — Bairro Tranquilo", price: "R$ 790.000", description: "Sobrado reformado...", location: "Vila Mariana, São Paulo - SP", type: "casa", transaction: "aluguel", features:["3 dormitórios","2 banheiros","2 vagas","180 m²","Quintal","Reformado"], images:["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80&auto=format&fit=crop"], seller:{rating:4.7} },
    { id:3, title: "Apartamento de 2 Quartos no Centro", price: "R$ 420.000", description: "Apartamento bem localizado...", location: "Centro, São Paulo - SP", type: "apartamento", transaction: "aluguel", features:["2 quartos","2 banheiros","1 vaga","75 m²","Centro","Portaria 24h"], images:["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80&auto=format&fit=crop"], seller:{rating:4.9} },
    { id:4, title: "Casa com Piscina e Churrasqueira", price: "R$ 3.500/mês", description: "Casa espaçosa...", location: "Morumbi, São Paulo - SP", type: "casa", transaction: "aluguel", features:["4 quartos","3 banheiros","Piscina","Churrasqueira","220 m²","Condomínio"], images:["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop"], seller:{rating:4.8} },
    { id:5, title: "Loja Comercial em Localização Privilegiada", price: "R$ 850.000", description: "Loja comercial...", location: "Moema, São Paulo - SP", type: "comercial", transaction: "aluguel", features:["120 m²","2 banheiros","Reformada","Ponto comercial","Alto fluxo"], images:["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80&auto=format&fit=crop"], seller:{rating:4.6} },
    { id:6, title: "Terreno para Construção — 500 m²", price: "R$ 350.000", description: "Terreno plano...", location: "Interlagos, São Paulo - SP", type: "terreno", transaction: "aluguel", features:["500 m²","Plano","Regular","Boa localização","Infraestrutura"], images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop"], seller:{rating:4.5} }
];

const grid = document.getElementById('allPropertiesGrid');
const filterCasa = document.getElementById('filterCasa');
const filterApartamento = document.getElementById('filterApartamento');
const filterBedrooms = document.getElementById('filterBedrooms');
const filterPriceMax = document.getElementById('filterPriceMax');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

function parsePrice(raw) {
    if (!raw) return NaN;
    const cleaned = raw.replace(/[^0-9.,]/g, '').trim();
    let num = NaN;
    if (cleaned.includes(',')) num = Number(cleaned.replace(/\./g, '').replace(',', '.'));
    else num = Number(cleaned.replace(/\./g, ''));
    return isNaN(num) ? NaN : num;
}

function bedroomsFromFeatures(features) {
    for (const f of features) {
        const m = f.match(/(\d+)\s*(?:suítes|dormitórios|quartos)/i);
        if (m) return Number(m[1]);
    }
    // fallback: check '1 vaga' etc -> return 0
    return 0;
}

function renderProperties(list) {
    if (!grid) return;
    grid.innerHTML = '';
    if (list.length === 0) {
        grid.innerHTML = '<p style="color:var(--muted);">Nenhum imóvel encontrado.</p>';
        return;
    }
    list.forEach(property => {
        const el = document.createElement('div');
        el.className = 'property-card fade-up';
        el.innerHTML = `
            <div class="property-image"><img src="${property.images[0]}" alt="${property.title}"><div class="property-badge">${property.transaction === 'aluguel' ? 'Aluguel' : ''}</div></div>
            <div class="property-content">
                <div class="property-header"><div class="property-price">${property.price}</div><div class="property-rating"><i class="fas fa-star"></i><span>${property.seller.rating}</span></div></div>
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.location}</p>
                <div class="property-features">${property.features.slice(0,3).map(f=>`<span class="property-feature">${f}</span>`).join('')}</div>
            </div>
        `;
        grid.appendChild(el);
    });
}

function applyFilters() {
    let result = [...properties];
    // Type
    const wantCasa = filterCasa && filterCasa.checked;
    const wantApto = filterApartamento && filterApartamento.checked;
    if (wantCasa && !wantApto) result = result.filter(p => p.type === 'casa');
    else if (!wantCasa && wantApto) result = result.filter(p => p.type === 'apartamento');

    // Bedrooms
    const bd = filterBedrooms ? filterBedrooms.value : 'any';
    if (bd !== 'any') {
        const min = Number(bd);
        result = result.filter(p => bedroomsFromFeatures(p.features) >= min);
    }

    // Price max
    const priceMaxRaw = filterPriceMax ? Number(filterPriceMax.value) : NaN;
    if (!isNaN(priceMaxRaw) && priceMaxRaw > 0) {
        result = result.filter(p => {
            const num = parsePrice(p.price);
            return !isNaN(num) && num <= priceMaxRaw;
        });
    }

    renderProperties(result);
}

document.addEventListener('DOMContentLoaded', () => {
    // Default: mostrar apenas casas
    if (filterCasa) filterCasa.checked = true;
    if (filterApartamento) filterApartamento.checked = false;
    applyFilters();

    if (filterCasa) filterCasa.addEventListener('change', applyFilters);
    if (filterApartamento) filterApartamento.addEventListener('change', applyFilters);
    if (filterBedrooms) filterBedrooms.addEventListener('change', applyFilters);
    if (filterPriceMax) filterPriceMax.addEventListener('input', applyFilters);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (filterCasa) filterCasa.checked = true;
        if (filterApartamento) filterApartamento.checked = false;
        if (filterBedrooms) filterBedrooms.value = 'any';
        if (filterPriceMax) filterPriceMax.value = '';
        applyFilters();
    });
});
