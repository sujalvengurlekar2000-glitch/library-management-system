# 📚 Library Management System

A full-stack Library Management application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**.

The application allows authenticated users to securely manage a library collection through a clean and responsive dashboard.

---

## ✨ Features

### Authentication

- User registration
- User login
- Password hashing using `bcryptjs`
- JWT-based authentication
- Protected book routes
- JWT stored in the frontend using `localStorage`
- Automatic JWT inclusion in protected API requests
- Logout functionality

### Library Management

- View all books
- Add a new book
- Edit an existing book
- Delete a book
- Search by title, author, or published year
- Display total books
- Display total unique authors
- Display average book price
- Responsive desktop table
- Responsive mobile book cards
- Loading, empty, error, and no-results states
- Add, edit, and delete confirmation modals
- Success and error toast notifications

---

## 🧰 Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs

---

## 📁 Project Structure

```text
LIBRARY-BACKEND/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   └── bookController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/
│   │   ├── authroutes.js
│   │   └── bookRoutes.js
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 Demo Login

Use the following demo account to sign in:

```json
{
  "name": "Moheet",
  "email": "moheet@gmail.com",
  "password": "123456"
}
```

### Login credentials

```text
Email: moheet@gmail.com
Password: 123456
```

> These credentials are intended only for local development and project demonstration. Do not use this password for a production account.

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Books

All book endpoints are protected by JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

---

## 📘 Book Data Format

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "publishedYear": 1988,
  "price": 499
}
```

---

## 🔑 Authentication Header

Protected requests must include the JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The frontend stores the token using:

```text
library_token
```

---

## ⚙️ Environment Variables

### Backend

Create:

```text
Backend/.env
```

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_jwt_secret
```

> The current development backend may still use a hardcoded JWT secret. Move it to `process.env.JWT_SECRET` before production deployment.

### Frontend

Create:

```text
Frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/CodeWithMoheet/user-inquiry-platform.git
cd user-inquiry-platform
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Start the backend

```bash
npm start
```

The backend runs at:

```text
http://localhost:5000
```

### 4. Install frontend dependencies

Open a second terminal:

```bash
cd Frontend
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

Vite will display the frontend development URL in the terminal.

---

## 🧪 Demo Flow

1. Start MongoDB and the backend.
2. Start the React frontend.
3. Open the frontend URL.
4. Log in using the demo credentials.
5. View the library dashboard.
6. Add a book.
7. Edit the book.
8. Search for the book.
9. Delete the book.
10. Log out.

---

## 🛡️ Security Notes

- Store the JWT secret in an environment variable.
- Do not commit real `.env` files.
- Use stronger passwords in production.
- Use HTTPS in production.
- Consider adding request validation.
- Consider implementing role-based access control.
- Consider adding token refresh or shorter session handling.
- Do not publish active JWT tokens.

---

## 🔮 Future Improvements

- User registration page in the frontend
- Pagination
- Sorting
- Book categories
- Book cover uploads
- Borrow and return tracking
- User roles
- Admin dashboard
- Refresh tokens
- Unit and integration tests
- Deployment configuration

---

## 👨‍💻 Author

**Mohammed Abdul Moheet**

GitHub: `CodeWithMoheet`

---

## 📄 License

This project is available under the MIT License.
