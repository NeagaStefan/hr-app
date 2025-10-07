import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header', () => {
    const mockOnLogout = jest.fn();

    const defaultProps = {
        username: 'john.doe@example.com',
        role: 'ROLE_ADMIN',
        onLogout: mockOnLogout
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the dashboard title', () => {
            render(<Header {...defaultProps} />);
            expect(screen.getByText('HR Management Dashboard')).toBeInTheDocument();
        });

        it('should render the username', () => {
            render(<Header {...defaultProps} />);
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        });

        it('should render the logout button', () => {
            render(<Header {...defaultProps} />);
            expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        });

        it('should display "Logged in as:" text', () => {
            render(<Header {...defaultProps} />);
            expect(screen.getByText(/Logged in as:/i)).toBeInTheDocument();
        });
    });

    describe('Role Display', () => {
        it('should display ADMIN role without ROLE_ prefix', () => {
            render(<Header {...defaultProps} role="ROLE_ADMIN" />);
            expect(screen.getByText(/\(ADMIN\)/i)).toBeInTheDocument();
        });

        it('should display MANAGER role without ROLE_ prefix', () => {
            render(<Header {...defaultProps} role="ROLE_MANAGER" />);
            expect(screen.getByText(/\(MANAGER\)/i)).toBeInTheDocument();
        });

        it('should display USER role without ROLE_ prefix', () => {
            render(<Header {...defaultProps} role="ROLE_USER" />);
            expect(screen.getByText(/\(USER\)/i)).toBeInTheDocument();
        });

        it('should display role as-is when no ROLE_ prefix', () => {
            render(<Header {...defaultProps} role="EMPLOYEE" />);
            expect(screen.getByText(/\(EMPLOYEE\)/i)).toBeInTheDocument();
        });

        it('should display "User" as fallback when role is null', () => {
            render(<Header {...defaultProps} role={null} />);
            expect(screen.getByText(/\(User\)/i)).toBeInTheDocument();
        });

        it('should display "User" as fallback when role is undefined', () => {
            render(<Header {...defaultProps} role={undefined} />);
            expect(screen.getByText(/\(User\)/i)).toBeInTheDocument();
        });

        it('should display "User" as fallback when role is empty string', () => {
            render(<Header {...defaultProps} role="" />);
            expect(screen.getByText(/\(User\)/i)).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should call onLogout when logout button is clicked', () => {
            render(<Header {...defaultProps} />);

            const logoutButton = screen.getByRole('button', { name: /Logout/i });
            fireEvent.click(logoutButton);

            expect(mockOnLogout).toHaveBeenCalledTimes(1);
        });

        it('should call onLogout multiple times when clicked multiple times', () => {
            render(<Header {...defaultProps} />);

            const logoutButton = screen.getByRole('button', { name: /Logout/i });
            fireEvent.click(logoutButton);
            fireEvent.click(logoutButton);
            fireEvent.click(logoutButton);

            expect(mockOnLogout).toHaveBeenCalledTimes(3);
        });
    });

    describe('CSS Classes', () => {
        it('should apply correct CSS class to header container', () => {
            const { container } = render(<Header {...defaultProps} />);
            expect(container.querySelector('.dashboard-header')).toBeInTheDocument();
        });

        it('should apply correct CSS class to header actions', () => {
            const { container } = render(<Header {...defaultProps} />);
            expect(container.querySelector('.header-actions')).toBeInTheDocument();
        });

        it('should apply correct CSS class to user info span', () => {
            const { container } = render(<Header {...defaultProps} />);
            expect(container.querySelector('.user-info')).toBeInTheDocument();
        });

        it('should apply correct CSS class to logout button', () => {
            render(<Header {...defaultProps} />);

            const logoutButton = screen.getByRole('button', { name: /Logout/i });
            expect(logoutButton).toHaveClass('btn-logout');
        });

        it('should have strong tag for username', () => {
            const { container } = render(<Header {...defaultProps} />);

            const strongElement = container.querySelector('strong');
            expect(strongElement).toBeInTheDocument();
            expect(strongElement).toHaveTextContent('john.doe@example.com');
        });
    });

    describe('Edge Cases', () => {
        it('should handle very long username', () => {
            const longUsername = 'very.long.username.that.might.break.layout@verylongdomain.com';
            render(<Header {...defaultProps} username={longUsername} />);

            expect(screen.getByText(longUsername)).toBeInTheDocument();
        });

        it('should handle username with special characters', () => {
            const specialUsername = "user+test@example.com";
            render(<Header {...defaultProps} username={specialUsername} />);

            expect(screen.getByText(specialUsername)).toBeInTheDocument();
        });

        it('should handle empty username', () => {
            render(<Header {...defaultProps} username="" />);

            const userInfo = screen.getByText(/Logged in as:/i);
            expect(userInfo).toBeInTheDocument();
        });

        it('should handle role with multiple underscores', () => {
            render(<Header {...defaultProps} role="ROLE_SUPER_ADMIN" />);
            expect(screen.getByText(/\(SUPER_ADMIN\)/i)).toBeInTheDocument();
        });

        it('should handle role with lowercase', () => {
            render(<Header {...defaultProps} role="ROLE_admin" />);
            expect(screen.getByText(/\(admin\)/i)).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have heading with correct level', () => {
            render(<Header {...defaultProps} />);

            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveTextContent('HR Management Dashboard');
        });

        it('should have logout button accessible by role', () => {
            render(<Header {...defaultProps} />);

            const logoutButton = screen.getByRole('button', { name: /Logout/i });
            expect(logoutButton).toBeInTheDocument();
            expect(logoutButton).toHaveClass('btn-logout');
        });
    });

    describe('Component Structure', () => {
        it('should render all main sections', () => {
            const { container } = render(<Header {...defaultProps} />);

            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(container.querySelector('.header-actions')).toBeInTheDocument();
            expect(container.querySelector('.user-info')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        });

        it('should display user info in correct format', () => {
            render(<Header {...defaultProps} />);

            const userInfo = screen.getByText(/Logged in as:/i);
            expect(userInfo).toBeInTheDocument();
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByText(/\(ADMIN\)/i)).toBeInTheDocument();
        });
    });

    describe('Props Validation', () => {
        it('should render correctly with all props provided', () => {
            render(<Header {...defaultProps} />);

            expect(screen.getByText('HR Management Dashboard')).toBeInTheDocument();
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByText(/\(ADMIN\)/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        });

        it('should handle missing onLogout gracefully', () => {
            render(<Header username="test@example.com" role="ROLE_USER" onLogout={undefined} />);

            expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        });
    });

    describe('Text Content', () => {
        it('should display complete user information string', () => {
            const { container } = render(<Header {...defaultProps} />);

            const userInfo = container.querySelector('.user-info');
            expect(userInfo.textContent).toContain('Logged in as:');
            expect(userInfo.textContent).toContain('john.doe@example.com');
            expect(userInfo.textContent).toContain('(ADMIN)');
        });

        it('should format role with parentheses', () => {
            render(<Header {...defaultProps} role="ROLE_MANAGER" />);

            expect(screen.getByText(/\(MANAGER\)/i)).toBeInTheDocument();
        });
    });
});
