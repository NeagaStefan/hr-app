import { renderHook, act } from '@testing-library/react';
import { useEmployeeForm } from './useEmployeeForm';

describe('useEmployeeForm', () => {
    it('should initialize with default empty values', () => {
        const { result } = renderHook(() => useEmployeeForm());

        expect(result.current.formData).toEqual({
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
        expect(result.current.emailError).toBe('');
        expect(result.current.duplicateEmailError).toBe(false);
        expect(result.current.error).toBe('');
    });

    it('should update form data on input change', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'firstName', value: 'John' }
            });
        });

        expect(result.current.formData.firstName).toBe('John');
    });

    it('should update multiple fields', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'firstName', value: 'John' }
            });
            result.current.handleInputChange({
                target: { name: 'lastName', value: 'Doe' }
            });
            result.current.handleInputChange({
                target: { name: 'position', value: 'Developer' }
            });
        });

        expect(result.current.formData.firstName).toBe('John');
        expect(result.current.formData.lastName).toBe('Doe');
        expect(result.current.formData.position).toBe('Developer');
    });

    it('should handle teamIds as multiple select', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: {
                    name: 'teamIds',
                    options: [
                        { value: '1', selected: true },
                        { value: '2', selected: true },
                        { value: '3', selected: false }
                    ]
                }
            });
        });

        expect(result.current.formData.teamIds).toEqual(['1', '2']);
    });

    it('should handle empty teamIds selection', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: {
                    name: 'teamIds',
                    options: [
                        { value: '1', selected: false },
                        { value: '2', selected: false }
                    ]
                }
            });
        });

        expect(result.current.formData.teamIds).toEqual([]);
    });

    it('should validate valid email format', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john.doe@example.com' }
            });
        });

        expect(result.current.emailError).toBe('');
    });

    it('should show error for invalid email format without @', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'invalidemail.com' }
            });
        });

        expect(result.current.emailError).toBe('Invalid email format');
    });

    it('should show error for email with multiple @', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john@@example.com' }
            });
        });

        expect(result.current.emailError).toBe('Invalid email format');
    });

    it('should show error for email without domain extension', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john@example' }
            });
        });

        expect(result.current.emailError).toBe('Email must have a valid domain (e.g., example.com)');
    });

    it('should show error for domain extension less than 2 characters', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john@example.c' }
            });
        });

        expect(result.current.emailError).toBe('Domain extension must be at least 2 characters');
    });

    it('should show error for invalid domain format with empty parts', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john@.example.com' }
            });
        });

        expect(result.current.emailError).toBe('Invalid domain format');
    });

    it('should show error for email with consecutive dots in domain', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john@example..com' }
            });
        });

        expect(result.current.emailError).toBe('Invalid domain format');
    });

    it('should clear email error when email is empty', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'invalid' }
            });
        });

        expect(result.current.emailError).not.toBe('');

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: '' }
            });
        });

        expect(result.current.emailError).toBe('');
    });

    it('should accept email with subdomain', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'email', value: 'john@mail.example.com' }
            });
        });

        expect(result.current.emailError).toBe('');
    });

    it('should reset form to initial state', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'firstName', value: 'John' }
            });
            result.current.handleInputChange({
                target: { name: 'email', value: 'invalid@' }
            });
            result.current.setError('Some error');
            result.current.setDuplicateEmailError(true);
        });

        act(() => {
            result.current.resetForm();
        });

        expect(result.current.formData).toEqual({
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
        expect(result.current.emailError).toBe('');
        expect(result.current.error).toBe('');
        expect(result.current.duplicateEmailError).toBe(false);
    });

    it('should allow setting formData directly', () => {
        const { result } = renderHook(() => useEmployeeForm());

        const newData = {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            position: 'Manager',
            department: 'IT',
            salary: '75000',
            hireDate: '2024-01-01',
            managerId: '5',
            teamIds: ['1', '2']
        };

        act(() => {
            result.current.setFormData(newData);
        });

        expect(result.current.formData).toEqual(newData);
    });

    it('should allow setting email error directly', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.setEmailError('Custom error');
        });

        expect(result.current.emailError).toBe('Custom error');
    });

    it('should allow setting duplicate email error', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.setDuplicateEmailError(true);
        });

        expect(result.current.duplicateEmailError).toBe(true);
    });

    it('should allow setting general error', () => {
        const { result } = renderHook(() => useEmployeeForm());

        act(() => {
            result.current.setError('General error message');
        });

        expect(result.current.error).toBe('General error message');
    });
});

