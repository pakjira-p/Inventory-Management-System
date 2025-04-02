document.addEventListener("DOMContentLoaded", async function () {
    const productList = document.getElementById("product-list");
    const categoryFilter = document.getElementById("category-filter");
    const searchBox = document.getElementById("search-box");
    const token = localStorage.getItem("token");
    
    if (!token) {
        window.location.href = "login.html";
    }

    let products = []; // Store all products
    let categories = []; // Store categories

    // Fetch categories
    async function fetchCategories() {
        const res = await fetch("http://localhost:5000/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
        });
        categories = await res.json();
        

        // เพิ่มตัวเลือก "All Categories"
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Categories";
        categoryFilter.innerHTML = ''
        categoryFilter.appendChild(allOption);

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id; // ใช้ category._id
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    // Fetch products
    async function fetchProducts() {
        const res = await fetch("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
        });
        products = await res.json(); // Store all products
        displayProducts(products);
    }

    // Display products based on selected category or search term
    function displayProducts(filteredProducts) {
        productList.innerHTML = ""; // Clear old data

        filteredProducts.forEach((product) => {
            // ค้นหาหมวดหมู่ที่ตรงกับ category._id
            const matchedCategory = categories.find(cat => cat._id === product.category);
            const categoryName = matchedCategory ? matchedCategory.name : "No Category";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>${categoryName}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${product._id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">Delete</button>
                </td>
            `;
            productList.appendChild(row);
        });

        // Add event listeners for delete and edit buttons
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", deleteProduct);
        });

        document.addEventListener("click", function (e) {
            if (e.target.classList.contains("edit-btn")) {
                editProduct(e);

            }
        });
    }

    // Function to filter products based on category and search term
    function filterProducts() {
        const searchTerm = searchBox.value.toLowerCase(); // Get search term
        const selectedCategory = categoryFilter.value; // Get selected category

        // Filter products based on both search term and category
        const filtered = products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm); // Match search term
            const matchesCategory = selectedCategory === "all" || p.category === selectedCategory; // Match category
            return matchesSearch && matchesCategory; // Return true if both conditions match
        });

        displayProducts(filtered); // Display the filtered products
    }

    // Filter products when category changes or search term is typed
    categoryFilter.addEventListener("change", filterProducts);
    searchBox.addEventListener("input", filterProducts);

    // Delete product with name confirmation
    async function deleteProduct(e) {
        const id = e.target.dataset.id;
        const product = products.find(p => p._id === id);

        if (!product) return alert("Product not found!");

        const confirmation = prompt(`Type the product name "${product.name}" to confirm deletion:`);

        if (confirmation === product.name) {
            await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Product deleted successfully!");
            fetchProducts();
        } else {
            alert("Product name does not match. Deletion cancelled.");
        }
    }

    function editProduct(e) {
        
        const id = e.target.dataset.id;
        const product = products.find(p => p._id === id); // Find the product by id
        
        if (!product) return; // If no product found, return
        // Set the form fields to the product's current values
        document.getElementById("editProductId").value = product._id;
        document.getElementById("editProductName").value = product.name;
        document.getElementById("editProductDescription").value = product.description;
        document.getElementById("editProductPrice").value = product.price;
        document.getElementById("editProductStock").value = product.stock;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById("editProductModal"));
        modal.show();
        
    }   

    // Handle form submission to update the product
    document.getElementById("editProductForm").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission

        const productId = document.getElementById("editProductId").value;
        const updatedProduct = {
            name: document.getElementById("editProductName").value,
            description: document.getElementById("editProductDescription").value,
            price: document.getElementById("editProductPrice").value,
            stock: document.getElementById("editProductStock").value
        };

        // Send PUT request to update product
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedProduct)
        });

        // Show success message
        alert("Product updated successfully!");

        // Check if modal is open and close it
        const modalElement = document.getElementById("editProductModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement); // Get the modal instance

        if (modalInstance) {
            modalInstance.hide(); // Close the modal
        }

        // Refresh the product list after update
        fetchProducts(); 
    });

    // Handle form submission to adding new category
    document.getElementById("addCategoryForm").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission
    
        const categoryName = document.getElementById("categoryName").value; // Get category name
        const categoryDescription = document.getElementById("categoryDescription").value; // Get category description
    
        const newCategory = { name: categoryName, description: categoryDescription};
    
        const token = localStorage.getItem("token");
    
        try {
            // Send POST request to add the new category
            const res = await fetch("http://localhost:5000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newCategory),
            });
            // Fetch categories again to update the list
            await fetchCategories();
    
            if (res.ok) {
                alert("Category added successfully!");
                // Close the modal after adding category
                const modalElement = document.getElementById("addCategoryModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
                if (modalInstance) {
                    modalInstance.hide(); // Close the modal
                    
                }
            } else {
                alert("Failed to add category.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the category.");
        }
    });

    // Fetch categories to populate the dropdown list for selecting category
    async function fetchCategoriesForProduct() {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            console.error("Failed to fetch categories");
            return;
        }

        const categories = await res.json();
        const categorySelect = document.getElementById("productCategory");
        
        // Clear the existing options first
        categorySelect.innerHTML = '';

        // Add the "Select Category" option
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select Category";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        categorySelect.appendChild(defaultOption);

        // Add categories as options
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;  // Use category._id as the value
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // Handle form submission to add a new product
    document.getElementById("addProductForm").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission
    
        const productName = document.getElementById("productName").value; // Get product name
        const productDescription = document.getElementById("productDescription").value; // Get product description
        let productPrice = parseFloat(document.getElementById("productPrice").value); // Get product price and convert to number
        let productStock = parseInt(document.getElementById("productStock").value); // Get product stock and convert to integer
        const productCategory = document.getElementById("productCategory").value; // Get selected category
    
        // ตรวจสอบว่าราคาและสต็อกเป็นตัวเลขที่ถูกต้องหรือไม่
        if (isNaN(productPrice) || productPrice <= 0) {
            alert("Please enter a valid price.");
            return;
        }
    
        if (isNaN(productStock) || productStock < 0) {
            alert("Please enter a valid stock quantity.");
            return;
        }
    
        const newProduct = {
            name: productName,
            description: productDescription,
            price: productPrice,
            stock: productStock,
            categoryId: productCategory 
        };
    
        const token = localStorage.getItem("token");
    
        try {
            // Send POST request to add the new product
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newProduct),
            });
    
            if (res.ok) {
                alert("Product added successfully!");
                // Close the modal after adding product
                const modalElement = document.getElementById("addProductModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();  // Close the modal
                }
    
                // Optionally, refresh the product list or display it dynamically here
                fetchProducts();
            } else {
                const errorResponse = await res.json();
                console.error("Error response:", errorResponse);
                alert(`Failed to add product: ${errorResponse.message || res.statusText}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the product.");
        }
    });
    

    // Fetch categories and products on page load
    await fetchCategories();
    await fetchProducts();
    await fetchCategoriesForProduct();
});
