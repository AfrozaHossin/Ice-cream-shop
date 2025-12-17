const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');

cartIcon.addEventListener('click', () => {
    cartTab.classList.add('cart-tab-active');
});

const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        cartTab.classList.remove('cart-tab-active');
    });
}

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu-active');
    bars.classList.toggle('fa-xmark');
});

let productList = [];
let cartProduct = [];

const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    
    document.querySelectorAll('.item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-value').textContent);
        const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));
        totalPrice += price;
        totalQuantity += quantity;
    });
    
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
}

const showCards = () => {
    cardList.innerHTML = "";

    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn card-btn">Add to cart</a>
        `;

        cardList.appendChild(orderCard);

        orderCard.querySelector('.card-btn').addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};

const addToCart = (product) => {
    const existingProduct = cartProduct.find(item => item.id == product.id);
    if (existingProduct) {
        alert('Item already in your cart');
        return;
    }
    cartProduct.push(product);
    let quantity = 1;
    let price = parseFloat(product.price.replace('$', ''));

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">$${(price * quantity).toFixed(2)}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>
    `;

    cartList.appendChild(cartItem);

    const plusBtn = cartItem.querySelector('.plus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');
    const minusBtn = cartItem.querySelector('.minus');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
        updateTotals();
    });

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
            updateTotals();
        } else {
            cartItem.classList.add('slide-out');
            setTimeout(() => {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotals();
            }, 300);
        }
    });

    cartTab.classList.add('cart-tab-active');
    updateTotals();
};

// Simple checkout function
const handleCheckout = (e) => {
    e.preventDefault();
    
    if (cartProduct.length === 0) {
        alert('Your cart is empty! Add some items first.');
        return;
    }
    
    const total = cartTotal.textContent;
    const itemCount = cartValue.textContent;
    
    // Simple confirmation message
    const confirmCheckout = confirm(`You have ${itemCount} items in your cart.\nTotal: ${total}\n\nProceed to checkout?`);
    
    if (confirmCheckout) {
        // Show checkout success message
        alert(`Checkout successful!\n\nThank you for your purchase.\nOrder Total: ${total}\n\nYour order will be processed shortly.`);
        
        // Clear the cart after checkout
        cartList.innerHTML = '';
        cartProduct = [];
        updateTotals();
        
        // Close the cart tab
        cartTab.classList.remove('cart-tab-active');
    }
};

// Add event listener to checkout button
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.btn-container .btn:not(.close-btn)');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});

fetch('products.json')
    .then(res => res.json())
    .then(data => {
        productList = data;
        showCards();
    })
    .catch(error => {
        console.error('Error loading products:', error);
    });