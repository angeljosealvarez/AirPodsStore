const ticketInput = document.querySelector('#tickets');
const totalOutput = document.querySelector('#total');
const form = document.querySelector('#purchase-form');
const ticketControls = document.querySelectorAll('.ticket-control');

const TICKET_PRICE = 3;

function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    }).format(value);
}

function updateTotal() {
    const tickets = Math.min(Math.max(parseInt(ticketInput.value, 10) || 1, parseInt(ticketInput.min, 10)), parseInt(ticketInput.max, 10));
    ticketInput.value = tickets;
    const total = tickets * TICKET_PRICE;
    totalOutput.textContent = formatCurrency(total);
}

updateTotal();

ticketControls.forEach((control) => {
    control.addEventListener('click', () => {
        const action = control.dataset.action;
        const current = parseInt(ticketInput.value, 10) || 1;
        if (action === 'increment') {
            ticketInput.value = Math.min(current + 1, parseInt(ticketInput.max, 10));
        } else if (action === 'decrement') {
            ticketInput.value = Math.max(current - 1, parseInt(ticketInput.min, 10));
        }
        updateTotal();
    });
});

ticketInput.addEventListener('input', updateTotal);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const tickets = parseInt(ticketInput.value, 10);

    if (!name || !email || Number.isNaN(tickets)) {
        alert('Por favor, completa todos los campos antes de continuar.');
        return;
    }

    const message = [
        `¡Gracias, ${name}!`,
        `Has reservado ${tickets} boleto${tickets === 1 ? '' : 's'} por un total de ${formatCurrency(tickets * TICKET_PRICE)}.`,
        'En breve recibirás un correo con los métodos de pago y tus números del sorteo.'
    ].join('\n');

    alert(message);
    form.reset();
    ticketInput.value = 1;
    updateTotal();
});

const smoothLinks = document.querySelectorAll('a[href^="#"]');

smoothLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
