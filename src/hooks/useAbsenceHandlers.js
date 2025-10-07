import {useState} from 'react';

export const useAbsenceHandlers = (getAuthHeaders, showNotification, fetchMyAbsenceRequests, fetchTeamAbsenceRequests) => {
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [absenceFormData, setAbsenceFormData] = useState({
        startDate: '',
        endDate: '',
        type: 'VACATION',
        reason: ''
    });
    const [absenceError, setAbsenceError] = useState('');

    const ABSENCE_API_URL = 'http://localhost:8080/api/absence-requests';

    const handleRequestAbsence = () => {
        setShowAbsenceModal(true);
        setAbsenceFormData({
            startDate: '',
            endDate: '',
            type: 'VACATION',
            reason: ''
        });
        setAbsenceError('');
    };

    const handleAbsenceInputChange = (e) => {
        const {name, value} = e.target;
        setAbsenceFormData(prevData => ({...prevData, [name]: value}));
    };

    const handleSubmitAbsenceRequest = async () => {
        setAbsenceError('');

        if (!absenceFormData.startDate || !absenceFormData.endDate) {
            setAbsenceError('Start date and end date are required');
            return;
        }

        if (new Date(absenceFormData.endDate) < new Date(absenceFormData.startDate)) {
            setAbsenceError('End date must be after start date');
            return;
        }

        try {
            const response = await fetch(ABSENCE_API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(absenceFormData)
            });

            if (response.ok) {
                setShowAbsenceModal(false);
                showNotification('Absence request submitted successfully!', 'success');
                fetchMyAbsenceRequests();
            } else {
                const errorData = await response.json().catch(() => null);
                setAbsenceError(errorData?.message || 'Failed to submit absence request');
            }
        } catch (error) {
            console.error('Error submitting absence request:', error);
            setAbsenceError('Network error. Please try again.');
        }
    };

    const handleCancelAbsenceRequest = () => {
        setShowAbsenceModal(false);
        setAbsenceFormData({
            startDate: '',
            endDate: '',
            type: 'VACATION',
            reason: ''
        });
        setAbsenceError('');
    };

    const handleRespondToAbsence = async (requestId, status, comment = '') => {
        try {
            const response = await fetch(`${ABSENCE_API_URL}/${requestId}/respond`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    status: status,
                    managerComment: comment
                })
            });

            if (response.ok) {
                showNotification(`Request ${status.toLowerCase()} successfully!`, 'success');
                fetchTeamAbsenceRequests();
            } else {
                const errorData = await response.json().catch(() => null);
                showNotification(errorData?.message || 'Failed to respond to request', 'error');
            }
        } catch (error) {
            console.error('Error responding to absence request:', error);
            showNotification('Network error. Please try again.', 'error');
        }
    };

    return {
        showAbsenceModal,
        absenceFormData,
        absenceError,
        handleRequestAbsence,
        handleAbsenceInputChange,
        handleSubmitAbsenceRequest,
        handleCancelAbsenceRequest,
        handleRespondToAbsence
    };
};

export const useEmployeeHandlers = (
    auth,
    getAuthHeaders,
    showNotification,
    formData,
    setFormData,
    emailError,
    setError,
    setDuplicateEmailError,
    fetchEmployees,
    fetchTeams
) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const API_URL = 'http://localhost:8080/api/employees';
    const isManager = auth?.user?.roles?.includes('ROLE_MANAGER');
    const canEdit = auth?.user?.roles?.includes('ROLE_HR') || auth?.user?.roles?.includes('ROLE_ADMIN');

    const canEditEmployee = (employee, currentUserEmployeeId) => {
        if (canEdit) return true;
        return !!(isManager && employee.id !== currentUserEmployeeId);

    };

    const handleEdit = (employee, currentUserEmployeeId) => {
        if (!canEditEmployee(employee, currentUserEmployeeId)) {
            showNotification('You do not have permission to edit this employee.', 'error');
            return;
        }
        setSelectedEmployee(employee);
        setFormData(employee);
        setIsEditing(true);
    };

    const handleAdd = (canAdd) => {
        if (!canAdd) {
            showNotification('You do not have permission to add employees', 'error');
            return;
        }
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
        setIsAdding(true);
    };

    const handleSave = async () => {
        setError('');
        setDuplicateEmailError(false);

        if (!formData.firstName || !formData.lastName || !formData.email ||
            !formData.position || !formData.department || !formData.salary || !formData.hireDate) {
            setError('All fields are required');
            return;
        }

        if (!isManager && !formData.managerId) {
            setError('Please select a manager');
            return;
        }

        if (!formData.teamIds || formData.teamIds.length === 0) {
            setError('Please select at least one team');
            return;
        }

        if (emailError) {
            setError('Please enter a valid email address');
            return;
        }

        if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
            setError('Salary must be a positive number');
            return;
        }

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_URL}/${selectedEmployee.id}` : API_URL;

            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                if (response.status === 409) {
                    setError(errorData?.message || 'Email address is already in use');
                    setDuplicateEmailError(true);
                    return;
                }

                if (response.status === 400 && errorData) {
                    if (errorData.message) {
                        setError(errorData.message);
                    } else if (errorData.errors && Array.isArray(errorData.errors)) {
                        const errorMessages = errorData.errors.map(err => err.message || err).join(', ');
                        setError(errorMessages);
                    } else if (typeof errorData === 'object') {
                        const errorMessages = Object.values(errorData).join(', ');
                        setError(errorMessages);
                    } else {
                        setError(`Failed to ${isEditing ? 'update' : 'create'} employee`);
                    }
                } else {
                    const errorMessage = errorData?.message || `Failed to ${isEditing ? 'update' : 'create'} employee`;
                    setError(errorMessage);
                }
                return;
            }

            await fetchEmployees();
            await fetchTeams();

            setIsEditing(false);
            setIsAdding(false);
            showNotification(`Employee ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
        } catch (error) {
            console.error('Error saving employee:', error);
            setError('Network error. Please try again.');
        }
    };

    const handleDelete = async (id, canDelete) => {
        if (!canDelete) {
            showNotification('You do not have permission to delete employees', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to delete this employee?\n\nNote: If this employee has a user account, it will also be deleted.')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    await fetchEmployees();
                    await fetchTeams();
                    showNotification('Employee deleted successfully!', 'success');
                } else {
                    showNotification('Failed to delete employee.', 'error');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                showNotification('Error deleting employee.', 'error');
            }
        }
    };

    const handleCancel = (resetForm) => {
        setIsEditing(false);
        setIsAdding(false);
        setSelectedEmployee(null);
        resetForm();
    };

    return {
        selectedEmployee,
        isEditing,
        isAdding,
        handleEdit,
        handleAdd,
        handleSave,
        handleDelete,
        handleCancel
    };
};
