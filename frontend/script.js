// document.addEventListener("DOMContentLoaded", async function () {
//     try {
//         // ดึง Categories จาก Backend
//         const categoryRes = await fetch("http://localhost:5000/api/categories");
//         const categories = await categoryRes.json();
//         const categoryList = document.getElementById("category-list");
        
//         categories.forEach(category => {
//             let li = document.createElement("li");
//             li.className = "list-group-item";
//             li.textContent = category.name;
//             categoryList.appendChild(li);
//         });

//         // ดึง Products จาก Backend
//         const productRes = await fetch("http://localhost:5000/api/products");
//         const products = await productRes.json();
//         const productList = document.getElementById("product-list");

//         products.forEach(product => {
//             let li = document.createElement("li");
//             li.className = "list-group-item d-flex justify-content-between align-items-center";
//             li.innerHTML = `${product.name} <span class="badge bg-secondary">$${product.price}</span>`;
//             productList.appendChild(li);
//         });

//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// });
