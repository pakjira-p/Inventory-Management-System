document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const logoutBtn = document.getElementById("logout-btn");

    // Protect Route: Redirect to login if not authenticated
    if (window.location.pathname.includes("index.html")) {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
        }
    }

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const res = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "products.html";
                } else {
                    alert(data.message || "Login failed.");
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("An error occurred during login.");
            }
        });
    }

    // Register Handler
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const res = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Register successful! Please login.");
                    window.location.href = "login.html";
                } else {
                    alert(data.message || "Registration failed.");
                }
            } catch (err) {
                console.error("Registration error:", err);
                alert("An error occurred during registration.");
            }
        });
    }

    // Logout Handler (Uncomment to use)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }
});
