import { menuArray } from "./data.js";

const menu = document.getElementById("menu");
const orderDiv = document.getElementById("order");
const orderItemsDiv = document.getElementById("order-items");
const orderTotalContainer = document.getElementById("order-total-container");
const orderTotalSpan = document.getElementById("order-total");
const completeOrderBtn = document.getElementById("complete-order-btn");
const modal = document.getElementById('order-modal');
const modalContent = document.querySelector('.modal-content');
const closeButton = document.querySelector('.close-button');
const paymentForm = document.getElementById('payment-form');
const confirmationMessage = document.getElementById('confirmation-message');
const payBtn = document.getElementById('pay-btn');


let orderArray = []

menu.addEventListener('click', function(e) {
    if(e.target.classList.contains('item-add-btn')) {
        const orderId = Number(e.target.dataset.id);
        order(orderId);
    }
})

orderItemsDiv.addEventListener('click', function(e) {
    if(e.target.classList.contains('remove-button')) {
        handleRemoveItem(e.target.dataset.remove);
    }
})

completeOrderBtn.addEventListener('click', function() {
    modal.classList.remove('hidden');
    modalContent.classList.remove('hidden');
})


closeButton.addEventListener('click', function() {
    modal.classList.add('hidden');
    modalContent.classList.add('hidden');
})

modal.addEventListener('click', function(e) {
    if(e.target === modal) {
        modal.classList.add('hidden');
        modalContent.classList.add('hidden');
    }
})

paymentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('card-name').value;

    modal.classList.add('hidden');
    modalContent.classList.add('hidden');

    confirmationMessage.innerHTML = `
        <p>Thanks, ${name}! Your order is on its way!</p>
    `;
    confirmationMessage.classList.remove('hidden');

    paymentForm.reset();
    orderArray = [];
    renderCurrentOrder();
});

function handleRemoveItem(itemId) {
    const item = orderArray.find(item => item.id === Number(itemId));
    if(!item) return;

    if(item.quantity > 1) {
        item.quantity--;
    } else {
        orderArray = orderArray.filter(item => item.id !== Number(itemId));
    }

    renderCurrentOrder();
}

function renderCurrentOrder() {
    let renderOrder = ''
    let totalPrice = 0

    orderArray.map(item => {
        const { name, price, id } = item;

        renderOrder += `
            <div class="order-item" id="orders-${item.id}">
                <p class="order-item-name">
                    ${item.name} ${item.quantity > 1 ? `<span class="quantity">x${item.quantity}</span>` : ''}
                    <button class="remove-button" data-remove="${item.id}">remove</button>
                </p>
                <p class="order-item-price">$${item.price * item.quantity}</p>
            </div>
        `
        totalPrice += item.price * item.quantity;
    })

    orderItemsDiv.innerHTML = renderOrder;
    orderTotalSpan.innerHTML = `$${totalPrice}`;

    if(orderArray.length === 0) {
        orderDiv.classList.add("hidden");
        orderDiv.classList.add("hidden");
        orderTotalContainer.classList.add("hidden");
        completeOrderBtn.classList.add("hidden");
    } else {
        orderDiv.classList.remove("hidden");
        orderItemsDiv.classList.remove("hidden");
        orderTotalContainer.classList.remove("hidden");
        completeOrderBtn.classList.remove("hidden");
    }
}

function getOrderObj(orderId) {
    return menuArray.find(item => item.id === orderId);
}


function order(orderId) {
    confirmationMessage.classList.add('hidden');
    const existingOrder = orderArray.find(item => item.id === orderId);

    if (existingOrder) {
        existingOrder.quantity++;
    } else {
        const orderObj = getOrderObj(orderId);
        if (!orderObj) return;
        orderArray.push({...orderObj, quantity: 1});
    }

    renderCurrentOrder();
}

function renderMenu() {
    menu.innerHTML = "";

    menuArray.map(item => {
        const { id, name, ingredients, price, emoji } = item;
        menu.innerHTML += `
        <div class="menu-item">
        <section class="item-info">
            <div class="item-emoji">${emoji}</div>
            <div class="item-details">
                <h2 class="item-name">${name}</h2>
                <p class="item-ingredients">${ingredients.join(', ')}</p>
                <p class="item-price">$${price}</p>
            </div>
        </section>
            <div class="item-add-btn" data-id="${id}">+</div>
        </div>
        <hr>
        `
})
}

renderMenu();

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = 
        document.body.classList.contains('dark') ? '☀️' : '🌙';
});


