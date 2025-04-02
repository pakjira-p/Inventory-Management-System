document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const logoutBtn = document.getElementById("logout-btn");

    // Protect Routes
    if (window.location.pathname.includes("index.html")) {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const username = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

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
                alert(data.message);
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }
});
