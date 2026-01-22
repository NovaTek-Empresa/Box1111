// Componente reutilizável de endereço por CEP (ViaCEP)
(function(window){
    function sanitizeCep(v){
        return String(v||'').replace(/\D/g,'');
    }

    function validCep(cep){
        return /^\d{8}$/.test(sanitizeCep(cep));
    }

    async function fetchCep(cep){
        const cleaned = sanitizeCep(cep);
        const url = `https://viacep.com.br/ws/${cleaned}/json/`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erro na requisição');
        const data = await res.json();
        if (data.erro) throw new Error('CEP não encontrado');
        return data;
    }

    function showLoading(root, show){
        if (!root) return;
        if (show) root.classList.add('cep-loading'); else root.classList.remove('cep-loading');
    }

    function showError(el, msg){
        if (!el) return;
        el.classList.add('input-error');
        let next = el.nextElementSibling;
        if (!next || !next.classList || !next.classList.contains('error-text')){
            next = document.createElement('div'); next.className = 'error-text';
            el.parentNode.insertBefore(next, el.nextSibling);
        }
        next.textContent = msg;
    }

    function clearError(el){
        if (!el) return;
        el.classList.remove('input-error');
        const next = el.nextElementSibling;
        if (next && next.classList && next.classList.contains('error-text')) next.remove();
    }

    // prefix: string like 'property' or 'profile'
    function attachCepComponent(prefix){
        if (!prefix) return;
        const cep = document.getElementById(prefix + 'Cep');
        const street = document.getElementById(prefix + 'Street');
        const number = document.getElementById(prefix + 'Number');
        const complement = document.getElementById(prefix + 'Complement');
        const neighborhood = document.getElementById(prefix + 'Neighborhood');
        const city = document.getElementById(prefix + 'City');
        const state = document.getElementById(prefix + 'State');
        const root = cep ? cep.closest('.cep-component') : null;

        if (!cep) return;

        function setFields(data){
            if (street && data.logradouro) street.value = data.logradouro;
            if (neighborhood && data.bairro) neighborhood.value = data.bairro;
            if (city && data.localidade) city.value = data.localidade;
            if (state && data.uf) state.value = data.uf;
        }

        cep.addEventListener('blur', async () => {
            clearError(cep);
            const v = cep.value || '';
            const cleaned = sanitizeCep(v);
            if (!validCep(cleaned)) {
                showError(cep, 'Formato de CEP inválido');
                return;
            }

            try{
                showLoading(root, true);
                if (street) street.disabled = true;
                if (neighborhood) neighborhood.disabled = true;
                if (city) city.disabled = true;
                if (state) state.disabled = true;

                const data = await fetchCep(cleaned);
                setFields(data);
            } catch (err){
                showError(cep, err.message || 'CEP não encontrado');
            } finally {
                showLoading(root, false);
                if (street) street.disabled = false;
                if (neighborhood) neighborhood.disabled = false;
                if (city) city.disabled = false;
                if (state) state.disabled = false;
            }
        });

        // Formatação simples enquanto digita
        cep.addEventListener('input', () => {
            const v = sanitizeCep(cep.value);
            if (v.length > 5) cep.value = v.slice(0,5) + '-' + v.slice(5,8);
            else cep.value = v;
            clearError(cep);
        });
    }

    window.attachCepComponent = attachCepComponent;
})(window);
