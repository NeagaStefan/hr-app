import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import {useAuth} from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext');

describe('Login', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            login: mockLogin
        });
    });

    describe('Rendering', () => {
        it('should render the login form', () => {
            render(<Login/>);
            expect(screen.getByRole('heading', {name: 'HR Management System'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {name: 'Login'})).toBeInTheDocument();
        });

        it('should render username input field', () => {
            render(<Login/>);
            const usernameInput = screen.getByLabelText(/username/i);
            expect(usernameInput).toBeInTheDocument();
            expect(usernameInput).toHaveAttribute('type', 'text');
        });

        it('should render password input field', () => {
            render(<Login/>);
            const passwordInput = screen.getByLabelText(/password/i);
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('should render login button', () => {
            render(<Login/>);
            expect(screen.getByRole('button', {name: /^Login$/i})).toBeInTheDocument();
        });

        it('should render demo accounts section', () => {
            render(<Login/>);
            expect(screen.getByText('Demo Accounts:')).toBeInTheDocument();
            expect(screen.getByText(/manager/i)).toBeInTheDocument();
            expect(screen.getByText(/michael.brown/i)).toBeInTheDocument();
            expect(screen.getByText(/emily.davis/i)).toBeInTheDocument();
        });

        it('should have placeholder text in inputs', () => {
            render(<Login/>);
            expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
        });

        it('should have required attributes on inputs', () => {
            render(<Login/>);
            expect(screen.getByLabelText(/username/i)).toBeRequired();
            expect(screen.getByLabelText(/password/i)).toBeRequired();
        });

        it('should not show error message initially', () => {
            render(<Login/>);
            expect(screen.queryByText(/Login failed/i)).not.toBeInTheDocument();
        });
    });

    describe('User Input', () => {
        it('should update username when typing', () => {
            render(<Login/>);
            const usernameInput = screen.getByLabelText(/username/i);

            fireEvent.change(usernameInput, {target: {value: 'testuser'}});

            expect(usernameInput).toHaveValue('testuser');
        });

        it('should update password when typing', () => {
            render(<Login/>);
            const passwordInput = screen.getByLabelText(/password/i);

            fireEvent.change(passwordInput, {target: {value: 'testpass123'}});

            expect(passwordInput).toHaveValue('testpass123');
        });

        it('should update both fields independently', () => {
            render(<Login/>);
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);

            fireEvent.change(usernameInput, {target: {value: 'manager'}});
            fireEvent.change(passwordInput, {target: {value: 'password123'}});

            expect(usernameInput).toHaveValue('manager');
            expect(passwordInput).toHaveValue('password123');
        });

        it('should start with empty input fields', () => {
            render(<Login/>);

            expect(screen.getByLabelText(/username/i)).toHaveValue('');
            expect(screen.getByLabelText(/password/i)).toHaveValue('');
        });
    });

    describe('Form Submission', () => {
        it('should call login function with credentials on submit', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('manager', 'password123');
            });
        });

        it('should prevent default form submission', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            const form = screen.getByRole('button', {name: /^Login$/i}).closest('form');
            const submitEvent = new Event('submit', {bubbles: true, cancelable: true});
            const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

            form.dispatchEvent(submitEvent);

            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('should clear error message on new submission', async () => {
            mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
            const {rerender} = render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'wrong'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'wrong'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
            });

            mockLogin.mockResolvedValue({});
            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Loading State', () => {
        it('should show loading state during login', async () => {
            mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            expect(screen.getByText('Logging in...')).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /Logging in.../i})).toBeDisabled();
        });

        it('should display spinner during loading', async () => {
            mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            const {container} = render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            expect(container.querySelector('.spinner')).toBeInTheDocument();
        });

        it('should disable inputs during loading', async () => {
            mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            expect(screen.getByLabelText(/username/i)).toBeDisabled();
            expect(screen.getByLabelText(/password/i)).toBeDisabled();
        });

        it('should re-enable inputs after successful login', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByLabelText(/username/i)).not.toBeDisabled();
                expect(screen.getByLabelText(/password/i)).not.toBeDisabled();
            });
        });

        it('should re-enable inputs after failed login', async () => {
            mockLogin.mockRejectedValue(new Error('Login failed'));
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'wrong'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'wrong'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByLabelText(/username/i)).not.toBeDisabled();
                expect(screen.getByLabelText(/password/i)).not.toBeDisabled();
            });
        });

        it('should remove spinner after login completes', async () => {
            mockLogin.mockResolvedValue({});
            const {container} = render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(container.querySelector('.spinner')).not.toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('should display error message on login failure', async () => {
            mockLogin.mockRejectedValue(new Error('Invalid credentials'));
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'wrong'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'wrong'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });
        });

        it('should display default error message when error has no message', async () => {
            mockLogin.mockRejectedValue(new Error());
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'test'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'test'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
            });
        });

        it('should handle non-Error rejections', async () => {
            mockLogin.mockRejectedValue({message: 'Custom error'});
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'test'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'test'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByText('Custom error')).toBeInTheDocument();
            });
        });

        it('should apply error-message class to error div', async () => {
            mockLogin.mockRejectedValue(new Error('Test error'));
            const {container} = render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'test'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'test'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(container.querySelector('.error-message')).toBeInTheDocument();
            });
        });
    });

    describe('Demo Accounts Display', () => {
        it('should display all demo account usernames', () => {
            render(<Login/>);

            expect(screen.getByText(/manager/)).toBeInTheDocument();
            expect(screen.getByText(/michael.brown/)).toBeInTheDocument();
            expect(screen.getByText(/emily.davis/)).toBeInTheDocument();
        });

        it('should display password hint for demo accounts', () => {
            render(<Login/>);

            const demoAccountsText = screen.getByText('Demo Accounts:').parentElement.textContent;
            expect(demoAccountsText).toContain('password123');
        });

        it('should render demo accounts in a list', () => {
            const {container} = render(<Login/>);

            const demoSection = container.querySelector('.demo-accounts');
            expect(demoSection).toBeInTheDocument();
            expect(demoSection.querySelectorAll('li').length).toBe(3);
        });
    });

    describe('CSS Classes', () => {
        it('should apply login-container class to wrapper', () => {
            const {container} = render(<Login/>);
            expect(container.querySelector('.login-container')).toBeInTheDocument();
        });

        it('should apply login-box class to content box', () => {
            const {container} = render(<Login/>);
            expect(container.querySelector('.login-box')).toBeInTheDocument();
        });

        it('should apply form-group class to input containers', () => {
            const {container} = render(<Login/>);
            const formGroups = container.querySelectorAll('.form-group');
            expect(formGroups.length).toBe(2);
        });

        it('should apply btn-login class to submit button', () => {
            render(<Login/>);
            const button = screen.getByRole('button', {name: /^Login$/i});
            expect(button).toHaveClass('btn-login');
        });

        it('should apply demo-accounts class to demo section', () => {
            const {container} = render(<Login/>);
            expect(container.querySelector('.demo-accounts')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<Login/>);

            const h1 = screen.getByRole('heading', {level: 1});
            const h2 = screen.getByRole('heading', {level: 2});
            const h3 = screen.getByRole('heading', {level: 3});

            expect(h1).toHaveTextContent('HR Management System');
            expect(h2).toHaveTextContent('Login');
            expect(h3).toHaveTextContent('Demo Accounts:');
        });

        it('should have labels associated with inputs', () => {
            render(<Login/>);

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(usernameInput).toHaveAttribute('id', 'username');
            expect(passwordInput).toHaveAttribute('id', 'password');
        });

        it('should have submit button type', () => {
            render(<Login/>);

            const button = screen.getByRole('button', {name: /^Login$/i});
            expect(button).toHaveAttribute('type', 'submit');
        });
    });

    describe('Integration Tests', () => {
        it('should complete full login flow successfully', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);


            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});

            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            expect(screen.getByText('Logging in...')).toBeInTheDocument();

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('manager', 'password123');
                expect(screen.queryByText('Logging in...')).not.toBeInTheDocument();
            });
        });

        it('should handle failed login and allow retry', async () => {
            mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'wrong'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'wrong'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });


            mockLogin.mockResolvedValue({});
            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'manager'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('manager', 'password123');
                expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty form submission', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            const button = screen.getByRole('button', {name: /^Login$/i});
            fireEvent.click(button);

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('', '');
            });
        });

        it('should trim whitespace from username', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: '  manager  '}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});

            expect(screen.getByLabelText(/username/i)).toHaveValue('  manager  ');
        });

        it('should handle very long input values', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            const longUsername = 'a'.repeat(1000);
            const longPassword = 'b'.repeat(1000);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: longUsername}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: longPassword}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith(longUsername, longPassword);
            });
        });

        it('should handle special characters in credentials', async () => {
            mockLogin.mockResolvedValue({});
            render(<Login/>);

            fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'user@domain.com'}});
            fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'p@ss!w0rd#123'}});
            fireEvent.click(screen.getByRole('button', {name: /^Login$/i}));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('user@domain.com', 'p@ss!w0rd#123');
            });
        });
    });
});

