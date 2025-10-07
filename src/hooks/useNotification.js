import {useEffect, useRef, useState} from 'react';

export const useNotification = () => {
    const [notification, setNotification] = useState({ message: '', type: '' });
    const timerRef = useRef(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setNotification({ message: '', type: '' });
            timerRef.current = null;
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        notification,
        showNotification
    };
};

export const useEmployeeData = (auth, getAuthHeaders) => {
    const [employees, setEmployees] = useState([]);
    const [currentUserEmployee, setCurrentUserEmployee] = useState(null);
    const [currentUserEmployeeId, setCurrentUserEmployeeId] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/employees/me', {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentUserEmployee(data);
                setCurrentUserEmployeeId(data.id);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/employees', {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        if (auth) {
            fetchProfile();
        }
    }, [auth]);

    return {
        employees,
        currentUserEmployee,
        currentUserEmployeeId,
        fetchProfile,
        fetchEmployees
    };
};
