const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const cardList = document.querySelector('#menu-products');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');
const categoryButtons = document.querySelectorAll('.category-btn');

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
let currentCategory = 'all';

// Category filter functionality
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Update current category
        currentCategory = button.dataset.category;
        // Filter and show products
        showCards();
    });
});

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

    // Filter products based on category
    let filteredProducts;
    
    if (currentCategory === 'all') {
        filteredProducts = productList;
    } else {
        filteredProducts = productList.filter(product => {
            // Debug: Check each product's category
            console.log(`Product: ${product.name}, Category: ${product.category}, Looking for: ${currentCategory}`);
            return product.category === currentCategory;
        });
    }

    // Show message if no products found
    if (filteredProducts.length === 0) {
        cardList.innerHTML = `
            <div class="no-products" style="width: 100%; text-align: center; padding: 2rem;">
                <h3>No products found in this category</h3>
                <p>Please check back later!</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
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

// Checkout function
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.btn-container .btn:not(.close-btn)');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (cartProduct.length === 0) {
                alert('Your cart is empty! Add some items first.');
                return;
            }
            
            const total = cartTotal.textContent;
            const itemCount = cartValue.textContent;
            
            const confirmCheckout = confirm(`You have ${itemCount} items in your cart.\nTotal: ${total}\n\nProceed to checkout?`);
            
            if (confirmCheckout) {
                alert(`Checkout successful!\n\nThank you for your purchase.\nOrder Total: ${total}\n\nYour order will be processed shortly.`);
                
                cartList.innerHTML = '';
                cartProduct = [];
                updateTotals();
                cartTab.classList.remove('cart-tab-active');
            }
        });
    }
});

// Load products
fetch('products.json')
    .then(res => res.json())
    .then(data => {
        productList = data;
        console.log('Products loaded:', productList); // Debug
        showCards();
    })
    .catch(error => {
        console.error('Error loading products:', error);
        // Show error message
        cardList.innerHTML = `
            <div class="error" style="width: 100%; text-align: center; padding: 2rem; color: red;">
                <h3>Failed to load products</h3>
                <p>Please check your internet connection and refresh the page.</p>
            </div>
        `;
    });