document.addEventListener("DOMContentLoaded", () => {
    const pendingData = JSON.parse(localStorage.getItem("pendingData")) || {};
    const approvedData = JSON.parse(localStorage.getItem("approvedData")) || { products: [] };

    const buyerAndProductDetailsTableBody = document.getElementById("buyerAndProductDetails").querySelector("tbody");
    const approvedOrdersTableBody = document.getElementById("approvedOrders").querySelector("tbody");

    // Render Pending Orders
    const { buyer, products } = pendingData;
    if (products && products.length > 0) {
        products.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${buyer.name}</td>
                <td>${buyer.contact}</td>
                <td>${buyer.address}</td>
                <td>${buyer.landmark || "N/A"}</td>
                <td>${buyer.postalCode}</td>
                <td>${buyer.paymentMethod}</td>
                <td>${product.name}</td>
                <td>₱${product.price}</td>
                <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                <td>
                    <button class="action-btn approve" data-index="${index}" ${product.status2 === "Approved" ? "disabled" : ""}>Approve</button>
                    <button class="action-btn reject" data-index="${index}" ${product.status2 === "Rejected" ? "disabled" : ""}>Reject</button>
                </td>
                <td class="status">${product.status2 || "Pending"}</td>
            `;
            buyerAndProductDetailsTableBody.appendChild(row);
        });
    } else {
        buyerAndProductDetailsTableBody.innerHTML = "<tr><td colspan='12'>No products found.</td></tr>";
    }

    // Render Approved Orders
    if (approvedData.products.length > 0) {
        approvedData.products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.buyerName || "N/A"}</td>
                <td>${product.buyerContact || "N/A"}</td>
                <td>${product.buyerAddress || "N/A"}</td>
                <td>${product.buyerLandmark || "N/A"}</td>
                <td>${product.buyerPostalCode || "N/A"}</td>
                <td>${product.buyerPaymentMethod || "N/A"}</td>
                <td>${product.name}</td>
                <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                <td>${product.approvedDate}</td>
                <td>${product.paymentDetails || "N/A"}</td>
            `;
            approvedOrdersTableBody.appendChild(row);
        });
    } else {
        approvedOrdersTableBody.innerHTML = "<tr><td colspan='11'>No approved orders found.</td></tr>";
    }

    // Event delegation for Approve and Reject buttons
    buyerAndProductDetailsTableBody.addEventListener("click", (event) => {
        const target = event.target;
        const index = target.getAttribute("data-index");

        if (target.classList.contains("approve") || target.classList.contains("reject")) {
            const statusCell = target.closest("tr").querySelector(".status");

            // Disable both buttons for the current row permanently
            const row = target.closest("tr");
            const approveButton = row.querySelector(".approve");
            const rejectButton = row.querySelector(".reject");
            approveButton.disabled = true;
            rejectButton.disabled = true;

            if (target.classList.contains("approve")) {
                statusCell.textContent = "Approved";
                alert(`Product ${products[index].name} approved.`);
                const paymentDetails = `Payment of ₱${(products[index].price * products[index].quantity).toFixed(2)} was received via ${buyer.paymentMethod}.`;
                products[index].status = "sold";
                products[index].status2 = "Approved";
                products[index].approvedDate = new Date().toLocaleString();
                products[index].paymentDetails = paymentDetails;

                // Update localStorage for pendingData
                pendingData.products = products;
                localStorage.setItem("pendingData", JSON.stringify(pendingData));

                // Add approved product to approvedData
                approvedData.products.push({
                    ...products[index],
                    buyerName: buyer.name,
                    buyerContact: buyer.contact,
                    buyerAddress: buyer.address,
                    buyerLandmark: buyer.landmark,
                    buyerPostalCode: buyer.postalCode,
                    buyerPaymentMethod: buyer.paymentMethod,
                    paymentDetails: paymentDetails,
                });

                // Update localStorage for approvedData
                localStorage.setItem("approvedData", JSON.stringify(approvedData));

                // Re-render the tables to reflect changes
                renderProducts();
            } else if (target.classList.contains("reject")) {
                statusCell.textContent = "Rejected";
                alert(`Product ${products[index].name} rejected.`);
                products[index].status2 = "Rejected";

                // Update localStorage for pendingData
                pendingData.products = products;
                localStorage.setItem("pendingData", JSON.stringify(pendingData));

                // Re-render the tables to reflect changes
                renderProducts();
            }
        }
    });

    // Render all products initially
    function renderProducts() {
        buyerAndProductDetailsTableBody.innerHTML = "";
        approvedOrdersTableBody.innerHTML = "";

        // Re-render pending and approved data
        if (pendingData && pendingData.products) {
            pendingData.products.forEach((product, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${buyer.name}</td>
                    <td>${buyer.contact}</td>
                    <td>${buyer.address}</td>
                    <td>${buyer.landmark || "N/A"}</td>
                    <td>${buyer.postalCode}</td>
                    <td>${buyer.paymentMethod}</td>
                    <td>${product.name}</td>
                    <td>${product.productId}</td>
                    <td>₱${product.price}</td>
                    <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                    <td>
                        <button class="action-btn approve" data-index="${index}" ${product.status2 === "Approved" ? "disabled" : ""}>Approve</button>
                        <button class="action-btn reject" data-index="${index}" ${product.status2 === "Rejected" ? "disabled" : ""}>Reject</button>
                    </td>
                    <td class="status">${product.status2 || "Pending"}</td>
                `;
                buyerAndProductDetailsTableBody.appendChild(row);
            });
        }

        if (approvedData.products) {
            approvedData.products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.buyerName || "N/A"}</td>
                    <td>${product.buyerContact || "N/A"}</td>
                    <td>${product.buyerAddress || "N/A"}</td>
                    <td>${product.buyerLandmark || "N/A"}</td>
                    <td>${product.buyerPostalCode || "N/A"}</td>
                    <td>${product.buyerPaymentMethod || "N/A"}</td>
                    <td>${product.name}</td>
                    <td>${product.productId}</td>
                    <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                    <td>${product.approvedDate}</td>
                    <td>${product.paymentDetails || "N/A"}</td>
                `;
                approvedOrdersTableBody.appendChild(row);
            });
        }
    }

    renderProducts();  // Initialize rendering
});
