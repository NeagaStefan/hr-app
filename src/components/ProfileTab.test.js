import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileTab from './ProfileTab';

describe('ProfileTab', () => {
    const mockCurrentUserEmployee = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Software Engineer',
        department: 'Engineering',
        salary: 75000,
        hireDate: '2020-01-15',
        managerName: 'Jane Smith',
        teamIds: ['team1', 'team2']
    };

    const mockTeams = [
        { id: 'team1', name: 'Development Team' },
        { id: 'team2', name: 'QA Team' },
        { id: 'team3', name: 'Design Team' }
    ];

    const mockGetAuthHeaders = jest.fn(() => ({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    }));

    const mockOnEditProfile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should display loading message when currentUserEmployee is null', () => {
            render(<ProfileTab currentUserEmployee={null} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        });

        it('should display loading message when currentUserEmployee is undefined', () => {
            render(<ProfileTab currentUserEmployee={undefined} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        });

        it('should render profile card with employee information', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByText('Edit Profile')).toBeInTheDocument();
        });

        it('should display employee name', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('should display employee email', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        });

        it('should display employee position', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        });

        it('should display employee department', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Engineering')).toBeInTheDocument();
        });

        it('should display formatted salary', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('$75,000')).toBeInTheDocument();
        });

        it('should display formatted hire date', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const expectedDate = new Date('2020-01-15').toLocaleDateString();
            expect(screen.getByText(expectedDate)).toBeInTheDocument();
        });

        it('should display manager name when present', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        it('should not display manager row when managerName is not present', () => {
            const employeeWithoutManager = { ...mockCurrentUserEmployee, managerName: null };
            render(<ProfileTab currentUserEmployee={employeeWithoutManager} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.queryByText('Manager:')).not.toBeInTheDocument();
        });

        it('should display all profile labels', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Name:')).toBeInTheDocument();
            expect(screen.getByText('Email:')).toBeInTheDocument();
            expect(screen.getByText('Position:')).toBeInTheDocument();
            expect(screen.getByText('Department:')).toBeInTheDocument();
            expect(screen.getByText('Salary:')).toBeInTheDocument();
            expect(screen.getByText('Hire Date:')).toBeInTheDocument();
        });
    });

    describe('Edit Profile Modal', () => {
        it('should not show modal initially', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.queryByText('Edit Profile')).not.toHaveClass('modal');
        });

        it('should open modal when Edit Profile button is clicked', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const editButton = screen.getByRole('button', { name: 'Edit Profile' });
            fireEvent.click(editButton);
            expect(screen.getByText('Note: You cannot edit your salary, hire date, or manager.')).toBeInTheDocument();
        });

        it('should display modal with correct heading', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const editButton = screen.getByRole('button', { name: 'Edit Profile' });
            fireEvent.click(editButton);
            const modalHeadings = screen.getAllByText('Edit Profile');
            expect(modalHeadings.length).toBeGreaterThan(1);
        });

        it('should populate form fields with current employee data', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const editButton = screen.getByRole('button', { name: 'Edit Profile' });
            fireEvent.click(editButton);
            expect(screen.getByPlaceholderText('First Name *')).toHaveValue('John');
            expect(screen.getByPlaceholderText('Last Name *')).toHaveValue('Doe');
            expect(screen.getByPlaceholderText('Email *')).toHaveValue('john.doe@example.com');
            expect(screen.getByPlaceholderText('Position *')).toHaveValue('Software Engineer');
            expect(screen.getByPlaceholderText('Department *')).toHaveValue('Engineering');
        });

        it('should display teams dropdown', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const editButton = screen.getByRole('button', { name: 'Edit Profile' });
            fireEvent.click(editButton);
            expect(screen.getByText('Development Team')).toBeInTheDocument();
            expect(screen.getByText('QA Team')).toBeInTheDocument();
            expect(screen.getByText('Design Team')).toBeInTheDocument();
        });

        it('should display team selection hint', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const editButton = screen.getByRole('button', { name: 'Edit Profile' });
            fireEvent.click(editButton);
            expect(screen.getByText('Hold Ctrl (Cmd on Mac) to select multiple teams')).toBeInTheDocument();
        });

        it('should close modal when Cancel button is clicked', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const editButton = screen.getByRole('button', { name: 'Edit Profile' });
            fireEvent.click(editButton);
            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            fireEvent.click(cancelButton);
            expect(screen.queryByText('Note: You cannot edit your salary, hire date, or manager.')).not.toBeInTheDocument();
        });
    });

    describe('Form Input Changes', () => {
        it('should update first name when input changes', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const firstNameInput = screen.getByPlaceholderText('First Name *');
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            expect(firstNameInput).toHaveValue('Jane');
        });

        it('should update last name when input changes', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const lastNameInput = screen.getByPlaceholderText('Last Name *');
            fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
            expect(lastNameInput).toHaveValue('Smith');
        });

        it('should update email when input changes', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: 'jane.smith@example.com' } });
            expect(emailInput).toHaveValue('jane.smith@example.com');
        });

        it('should update position when input changes', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const positionInput = screen.getByPlaceholderText('Position *');
            fireEvent.change(positionInput, { target: { value: 'Senior Engineer' } });
            expect(positionInput).toHaveValue('Senior Engineer');
        });

        it('should update department when input changes', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const departmentInput = screen.getByPlaceholderText('Department *');
            fireEvent.change(departmentInput, { target: { value: 'Product' } });
            expect(departmentInput).toHaveValue('Product');
        });
    });

    describe('Form Validation', () => {
        it('should show error when first name is empty', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const firstNameInput = screen.getByPlaceholderText('First Name *');
            fireEvent.change(firstNameInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('All fields are required')).toBeInTheDocument();
            });
        });

        it('should show error when last name is empty', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const lastNameInput = screen.getByPlaceholderText('Last Name *');
            fireEvent.change(lastNameInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('All fields are required')).toBeInTheDocument();
            });
        });

        it('should show error when email is empty', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('All fields are required')).toBeInTheDocument();
            });
        });

        it('should show error when position is empty', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const positionInput = screen.getByPlaceholderText('Position *');
            fireEvent.change(positionInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('All fields are required')).toBeInTheDocument();
            });
        });

        it('should show error when department is empty', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const departmentInput = screen.getByPlaceholderText('Department *');
            fireEvent.change(departmentInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('All fields are required')).toBeInTheDocument();
            });
        });

        it('should show error for invalid email format without @', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Invalid email format')).toBeInTheDocument();
                expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            });
        });

        it('should show error for invalid email format without domain', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: 'test@' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Invalid email format')).toBeInTheDocument();
            });
        });

        it('should show error for email with invalid domain extension', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: 'test@domain.c' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Invalid email format')).toBeInTheDocument();
            });
        });

        it('should add error class to email input when email is invalid', async () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(emailInput).toHaveClass('error');
            });
        });

        it('should accept valid email format', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
            });
        });
    });

    describe('API Integration', () => {
        it('should call fetch with correct URL when saving profile', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    'http://localhost:8080/api/employees/me',
                    expect.any(Object)
                );
            });
        });

        it('should call fetch with PUT method', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.objectContaining({ method: 'PUT' })
                );
            });
        });

        it('should call getAuthHeaders to get authorization headers', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(mockGetAuthHeaders).toHaveBeenCalled();
            });
        });

        it('should send updated profile data in request body', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const firstNameInput = screen.getByPlaceholderText('First Name *');
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.objectContaining({
                        body: expect.stringContaining('Jane')
                    })
                );
            });
        });

        it('should close modal on successful save', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.queryByText('Note: You cannot edit your salary, hire date, or manager.')).not.toBeInTheDocument();
            });
        });

        it('should call onEditProfile callback on successful save', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} onEditProfile={mockOnEditProfile} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(mockOnEditProfile).toHaveBeenCalled();
            });
        });

        it('should not call onEditProfile if callback is not provided', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalled();
            });
        });
    });

    describe('Error Handling', () => {
        it('should display error message on 409 conflict status', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: async () => ({ message: 'Email already exists' })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Email already exists')).toBeInTheDocument();
            });
        });

        it('should display default message on 409 without error message', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: async () => ({})
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Email address is already in use')).toBeInTheDocument();
            });
        });

        it('should display error message on 400 bad request status', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ message: 'Invalid data provided' })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Invalid data provided')).toBeInTheDocument();
            });
        });

        it('should display default error on 400 without message', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({})
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
            });
        });

        it('should display error message on other error status codes', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ message: 'Server error occurred' })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Server error occurred')).toBeInTheDocument();
            });
        });

        it('should handle network error gracefully', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
            });
            consoleErrorSpy.mockRestore();
        });

        it('should keep modal open on error', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ message: 'Error' })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Note: You cannot edit your salary, hire date, or manager.')).toBeInTheDocument();
            });
        });

        it('should handle response without json gracefully', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => {
                    throw new Error('No JSON');
                }
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
            });
        });
    });

    describe('State Management', () => {
        it('should clear errors when opening edit modal', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            expect(screen.queryByText('All fields are required')).not.toBeInTheDocument();
        });

        it('should update form data when currentUserEmployee changes', async () => {
            const { rerender } = render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            const updatedEmployee = { ...mockCurrentUserEmployee, firstName: 'Alice', lastName: 'Johnson' };
            rerender(<ProfileTab currentUserEmployee={updatedEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            await waitFor(() => {
                expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
            });
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });

        it('should initialize teamIds as empty array if not provided', () => {
            const employeeWithoutTeams = { ...mockCurrentUserEmployee, teamIds: undefined };
            render(<ProfileTab currentUserEmployee={employeeWithoutTeams} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const teamSelect = screen.getByRole('listbox');
            expect(teamSelect).toBeInTheDocument();
        });
    });

    describe('Salary Formatting', () => {
        it('should display salary with thousand separators', () => {
            const employeeWithHighSalary = { ...mockCurrentUserEmployee, salary: 150000 };
            render(<ProfileTab currentUserEmployee={employeeWithHighSalary} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('$150,000')).toBeInTheDocument();
        });

        it('should handle undefined salary gracefully', () => {
            const employeeWithoutSalary = { ...mockCurrentUserEmployee, salary: undefined };
            render(<ProfileTab currentUserEmployee={employeeWithoutSalary} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Salary:')).toBeInTheDocument();
        });

        it('should handle null salary gracefully', () => {
            const employeeWithNullSalary = { ...mockCurrentUserEmployee, salary: null };
            render(<ProfileTab currentUserEmployee={employeeWithNullSalary} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Salary:')).toBeInTheDocument();
        });

        it('should display zero salary', () => {
            const employeeWithZeroSalary = { ...mockCurrentUserEmployee, salary: 0 };
            render(<ProfileTab currentUserEmployee={employeeWithZeroSalary} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('$0')).toBeInTheDocument();
        });
    });

    describe('Team Selection', () => {
        it('should display all available teams in dropdown', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            mockTeams.forEach(team => {
                expect(screen.getByText(team.name)).toBeInTheDocument();
            });
        });

        it('should handle empty teams array', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={[]} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });

        it('should render team options with correct keys', () => {
            const { container } = render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const options = container.querySelectorAll('option');
            expect(options.length).toBe(mockTeams.length);
        });
    });

    describe('CSS Classes', () => {
        it('should render with profile-card class', () => {
            const { container } = render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(container.querySelector('.profile-card')).toBeInTheDocument();
        });

        it('should render modal with modal-overlay class when editing', () => {
            const { container } = render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
        });

        it('should apply alert-error class to error messages', async () => {
            const { container } = render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const firstNameInput = screen.getByPlaceholderText('First Name *');
            fireEvent.change(firstNameInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(container.querySelector('.alert.alert-error')).toBeInTheDocument();
            });
        });
    });

    describe('Conditional Rendering of Manager', () => {
        it('should display manager when managerName is provided', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.getByText('Manager:')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        it('should not display manager row when managerName is undefined', () => {
            const employeeWithoutManager = { ...mockCurrentUserEmployee, managerName: undefined };
            render(<ProfileTab currentUserEmployee={employeeWithoutManager} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.queryByText('Manager:')).not.toBeInTheDocument();
        });

        it('should not display manager row when managerName is empty string', () => {
            const employeeWithEmptyManager = { ...mockCurrentUserEmployee, managerName: '' };
            render(<ProfileTab currentUserEmployee={employeeWithEmptyManager} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            expect(screen.queryByText('Manager:')).not.toBeInTheDocument();
        });
    });

    describe('Form Actions', () => {
        it('should have Save Changes button', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
        });

        it('should have Cancel button', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });

        it('should not submit form when Save Changes is clicked', () => {
            const { container } = render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const form = container.querySelector('form');
            const submitHandler = jest.fn(e => e.preventDefault());
            form.addEventListener('submit', submitHandler);
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            expect(submitHandler).not.toHaveBeenCalled();
        });
    });

    describe('Profile Display Fields', () => {
        it('should display all required profile fields', () => {
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const labels = ['Name:', 'Email:', 'Position:', 'Department:', 'Salary:', 'Hire Date:'];
            labels.forEach(label => {
                expect(screen.getByText(label)).toBeInTheDocument();
            });
        });

        it('should display formatted date correctly', () => {
            const testEmployee = {
                ...mockCurrentUserEmployee,
                hireDate: '2023-06-15'
            };
            render(<ProfileTab currentUserEmployee={testEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            const expectedDate = new Date('2023-06-15').toLocaleDateString();
            expect(screen.getByText(expectedDate)).toBeInTheDocument();
        });
    });

    describe('Error State Clearing', () => {
        it('should clear errors when starting to save profile', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });
            render(<ProfileTab currentUserEmployee={mockCurrentUserEmployee} teams={mockTeams} getAuthHeaders={mockGetAuthHeaders} />);
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
            const firstNameInput = screen.getByPlaceholderText('First Name *');
            fireEvent.change(firstNameInput, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.getByText('All fields are required')).toBeInTheDocument();
            });
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
            await waitFor(() => {
                expect(screen.queryByText('All fields are required')).not.toBeInTheDocument();
            });
        });
    });
});

