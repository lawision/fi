document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    // Check if there's no current user
    const currentUser = localStorage.getItem("currentUser");

    // If no user is logged in, alert and redirect to login page
    if (!currentUser) {
        alert("Please log in first.");
        location.replace("login.html"); 
        return; 
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
