import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import HRDashboard from './components/HRDashboard';
import './App.css';

function AppContent() {
    const { auth } = useAuth();

    return auth ? <HRDashboard /> : <Login />;
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;