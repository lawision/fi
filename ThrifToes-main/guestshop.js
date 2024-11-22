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

    function renderProducts(filteredProducts = products) {
        productGrid.innerHTML = ""; // Clear previous content
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

        paginatedProducts.forEach((product, index) => {
            const isConfirmed = product.confirmed || product.status === "sold";
            const disabledClass = isConfirmed ? "disabled" : "";
            const priceClass = isConfirmed ? "sold-out" : "";

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <a href="guestviewproducts.html?index=${index}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                <div class="des ${isConfirmed ? "sold" : ""}">
                    <span>${product.brand}</span>
                    <h5>Name: ${product.name}</h5>
                    <h5>Color: ${product.color}</h5>
                    <h5>Size: ${product.size} US</h5>
                    <h4>₱ ${product.price}</h4>
                </div>
                <button class="add-to-cart ${disabledClass}" data-index="${index}" ${isConfirmed ? "disabled" : ""}>
                    <i class="fa-solid fa-cart-shopping"></i>${isConfirmed ? "Sold Out" : "Add to Cart"}
                </button>
            `;

            productGrid.appendChild(productCard);
        });

        renderPaginationButtons(filteredProducts.length);
    }

    function filterProducts() {
        const brandValue = brandSearch.value.toLowerCase();
        const maxPrice = parseFloat(priceSearch.value) || Infinity;
        const sizeValue = sizeSearch.value.toLowerCase(); // Get size filter value

        const filteredProducts = products.filter(product => {
            const matchesBrand = product.brand.toLowerCase().includes(brandValue);
            const matchesPrice = product.price <= maxPrice;
            const matchesSize = product.size.toLowerCase().includes(sizeValue); // Check size match
            return matchesBrand && matchesPrice && matchesSize;
        });

        currentPage = 1; // Reset to the first page after filtering
        renderProducts(filteredProducts);
    }

    function renderPaginationButtons(totalProducts) {
        pagination.innerHTML = ""; // Clear previous pagination buttons
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.innerText = i;
            pageButton.classList.add("pagination-button");
            if (i === currentPage) pageButton.classList.add("active");

            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderProducts();
            });

            pagination.appendChild(pageButton);
        }
    }

    brandSearch.addEventListener("input", filterProducts);
    priceSearch.addEventListener("input", filterProducts);
    sizeSearch.addEventListener("input", filterProducts); // Add size search event listener

    renderProducts(); // Initial render of products

    productGrid.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productIndex = e.target.getAttribute("data-index");
            const selectedProduct = products[productIndex];

            addToCart(selectedProduct); // Call addToCart function
        }
    });

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
