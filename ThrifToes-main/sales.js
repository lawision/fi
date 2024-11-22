document.addEventListener("DOMContentLoaded", () => {
    const salesTableBody = document.getElementById("salesTableBody");

    // Get all keys in localStorage that contain "_salesHistory"
    const allSalesHistoryKeys = Object.keys(localStorage).filter(key => key.includes("_salesHistory"));

    console.log("All Sales History Keys:", allSalesHistoryKeys);

    // Function to render the sales data
    function renderSales() {
        salesTableBody.innerHTML = ""; // Clear any existing rows

        // Loop through each sales history key
        allSalesHistoryKeys.forEach(salesKey => {
            console.log(`Processing sales for key: ${salesKey}`);

            // Get sales data from localStorage
            const salesData = JSON.parse(localStorage.getItem(salesKey)) || [];

            if (salesData.length === 0) {
                // Display message if no sales data exists
                const noDataRow = document.createElement("tr");
                noDataRow.innerHTML = `<td colspan='6'>No sales data available.</td>`;
                salesTableBody.appendChild(noDataRow);
                return;
            }

            // Extract user email from the key or fallback
            const emailAddress = salesKey.replace("_salesHistory", "") || "Unknown User";

            // Render sales data
            salesData.forEach(sale => {
                const row = document.createElement("tr");

                // Calculate total amount for the sale
                const totalAmount = sale.products.reduce(
                    (sum, product) => sum + product.price * product.quantity,
                    0
                );

                const formattedTotalAmount = `₱${totalAmount.toFixed(2)}`;

                // Display sale details
                row.innerHTML = `
                    <td>${sale.orderId}</td>
                    <td>${sale.date}</td>
                    <td>${sale.products.map(product => product.name).join(", ")}</td>
                    <td>${sale.products.map(product => product.size).join(", ")}</td>
                    <td>${formattedTotalAmount}</td>
                    <td>${emailAddress}</td>
                `;

                salesTableBody.appendChild(row);
            });
        });
    }

    // Logout function for admin
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

    // Render the sales data on page load
    renderSales();
});
