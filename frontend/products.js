document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");
    const categoryFilter = document.getElementById("category-filter");
    const searchBox = document.getElementById("search-box");
    const token = localStorage.getItem("token");
    let products = [], categories = [];

    if (!token) return window.location.href = "login.html";

    // ================================
    // Utility Functions
    // ================================
    const getJSON = async (url, options = {}) => {
        const res = await fetch(url, options);
        return await res.json();
    };

    const authHeaders = () => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    // ================================
    // Fetch & Display Functions
    // ================================
    const fetchCategories = async () => {
        categories = await getJSON("http://localhost:5000/api/categories", {
            headers: authHeaders()
        });

        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(cat => {
            categoryFilter.innerHTML += `<option value="${cat._id}">${cat.name}</option>`;
        });
    };

    const fetchProducts = async () => {
        products = await getJSON("http://localhost:5000/api/products", {
            headers: authHeaders()
        });
        displayProducts(products);
    };

    const fetchCategoriesForProduct = async () => {
        const res = await fetch("http://localhost:5000/api/categories", {
            headers: authHeaders()
        });
        if (!res.ok) return console.error("Failed to fetch categories");
        const cats = await res.json();

        const categorySelect = document.getElementById("productCategory");
        categorySelect.innerHTML = '<option disabled selected>Select Category</option>';
        cats.forEach(cat => {
            categorySelect.innerHTML += `<option value="${cat._id}">${cat.name}</option>`;
        });
    };

    // ================================
    // Display & Filter Logic
    // ================================
    const displayProducts = (items) => {
        productList.innerHTML = items.map(product => {
            const category = categories.find(cat => cat._id === product.category)?.name || "No Category";
            return `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${category}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${product._id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">Delete</button>
                    </td>
                </tr>
            `;
        }).join("");

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteProduct);
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", openEditModal);
        });
    };

    const filterProducts = () => {
        const term = searchBox.value.toLowerCase();
        const selected = categoryFilter.value;
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(term) &&
            (selected === "all" || p.category === selected)
        );
        displayProducts(filtered);
    };

    // ================================
    // CRUD Functions
    // ================================
    const deleteProduct = async (e) => {
        const id = e.target.dataset.id;
        const product = products.find(p => p._id === id);
        if (!product) return alert("Product not found!");

        const confirmation = prompt(`Type "${product.name}" to confirm deletion:`);
        if (confirmation !== product.name) return alert("Product name does not match. Deletion cancelled.");

        await fetch(`http://localhost:5000/api/products/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        });

        alert("Product deleted successfully!");
        fetchProducts();
    };

    const openEditModal = (e) => {
        const id = e.target.dataset.id;
        const product = products.find(p => p._id === id);
        if (!product) return;

        document.getElementById("editProductId").value = product._id;
        document.getElementById("editProductName").value = product.name;
        document.getElementById("editProductDescription").value = product.description;
        document.getElementById("editProductPrice").value = product.price;
        document.getElementById("editProductStock").value = product.stock;

        new bootstrap.Modal(document.getElementById("editProductModal")).show();
    };

    const handleProductUpdate = async (e) => {
        e.preventDefault();
        const id = document.getElementById("editProductId").value;
        const updatedProduct = {
            name: document.getElementById("editProductName").value,
            description: document.getElementById("editProductDescription").value,
            price: document.getElementById("editProductPrice").value,
            stock: document.getElementById("editProductStock").value
        };

        await fetch(`http://localhost:5000/api/products/${id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(updatedProduct)
        });

        alert("Product updated successfully!");
        bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();
        fetchProducts();
    };

    const handleCategoryAdd = async (e) => {
        e.preventDefault();
        const newCategory = {
            name: document.getElementById("categoryName").value,
            description: document.getElementById("categoryDescription").value
        };

        const res = await fetch("http://localhost:5000/api/categories", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(newCategory)
        });

        await fetchCategories();

        if (res.ok) {
            alert("Category added successfully!");
            bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
        } else {
            alert("Failed to add category.");
        }
    };

    const handleProductAdd = async (e) => {
        e.preventDefault();
        const price = parseFloat(document.getElementById("productPrice").value);
        const stock = parseInt(document.getElementById("productStock").value);

        if (isNaN(price) || price <= 0) return alert("Please enter a valid price.");
        if (isNaN(stock) || stock < 0) return alert("Please enter a valid stock quantity.");

        const newProduct = {
            name: document.getElementById("productName").value,
            description: document.getElementById("productDescription").value,
            price,
            stock,
            categoryId: document.getElementById("productCategory").value
        };

        const res = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(newProduct)
        });

        if (res.ok) {
            alert("Product added successfully!");
            bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
            fetchProducts();
        } else {
            const error = await res.json();
            alert(`Failed to add product: ${error.message || res.statusText}`);
        }
    };

    // ================================
    // Event Listeners
    // ================================
    categoryFilter.addEventListener("change", filterProducts);
    searchBox.addEventListener("input", filterProducts);
    document.getElementById("editProductForm").addEventListener("submit", handleProductUpdate);
    document.getElementById("addCategoryForm").addEventListener("submit", handleCategoryAdd);
    document.getElementById("addProductForm").addEventListener("submit", handleProductAdd);

    // ================================
    // Init
    // ================================
    await fetchCategories();
    await fetchProducts();
    await fetchCategoriesForProduct();
});
