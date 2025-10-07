# HR App Backend

A modern Human Resources Management System backend built with Spring Boot, providing REST APIs for employee management, team organization, feedback collection, and absence request handling.

## 🚀 Technologies Used

### Core Technologies
- **Java 21** - Latest LTS version with modern language features
- **Spring Boot 3.5.6** - Framework for building production-ready applications
- **Maven** - Dependency management and build tool

### Spring Ecosystem
- **Spring Web** - RESTful API development
- **Spring Data JPA** - Data persistence and ORM
- **Spring Security** - Authentication and authorization
- **Hibernate** - JPA implementation and ORM framework

### Database & Migration
- **H2 Database** - In-memory database for development and testing
- **Liquibase 5.0.1** - Database version control and migration management

### Security & Authentication
- **JWT (JSON Web Tokens)** - Stateless authentication
  - jjwt-api 0.11.5
  - jjwt-impl 0.11.5
  - jjwt-jackson 0.11.5

### Documentation & Utilities
- **SpringDoc OpenAPI 2.8.13** - Automatic API documentation (Swagger UI)
- **Lombok** - Reduce boilerplate code with annotations
- **Hibernate Validator** - Bean validation
- **Jsoup 1.16.1** - HTML parsing and sanitization

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Java Development Kit (JDK) 21** or higher
- **Maven 3.6+** (or use the included Maven wrapper)
- **Git** (for cloning the repository)

## 🏃 How to Run Locally

### Using Maven Wrapper (Recommended)

1. **Clone the repository** (if applicable):
   ```cmd
   git clone <repository-url>
   cd hr-app-backend
   ```

2. **Run the application**:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

3. **Access the application**:
   - API Base URL: `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`


### Using Installed Maven

1. **Build the project**:
   ```cmd
   mvn clean install
   ```

2. **Run the application**:
   ```cmd
   mvn spring-boot:run
   ```

### Running the JAR file

1. **Build the JAR**:
   ```cmd
   mvnw.cmd clean package
   ```

2. **Run the JAR**:
   ```cmd
   java -jar target\hr-app-backend-0.0.1-SNAPSHOT.jar
   ```

## 🏗️ Architectural Decisions

### 1. **Layered Architecture**
The application follows a clean layered architecture pattern:
- **Controller Layer** - REST endpoints and request handling
- **Service Layer** - Business logic implementation
- **Repository Layer** - Data access and persistence
- **Entity Layer** - Domain models and JPA entities
- **DTO Layer** - Data Transfer Objects for API contracts

This separation ensures:
- Clear separation of concerns
- Easy testability
- Maintainability and scalability
- Loose coupling between layers

### 2. **Database Migration with Liquibase**
- **Why Liquibase?** Version control for database schema changes
- **Benefits**:
  - Track all database changes in YAML files
  - Reproducible deployments across environments
  - Rollback capabilities
  - Team collaboration without conflicts

Database changelogs are organized in `src/main/resources/db/changelog/changes/`:
- `create-employees-table.yaml`
- `create-users-table.yaml`
- `create-teams-and-feedbacks-tables.yaml`
- `create-absence-requests-table.yaml`
- `insert-sample-data.yaml`

### 3. **JWT-Based Authentication**
- **Stateless Authentication** - No server-side session storage
- **Scalability** - Easy to scale horizontally
- **Security** - Token-based with configurable expiration (24 hours)
- **Separation** - Authentication logic isolated in security package

### 4. **H2 In-Memory Database**
- **Development Speed** - Quick setup with no external database required
- **Testing** - Easy to reset and test with clean state
- **Future Migration** - Easy to switch to PostgreSQL/MySQL by changing configuration
- **Note**: For production, replace with a persistent database

### 5. **API Documentation with SpringDoc OpenAPI**
- **Auto-generated Documentation** - Swagger UI for interactive API testing
- **Developer Experience** - Easy for frontend developers to understand APIs
- **Standardization** - OpenAPI 3.0 specification compliance

### 6. **Configuration Externalization**
- Application properties in `application.properties`
- Environment-specific configurations can be added (application-dev.properties, application-prod.properties)
- Sensitive data (JWT secret, API keys) should be moved to environment variables in production

### 7. **Exception Handling**
- Centralized exception handling (exception package)
- Consistent error responses across all endpoints
- Improved debugging and client-side error handling

### 8. **Validation**
- Bean validation using Hibernate Validator
- Input sanitization with Jsoup
- Ensures data integrity at the API boundary

## 📁 Project Structure

```
src/main/java/org/example/hrappbackend/
├── config/           # Application configuration classes
├── controller/       # REST API endpoints
│   ├── AuthController.java
│   ├── EmployeeController.java
│   ├── TeamController.java
│   ├── FeedbackController.java
│   └── AbsenceRequestController.java
├── dto/              # Data Transfer Objects
├── entity/           # JPA entities (domain models)
├── exception/        # Custom exceptions and handlers
├── repository/       # Data access layer
├── security/         # Security configuration and JWT handling
├── service/          # Business logic layer
└── util/             # Utility classes
```

## 🔧 Configuration

Key configuration properties in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:h2:mem:hrdb
spring.jpa.hibernate.ddl-auto=none

# Liquibase
spring.liquibase.enabled=true

# JWT
application.security.jwt.secret-key=<secret>
application.security.jwt.expiration=86400000
```

## 🔐 Security Notes

⚠️ **Important for Production**:
1. Move JWT secret key to environment variables
2. Remove or secure HuggingFace API key from properties file
3. Replace H2 with a production database (PostgreSQL, MySQL)
4. Enable HTTPS/TLS
5. Configure CORS properly for your frontend domain
6. Implement rate limiting
7. Add comprehensive logging and monitoring

## 🧪 Testing

Run tests with:
```cmd
mvnw.cmd test
```

## 📝 API Endpoints

The application provides REST APIs for:
- **Authentication** - Login, token management
- **Employee Management** - CRUD operations for employees
- **Team Management** - Create and manage teams
- **Feedback** - Collect and manage employee feedback
- **Absence Requests** - Handle time-off requests

For detailed API documentation, visit Swagger UI at `http://localhost:8080/swagger-ui.html` when the application is running.


