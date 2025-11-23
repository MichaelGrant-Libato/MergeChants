# MergeChants – Campus Marketplace Web Application

![React](https://img.shields.io/badge/Frontend-React-blue) ![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![MySQL](https://img.shields.io/badge/Database-MySQL-orange) ![JWT](https://img.shields.io/badge/Auth-JWT-black)

**MergeChants** is a university marketplace platform designed for the safe buying, selling, and trading of items within the campus community. It facilitates secure interactions between students using a protected hub.

### Architecture
* **Frontend:** React (Create React App)
* **Backend:** Java & Spring Boot (REST APIs)
* **Database:** MySQL
* **Authentication:** JWT (JSON Web Tokens)

---

##  Getting Started
Follow these instructions to get the project up and running on your local machine.

### 1. Backend Configuration (Spring Boot)
Before running the client, ensure your backend and database are ready.

**Prerequisites:**
* Java JDK
* Maven
* MySQL Server

**Database Setup:**
Configure your `application.properties` file located in the backend resources folder:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mergechants_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

jwt.secret=YOUR_JWT_SECRET
```

**Run the Server:** Navigate to the backend directory and run the application:
cd backend
mvn clean install
mvn spring-boot:run

**The backend will start on http://localhost:8080**

### 2. Frontend Setup (React)
In the frontend project directory, you can run the following scripts:

**Install Dependencies & Start:**
cd frontend
npm install
npm start
**The frontend will start on http://localhost:3000**

#### Project Features
## Core Marketplace
Listings: Create listings and view marketplace items.
Filtering: Filter items by category, condition, and price.
Seller Profiles: View seller profiles and browse reviews.

## Interaction
Messaging: Buyer–seller messaging system.
Negotiations: Send purchase offers and negotiate prices.
Escrow: Escrow agreement display for safer transactions.

## Transactions
Status: Track confirmed transactions and completed sales.
History: Full transaction history log.
Receipts: Generate digital receipts.

## User Management
Access: Login & registration with JWT authentication.
Settings: Profile settings, notification preferences, and privacy controls.

## Safety
Moderation: User reporting and evidence submission.
Verification: Verified account tracking.
Agreements: Escrow agreement summaries.


#### Documentation & Resources
## Frontend Tools

React Documentation

Create React App Docs

## Backend Tools

Spring Boot Documentation

MySQL Documentation

JWT Introduction
