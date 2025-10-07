# HR App Frontend

A modern, responsive Human Resources Management System frontend built with React, providing an intuitive interface for employee management, team organization, feedback collection, and absence request handling.

## 🚀 Technologies Used

### Core Technologies
- **React 19.2.0** - Latest stable version of React with modern features
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

## 🧪 Testing

### Test Framework
The application uses **Jest** and **React Testing Library** for comprehensive unit and integration testing. All tests follow best practices for React component and hook testing.

### Running Tests

#### Run All Tests
```cmd
npm test
```

#### Run Tests in Watch Mode
```cmd
npm test -- --watch
```

#### Run Tests with Coverage
```cmd
npm test -- --coverage
```

#### Run Specific Test File
```cmd
npm test -- src/hooks/useNotification.test.js
```

### Test Coverage

The project maintains comprehensive test coverage across all layers:

#### Component Tests
- **AbsenceModal.test.js** - Absence request modal functionality
- **AbsenceTab.test.js** - Absence request tab rendering and interactions
- **EmployeeFormModal.test.js** - Employee creation/editing form validation
- **FeedbackModal.test.js** - Feedback submission modal
- **Header.test.js** - Navigation and header rendering
- **HRDashboard.test.js** - Main dashboard integration
- **Login.test.js** - Authentication flow
- **MyTeamTab.test.js** - Team member view
- **Notification.test.js** - Notification component rendering
- **ProfileTab.test.js** - Employee profile view
- **TabNavigation.test.js** - Tab switching functionality
- **TeamFormModal.test.js** - Team creation/editing form
- **TeamManagementTab.test.js** - Team administration interface

#### Custom Hook Tests
- **useAbsenceData.test.js** - Absence data fetching logic
- **useAbsenceHandlers.test.js** - Absence CRUD operations
- **useEmployeeForm.test.js** - Form state management and validation
- **useFeedbackData.test.js** - Feedback data fetching
- **useFeedbackHandlers.test.js** - Feedback operations
- **useNotification.test.js** - Notification state and timer management
- **useTeamData.test.js** - Team data fetching
- **useTeamHandlers.test.js** - Team operations

### Testing Strategy

#### 1. **Component Testing**
Components are tested for:
- **Rendering** - Correct initial render with props
- **User Interactions** - Click events, form submissions, input changes
- **Conditional Rendering** - Different states (loading, error, success)
- **Props Handling** - Correct behavior with different prop combinations
- **Accessibility** - Proper ARIA labels and semantic HTML

Example:
```javascript
it('should render login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

#### 2. **Custom Hook Testing**
Hooks are tested using `@testing-library/react-hooks`:
- **State Management** - Correct state updates
- **Side Effects** - API calls, timers, event listeners
- **Return Values** - Proper function and state exposure
- **Error Handling** - Graceful error scenarios
- **Edge Cases** - Boundary conditions and edge cases

Example:
```javascript
it('should update form data on input change', () => {
    const { result } = renderHook(() => useEmployeeForm());
    act(() => {
        result.current.handleInputChange({
            target: { name: 'firstName', value: 'John' }
        });
    });
    expect(result.current.formData.firstName).toBe('John');
});
```

#### 3. **Integration Testing**
Key user flows are tested end-to-end:
- Login → Dashboard navigation
- Employee creation and editing
- Team management workflows
- Absence request submission and approval
- Feedback submission

#### 4. **Validation Testing**
All form validations are thoroughly tested:
- **Email Validation**
  - Valid email format
  - Invalid formats (missing @, missing domain, etc.)
  - Domain extension length requirements
  - Empty domain parts
- **Required Fields** - Presence validation
- **Data Types** - Numeric, date, text validations

### Test Best Practices

✅ **Do:**
- Test user behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility features
- Mock API calls and external dependencies
- Test edge cases and error scenarios
- Keep tests focused and isolated
- Use descriptive test names

❌ **Don't:**
- Test internal component state directly
- Rely on implementation details (class names, internal functions)
- Write tests that are too broad or too narrow
- Skip error case testing
- Ignore accessibility testing

### Mocking Strategy

#### API Calls
```javascript
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'mock data' })
    })
);
```

#### Timers
```javascript
jest.useFakeTimers();
act(() => {
    jest.advanceTimersByTime(3000);
});
jest.useRealTimers();
```

#### LocalStorage
```javascript
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};
global.localStorage = mockLocalStorage;
```

### Continuous Integration

Tests are designed to run in CI/CD pipelines:
- Fast execution time
- No external dependencies required
- Deterministic results
- Clear failure messages

### Coverage Goals

Target coverage metrics:
- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Debugging Tests

For failing tests:
```cmd
npm test -- --verbose
npm test -- --no-coverage
```

To debug a specific test:
```javascript
screen.debug(); // Prints current DOM
console.log(result.current); // Inspect hook state
```

### Future Testing Enhancements

Planned improvements:
- E2E tests with Cypress or Playwright
- Visual regression testing
- Performance testing with Lighthouse CI
- Accessibility automated testing with axe-core
- Load testing for data-heavy operations

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
