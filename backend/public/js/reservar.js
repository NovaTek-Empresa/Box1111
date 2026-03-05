// reservar.js — lógica do formulário de reserva

function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR');
}

function daysBetween(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.max(0, Math.floor((utc2 - utc1) / _MS_PER_DAY));
}

document.addEventListener('DOMContentLoaded', () => {
    const propertyId = qs('propertyId') || '';
    const propertyTitle = qs('title') ? decodeURIComponent(qs('title')) : 'Imóvel';
    const nightlyParam = Number(qs('nightly')) || 0;

    // elementos
    const elTitle = document.getElementById('summaryTitle');
    const elNightly = document.getElementById('summaryNightly');
    const elNights = document.getElementById('summaryNights');
    const elSubtotal = document.getElementById('summarySubtotal');
    const elTotal = document.getElementById('summaryTotal');
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const guests = document.getElementById('guests');
    const babies = document.getElementById('babies');
    const pets = document.getElementById('pets');

    const hiddenId = document.getElementById('propertyId');
    const hiddenTitle = document.getElementById('propertyTitle');

    hiddenId.value = propertyId;
    hiddenTitle.value = propertyTitle;

    elTitle.textContent = propertyTitle;
    elNightly.textContent = formatCurrency(nightlyParam);

    // preencher galeria a partir de parâmetros img1,img2,img3
    const galleryMain = document.getElementById('galleryMainImage');
    const galleryThumbs = document.getElementById('galleryThumbs');
    const img1 = qs('img1');
    const img2 = qs('img2');
    const img3 = qs('img3');
    const imgs = [];
    if (img1) imgs.push(decodeURIComponent(img1));
    if (img2) imgs.push(decodeURIComponent(img2));
    if (img3) imgs.push(decodeURIComponent(img3));
    if (imgs.length > 0) {
        galleryMain.src = imgs[0];
        galleryThumbs.innerHTML = '';
        imgs.forEach((u, i) => {
            const t = document.createElement('button');
            t.type = 'button';
            t.className = 'thumb-btn';
            t.innerHTML = `<img src="${u}" alt="Foto ${i+1}">`;
            t.addEventListener('click', () => { galleryMain.src = u; });
            galleryThumbs.appendChild(t);
        });
    } else {
        // placeholder
        galleryMain.src = 'https://via.placeholder.com/800x500?text=Imagem+do+im%C3%B3vel';
    }

    // seller info params (avatar, phone) para o painel de pagamento em dinheiro
    const sellerAvatarParam = qs('sellerAvatar');
    const sellerPhoneParam = qs('sellerPhone');
    if (sellerAvatarParam) {
        const av = decodeURIComponent(sellerAvatarParam);
        const sellerImg = document.getElementById('sellerAvatarImg');
        if (sellerImg) sellerImg.src = av;
    }

    // configurar botão para enviar mensagem quando escolher pagar em dinheiro (usa textarea)
    const sendCashMessageBtn = document.getElementById('sendCashMessage');
    if (sendCashMessageBtn) {
        sendCashMessageBtn.addEventListener('click', () => {
            const phone = sellerPhoneParam ? decodeURIComponent(sellerPhoneParam) : '';
            const textarea = document.getElementById('cashMessage');
            const userMessage = textarea ? textarea.value.trim() : '';
            const defaultMsg = `Olá, sou ${document.title} — vou escolher pagar em dinheiro no local para a reserva do ${propertyTitle}. Por favor, confirmar horário e instruções.`;
            const message = userMessage || defaultMsg;
            if (phone) {
                // abrir WhatsApp
                window.open(`https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(message)}`, '_blank');
            } else {
                alert('Telefone do vendedor não disponível.');
            }
        });
    }

    function updateSummary() {
        const ci = checkin.value ? new Date(checkin.value) : null;
        const co = checkout.value ? new Date(checkout.value) : null;
        let nights = 0;
        if (ci && co) {
            nights = daysBetween(ci, co);
        }
        elNights.textContent = nights;

        const nightly = nightlyParam || 0;
        const subtotal = nights * nightly;
        const total = subtotal;

        elSubtotal.textContent = formatCurrency(subtotal);
        elTotal.textContent = formatCurrency(total);

        return { nights, nightly, subtotal, total };
    }

    // não preenchemos mais dados pessoais aqui (seção removida)

    // eventos para atualizar resumo
    [checkin, checkout, guests, babies, pets].forEach(el => {
        if (el) el.addEventListener('change', updateSummary);
    });

    // máscara simples para número do cartão
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0,16);
            v = v.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = v;
        });
    }

    // submissão
    const bookingForm = document.getElementById('bookingForm');
    // controle de métodos de pagamento
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    function showPaymentPanel(method) {
        ['Pix','Card','Boleto','Cash'].forEach(k => {});
        document.getElementById('paymentPix').style.display = method === 'pix' ? 'block' : 'none';
        document.getElementById('paymentCard').style.display = method === 'card' ? 'block' : 'none';
        document.getElementById('paymentBoleto').style.display = method === 'boleto' ? 'block' : 'none';
        document.getElementById('paymentCash').style.display = method === 'cash' ? 'block' : 'none';
    }
    paymentRadios.forEach(r => r.addEventListener('change', (ev) => { showPaymentPanel(ev.target.value); }));
    // destacar visualmente o botão selecionado dentro de .payment-options
    function updateSelectedPayment(targetRadio) {
        const labels = document.querySelectorAll('.payment-options .checkbox');
        labels.forEach(l => l.classList.remove('payment-selected'));
        if (targetRadio) {
            const parentLabel = targetRadio.closest('label');
            if (parentLabel) parentLabel.classList.add('payment-selected');
        }
    }

    paymentRadios.forEach(r => r.addEventListener('change', (ev) => {
        showPaymentPanel(ev.target.value);
        updateSelectedPayment(ev.target);
    }));

    // mostrar painel inicial conforme opção marcada e destacar
    const initial = document.querySelector('input[name="paymentMethod"]:checked');
    if (initial) {
        showPaymentPanel(initial.value);
        updateSelectedPayment(initial);
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ci = checkin.value ? new Date(checkin.value) : null;
        const co = checkout.value ? new Date(checkout.value) : null;
        if (!ci || !co) {
            alert('Preencha data de entrada e saída');
            return;
        }
        if (co <= ci) {
            alert('Data de saída deve ser posterior à data de entrada');
            return;
        }

        // checar termos
        const acceptRules = document.getElementById('acceptRules');
        const acceptTerms = document.getElementById('acceptTerms');
        if (!acceptRules.checked || !acceptTerms.checked) {
            alert('Você precisa aceitar as regras e os termos para prosseguir');
            return;
        }

        // coletar forma de pagamento (simulação) — validar conforme método
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;
        let payment = { method };
        if (method === 'pix') {
            const pixKey = document.getElementById('pixKey').value.trim();
            if (!pixKey) { alert('Preencha a chave PIX'); return; }
            payment.pixKey = pixKey;
        } else if (method === 'card') {
            const cardNum = document.getElementById('cardNumber').value.trim();
            const cardName = document.getElementById('cardName').value.trim();
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvv = document.getElementById('cardCvv').value.trim();
            if (!cardNum || !cardName || !cardExpiry || !cardCvv) {
                if (!confirm('Dados do cartão incompletos. Deseja prosseguir como simulação?')) return;
            }
            payment.cardName = cardName;
            payment.last4 = cardNum ? cardNum.replace(/\s/g,'').slice(-4) : null;
        } else if (method === 'boleto') {
            const boletoName = document.getElementById('boletoName').value.trim();
            const boletoDocument = document.getElementById('boletoDocument').value.trim();
            if (!boletoName || !boletoDocument) { alert('Preencha nome e documento para boleto'); return; }
            payment.boletoName = boletoName;
            payment.boletoDocument = boletoDocument;
        } else if (method === 'cash') {
            // nothing to validate
        }

        const summary = updateSummary();

        // montar objeto de reserva
        const reservation = {
            id: 'res_' + Date.now(),
            propertyId: hiddenId.value,
            propertyTitle: hiddenTitle.value,
            checkin: checkin.value,
            checkout: checkout.value,
            nights: summary.nights,
            guests: Number(guests.value) || 1,
            babies: Number(babies.value) || 0,
            pets: Number(pets.value) || 0,
            total: summary.total,
            payment: payment,
            createdAt: new Date().toISOString()
        };

        // salvar em localStorage (simulação de backend)
        try {
            const existing = JSON.parse(localStorage.getItem('reservas') || '[]');
            existing.push(reservation);
            localStorage.setItem('reservas', JSON.stringify(existing));
        } catch (err) {
            console.error('Erro salvando reserva', err);
        }

        alert('Reserva confirmada! Obrigado.');
        window.location.href = 'index.html';
    });

    // atualizar inicialmente
    updateSummary();
});
