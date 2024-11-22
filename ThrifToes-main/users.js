document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.querySelector("#userTable tbody");

    // Load users from local storage or initialize with example data
    const users = JSON.parse(localStorage.getItem("users"));

    // Save users to local storage if not already present
    localStorage.setItem("users", JSON.stringify(users));

    // Function to render user rows in the table
    function renderUsers() {
        userTableBody.innerHTML = ""; // Clear existing rows

        users.forEach((user, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.contactNumber}</td>
                <td>${user.address}</td>
                <td>${user.emailAddress}</td>
                <td>${user.password}</td>
                <td>${user.lastLogin || "Never Logged In"}</td>
                <td>
                    <button class="enable-btn ${user.status === 'active' ? 'active' : ''}" data-index="${index}" style="background-color: ${user.status === 'active' ? '#4caf50' : '#e0e0e0'};">
                        Enable
                    </button>
                    <button class="disable-btn ${user.status === 'disabled' ? 'active' : ''}" data-index="${index}" style="background-color: ${user.status === 'disabled' ? '#e74c3c' : '#e0e0e0'};">
                        Disable
                    </button>
                </td>
            `;

            userTableBody.appendChild(row);
        });
    }

    // Function to disable a user
    function disableUser(index) {
        const user = users[index];
        user.status = "disabled"; // Set user status to disabled
        localStorage.setItem("users", JSON.stringify(users)); // Save updated users to localStorage
        renderUsers(); // Re-render the table with updated users
    }

    // Function to enable a user
    function enableUser(index) {
        const user = users[index];
        user.status = "active"; // Set user status to active
        localStorage.setItem("users", JSON.stringify(users)); // Save updated users to localStorage
        renderUsers(); // Re-render the table with updated users        
    }

    // Event delegation for enable and disable buttons
    userTableBody.addEventListener("click", (event) => {
        const target = event.target;
        const index = target.getAttribute("data-index");

        if (target.classList.contains("disable-btn")) {
            disableUser(index); // Disable the user
        } else if (target.classList.contains("enable-btn")) {
            enableUser(index); // Enable the user
        }
    });

    // Logout function
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

    // Render users when the page loads
    renderUsers(); // Initial render of the users
});
