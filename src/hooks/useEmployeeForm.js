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
            setFormData(prev => ({...prev, [name]: selectedTeamIds}));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }

        if (name === 'email') {
            if (value === '') {
                setEmailError('');
            } else {
                // Email validation logic
                const parts = value.split('@');
                if (parts.length !== 2) {
                    setEmailError('Invalid email format');
                    return;
                }
                const local = parts[0];
                const domain = parts[1];
                if (!local || !domain) {
                    setEmailError('Invalid email format');
                    return;
                }
                if (domain.includes('..')) {
                    setEmailError('Invalid domain format');
                    return;
                }
                const domainParts = domain.split('.');
                if (domainParts.length < 2) {
                    setEmailError('Email must have a valid domain (e.g., example.com)');
                    return;
                }
                if (domainParts.some(part => part === '')) {
                    setEmailError('Invalid domain format');
                    return;
                }
                const extension = domainParts[domainParts.length - 1];
                if (extension.length < 2) {
                    setEmailError('Domain extension must be at least 2 characters');
                    return;
                }
                if (value.split('@').length !== 2) {
                    setEmailError('Invalid email format');
                    return;
                }
                setEmailError('');
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
        setEmailError('');
        setDuplicateEmailError(false);
        setError('');
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
