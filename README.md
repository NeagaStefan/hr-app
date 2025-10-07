# HR App Frontend

A modern, responsive Human Resources Management System frontend built with React, providing an intuitive interface for employee management, team organization, feedback collection, and absence request handling.

## 🚀 Technologies Used

### Core Technologies
- **React 19.2.0** - Latest version of React with modern features
- **Node.js 22** - JavaScript runtime environment
- **React Scripts 5.0.1** - Build tooling and development server

### Key Dependencies
- **React DOM 19.2.0** - React rendering for web applications
- **jwt-decode 4.0.0** - JWT token parsing and validation
- **Web Vitals 2.1.4** - Performance monitoring

### Testing
- **@testing-library/react 16.3.0** - React component testing utilities
- **@testing-library/jest-dom 6.9.1** - Custom Jest matchers
- **@testing-library/user-event 13.5.0** - User interaction simulation
- **Jest** - JavaScript testing framework (included with React Scripts)

### Build Tools
- **Webpack** - Module bundler (included with React Scripts)
- **Babel** - JavaScript compiler (included with React Scripts)
- **ESLint** - Code linting and quality

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js 22** or higher
- **npm** (comes with Node.js) or **yarn**
- **HR App Backend** running on `http://localhost:8080`

## 🏃 How to Run Locally

### 1. Install Dependencies

```cmd
npm install
```

### 2. Start the Development Server

