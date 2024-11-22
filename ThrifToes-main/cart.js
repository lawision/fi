document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotal");
    const dfElement = document.getElementById("df");
    const totalElement = document.getElementById("total");

    const currentUser = localStorage.getItem("currentUser");

    // Load cart items for the current user
    function loadCartItems() {
        return JSON.parse(localStorage.getItem(currentUser + "_cart")) || [];
    }

    // Render cart items
    function renderCart() {
        const cartItems = loadCartItems();
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Your cart is empty.</td></tr>";
            subtotalElement.textContent = "₱0.00";
            dfElement.textContent = "₱100.00";
            totalElement.textContent = "₱0.00";
            return;
        }

        cartItems.forEach((item, index) => {
            const price = Number(item.price);
            const itemTotal = price * 1;  
            subtotal += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.brand}</td>
                <td>₱${price.toFixed(2)}</td>
                <td>₱${itemTotal.toFixed(2)}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });

        const df = subtotal * 100.0;
        const total = subtotal + df;

        subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        dfElement.textContent = `₱${df.toFixed(2)}`;
        totalElement.textContent = `₱${total.toFixed(2)}`;
    }

    // Remove item from cart
    cartItemsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            let cartItems = loadCartItems();
            cartItems.splice(index, 1);
            localStorage.setItem(currentUser + "_cart", JSON.stringify(cartItems));
            renderCart();
        }
    });

    // Checkout functionality
    document.getElementById("checkoutBtn").addEventListener("click", () => {
        const cartItems = loadCartItems();
        if (cartItems.length > 0) {
            const currentDate = new Date().toLocaleString();

            localStorage.setItem(currentUser + "_checkoutItems", JSON.stringify(cartItems));

            const salesData = JSON.parse(localStorage.getItem(currentUser + "_salesData")) || [];
            const newSale = {
                orderId: "ORD" + Math.floor(Math.random() * 10000),
                products: cartItems,
                totalAmount: cartItems.reduce((acc, item) => acc + item.price * 1, 0),
                date: currentDate
            };

            salesData.push(newSale);
            localStorage.setItem(currentUser + "_salesData", JSON.stringify(salesData));

            localStorage.setItem(currentUser + "_cart", JSON.stringify([])); 

            window.location.href = "payment.html";
        } else {
            alert("Your cart is empty!");
        }
    });

    renderCart();

    const logoutBtn = document.getElementById("logoutBtn");

    // If no user is logged in, alert and redirect to login page
    if (!currentUser) {
        alert("Please log in first.");
        location.replace("login.html"); // Redirect to the login page
        return; // Exit the function to prevent further code execution
    }

    logoutBtn.addEventListener("click", () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            // Remove the 'currentUser' from localStorage
            localStorage.removeItem("currentUser");
            alert("You have logged out successfully.");
        }
    });
});
