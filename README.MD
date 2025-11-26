# Berties Books
Sample code for Dynamic Web Applications module.
Uses node.js with Express and EJS.

## Installation and Setup

### Install dependencies
```
npm install
```

### Environment Variables
Create a `.env` file in the project root with the following variables:
```
DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=your_password
DB_NAME=berties_books
```

### Database Setup
Create the required tables by running the SQL scripts in your MySQL database:
- `create_tables.sql` - Creates books, users, and audit_log tables
- `insert_test_data.sql` - Inserts sample data (optional)

### Run the application
```
node index.js
```

## Features

### Book Management
- View all books
- Add new books
- Search for books
- View bargain books (under £20)

### User Authentication
- User registration with password hashing (bcrypt)
- User login with password verification
- View list of registered users

### Security Features
- Password hashing using bcrypt with salt
- Secure database credentials using dotenv
- Audit logging for login attempts

## dotenv

This application uses the `dotenv` module to secure database credentials. 

### Setup:
1. Install dotenv: `npm install dotenv`
2. Create a `.env` file in the project root with the following variables:
```
   DB_HOST=localhost
   DB_USER=berties_books_app
   DB_PASSWORD=your_password
   DB_NAME=berties_books
```
3. The `.env` file is listed in `.gitignore` to prevent credentials from being committed to GitHub.
4. Load environment variables in `index.js` using `require('dotenv').config()`

## Routes

### Books
- `/` - Home page
- `/books/list` - View all books
- `/books/addbook` - Add a new book
- `/books/search` - Search for books
- `/books/bargainbooks` - View bargain books

### Users
- `/users/register` - User registration form
- `/users/login` - User login form
- `/users/list` - View all registered users

## Technologies Used
- Node.js
- Express
- EJS (templating)
- MySQL
- bcrypt (password hashing)
- dotenv (environment variables)
