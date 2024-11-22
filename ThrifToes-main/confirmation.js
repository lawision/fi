document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
    const cartItems = JSON.parse(localStorage.getItem(`${currentUser}_checkoutItems`)) || [];
    const confirmedProducts = JSON.parse(localStorage.getItem("confirmedProducts")) || [];
    const cartItemsTableBody = document.getElementById("cartItemsTableBody");
    const totalAmountElement = document.getElementById("totalAmount");
    const backToShopButton = document.getElementById("backToShop");

    // Populate payment details in the confirmation page
    if (paymentDetails) {
        document.getElementById("confirmName").textContent = paymentDetails.name || "N/A";
        document.getElementById("confirmContact").textContent = paymentDetails.contact || "N/A";
        document.getElementById("confirmAddress").textContent = paymentDetails.address || "N/A";
        document.getElementById("confirmLandmark").textContent = paymentDetails.landmark || "N/A";
        document.getElementById("confirmPostalCode").textContent = paymentDetails.postalCode || "N/A";
        document.getElementById("confirmPaymentMethod").textContent = paymentDetails.paymentMethod || "N/A";
    } else {
        console.error("Payment details not found.");
    }

    // Populate cart items in the confirmation page
    let totalAmount = 0;

    if (cartItems.length > 0) {
        cartItems.forEach((item) => {
            const price = parseFloat(item.price) || 0;
            const itemTotal = price * item.quantity;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.brand}</td>
                <td>${item.color}</td>
                <td>${item.size}</td>
                <td>₱ ${item.price}</td>
            `;
            cartItemsTableBody.appendChild(row);
            totalAmount += itemTotal;
        });
    } else {
        cartItemsTableBody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>No items in your cart.</td></tr>";
    }

    // Display total amount
    if (totalAmountElement) {
        totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
    } else {
        console.error("Total amount element not found.");
    }

    // Back to Shop button functionality
    backToShopButton.addEventListener("click", () => {
        if (paymentDetails && cartItems.length > 0) {
            // Save pending data for the admin page
            const pendingData = { buyer: paymentDetails, products: cartItems };
            localStorage.setItem("pendingData", JSON.stringify(pendingData));

            // Mark confirmed items in the products list
            const allProducts = JSON.parse(localStorage.getItem("products")) || [];
            cartItems.forEach(cartItem => {
                const product = allProducts.find(p => p.name === cartItem.name);
                if (product) {
                    product.confirmed = true; // Mark as confirmed
                }
            });
            localStorage.setItem("products", JSON.stringify(allProducts)); // Save updated products list

            // Redirect to the shop page
            window.location.href = "shop.html"; // Ensure this is the correct page URL
        } else {
            alert("No data available to process.");
        }
    });

    // Disable Add to Cart buttons for confirmed products
    const addToCartButtons = document.querySelectorAll(".add-to-cart"); 
    addToCartButtons.forEach((button) => {
        const productId = button.getAttribute("data-product-id"); 
        if (confirmedProducts.includes(productId)) {
            button.disabled = true;
            button.classList.add("disabled");
        }
    });
});
