document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const passwordField = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');


    const adminEmail = 'admin@example.com'; 
    const adminPassword = 'admin123'; 

    const clearErrorMessage = () => {
        errorMessage.textContent = '';
    };

    togglePassword.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrorMessage();

        const email = document.getElementById('username').value.trim();
        const password = passwordField.value.trim();

        if (!email || !password) {
            errorMessage.textContent = 'Please enter both email and password.';
            return;
        }

        if (email === adminEmail && password === adminPassword) {
            const now = new Date().toLocaleString();
            const adminData = {
                email: adminEmail,
                role: 'admin',
                lastLogin: now,
            };
            localStorage.setItem('currentUser', JSON.stringify(adminData));
            alert('Admin logged in successfully!');
            window.location = 'admin.html'; 
            return;
        }

        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.emailAddress === email && user.password === password);

        if (user) {
            if (user.status === 'disabled') {
                errorMessage.textContent = "Your account has been disabled. Please contact support.";
                return;
            }

            
            const now = new Date().toLocaleString();
            user.lastLogin = now;
            localStorage.setItem('users', JSON.stringify(users));

            
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.emailAddress,
                role: 'user',
                lastLogin: now,
            }));

            alert(`Login successful! Welcome, ${user.firstName}`);
            window.location = 'index.html'; 
        } else {
            errorMessage.textContent = 'Invalid email or password. Please try again.';
        }
    });

    
    document.getElementById('username').addEventListener('input', clearErrorMessage);
    passwordField.addEventListener('input', clearErrorMessage);
});