```cmd
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

### 3. Build for Production

To create an optimized production build:

```cmd
npm run build
```

The build output will be in the `build/` directory.


## 🌐 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🏗️ Architectural Decisions

### 1. **Component-Based Architecture**
The application follows a modular component-based structure:

```
src/
├── components/       # Reusable UI components
├── context/          # Global state management
├── hooks/            # Custom React hooks
└── styles/           # CSS styling
```

**Benefits**:
- Reusability and maintainability
- Clear separation of concerns
- Easy to test individual components
- Scalable architecture

### 2. **Custom Hooks Pattern**
Business logic is extracted into custom hooks for better code organization:

- **useAbsenceData.js** - Absence request data fetching
- **useAbsenceHandlers.js** - Absence request operations (create, approve, reject)
- **useEmployeeForm.js** - Employee form state management
- **useFeedbackData.js** - Feedback data fetching
- **useFeedbackHandlers.js** - Feedback operations
- **useNotification.js** - Notification state management
- **useTeamData.js** - Team data fetching
- **useTeamHandlers.js** - Team operations

**Benefits**:
- Separation of business logic from UI
- Reusable logic across components
- Easier testing and maintenance
- Better code organization

### 3. **Context API for Authentication**
Using React Context API (`AuthContext.js`) for global authentication state:

- **Centralized Auth State** - Single source of truth for authentication
- **JWT Token Management** - Automatic token persistence in localStorage
- **Token Validation** - Automatic expiration checking
- **Protected Routes** - Conditional rendering based on auth state

**Why not Redux?**
- Application state is relatively simple
- Context API is sufficient for this use case
- Reduces bundle size and complexity
- Native React solution

### 4. **Component Organization**

#### Core Components:
- **Login.js** - Authentication interface
- **HRDashboard.js** - Main application container
- **Header.js** - Navigation and user info
- **TabNavigation.js** - Tab switching interface

#### Feature Components:
- **ProfileTab.js** - Employee profile view
- **TeamManagementTab.js** - Team administration
- **MyTeamTab.js** - Team member view
- **AbsenceTab.js** - Absence request management
- **EmployeeFormModal.js** - Employee creation/editing
- **TeamFormModal.js** - Team creation/editing
- **FeedbackModal.js** - Feedback submission
- **AbsenceModal.js** - Absence request creation
- **Notification.js** - User feedback messages

### 5. **State Management Strategy**
- **Local State** - Component-specific state with `useState`
- **Context State** - Authentication state shared globally
- **Custom Hooks** - Shared business logic and data fetching
- **Props** - Parent-child communication

This layered approach provides the right balance between simplicity and scalability.

### 6. **API Communication**
- **RESTful API** - Communication with Spring Boot backend
- **Fetch API** - Native browser API for HTTP requests
- **JWT Authentication** - Bearer token in Authorization header
- **Error Handling** - Centralized error handling with user-friendly notifications

### 7. **Conditional Rendering Pattern**
```javascript
return auth ? <HRDashboard /> : <Login />;
```

Simple and effective approach for authentication-based routing without additional routing libraries.

**Benefits**:
- No need for react-router for this simple use case
- Reduced bundle size
- Clear authentication flow

### 8. **CSS Modules Strategy**
Separate CSS files for different views:
- `HRDashboard.css` - Main dashboard styling
- `Login.css` - Login page styling
- `App.css` - Global styles

Keeps styling organized and maintainable.

### 9. **Performance Considerations**
- **Code Splitting** - Automatic with React Scripts
- **Web Vitals** - Performance monitoring built-in
- **Production Builds** - Optimized and minified
- **Lazy Loading** - Can be implemented for larger feature sets

## 📁 Project Structure

```
hr-app-frontend/
├── public/                    # Static assets
│   ├── index.html            # HTML template
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/           # React components
│   │   ├── AbsenceModal.js
│   │   ├── AbsenceTab.js
│   │   ├── EmployeeFormModal.js
│   │   ├── FeedbackModal.js
│   │   ├── Header.js
│   │   ├── HRDashboard.js
│   │   ├── Login.js
│   │   ├── MyTeamTab.js
│   │   ├── Notification.js
│   │   ├── ProfileTab.js
│   │   ├── TabNavigation.js
│   │   ├── TeamFormModal.js
│   │   └── TeamManagementTab.js
│   ├── context/              # Context providers
│   │   └── AuthContext.js    # Authentication context
│   ├── hooks/                # Custom React hooks
│   │   ├── useAbsenceData.js
│   │   ├── useAbsenceHandlers.js
│   │   ├── useEmployeeForm.js
│   │   ├── useFeedbackData.js
│   │   ├── useFeedbackHandlers.js
│   │   ├── useNotification.js
│   │   ├── useTeamData.js
│   │   └── useTeamHandlers.js
│   ├── styles/               # CSS files
│   │   ├── HRDashboard.css
│   │   └── Login.css
│   ├── App.js               # Root component
│   ├── App.css              # Global styles
│   ├── index.js             # Application entry point
│   └── setupTests.js        # Test configuration
├── build/                    # Production build output
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Configuration

### Backend API URL
The frontend connects to the backend at `http://localhost:8080`. If your backend runs on a different port, update the API calls in:
- `src/context/AuthContext.js`
- Custom hooks in `src/hooks/`

## 🎨 Features

- **User Authentication** - Secure login with JWT tokens
- **Employee Management** - View and manage employee information
- **Team Management** - Create and organize teams
- **Feedback System** - Submit and view employee feedback
- **Absence Requests** - Request time off and manage approvals
- **Role-Based Access** - Different views for managers and employees
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Notifications** - User feedback for all actions

## 🔐 Security Notes

⚠️ **Important for Production**:
1. Use environment variables for API URLs
2. Implement HTTPS for all API communication
3. Add request/response interceptors for better error handling
4. Implement token refresh mechanism
5. Add CSRF protection if needed
6. Sanitize user inputs
7. Implement proper error boundaries

## 📝 Common Issues

### Port Already in Use
If port 3000 is already in use:
```cmd
set PORT=3001 && npm start
```

### Backend Connection Issues
Ensure the backend is running on `http://localhost:8080` before starting the frontend.

### CORS Errors
The backend must be configured to allow requests from `http://localhost:3000`.

## 📄 License

[Add your license information here]

## 👥 Authors

[Add author information here]

---

**Built with ❤️ using React 19 and Node.js 22**

