import React, {createContext, useContext, useState} from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    return {token, user: {username: decoded.sub, roles: decoded.roles}};
                }
            } catch (e) {
                console.error("Invalid token");
            }
        }
        return null;
    });

    const login = async (username, password) => {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        if (!response.ok) {
            throw new Error('Invalid username or password');
        }

        const data = await response.json();
        const decoded = jwtDecode(data.token);

        localStorage.setItem('token', data.token);
        setAuth({token: data.token, user: {username: decoded.sub, roles: decoded.roles}});
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);