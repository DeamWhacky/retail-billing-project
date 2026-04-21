# Retail Billing System

## Overview

The Retail Billing System is a full-stack web application designed to manage retail operations such as product management, customer handling, and billing. It demonstrates end-to-end interaction between a frontend interface, backend services, and a relational database.

---

## Features

### Authentication

* User registration and login
* Role-based access control (Admin/User)

### Product Management

* View all products
* Search products by name or category
* Add, update, and delete products (restricted to admin role)

### Customer Management

* Add new customers
* View customer details

### Billing / Orders

* Create new bills
* Associate customers with selected products
* Calculate total billing amount

### Dashboard

* Displays total number of products, customers, and orders
* Provides a basic overview of system usage

---

## System Architecture

The application follows a three-tier architecture:

Frontend (React) communicates with the backend (Spring Boot) through REST APIs. The backend processes requests and interacts with the MySQL database using JPA/Hibernate.

```
React (Frontend)
   ↓
REST API (JSON)
   ↓
Spring Boot (Backend)
   ↓
JPA / Hibernate
   ↓
MySQL Database
```

---

## Technology Stack

### Backend

* Java 17
* Spring Boot
* Spring Data JPA (Hibernate)
* Spring Security
* Maven

### Frontend

* React (Vite)
* Axios
* React Router

### Database

* MySQL

---

## Prerequisites

Ensure the following are installed:

* Java 17 or higher
* Node.js
* MySQL Server

---

## Setup and Installation

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Open the project in IntelliJ IDEA or any Java IDE

3. Configure database credentials in:

   ```
   src/main/resources/application.properties
   ```

4. Update:

   ```properties
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```

5. Run the application:

   ```bash
   mvn spring-boot:run
   ```

---

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open in browser:

   ```
   http://localhost:5173
   ```

---

## Database Configuration

The application uses MySQL as the database.

* The database will be created automatically if it does not exist
* Tables are generated automatically using JPA/Hibernate

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retail_billing?createDatabaseIfNotExist=true
spring.jpa.hibernate.ddl-auto=update
```

---

## API Endpoints (Sample)

### Products

* GET /api/products
* POST /api/products
* PUT /api/products/{id}
* DELETE /api/products/{id}

### Customers

* GET /api/customers
* POST /api/customers

### Orders

* POST /api/orders

---

## Security

Spring Security is used for authentication and authorization. Certain operations are restricted based on user roles.

---

## Project Structure

```
backend/
 ├── controller/
 ├── service/
 ├── repository/
 ├── entity/
 └── resources/

frontend/
 ├── src/
 ├── components/
 ├── pages/
 └── services/
```

---

## Notes

* Ensure MySQL server is running before starting the backend
* Update database credentials before running the application
* Backend runs on port 8080, frontend runs on port 5173

---

## Future Improvements

* Payment integration
* Inventory management enhancements
* Reporting and analytics
* Deployment to cloud environment

---

## Author

Soumyadeep Sinha
Roll No: 23052762




