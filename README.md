# 🏪 Store Rating Platform

A full-stack web application that allows users to submit ratings for stores. Built with **Express.js**, **MySQL**, **React**, and **Tailwind CSS**.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### System Administrator
- Dashboard with statistics (Total Users, Stores, Ratings)
- Create and manage users (Admin, Normal User, Store Owner)
- Create and manage stores
- View user details with store ratings
- Filter and sort all data tables

### Normal User
- Register and login
- Browse all stores with search and filter
- Submit ratings (1-5 stars) for stores
- Update previously submitted ratings
- View store ratings and personal ratings

### Store Owner
- View store dashboard
- See average rating and total ratings
- View list of users who rated their store
- Update password

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MySQL** with **Sequelize ORM**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for validation

### Frontend
- **React 18** with **Vite**
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📁 Project Structure
store-rating-platform/
├── backend/                 # Express.js Backend
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   └── storeOwnerController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── user.js
│   │   └── storeOwner.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/                # React Frontend
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── DataTable.jsx
│   │   └── StarRating.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminStores.jsx
│   │   ├── UserStores.jsx
│   │   ├── StoreOwnerDashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── validations.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
Backend Setup
bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

 Frontend Setup
bash

# Open new terminal, navigate to frontend
cd ../frontend

# Install dependencies
npm install
⚙️ Configuration
Backend .env
Create a .env file in the backend folder:
env
Copy
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10
Frontend .env
Create a .env file in the frontend folder:
env
Copy
VITE_API_URL=http://localhost:5000/api
Database Setup
Start MySQL Service:
bash
Copy
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
Create Database:
bash
Copy
mysql -u root -p

# In MySQL shell:
CREATE DATABASE store_rating_db;
EXIT;
▶️ Running the Application
Start Backend Server
bash
Copy
cd backend

# Development mode with auto-restart
npm run dev

# OR production mode
npm start
Backend will run on: http://localhost:5000
Start Frontend Server
bash
Copy
cd frontend

# Start development server
npm run dev
Frontend will run on: http://localhost:3000
Access the Application
Open your browser and go to: http://localhost:3000
🔑 Default Credentials
Table
Copy
Role	Email	Password
System Administrator	admin@storerating.com	Admin@123456
Note: Default admin is created automatically when the backend starts for the first time.
📚 API Documentation
Authentication Endpoints
Table
Copy
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new normal user	Public
POST	/api/auth/login	Login user	Public
PUT	/api/auth/password	Update password	Authenticated
GET	/api/auth/dashboard	Get dashboard stats	Authenticated
Admin Endpoints
Table
Copy
Method	Endpoint	Description	Access
GET	/api/admin/users	List all users	Admin
POST	/api/admin/users	Create new user	Admin
GET	/api/admin/users/:id	Get user details	Admin
GET	/api/admin/stores	List all stores	Admin
POST	/api/admin/stores	Create new store	Admin
User Endpoints
Table
Copy
Method	Endpoint	Description	Access
GET	/api/user/stores	Browse stores	Normal User
POST	/api/user/ratings	Submit rating	Normal User
PUT	/api/user/ratings/:storeId	Update rating	Normal User
Store Owner Endpoints
Table
Copy
Method	Endpoint	Description	Access
GET	/api/store-owner/stores	View my stores	Store Owner
GET	/api/store-owner/stores/:id	Store details	Store Owner
👥 User Roles
System Administrator
Full system access
Manage users and stores
View statistics dashboard
Normal User
Browse stores
Submit and modify ratings
Search and filter stores
Store Owner
View store performance
See customer ratings
View rating statistics
📝 Validation Rules
Table
Copy
Field	Rules
Name	20-60 characters
Email	Valid email format
Password	8-16 characters, 1 uppercase, 1 special character
Address	Max 400 characters (optional)
Rating	1-5 integer values
