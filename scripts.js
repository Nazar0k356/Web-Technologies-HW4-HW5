document.addEventListener('DOMContentLoaded', () => {
    const pizzaList = document.getElementById('pizza-list');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const orderCountElement = document.querySelector('.order-count');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let pizzas = [];

    fetch('pizzas.json').then(response => response.json())
        .then(data => {
            pizzas = data;
            displayPizzas();
            document.getElementById('pizza-count').innerText = pizzas.length;
            updateCart();
        })
        .catch(error => console.error('Error loading pizzas:', error));

    function displayPizzas(filter = 'all') {
        let pizzaNum = 0;
        pizzaList.innerHTML = '';
        const filteredPizzas = filter === 'all' ? pizzas : pizzas.filter(pizza => pizza.category.includes(filter));
        filteredPizzas.forEach(pizza => {
            const pizzaItem = document.createElement('div');
            pizzaItem.classList.add('pizza');
            pizzaItem.innerHTML = `
                <img src="${pizza.image}" alt="${pizza.name}">
                <h2>${pizza.name}</h2>
                <p>${pizza.description}</p>
                <div class="size-choice">
                    ${pizza.sizes.map((size, index) => `
                        <div class="size-${index + 1}">
                            <span class="radius-info">Ø ${size.diameter}</span>
                            <span class="weight-info">⚖️ ${size.weight}</span>
                            <span class="price-info">${size.price}</span>
                            <span class="currency-info">грн.</span>
                            <button data-name="${pizza.name}" data-size="${index}" data-price="${size.price}" data-diameter="${size.diameter}" data-weight="${size.weight}">Купити</button>
                        </div>
                    `).join('')}
                </div>
            `;
            pizzaList.appendChild(pizzaItem);
            pizzaNum++;
        });
        document.getElementById('pizza-count').innerText = pizzaNum;
    }

    function addToCart(name, size, price, diameter, weight) {
        const existingItem = cart.find(item => item.name === name && item.size === size);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, size, price, diameter, weight, quantity: 1 });
        }
        updateCart();
        saveCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let totalPrice = 0;
        cart.forEach(item => {
            const pizza = pizzas.find(pizza => pizza.name === item.name);
            const cartItem = document.createElement('li');
            cartItem.classList.add('order-item');
            cartItem.innerHTML = `
                <div class="item-details">
                    <h2>${item.name} (${item.size === 0 ? 'Мала' : 'Велика'})</h2>
                    <p class="icons">Ø ${item.diameter} <span>⚖️ ${item.weight}</span></p>
                    <div class="item-quantity">
                        <p class="price">${item.price * item.quantity} грн</p>
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-name="${item.name}" data-size="${item.size}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-name="${item.name}" data-size="${item.size}">+</button>
                            <button class="remove-item" data-name="${item.name}" data-size="${item.size}">✖</button>
                        </div>
                    </div>
                </div>
                <img src="${pizza.image}" alt="${item.name}" class="item-image">
            `;
            cartItems.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });
        totalPriceElement.innerText = `${totalPrice} грн`;
        orderCountElement.innerText = cart.length;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    pizzaList.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const button = e.target;
            const name = button.getAttribute('data-name');
            const size = parseInt(button.getAttribute('data-size'));
            const price = parseInt(button.getAttribute('data-price'));
            const diameter = button.getAttribute('data-diameter');
            const weight = button.getAttribute('data-weight');
            addToCart(name, size, price, diameter, weight);
        }
    });

    cartItems.addEventListener('click', e => {
        if (e.target.classList.contains('quantity-btn') || e.target.classList.contains('remove-item')) {
            const name = e.target.getAttribute('data-name');
            const size = parseInt(e.target.getAttribute('data-size'));
            const item = cart.find(item => item.name === name && item.size === size);

            if (e.target.classList.contains('plus')) {
                item.quantity++;
            } else if (e.target.classList.contains('minus')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(item => !(item.name === name && item.size === size));
                }
            } else if (e.target.classList.contains('remove-item')) {
                cart = cart.filter(item => !(item.name === name && item.size === size));
            }

            updateCart();
            saveCart();
        }
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
        saveCart();
    });

    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayPizzas(filter);
        });
    });

    if (cart.length === 0) {
        localStorage.removeItem('cart');
    }

    updateCart();
});
