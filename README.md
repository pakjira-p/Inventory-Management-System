# Inventory-Management-System (In progress)
Deploy on Rander [Live Demo]()

## Description

This project is designed as a test application for practicing software testing techniques. It includes fundamental features for inventory management, such as category and product management, authentication, and API endpoints.


## Features

- Authentication: Register and Login functionality using JWT for secure access.

- Category Management: CRUD operations for Categories

- Product Management: CRUD operations for Product

- API Endpoints: Exposes RESTful APIs for integration and testing purposes

## Tools & Resources:

- Frontend: HTML, CSS, JavaScript (Vanilla JS)

- Backend: Node.js, Express.js

- Database: MongoDB

- Authentication: JWT (JSON Web Token)

## Screenshots

![LaningPage](https://scontent.fbkk22-8.fna.fbcdn.net/v/t39.30808-6/487856938_9547251245360663_8895935664821078421_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UIgc6KTa7uwQ7kNvgEVSrlw&_nc_oc=AdlVB5hK5rsKc1k4BBsMWq5s4DNoQ-p1rg0vGZXwbddprL2rCaTQqvc-tXeffG86fxI&_nc_zt=23&_nc_ht=scontent.fbkk22-8.fna&_nc_gid=I_ybALAtsE1kcUDD-E_aQQ&oh=00_AYF8jiYOMQO6aW4g0knAPpiSwIp28xO2iplp2EAzsmuSgQ&oe=67F2FB40)

![LoginPage](https://scontent.fbkk22-3.fna.fbcdn.net/v/t39.30808-6/488560615_9547251228693998_8144797990329266172_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2FBokivb6fwQ7kNvgFNS9pP&_nc_oc=AdmvfZpYf_KYmbgjbDU6wIqdo4ZtaXfZNrDLC0DXoGOqltKGIXFf8lUe0QPixpwGyPM&_nc_zt=23&_nc_ht=scontent.fbkk22-3.fna&_nc_gid=8DNzeYb8SeOEe_XkjIKxEw&oh=00_AYGVGq0t9hjb-k7BzmX_2EUoywC6bhYs6v6Il3TGUvTScg&oe=67F2F6B2)

![RegisterPage](https://scontent.fbkk22-2.fna.fbcdn.net/v/t39.30808-6/487856591_9547251402027314_4125292184330901389_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=YiUCCL6NCSUQ7kNvgFWZ-yF&_nc_oc=Adk445JL4UqagQPk5lcwCn9Wb_k9lHw4RUi_wI_pK3rB5JusBpgZb4xOVC5otOEMkuM&_nc_zt=23&_nc_ht=scontent.fbkk22-2.fna&_nc_gid=D3VV7KMJcZTNTbZ5ib_U4A&oh=00_AYEesmZrqoIiqz9AvjzUt4lCoRDHnWusiUx_uOuo-ioCvQ&oe=67F2EBDC)

![ProductsPage](https://scontent.fbkk22-3.fna.fbcdn.net/v/t39.30808-6/487780357_9549057395180048_8887404194453555539_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=9q3H6Jt7aBoQ7kNvgGbzSeU&_nc_oc=Adk5wuAIBKjJppXcjZjYids4ZV_dtkWo-WYwxMCZXYvoON7bdB2jzPT56DtvsmPY_7U&_nc_zt=23&_nc_ht=scontent.fbkk22-3.fna&_nc_gid=BbTrAOOntlhbMAUwCf5cbA&oh=00_AYFoPFIPfpZFYYiR4IofaqaWuby4MERROUUiPtBqv28cFw&oe=67F34C33)

![CategoriesPage](https://scontent.fbkk22-1.fna.fbcdn.net/v/t39.30808-6/487530970_9549057295180058_8797169157338203042_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vgcYgnK0aEYQ7kNvgFnEItb&_nc_oc=AdkUwPKzfQqtpJ-5Ob5w2UXGvt2hxuOM0SR9az36lXZnYTXhznfqxV6ehglu-kAK38o&_nc_zt=23&_nc_ht=scontent.fbkk22-1.fna&_nc_gid=4pd7AXFlZKY-qnth_ovTDA&oh=00_AYF0EUSzg-Yjw3cXLca-BZSCEKSOEmg4ITGvzFvOsxSOSQ&oe=67F33A17)

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category by ID
- `DELETE /api/categories/:id` - Delete category by ID

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product by ID
- `DELETE /api/products/:id` - Delete product by ID

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID