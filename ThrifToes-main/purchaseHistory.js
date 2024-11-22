document.addEventListener("DOMContentLoaded", () => {
    const salesHistoryTableBody = document.getElementById("salesHistoryTableBody");
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Parse the current user

    // Redirect if no user is logged in
    if (!currentUser || !currentUser.email) {
        alert("No user found. Please log in.");
        location.replace("login.html"); // Redirect to login page
        return;
    }

    const salesHistoryKey = `${currentUser.email}_salesHistory`;

    // Retrieve sales history from localStorage
    const salesHistory = JSON.parse(localStorage.getItem(salesHistoryKey)) || [];

    // Display message if no sales history is available
    if (salesHistory.length === 0) {
        salesHistoryTableBody.innerHTML = "<tr><td colspan='5' style='text-align: center;'>No sales history available.</td></tr>";
    } else {
        // Iterate through sales history and display the information
        salesHistory.forEach(sale => {
            const saleDate = sale.date; // The date when the order was made

            sale.products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${saleDate}</td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.size || 'N/A'}</td>
                    <td>₱${sale.totalAmount}</td>
                `;
                salesHistoryTableBody.appendChild(row);
            });
        });
    }

    // Logout button functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            const confirmLogout = window.confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                // Remove 'currentUser' from localStorage
                localStorage.removeItem("currentUser");
                alert("You have logged out successfully.");
                location.href = "login.html"; // Redirect to login page
            }
        });
    } else {
        console.error("Logout button not found in the DOM.");
    }
});
