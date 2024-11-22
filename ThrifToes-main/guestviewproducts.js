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
        
        // Add to Cart functionality
        const addToCartBtn = document.querySelector(".add-to-cart");
        if (addToCartBtn && !isConfirmed) {
            addToCartBtn.addEventListener("click", () => {
                addToCart(product);
            });
        }
    } else {
        productDetailsSection.innerHTML = "<p>Product not found.</p>";
    }

    const cart = document.getElementById("cart");
    cart.addEventListener("click", function() {
        alert("You need to Login First!!");
    });

    // The addToCart function will now redirect to login.html if no user is logged in
    function addToCart(product) {
        if (!currentUser) {
            alert("Log in First to add items to cart!");
            return; // Prevent further code execution
        }
    }
});
