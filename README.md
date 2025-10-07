# HR App

A full-stack Human Resources Management System with a Java Spring Boot backend and a React frontend, featuring employee management, team organization, feedback collection, and absence request handling.

## 📋 Prerequisites
- **Java 21** or newer
- **Maven 3.6+**
- **Node.js 22** & npm
- **Git** (for version control)

## 🏗️ Project Structure
- `hr-app-backend/`: Spring Boot REST API with JWT authentication
- `hr-app-frontend/`: React 19 SPA with comprehensive testing

## 🚀 Quick Start

### Backend Setup
```bash
cd hr-app-backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Default Users:**
- Admin: `admin` / `admin123`
- Manager: `manager` / `manager123`
- Employee: `employee` / `employee123`

### Frontend Setup
```bash
cd hr-app-frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 🔧 Technologies

### Backend
- **Spring Boot 3.5.6** - Framework
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database
- **Liquibase** - Database migrations
- **Swagger/OpenAPI 3** - API documentation
- **Lombok** - Code generation
- **Hibernate Validator** - Input validation

### Frontend
- **React 19.2.0** - UI library
- **Context API** - State management
- **Jest & React Testing Library** - Testing
- **CSS3** - Styling

## 📚 API Documentation (Swagger)

Access the interactive API documentation at: `http://localhost:8080/swagger-ui/index.html`

### How to Test APIs with Swagger:

1. **Login to get JWT token:**
   - Navigate to `/api/auth/login` endpoint
   - Click "Try it out"
   - Enter credentials (e.g., `admin` / `admin123`)
   - Click "Execute"
   - **Copy the token** from the response

2. **Authorize Swagger:**
   - Click the **"Authorize"** button (🔓 lock icon) at the top right
   - Paste your JWT token in the "Value" field
   - Click "Authorize" then "Close"

3. **Test Protected Endpoints:**
   - All endpoints now include your JWT token automatically
   - You'll see a closed lock icon (🔒) on authenticated endpoints

## 🎯 Features

### Employee Management
- View and edit employee profiles
- Create and manage employee records
- Assign employees to teams
- Track employee hierarchy

### Team Management
- Create and organize teams
- Assign team managers
- View team members
- Manage team structure

### Absence Requests
- Submit time-off requests
- Approve/reject absence requests (managers)
- View absence history
- Track team absences

### Feedback System
- Submit employee feedback
- Anonymous feedback option
- Feedback history
- Manager feedback reviews

### Security
- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- Secure password encryption
- Token expiration handling

## 🧪 Testing

### Backend Tests
```bash
cd hr-app-backend
mvn test
```

### Frontend Tests
```bash
cd hr-app-frontend
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

See detailed testing documentation in `hr-app-frontend/README.md`

## 🗄️ Database

The application uses an **H2 in-memory database** with sample data loaded on startup.

**H2 Console:** `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:hrdb`
- Username: `sa`
- Password: *(leave empty)*

## 📁 Project Structure

```
hr-app/
├── hr-app-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/org/example/hrappbackend/
│   │   │   │   ├── config/           # Security & OpenAPI config
│   │   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── repository/       # Data repositories
│   │   │   │   ├── security/         # JWT & security
│   │   │   │   └── service/          # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/changelog/     # Liquibase migrations
│   │   └── test/                     # Unit & integration tests
│   └── pom.xml
│
└── hr-app-frontend/
    ├── src/
    │   ├── components/               # React components
    │   ├── context/                  # Auth context
    │   ├── hooks/                    # Custom hooks
    │   └── styles/                   # CSS files
    ├── package.json
    └── README.md                     # Detailed frontend docs
```

## 🔐 Security Configuration

### CORS
The backend is configured to accept requests from `http://localhost:3000`.

For production, update `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(List.of("https://your-production-domain.com"));
```

### JWT Configuration
JWT secret and expiration are configured in `application.properties`. 

⚠️ **Important:** Change the JWT secret for production use!

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/me` - Get current user profile
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create employee (ADMIN only)
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee (ADMIN only)

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/{id}` - Get team by ID
- `POST /api/teams` - Create team (ADMIN only)
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team (ADMIN only)

### Absences
- `GET /api/absences` - Get all absences
- `GET /api/absences/employee/{id}` - Get employee absences
- `POST /api/absences` - Create absence request
- `PUT /api/absences/{id}/approve` - Approve absence (MANAGER only)
- `PUT /api/absences/{id}/reject` - Reject absence (MANAGER only)

### Feedback
- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/employee/{id}` - Get employee feedback
- `POST /api/feedback` - Submit feedback

## 🐛 Troubleshooting

### Port Already in Use
**Backend (8080):**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Frontend (3000):**
```bash
# Set different port
set PORT=3001
npm start
```

### Database Issues
If you encounter database errors, the H2 database will reset on restart (in-memory).

### CORS Errors
Ensure the backend is running before starting the frontend.

## 📝 Development Workflow

1. **Start Backend:** `mvn spring-boot:run` (in hr-app-backend)
2. **Start Frontend:** `npm start` (in hr-app-frontend)
3. **Run Tests:** `mvn test` (backend) or `npm test` (frontend)
4. **View API Docs:** `http://localhost:8080/swagger-ui/index.html`
5. **Access App:** `http://localhost:3000`

## 🚀 Deployment

### Backend (JAR)
```bash
cd hr-app-backend
mvn clean package
java -jar target/hr-app-backend-0.0.1-SNAPSHOT.jar
```

### Frontend (Build)
```bash
cd hr-app-frontend
npm run build
# Deploy the build/ folder to your web server
```

## 📄 License

[Add your license information here]

## 👥 Contributors

[Add contributor information here]

---

**Built with ❤️ using Spring Boot 3 and React 19**
