# Book Management API

This is a simple RESTful API for managing books and authors.

## Features

- Get all books
- Get a single book by ID
- Add a new book
- Update a book
- Inactive a book
- Get all authors
- Get a single author by ID
- Add a new author

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone the repository:
   git clone https://github.com/your_username/book-management-api.git
   
2. Project Structure

bookmanagement/
├── config/
│   ├── logsCreation.js // to make logs 
│   ├── MongooseConnection.js // mongodb connection
│
├── Controller/
│   ├── Author.js
│   ├── Book.js
│   ├── User.js
|
├── Logs/   // to create all logs
|
├── Middlewares/
│   ├── AccessControl.js
│   ├── TokenVerify.js
│   
├── Models/
│   ├── Author.js
│   ├── Book.js
│   ├── User.js
│   
├── node_modules/
│ 
├── package.json
├── routes.js
├── server.js

3. Install dependencies:
   npm install

4. In the project directory, you can run:
   nodemon server.js

5. API Endpoints
Books
GET /api/admin/books: Get all books
GET /api/admin/book/:id: Get a single book by ID
POST /api/admin/save-book: Add a new book
post /api/admin/update-book/:id: Update a book by ID
DELETE /api/admin/delete/:id: Delete a book by ID

6. Authors
GET /api/authors: Get all authors
POST /api/save-author: Add a new author

