\# Retail Billing System



\## Overview



The Retail Billing System is a full-stack web application designed to manage basic retail operations such as product management, customer handling, and billing. It demonstrates end-to-end interaction between a frontend interface, backend services, and a relational database.



\---



\## Features



\### Authentication



\* User registration and login

\* Role-based access control (Admin/User)



\### Product Management



\* View all products

\* Search products by name or category

\* Add, update, and delete products (restricted to admin role)



\### Customer Management



\* Add new customers

\* View customer details



\### Billing / Orders



\* Create new bills

\* Associate customers with selected products

\* Calculate total billing amount



\### Dashboard



\* Displays total number of products, customers, and orders

\* Provides a basic overview of system usage



\---



\## System Architecture



The application follows a typical three-tier architecture:



Frontend (React) communicates with the backend (Spring Boot) through REST APIs. The backend processes requests and interacts with the MySQL database using JPA/Hibernate.



```

React (Frontend)

&#x20;     ↓

REST API (JSON)

&#x20;     ↓

Spring Boot (Backend)

&#x20;     ↓

JPA / Hibernate

&#x20;     ↓

MySQL Database

```



\---



\## Technology Stack



Backend:



\* Java 17

\* Spring Boot

\* Spring Data JPA (Hibernate)

\* Spring Security

\* Maven



Frontend:



\* React (Vite)

\* Axios

\* React Router



Database:



\* MySQL



\---



\## Prerequisites



Ensure the following are installed:



\* Java 17 or higher

\* Node.js

\* MySQL Server



\---



\## Setup and Installation



\### Backend



1\. Navigate to the backend directory:



&#x20;  ```bash

&#x20;  cd backend

&#x20;  ```



2\. Open the project in IntelliJ IDEA or any Java IDE



3\. Configure database credentials in:



&#x20;  ```

&#x20;  src/main/resources/application.properties

&#x20;  ```



&#x20;  Update:



&#x20;  ```properties

&#x20;  spring.datasource.username=root

&#x20;  spring.datasource.password=yourpassword

&#x20;  ```



4\. Run the application:



&#x20;  ```bash

&#x20;  mvn spring-boot:run

&#x20;  ```



\---



\### Frontend



1\. Navigate to the frontend directory:



&#x20;  ```bash

&#x20;  cd frontend

&#x20;  ```



2\. Install dependencies:



&#x20;  ```bash

&#x20;  npm install

&#x20;  ```



3\. Start the development server:



&#x20;  ```bash

&#x20;  npm run dev

&#x20;  ```



4\. Open the application in browser:



&#x20;  ```

&#x20;  http://localhost:5173

&#x20;  ```



\---



\## Database Configuration



The application uses MySQL as the database.



\* The database will be created automatically if it does not exist.

\* Tables are generated automatically using JPA/Hibernate.



```properties

spring.datasource.url=jdbc:mysql://localhost:3306/retail\_billing?createDatabaseIfNotExist=true

spring.jpa.hibernate.ddl-auto=update

```



\---



\## API Endpoints (Sample)



Products:



\* GET /api/products

\* POST /api/products

\* PUT /api/products/{id}

\* DELETE /api/products/{id}



Customers:



\* GET /api/customers

\* POST /api/customers



Orders:



\* POST /api/orders



\---



\## Security



Spring Security is used for authentication and authorization. Certain operations (such as creating or modifying products) are restricted based on user roles.



\---



\## Project Structure



```

backend/

&#x20;├── controller/

&#x20;├── service/

&#x20;├── repository/

&#x20;├── entity/

&#x20;└── resources/



frontend/

&#x20;├── src/

&#x20;├── components/

&#x20;├── pages/

&#x20;└── services/

```



\---



\## Notes



\* Ensure MySQL server is running before starting the backend

\* Update database credentials before running the application

\* Backend runs on port 8080, frontend runs on port 5173



\---



\## Future Improvements



\* Payment integration

\* Inventory management enhancements

\* Reporting and analytics

\* Deployment to cloud environment



\---



\## Author



Developed as part of a Full Stack Java project.



