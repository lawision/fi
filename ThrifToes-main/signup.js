document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const address = document.getElementById("address").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;
        const newPassword = document.getElementById("newPassword").value;

        // Check if any required field is missing
        if (!firstName || !lastName || !emailAddress || !newPassword || !contactNumber || !address) {
            alert("Please fill out all the required fields.");
            return;
        }

        // Validate contact number (should be exactly 11 digits)
        if (contactNumber.length !== 11 || isNaN(contactNumber)) {
            alert("Please enter a valid contact number!!");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if the email is already registered
        const existingUser = users.find(user => user.emailAddress === emailAddress);
        if (existingUser) {
            alert("Email address already registered. Please use another email.");
            return;
        }

        // Create the new user object
        const newUser = {
            firstName,
            lastName,
            contactNumber,
            address,
            emailAddress,
            password: newPassword
        };

        // Save the new user to localStorage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully!");
        window.location.href = "login.html";
    });
});
