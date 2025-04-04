document.addEventListener("DOMContentLoaded", () => {
    const categoryList = document.getElementById("category-list");
    const searchBox = document.getElementById("search-box");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    let categories = [];

    // Fetch all categories
    async function fetchCategories() {
        try {
            const res = await fetch("http://localhost:5000/api/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            categories = await res.json();
            displayCategories(categories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            alert("Failed to load categories.");
        }
    }

    // Display categories to the table
    function displayCategories(list) {
        categoryList.innerHTML = "";

        list.forEach((category) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${category._id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${category._id}">Delete</button>
                </td>
            `;
            categoryList.appendChild(row);
        });

        // Bind edit/delete events
        document.querySelectorAll(".edit-btn").forEach(btn =>
            btn.addEventListener("click", handleEdit)
        );
        document.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", handleDelete)
        );
    }

    // Handle search
    searchBox.addEventListener("input", () => {
        const term = searchBox.value.toLowerCase();
        const filtered = categories.filter(c =>
            c.name.toLowerCase().includes(term)
        );
        displayCategories(filtered);
    });

    // Handle delete category
    async function handleDelete(e) {
        const id = e.target.dataset.id;
        const category = categories.find(c => c._id === id);
        if (!category) return alert("Category not found!");

        const confirmText = prompt(`Type the category name "${category.name}" to confirm deletion:`);
        if (confirmText !== category.name) return alert("Category name does not match. Deletion cancelled.");

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Category deleted.");
                await fetchCategories();
            } else {
                alert("Failed to delete category.");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("An error occurred while deleting category.");
        }
    }

    // Open edit modal
    function handleEdit(e) {
        const id = e.target.dataset.id;
        const category = categories.find(c => c._id === id);
        if (!category) return;

        document.getElementById("editCategoryId").value = category._id;
        document.getElementById("editCategoryName").value = category.name;
        document.getElementById("editCategoryDescription").value = category.description;

        const modal = new bootstrap.Modal(document.getElementById("editCategoryModal"));
        modal.show();
    }

    // Submit edited category
    document.getElementById("editCategoryForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("editCategoryId").value;
        const updated = {
            name: document.getElementById("editCategoryName").value,
            description: document.getElementById("editCategoryDescription").value
        };

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updated)
            });

            if (res.ok) {
                alert("Category updated.");
                const modalElement = document.getElementById("editCategoryModal");
                bootstrap.Modal.getInstance(modalElement).hide();
                await fetchCategories();
            } else {
                alert("Failed to update category.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("An error occurred while updating category.");
        }
    });

    // Add new category
    document.getElementById("addCategoryForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("categoryName").value;
        const description = document.getElementById("categoryDescription").value;

        try {
            const res = await fetch("http://localhost:5000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description })
            });

            if (res.ok) {
                alert("Category added.");
                bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
                await fetchCategories();
                e.target.reset(); // clear form
            } else {
                alert("Failed to add category.");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            alert("An error occurred while adding category.");
        }
    });

    // Init
    fetchCategories();
});
