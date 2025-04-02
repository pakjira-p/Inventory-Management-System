document.addEventListener("DOMContentLoaded", async function () {
    const categoryList = document.getElementById("category-list");
    const searchBox = document.getElementById("search-box");
    const token = localStorage.getItem("token");

    // ตรวจสอบว่าไม่มี token จะทำการ redirect ไปที่หน้า login
    if (!token) {
        window.location.href = "login.html";
    }

    let categories = [];

    // ดึงข้อมูล categories จาก API
    async function fetchCategories() {
        const res = await fetch("http://localhost:5000/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
        });
        categories = await res.json();
        displayCategories(categories)
    }
    

    // แสดงข้อมูล categories ในตาราง
    function displayCategories(filteredCategories) {
        categoryList.innerHTML = ""; // ลบข้อมูลเก่าออกจากตาราง

        filteredCategories.forEach((category) => {
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

        // ตั้งค่า event listener สำหรับปุ่ม Edit และ Delete
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", deleteCategory);
        });

        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", editCategory);
        });
    }

    // ฟังก์ชันสำหรับค้นหาหมวดหมู่
    function searchCategories() {
        const searchTerm = searchBox.value.toLowerCase();
        const filtered = categories.filter((c) =>
            c.name.toLowerCase().includes(searchTerm)
        );
        displayCategories(filtered); // แสดงผลที่กรองแล้ว
    }

    // ตั้งค่าให้ฟังก์ชันค้นหาทำงานเมื่อมีการพิมพ์ในช่องค้นหา
    searchBox.addEventListener("input", searchCategories);

    // ลบหมวดหมู่
    async function deleteCategory(e) {
        const id = e.target.dataset.id;
        const category = categories.find(c => c._id === id);

        if (!category) return alert("Category not found!");

        const confirmation = prompt(`Type the category name "${category.name}" to confirm deletion:`);

        if (confirmation === category.name) {
            try {
                const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    alert("Category deleted successfully!");
                    fetchCategories(); // รีเฟรชข้อมูลหลังลบ
                } else {
                    alert("Failed to delete category.");
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("There was an error deleting category.");
            }
        } else {
            alert("Category name does not match. Deletion cancelled.");
        }
    }

    // ฟังก์ชันสำหรับแก้ไขหมวดหมู่
    function editCategory(e) {
        const id = e.target.dataset.id;
        const category = categories.find(c => c._id === id);
        if (!category) return;

        // กรอกข้อมูลในฟอร์มแก้ไข
        document.getElementById("editCategoryId").value = category._id;
        document.getElementById("editCategoryName").value = category.name;
        document.getElementById("editCategoryDescription").value = category.description;

        const modal = new bootstrap.Modal(document.getElementById("editCategoryModal"));
        modal.show(); // แสดง modal สำหรับแก้ไข
    }

    // ตั้งค่าให้ฟอร์มแก้ไขทำงาน
    document.getElementById("editCategoryForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const categoryId = document.getElementById("editCategoryId").value;
        const updatedCategory = {
            name: document.getElementById("editCategoryName").value,
            description: document.getElementById("editCategoryDescription").value,
        };

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updatedCategory),
            });

            if (res.ok) {
                alert("Category updated successfully!");
                const modalElement = document.getElementById("editCategoryModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
                fetchCategories(); // รีเฟรชข้อมูลหลังแก้ไข
            } else {
                alert("Failed to update category.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("There was an error updating category.");
        }
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

    // เรียกใช้งานฟังก์ชันเพื่อดึงข้อมูลหมวดหมู่เมื่อโหลดหน้า
    fetchCategories();
});
