// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const pizzaList = document.getElementById('pizza-list');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const pizzas = [
        {
            "name": "Імпреза",
            "description": "Балик, салямі, куриця, сир моцарелла, сир рокфор, ананаси, томатна паста, петрушка",
            "sizes": ["30 см", "40 см"],
            "prices": [99, 169],
            "image": "images/impreza.jpg",
            "category": ["meat", "pineapple"]
        },
        {
            "name": "BBQ",
            "description": "Мисливські ковбаски, ковбаски папероні, шинка, сир домашній, шампіньони, петрушка, оливки",
            "sizes": ["30 см", "40 см"],
            "prices": [139, 199],
            "image": "images/bbq.jpg",
            "category": ["meat", "mushroom"]
        },
        {
            "name": "Міксовий поло",
            "description": "Вітчина, куриця копчена, сир моцарелла, ананаси, кукурудза, петрушка, соус томатний",
            "sizes": ["30 см", "40 см"],
            "prices": [115, 179],
            "image": "images/miksoviy_polo.jpg",
            "category": ["meat", "pineapple"]
        }
    ];

    function displayPizzas(filter = 'all') {
        pizzaList.innerHTML = '';
        const filteredPizzas = filter === 'all' ? pizzas : pizzas.filter(pizza => pizza.category.includes(filter));
        filteredPizzas.forEach(pizza => {
            const pizzaItem = document.createElement('article');
            pizzaItem.classList.add('pizza-item');
            pizzaItem.innerHTML = `
                <img src="${pizza.image}" alt="${pizza.name}">
                <h2>${pizza.name}</h2>
                <p>${pizza.description}</p>
                <div class="sizes">
                    ${pizza.sizes.map((size, index) => `<span data-price="${pizza.prices[index]}">${size}</span>`).join('')}
                </div>
                <div class="prices">
                    ${pizza.prices.map(price => `<span>${price} грн</span>`).join('')}
                </div>
                <button class="buy-btn">Купити</button>
            `;
            pizzaList.appendChild(pizzaItem);
        });
    }

    function addToCart(name, size, price) {
        const existingItem = cart.find(item => item.name === name && item.size === size);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, size, price, quantity: 1 });
        }
        updateCart();
        saveCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let totalPrice = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} (${item.size})</span>
                <span>${item.price} грн</span>
                <span>Кількість: ${item.quantity}</span>
                <button class="increase">+</button>
                <button class="decrease">-</button>
                <button class="remove">x</button>
            `;
            cartItems.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });
        totalPriceElement.innerText = `${totalPrice} грн`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    pizzaList.addEventListener('click', e => {
        if (e.target.classList.contains('buy-btn')) {
            const pizzaItem = e.target.closest('.pizza-item');
            const name = pizzaItem.querySelector('h2').innerText;
            const sizeElement = pizzaItem.querySelector('.sizes span');
            const size = sizeElement.innerText;
            const price = parseInt(sizeElement.getAttribute('data-price'));
            addToCart(name, size, price);
        }
    });

    cartItems.addEventListener('click', e => {
        const itemElement = e.target.closest('.cart-item');
        const name = itemElement.querySelector('span').innerText.split(' (')[0];
        const size = itemElement.querySelector('span').innerText.split(' (')[1].split(')')[0];
        if (e.target.classList.contains('increase')) {
            addToCart(name, size);
        } else if (e.target.classList.contains('decrease')) {
            const item = cart.find(item => item.name === name && item.size === size);
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(item => !(item.name === name && item.size === size));
            }
            updateCart();
            saveCart();
        } else if (e.target.classList.contains('remove')) {
            cart = cart.filter(item => !(item.name === name && item.size === size));
            updateCart();
            saveCart();
        }
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
        saveCart();
    });

    document.querySelectorAll('.filters button').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            displayPizzas(filter);
        });
    });

    displayPizzas();
    updateCart();
});
