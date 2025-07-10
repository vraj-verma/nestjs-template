# NestJS Starter Template

## Overview

This is a **basic NestJS starter template** that comes pre-configured with essential features to help developers quickly start building applications with:

- ✅ **JWT Authentication**
- 👤 **User Management**
- 🗄️ **Database Integration**
- 📥 **Input/Payload Validation using Joi**
- 🔐 **Secure Password Hashing using bcrypt**

This template is designed to eliminate repetitive setup work and help you focus on building actual business logic.

---

## What's Included?

By cloning this repository, you'll get:

- 🧱 **Modular project structure** with pre-configured routes, controllers, services
- 🧩 A **generic database service** that works across schemas like `accounts` and `users`
- 🔐 **JWT-based Authentication system** for signup and signin flows
- 🔐 **bcrypt password hashing** for secure password storage and verification
- 📦 **Input validation system** using the `joi` package  
  - Define validation schemas inside the `validations/` folder  
  - Easily **customizable error formatting** using pipes
- 📄 **Swagger Documentation** for all APIs including Auth, Users, and Accounts
- 🗃️ Configuration file structure for MongoDB and JWT
- 🔁 Environment-based config support

---

## Features

- ✅ **JWT Authentication** (signup/signin)
- 🔐 **Password hashing with bcrypt**
- 👤 **User CRUD operations**
- 🧱 **Modular architecture**
- 🧩 **Generic database service**
- ⚙️ **Pre-configured routes and controllers**
- 📄 **Swagger API documentation**

- 📝 **Sample configuration file (`sample.config.ts`)**

---


Swagger is already set up.

### ✅ Available on: `http://localhost:7001/api`

---

## Security: Password Hashing with bcrypt

This template uses [`bcrypt`](https://www.npmjs.com/package/bcrypt) to ensure secure handling of user passwords:

- **During signup**, passwords are hashed using `bcrypt.hash()` before being saved to the database.
- **During signin**, the plain-text password is compared using `bcrypt.compare()` against the stored hash.

This ensures user credentials are safely encrypted, following best practices for authentication.

---


## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- npm
- [MongoDB](https://www.mongodb.com/lp/cloud/atlas/) (or your preferred database)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/vraj-verma/nestjs-template.git
```

### 2. Navigate into the project directory

```bash
cd nestjs-template
```

### 3. Install dependencies
```bash
npm i
```

### 4. Update sample Config values with your configuration
Sample data 
```json
{
    "MONGOCONFIG": {
        "DATABASE_NAME": "mytestdb",
        "PORT": 27017,
        "URI": "mongodb://localhost:27017"
    },
    "JWT_SECRET": "thi$-$hould-be-very-$ecure",
    "JWT_EXPIRY": "5d"
};
```


### 5. Running the Application
npm run start:dev
Runs at: http://localhost:7001



## API Endpoints

### 🔐 Authentication

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | `/auth/signup` | Register new user |
| POST   | `/auth/signin` | Login user        |

---

### Signup Request

```json
{
  "name": "Sumit Verma",
  "email": "sumit@stackly.in",
  "password": "test123"
}

```
## 👥 Users

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/users`     | Get all users   |
| GET    | `/users/:id` | Get single user |
| POST   | `/users`     | Create new user |
| PUT    | `/users/:id` | Update user     |
| DELETE | `/users/:id` | Delete user     |

---

## 👥 Accounts

| Method | Endpoint    | Description                          |
| ------ | ----------- | ------------------------------------ |
| GET    | `/accounts` | Get account details & users under it |
| PATCH  | `/accounts` | Update account details               |
| DELETE | `/accounts` | Delete account                       |

---

## 📁 Project Structure

```bash
src/
├── accounts/        # Account-related modules and logic
├── auth/            # Authentication module (signup, signin, guards, etc.)
├── constants/       # Application-wide constants
├── db/              # Database configuration and services
├── enums/           # Enum definitions used across the app
├── errors/          # Custom error classes and handlers
├── guards/          # Route guards (e.g., JWT, roles)
├── pipes/           # Pipes for validation, transformation, etc.
├── schema/          # Mongoose or other DB schemas
├── types/           # Global TypeScript types and interfaces
├── users/           # User module (CRUD logic, services, controllers)
├── utils/           # Utility functions/helpers
├── validations/     # Joi validation logic
├── app.controller.ts  # Root application controller
├── app.module.ts      # Root application module
├── main.ts            # Entry point of the application

```


## 🤝 Contributing

We welcome contributions to improve this project! Follow the steps below to contribute:

### 1. Fork the repository

Create a copy of the repository under your own GitHub account.

---

### 2. Create your feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Commit your changes

```bash
git commit -m "Add your feature"
```

### 4. Push to the branch
```bash
git push origin feature/your-feature
```

### 5. Open a Pull Request

Go to your forked repository on GitHub and click on **"New Pull Request"** to submit your changes for review.
