document.addEventListener("DOMContentLoaded", () => {
    const productDetailsSection = document.getElementById("product-details");

    // Get the product index from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productIndex = urlParams.get("index");

    if (productIndex === null) {
        productDetailsSection.innerHTML = "<p>Can't View Product Details.</p>";
        return;
    }

    // Load products from local storage
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Check if products are stored in localStorage
    if (products.length === 0) {
        productDetailsSection.innerHTML = "<p>Can't View Product Details.</p>";
        return;
    }

    // Get the product based on the index
    const product = products[parseInt(productIndex)];

    // Check if the product is confirmed or sold out
    const isConfirmed = product.confirmed || product.status === "sold";

    if (product) {
        // Display product details
        productDetailsSection.innerHTML = `
            <div class="product-detail-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p><strong>Brand:</strong> ${product.brand}</p>
                    <p><strong>Size:</strong> ${product.size}</p>
                    <p><strong>Price:</strong> ₱${product.price}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <button class="add-to-cart ${isConfirmed ? "disabled" : ""}" data-index="${productIndex}" ${isConfirmed ? "disabled" : ""}>
                        <i class="fa-solid fa-cart-shopping"></i> ${isConfirmed ? "Sold Out" : "Add to Cart"}
                    </button>
                </div>
            </div>
        `;
        
        
        const addToCartBtn = document.querySelector(".add-to-cart");
        if (addToCartBtn && !isConfirmed) {
            addToCartBtn.addEventListener("click", () => {
                addToCart(product);
            });
        }
    } else {
        productDetailsSection.innerHTML = "<p>Product not found.</p>";
    }

    
    function addToCart(product) {
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        
        const existingItem = cartItems.find(item => item.name === product.name);

        if (existingItem) {
            alert(`Only 1 ${product.name} is allowed in the cart.`);
        } else {
            
            cartItems.push({ ...product, quantity: 1 });
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            alert(`${product.name} added to cart!`);
        }
    }

    const logoutBtn = document.getElementById("logoutBtn");
    const currentUser = localStorage.getItem("currentUser");

    
    if (!currentUser) {
        alert("Please log in first.");
        location.replace("login.html"); 
        return; 
    }

    logoutBtn.addEventListener("click", () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");

        if (confirmLogout) {
            localStorage.removeItem("currentUser");
            alert("You have logged out successfully.");
        }
    });
});
