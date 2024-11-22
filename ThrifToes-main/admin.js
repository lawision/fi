document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const productTableBody = document.getElementById("productTableBody");
    const soldProductTableBody = document.getElementById("soldProductTableBody");
    const logoutBtn = document.getElementById("logoutBtn");

    // Load products from local storage
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // Save products to local storage
    function saveProducts() {
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Render products in both tables
    function renderProducts() {
        productTableBody.innerHTML = "";
        soldProductTableBody.innerHTML = "";

        // Filter out only sold products (approved data)
        const soldProducts = products.filter(product => product.status === 'sold');

        // Render products in the inShop table
        products.forEach((product, index) => {
            const productRow = `
                <td>${product.productId}</td> <!-- Display productId -->
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${parseInt(product.size, 10)} US</td>
                <td>₱${Number(product.price).toFixed(2)}</td>
                <td>${product.color}</td> <!-- Display color -->
                <td>${product.description}</td> <!-- Display description -->
                <td>${product.status}</td>
                <td>
                    <button class="action-btn edit" data-index="${index}">Edit</button>
                    <button class="action-btn delete" data-index="${index}">Delete</button>
                    <button class="action-btn mark-sold" data-index="${index}" ${product.status === "sold" ? "disabled" : ""}>Mark as Sold</button>
                </td>
            `;
            const row = document.createElement("tr");
            row.innerHTML = product.status === "inShop" ? productRow : productRow.replace('mark-sold', 'delete');
            if (product.status === "inShop") {
                productTableBody.appendChild(row);
            }
        });

        // Render sold products in the sold products table
        soldProducts.forEach((product, index) => {
            const productRow = `
                <td>${product.productId}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${parseInt(product.size, 10)} US</td>
                <td>₱${Number(product.price).toFixed(2)}</td>
                <td>${product.color}</td>
                <td>${product.description}</td>
                <td>${product.status}</td>
                <td>
                    <button class="action-btn delete" data-index="${index}">Delete</button>
                </td>
            `;
            const row = document.createElement("tr");
            row.innerHTML = productRow;
            soldProductTableBody.appendChild(row);
        });
    }

    // Handle form submission
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const productId = document.getElementById("productId").value;
        const productName = document.getElementById("productName").value.trim();
        const productBrand = document.getElementById("productBrand").value.trim();
        const productSize = document.getElementById("productSize").value.trim();
        const productPrice = document.getElementById("productPrice").value.trim();
        const productColor = document.getElementById("productColor").value.trim();
        const productDescription = document.getElementById("productDescription").value.trim();
        const productImageInput = document.getElementById("productImage");

        if (!productName || !productBrand || !productSize || !productPrice || !productColor || !productDescription) {
            alert("All fields except the image are required!");
            return;
        }

        if (productImageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const productImage = event.target.result;

                const product = {
                    productId: products.length + 1, // Assign a unique productId
                    name: productName,
                    brand: productBrand,
                    size: productSize,
                    price: productPrice,
                    color: productColor,
                    description: productDescription,
                    image: productImage,
                    status: "inShop"
                };

                if (productId) {
                    products[productId] = product;
                } else {
                    products.push(product);
                }

                productForm.reset();
                saveProducts();
                renderProducts();
            };

            reader.readAsDataURL(productImageInput.files[0]);
        } else if (productId) {
            const existingProduct = products[productId];
            products[productId] = {
                ...existingProduct,
                name: productName,
                brand: productBrand,
                size: productSize,
                price: productPrice,
                color: productColor,
                description: productDescription
            };

            productForm.reset();
            saveProducts();
            renderProducts();
        } else {
            alert("Please upload an image for new products.");
        }
    });

    // Event listeners for product actions
    productTableBody.addEventListener("click", (event) => {
        const target = event.target;
        const index = target.getAttribute("data-index");

        if (target.classList.contains("edit")) {
            editProduct(index);
        } else if (target.classList.contains("delete")) {
            deleteProduct(index);
        } else if (target.classList.contains("mark-sold")) {
            markAsSold(index);
        }
    });

    soldProductTableBody.addEventListener("click", (event) => {
        const target = event.target;
        const index = target.getAttribute("data-index");

        if (target.classList.contains("delete")) {
            deleteProduct(index);
        }
    });

    function editProduct(index) {
        const product = products[index];
        document.getElementById("productId").value = index;
        document.getElementById("productName").value = product.name;
        document.getElementById("productBrand").value = product.brand;
        document.getElementById("productSize").value = product.size;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productColor").value = product.color;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productImage").value = "";
    }

    function deleteProduct(index) {
        if (confirm("Are you sure you want to delete this product?")) {
            products.splice(index, 1);
            saveProducts();
            renderProducts();
        }
    }

    function markAsSold(index) {
        const product = products[index];
        const isConfirmed = confirm(`Are you sure you want to mark "${product.name}" as sold?`);
        if (isConfirmed) {
            product.status = "sold";
            saveProducts();
            renderProducts();
            alert(`Product "${product.name}" has been marked as sold.`);
        } else {
            alert("Product status not changed.");
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            const confirmLogout = window.confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                localStorage.removeItem("currentUser");
                alert("You have logged out successfully.");
                location.href = "login.html"; // Redirect to login page
            }
        });
    } else {
        console.error("Logout button not found in the DOM.");
    }

    renderProducts();
});
