document.addEventListener("DOMContentLoaded", function () {
    // Routes management
    const ProductPage = document.getElementById("ProductPage-btn");
    const CategoriesPage = document.getElementById("CategoriesPage-btn");
    const logoutBtn = document.getElementById("logout-btn");
    
     // ProductPage
     if (ProductPage) {
        ProductPage.addEventListener("click", function () {
            window.location.href = "products.html";
        });
    }

    // CategoriesPage
    if (CategoriesPage) {
        CategoriesPage.addEventListener("click", function () {
            window.location.href = "categories.html";
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