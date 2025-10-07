import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeFormModal from './EmployeeFormModal';

describe('EmployeeFormModal', () => {
    const mockOnInputChange = jest.fn();
    const mockOnSave = jest.fn();
    const mockOnCancel = jest.fn();

    const mockTeams = [
        {id: 1, name: 'Engineering'},
        {id: 2, name: 'Sales'},
        {id: 3, name: 'Marketing'}
    ];

    const mockManagers = [
        {id: 10, firstName: 'John', lastName: 'Manager', position: 'Senior Manager'},
        {id: 11, firstName: 'Jane', lastName: 'Director', position: 'Director'}
    ];

    const defaultFormData = {
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        hireDate: '',
        managerId: '',
        teamIds: []
    };

    const filledFormData = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        position: 'Software Engineer',
        department: 'Engineering',
        salary: '75000',
        hireDate: '2025-01-15',
        managerId: '10',
        teamIds: ['1', '2']
    };

    const defaultProps = {
        isEditing: false,
        formData: defaultFormData,
        error: null,
        emailError: null,
        duplicateEmailError: false,
        teams: mockTeams,
        managers: mockManagers,
        isManager: false,
        onInputChange: mockOnInputChange,
        onSave: mockOnSave,
        onCancel: mockOnCancel
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render Add New Employee title when not editing', () => {
            render(<EmployeeFormModal {...defaultProps} />);
            expect(screen.getByText('Add New Employee')).toBeInTheDocument();
        });

        it('should render Edit Employee title when editing', () => {
            render(<EmployeeFormModal {...defaultProps} isEditing={true}/>);
            expect(screen.getByText('Edit Employee')).toBeInTheDocument();
        });

        it('should render all form fields', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByPlaceholderText('First Name *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Last Name *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Position *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Department *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Salary *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Hire Date *')).toBeInTheDocument();
        });

        it('should render Save and Cancel buttons', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByRole('button', {name: /Save/i})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument();
        });

        it('should render manager select dropdown when not a manager', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByText('Select Manager *')).toBeInTheDocument();
        });

        it('should not render manager select dropdown when user is a manager', () => {
            render(<EmployeeFormModal {...defaultProps} isManager={true}/>);

            expect(screen.queryByText('Select Manager *')).not.toBeInTheDocument();
        });

        it('should render team select dropdown', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const teamSelect = container.querySelector('.team-select');
            expect(teamSelect).toBeInTheDocument();
        });

        it('should display error message when error prop is provided', () => {
            const errorMessage = 'Failed to save employee';
            render(<EmployeeFormModal {...defaultProps} error={errorMessage}/>);

            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toHaveClass('alert-error');
        });

        it('should not display error message when error is null', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            expect(container.querySelector('.alert-error')).not.toBeInTheDocument();
        });

        it('should display email error when emailError prop is provided', () => {
            const emailError = 'Invalid email format';
            render(<EmployeeFormModal {...defaultProps} emailError={emailError}/>);

            expect(screen.getByText(emailError)).toBeInTheDocument();
            expect(screen.getByText(emailError)).toHaveClass('field-error');
        });
    });

    describe('Form Data Display', () => {
        it('should display pre-filled form data', () => {
            render(<EmployeeFormModal {...defaultProps} formData={filledFormData}/>);

            expect(screen.getByPlaceholderText('First Name *')).toHaveValue('Alice');
            expect(screen.getByPlaceholderText('Last Name *')).toHaveValue('Johnson');
            expect(screen.getByPlaceholderText('Email *')).toHaveValue('alice.johnson@example.com');
            expect(screen.getByPlaceholderText('Position *')).toHaveValue('Software Engineer');
            expect(screen.getByPlaceholderText('Department *')).toHaveValue('Engineering');
            expect(screen.getByPlaceholderText('Salary *')).toHaveValue(75000);
            expect(screen.getByPlaceholderText('Hire Date *')).toHaveValue('2025-01-15');
        });

        it('should display selected manager', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} formData={filledFormData}/>);

            const managerSelect = container.querySelector('.manager-select');
            expect(managerSelect).toHaveValue('10');
        });

        it('should display selected teams', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} formData={filledFormData}/>);

            const teamSelect = container.querySelector('.team-select');
            const selectedOptions = Array.from(teamSelect.selectedOptions).map(option => option.value);
            expect(selectedOptions).toEqual(['1', '2']);
        });
    });

    describe('Manager Options', () => {
        it('should render all manager options', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByText('John Manager (Senior Manager)')).toBeInTheDocument();
            expect(screen.getByText('Jane Director (Director)')).toBeInTheDocument();
        });

        it('should render manager options with correct values', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const managerSelect = container.querySelector('.manager-select');
            const options = Array.from(managerSelect.querySelectorAll('option'));

            expect(options[1]).toHaveValue('10');
            expect(options[2]).toHaveValue('11');
        });
    });

    describe('Team Options', () => {
        it('should render all team options', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByText('Engineering')).toBeInTheDocument();
            expect(screen.getByText('Sales')).toBeInTheDocument();
            expect(screen.getByText('Marketing')).toBeInTheDocument();
        });

        it('should render team select as multiple', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const teamSelect = container.querySelector('.team-select');
            expect(teamSelect).toHaveAttribute('multiple');
        });
    });

    describe('User Interactions', () => {
        it('should call onInputChange when first name is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const firstNameInput = screen.getByPlaceholderText('First Name *');
            fireEvent.change(firstNameInput, {target: {name: 'firstName', value: 'Bob'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when last name is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const lastNameInput = screen.getByPlaceholderText('Last Name *');
            fireEvent.change(lastNameInput, {target: {name: 'lastName', value: 'Smith'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when email is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const emailInput = screen.getByPlaceholderText('Email *');
            fireEvent.change(emailInput, {target: {name: 'email', value: 'test@example.com'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when position is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const positionInput = screen.getByPlaceholderText('Position *');
            fireEvent.change(positionInput, {target: {name: 'position', value: 'Developer'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when department is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const departmentInput = screen.getByPlaceholderText('Department *');
            fireEvent.change(departmentInput, {target: {name: 'department', value: 'IT'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when salary is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const salaryInput = screen.getByPlaceholderText('Salary *');
            fireEvent.change(salaryInput, {target: {name: 'salary', value: '50000'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when hire date is changed', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const hireDateInput = screen.getByPlaceholderText('Hire Date *');
            fireEvent.change(hireDateInput, {target: {name: 'hireDate', value: '2025-10-01'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when manager is selected', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const managerSelect = container.querySelector('.manager-select');
            fireEvent.change(managerSelect, {target: {name: 'managerId', value: '10'}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when teams are selected', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const teamSelect = container.querySelector('.team-select');
            fireEvent.change(teamSelect, {target: {name: 'teamIds', value: ['1', '2']}});

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onSave when Save button is clicked', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const saveButton = screen.getByRole('button', {name: /Save/i});
            fireEvent.click(saveButton);

            expect(mockOnSave).toHaveBeenCalledTimes(1);
        });

        it('should call onCancel when Cancel button is clicked', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const cancelButton = screen.getByRole('button', {name: /Cancel/i});
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('Email Validation Styling', () => {
        it('should not apply error or valid class when email is empty', () => {
            render(<EmployeeFormModal {...defaultProps} formData={{...defaultFormData, email: ''}}/>);

            const emailInput = screen.getByPlaceholderText('Email *');
            expect(emailInput).not.toHaveClass('error');
            expect(emailInput).not.toHaveClass('valid');
        });

        it('should apply error class when email has error', () => {
            const formDataWithEmail = {...defaultFormData, email: 'invalid-email'};
            render(<EmployeeFormModal {...defaultProps} formData={formDataWithEmail}
                                      emailError="Invalid email format"/>);

            const emailInput = screen.getByPlaceholderText('Email *');
            expect(emailInput).toHaveClass('error');
        });

        it('should apply valid class when email is valid and no error', () => {
            const formDataWithEmail = {...defaultFormData, email: 'valid@example.com'};
            render(<EmployeeFormModal {...defaultProps} formData={formDataWithEmail} emailError={null}/>);

            const emailInput = screen.getByPlaceholderText('Email *');
            expect(emailInput).toHaveClass('valid');
        });

        it('should apply duplicate-error class when duplicateEmailError is true', () => {
            const formDataWithEmail = {...defaultFormData, email: 'duplicate@example.com'};
            render(<EmployeeFormModal {...defaultProps} formData={formDataWithEmail} duplicateEmailError={true}/>);

            const emailInput = screen.getByPlaceholderText('Email *');
            expect(emailInput).toHaveClass('duplicate-error');
        });

        it('should apply both error and duplicate-error classes when both errors exist', () => {
            const formDataWithEmail = {...defaultFormData, email: 'invalid-email'};
            render(<EmployeeFormModal {...defaultProps} formData={formDataWithEmail} emailError="Invalid email"
                                      duplicateEmailError={true}/>);

            const emailInput = screen.getByPlaceholderText('Email *');
            expect(emailInput).toHaveClass('error');
            expect(emailInput).toHaveClass('duplicate-error');
        });
    });

    describe('Form Validation', () => {
        it('should have required attribute on all required fields', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByPlaceholderText('First Name *')).toBeRequired();
            expect(screen.getByPlaceholderText('Last Name *')).toBeRequired();
            expect(screen.getByPlaceholderText('Email *')).toBeRequired();
            expect(screen.getByPlaceholderText('Position *')).toBeRequired();
            expect(screen.getByPlaceholderText('Department *')).toBeRequired();
            expect(screen.getByPlaceholderText('Salary *')).toBeRequired();
            expect(screen.getByPlaceholderText('Hire Date *')).toBeRequired();
        });

        it('should have required attribute on manager select', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const managerSelect = container.querySelector('.manager-select');
            expect(managerSelect).toBeRequired();
        });

        it('should have required attribute on team select', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const teamSelect = container.querySelector('.team-select');
            expect(teamSelect).toBeRequired();
        });

        it('should have correct input type for email field', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const emailInput = screen.getByPlaceholderText('Email *');
            expect(emailInput).toHaveAttribute('type', 'email');
        });

        it('should have correct input type for salary field', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const salaryInput = screen.getByPlaceholderText('Salary *');
            expect(salaryInput).toHaveAttribute('type', 'number');
        });

        it('should have min and step attributes on salary field', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const salaryInput = screen.getByPlaceholderText('Salary *');
            expect(salaryInput).toHaveAttribute('min', '0');
            expect(salaryInput).toHaveAttribute('step', '0.01');
        });

        it('should have correct input type for hire date field', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const hireDateInput = screen.getByPlaceholderText('Hire Date *');
            expect(hireDateInput).toHaveAttribute('type', 'date');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty teams array', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} teams={[]}/>);

            const teamSelect = container.querySelector('.team-select');
            const options = teamSelect.querySelectorAll('option');
            expect(options.length).toBe(0);
        });

        it('should handle empty managers array', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} managers={[]}/>);

            const managerSelect = container.querySelector('.manager-select');
            const options = managerSelect.querySelectorAll('option');
            // Only the default "Select Manager *" option
            expect(options.length).toBe(1);
            expect(options[0].textContent).toBe('Select Manager *');
        });

        it('should handle null error gracefully', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} error={null}/>);

            expect(container.querySelector('.alert-error')).not.toBeInTheDocument();
        });

        it('should handle null emailError gracefully', () => {
            render(<EmployeeFormModal {...defaultProps} emailError={null}/>);

            expect(screen.queryByText(/field-error/)).not.toBeInTheDocument();
        });

        it('should handle empty teamIds array', () => {
            const formDataWithEmptyTeams = {...filledFormData, teamIds: []};
            const {container} = render(<EmployeeFormModal {...defaultProps} formData={formDataWithEmptyTeams}/>);

            const teamSelect = container.querySelector('.team-select');
            expect(teamSelect.selectedOptions.length).toBe(0);
        });
    });

    describe('CSS Classes', () => {
        it('should apply correct CSS classes to modal elements', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
            expect(container.querySelector('.modal')).toBeInTheDocument();
        });

        it('should apply correct CSS class to form', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            expect(container.querySelector('.employee-form')).toBeInTheDocument();
        });

        it('should apply correct CSS classes to form rows', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const formRows = container.querySelectorAll('.form-row');
            expect(formRows.length).toBeGreaterThan(0);
        });

        it('should apply correct CSS classes to buttons', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const saveButton = screen.getByRole('button', {name: /Save/i});
            const cancelButton = screen.getByRole('button', {name: /Cancel/i});

            expect(saveButton).toHaveClass('btn-save');
            expect(cancelButton).toHaveClass('btn-cancel');
        });

        it('should apply correct CSS class to manager select', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const managerSelect = container.querySelector('.manager-select');
            expect(managerSelect).toHaveClass('manager-select');
        });

        it('should apply correct CSS class to team select', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const teamSelect = container.querySelector('.team-select');
            expect(teamSelect).toHaveClass('team-select');
        });
    });

    describe('Accessibility', () => {
        it('should have proper input names for all fields', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            expect(screen.getByPlaceholderText('First Name *')).toHaveAttribute('name', 'firstName');
            expect(screen.getByPlaceholderText('Last Name *')).toHaveAttribute('name', 'lastName');
            expect(screen.getByPlaceholderText('Email *')).toHaveAttribute('name', 'email');
            expect(screen.getByPlaceholderText('Position *')).toHaveAttribute('name', 'position');
            expect(screen.getByPlaceholderText('Department *')).toHaveAttribute('name', 'department');
            expect(screen.getByPlaceholderText('Salary *')).toHaveAttribute('name', 'salary');
            expect(screen.getByPlaceholderText('Hire Date *')).toHaveAttribute('name', 'hireDate');
        });

        it('should have proper names for select elements', () => {
            const {container} = render(<EmployeeFormModal {...defaultProps} />);

            const managerSelect = container.querySelector('.manager-select');
            const teamSelect = container.querySelector('.team-select');

            expect(managerSelect).toHaveAttribute('name', 'managerId');
            expect(teamSelect).toHaveAttribute('name', 'teamIds');
        });

        it('should have buttons with type="button"', () => {
            render(<EmployeeFormModal {...defaultProps} />);

            const saveButton = screen.getByRole('button', {name: /Save/i});
            const cancelButton = screen.getByRole('button', {name: /Cancel/i});

            expect(saveButton).toHaveAttribute('type', 'button');
            expect(cancelButton).toHaveAttribute('type', 'button');
        });
    });
});
