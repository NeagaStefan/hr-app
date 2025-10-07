import {useState} from 'react';

export const useEmployeeForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        hireDate: '',
        managerId: '',
        teamIds: []
    });
    const [emailError, setEmailError] = useState('');
    const [duplicateEmailError, setDuplicateEmailError] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const {name, value, options} = e.target;

        if (name === 'teamIds') {
            const selectedTeamIds = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData({...formData, [name]: selectedTeamIds});
        } else {
            setFormData({...formData, [name]: value});
        }

        if (name === 'email') {
            if (value === '') {
                setEmailError('');
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                const hasValidFormat = emailRegex.test(value);
                const parts = value.split('@');

                if (parts.length !== 2) {
                    setEmailError('Invalid email format');
                } else {
                    const domain = parts[1];
                    const domainParts = domain.split('.');

                    if (!hasValidFormat) {
                        setEmailError('Invalid email format');
                    } else if (domainParts.length < 2) {
                        setEmailError('Email must have a valid domain (e.g., example.com)');
                    } else if (domainParts[domainParts.length - 1].length < 2) {
                        setEmailError('Domain extension must be at least 2 characters');
                    } else if (domainParts.some(part => part.length === 0)) {
                        setEmailError('Invalid domain format');
                    } else {
                        setEmailError('');
                    }
                }
            }
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            position: '',
            department: '',
            salary: '',
            hireDate: '',
            managerId: '',
            teamIds: []
        });
        setError('');
        setEmailError('');
        setDuplicateEmailError(false);
    };

    return {
        formData,
        setFormData,
        emailError,
        setEmailError,
        duplicateEmailError,
        setDuplicateEmailError,
        error,
        setError,
        handleInputChange,
        resetForm
    };
};

