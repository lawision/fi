document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("productGrid");
    const brandSearch = document.getElementById("brand-search");
    const priceSearch = document.getElementById("price-search");
    const sizeSearch = document.getElementById("size-search"); // New size search input
    const pagination = document.getElementById("pagination");
    const currentUser = localStorage.getItem("currentUser"); // Get the logged-in user

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const productsPerPage = 5; // Number of products per page
    let currentPage = 1;

    // Render products on the page
    function renderProducts(filteredProducts = products) {
        productGrid.innerHTML = ""; // Clear previous content

        if (filteredProducts.length === 0) {
            // Display a message if no products match the filters
            const noProductsMessage = document.createElement("div");
            noProductsMessage.classList.add("no-products-message");
            noProductsMessage.textContent = "No products found matching your search criteria.";
            productGrid.appendChild(noProductsMessage);
            return;
        }

        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

        paginatedProducts.forEach((product, index) => {
            const isConfirmed = product.confirmed || product.status === "sold";
            const disabledClass = isConfirmed ? "disabled" : "";

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <a href="viewproduct.html?index=${index}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                <div class="des ${isConfirmed ? "sold" : ""}">
                    <span>${product.brand}</span>
                    <h5>Name: ${product.name}</h5>
                    <h5>Color: ${product.color}</h5>
                    <h5>Size: ${product.size} US</h5>
                    <h4>₱ ${product.price} </h4>
                </div>
                <button class="add-to-cart ${disabledClass}" data-index="${index}" ${isConfirmed ? "disabled" : ""}>
                    <i class="fa-solid fa-cart-shopping"></i>${isConfirmed ? "Sold Out" : "Add to Cart"}
                </button>
            `;

            productGrid.appendChild(productCard);
        });

        renderPagination(filteredProducts.length);
    }

    // Render pagination buttons
    function renderPagination(totalProducts) {
        pagination.innerHTML = ""; // Clear previous buttons
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("pagination-button");
            if (i === currentPage) button.classList.add("active");

            button.addEventListener("click", () => {
                currentPage = i;
                renderProducts();
            });
            pagination.appendChild(button);
        }
    }

    // Add to Cart functionality
    productGrid.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productIndex = e.target.getAttribute("data-index");
            const selectedProduct = products[productIndex];

            if (selectedProduct.confirmed || selectedProduct.status === "sold") {
                alert("This item has already been confirmed and cannot be added to the cart.");
                return;
            }

            // Check if the item is already in the cart before disabling the button
            const itemExists = isItemInCart(selectedProduct);
            if (itemExists) {
                alert(`${selectedProduct.name} is already in the cart.`);
            } else {
                addToCart(selectedProduct);
                e.target.disabled = true; // Disable the button after successfully adding to the cart
                alert(`${selectedProduct.name} added to cart!`);
            }
        }
    });

    // Check if the item is already in the cart
    function isItemInCart(product) {
        if (!currentUser) return false;

        const userCart = JSON.parse(localStorage.getItem(`${currentUser}_cart`)) || [];
        return userCart.some(item => 
            item.name === product.name && 
            item.brand === product.brand && 
            item.size === product.size && 
            item.price === product.price &&
            item.description === product.description
        );
    }

    // Add to Cart helper function
    function addToCart(product) {
        if (!currentUser) {
            alert("Please log in to add items to the cart.");
            window.location.href = "login.html"; // Redirect to login if not logged in
            return;
        }

        let userCart = JSON.parse(localStorage.getItem(`${currentUser}_cart`)) || [];
        userCart.push({ ...product, quantity: 1 });
        localStorage.setItem(`${currentUser}_cart`, JSON.stringify(userCart));
    }

    // Filter products based on brand, price, and size
    function filterProducts() {
        const brandValue = brandSearch.value.toLowerCase();
        const maxPrice = parseFloat(priceSearch.value) || Infinity;
        const sizeValue = sizeSearch.value.toLowerCase(); // Get size filter value

        const filtered = products.filter(product => {
            const matchesBrand = product.brand.toLowerCase().includes(brandValue);
            const matchesPrice = product.price <= maxPrice;
            const matchesSize = product.size.toLowerCase().includes(sizeValue); // Check size match
            return matchesBrand && matchesPrice && matchesSize;
        });

        currentPage = 1;
        renderProducts(filtered);
    }

    // Event listeners for filters
    brandSearch.addEventListener("input", filterProducts);
    priceSearch.addEventListener("input", filterProducts);
    sizeSearch.addEventListener("input", filterProducts); // Add size search listener

    // Initialize page
    renderProducts();

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        // Ask the user to confirm logout
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("currentUser");
            alert("You have logged out successfully.");
            window.location.href = "guestindex.html";
        }
    });
});
