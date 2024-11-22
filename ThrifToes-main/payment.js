document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById("paymentForm");

    // Get the current user's information (email or username)
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Assuming currentUser contains user details
    const currentUserEmail = currentUser?.email || ""; // Safely retrieve the email from currentUser object

    // Load checkout items for the current user
    const checkoutItems = JSON.parse(localStorage.getItem(currentUserEmail + "_checkoutItems")) || [];
    
    // The status to be updated for purchased products
    const newStatus = "sold"; 

    paymentForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get the values from the form fields
        const name = document.getElementById("name").value;
        const contact = document.getElementById("contact").value;
        const address = document.getElementById("address").value;
        const landmark = document.getElementById("landmark").value;
        const postalCode = document.getElementById("postalCode").value;
        const paymentMethod = document.getElementById("paymentMethod").value;

        // Create an object for the payment details
        const paymentDetails = {
            name,
            contact,
            address,
            landmark,
            postalCode,
            paymentMethod
        };

        // Save payment details to localStorage
        localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));

        // Load the products from localStorage
        const products = JSON.parse(localStorage.getItem("products")) || []; // Assuming 'products' is the key for all products in localStorage

        // Loop through products to update their status if they are in the checkout items
        products.forEach(product => {
            checkoutItems.forEach(checkoutItem => {
                if (product.productId === checkoutItem.productId) {
                    product.status = newStatus; // Update product status to "sold"
                }
            });
        });

        // Save the updated products list back to localStorage
        localStorage.setItem("products", JSON.stringify(products));

        // Remove the user's cart and checkout items after payment
        localStorage.removeItem(currentUserEmail + "_cart");
        localStorage.removeItem(currentUserEmail + "_checkoutItems");

        // Redirect to the confirmation page
        window.location.href = "confirmation.html";
    });
});
