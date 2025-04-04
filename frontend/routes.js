document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const productBtn = document.getElementById("ProductPage-btn");
    const categoryBtn = document.getElementById("CategoriesPage-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // Navigation Handler
    const navigateTo = (url) => {
        window.location.href = url;
    };

    // Bind Events
    if (productBtn) {
        productBtn.addEventListener("click", () => navigateTo("products.html"));
    }

    if (categoryBtn) {
        categoryBtn.addEventListener("click", () => navigateTo("categories.html"));
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            try {
                localStorage.removeItem("token");
                navigateTo("login.html");
            } catch (err) {
                console.error("Logout error:", err);
                alert("Error during logout. Please try again.");
            }
        });
    }
});
