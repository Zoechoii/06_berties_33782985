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
BB_HOST=localhost
BB_USER=berties_books_app
BB_PASSWORD=qwertyuiop
BB_DATABASE=berties_books
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
- Add new books with validation
- Search for books
- View bargain books (under £20)

### User Authentication
- User registration with password hashing (bcrypt)
- User login with password verification
- Session management with express-session
- User logout functionality
- View list of registered users (login required)
- Audit logging for all login attempts

### Security Features
- **Password hashing** using bcrypt with salt
- **Secure database credentials** using dotenv
- **Session management** using express-session
- **Access control** - certain pages require login
- **Input validation** using express-validator
- **Input sanitisation** using express-sanitizer to prevent XSS attacks
- **Audit logging** for login attempts

## Access Control

### Protected Routes (Login Required):
- `/users/list` - Only logged-in users can view the list of users
- `/users/audit` - Only logged-in users can view audit logs
- `/logout` - Only logged-in users can logout

### Public Routes (No Login Required):
- `/` - Home page
- `/about` - About page
- `/users/register` - Registration page (anyone can register)
- `/users/login` - Login page (public access needed)
- `/books/*` - All book-related pages are publicly accessible

**Reasoning:** Book browsing should be accessible to everyone to encourage engagement. User management and audit logs contain sensitive information and should only be accessible to authenticated users.

## Input Validation

### Validation Applied:
- **Registration form (`/users/register`):**
  - Email: Must be valid email format
  - Username: Must be 3-20 characters long
  - Password: Must be at least 5 characters long
  - First name: Required (not empty)
  - Last name: Required (not empty)

- **Login form (`/users/login`):**
  - Username: Required (not empty)
  - Password: Required (not empty)

- **Add book form (`/books/addbook`):**
  - Book name: Required (not empty)
  - Price: Must be a positive number

**Reasoning:** Validation ensures data integrity and prevents invalid data from being stored in the database. Email validation ensures we can contact users, username/password requirements ensure account security, and book validation ensures accurate inventory data.

## Input Sanitisation

### Sanitisation Applied:
- **Registration form:**
  - First name: Sanitised to prevent XSS attacks
  - Last name: Sanitised to prevent XSS attacks
  - Username: NOT sanitised (needs to match exactly for login)
  - Email: NOT sanitised (validated format instead)
  - Password: NOT sanitised (hashed with bcrypt, safe from XSS)

- **Add book form:**
  - Book name: Sanitised to prevent XSS attacks
  - Price: NOT sanitised (validated as number)

**Reasoning:** Text fields displayed on web pages (names, book titles) are sanitised to prevent malicious script injection. Fields used for authentication (username, password) or validated as specific formats (email, price) don't need sanitisation as they either have strict validation or are hashed/typed.

## Routes

### Main Routes
- `/` - Home page
- `/about` - About page
- `/logout` - Logout (requires login)

### Books
- `/books/list` - View all books
- `/books/addbook` - Add a new book
- `/books/bookadded` - Process new book (with validation)
- `/books/search` - Search for books
- `/books/search-result` - Search results
- `/books/bargainbooks` - View bargain books

### Users
- `/users/register` - User registration form
- `/users/registered` - Process registration (with validation and sanitisation)
- `/users/login` - User login form
- `/users/loggedin` - Process login (with validation)
- `/users/list` - View all registered users (requires login)
- `/users/audit` - View login audit log (requires login)

## Technologies Used
- Node.js
- Express
- EJS (templating)
- MySQL
- bcrypt (password hashing)
- dotenv (environment variables)
- express-session (session management)
- express-validator (input validation)
- express-sanitizer (input sanitisation)

## Test User
A test user account is available for marking purposes:
- Username: `gold`
- Password: `smiths`
