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
