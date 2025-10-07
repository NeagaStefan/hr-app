# HR App - Human Resources Management System

A full-stack Human Resources Management System with a React frontend and Spring Boot backend.

## 📁 Project Structure

This project consists of two main components:

```
hr-app/
├── hr-app-frontend/     # React 19 frontend application
└── hr-app-backend/      # Spring Boot backend API
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 22** or higher (for frontend)
- **Java 17** or higher (for backend)
- **Maven** (for backend)

### Running the Application

#### 1. Start the Backend
```cmd
cd hr-app-backend
mvnw spring-boot:run
```

The backend will run on `http://localhost:8080`

#### 2. Start the Frontend
```cmd
cd hr-app-frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 Documentation

- **Frontend Documentation**: See [hr-app-frontend/README.md](hr-app-frontend/README.md)
- **Backend Documentation**: See [hr-app-backend/README.md](hr-app-backend/README.md)

## 🎯 Features

- **User Authentication** - Secure login with JWT tokens
- **Employee Management** - View and manage employee information
- **Team Management** - Create and organize teams
- **Feedback System** - Submit and view employee feedback
- **Absence Requests** - Request time off and manage approvals
- **Role-Based Access** - Different views for managers and employees

## 🏗️ Technology Stack

### Frontend
- React 19.2.0
- React Scripts 5.0.1
- JWT Authentication
- Testing Library

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- H2/PostgreSQL Database

## 🧪 Testing

### Frontend Tests
```cmd
cd hr-app-frontend
npm test
```

### Backend Tests
```cmd
cd hr-app-backend
mvnw test
```