import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamManagementTab from './TeamManagementTab';

describe('TeamManagementTab', () => {
    const mockEmployees = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            position: 'Software Engineer',
            department: 'Engineering',
            salary: 75000,
            hireDate: '2020-01-15',
            teamIds: ['team1', 'team2']
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            position: 'Product Manager',
            department: 'Product',
            salary: 90000,
            hireDate: '2019-06-20',
            teamIds: ['team1']
        },
        {
            id: '3',
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            position: 'Designer',
            department: 'Design',
            salary: 70000,
            hireDate: '2021-03-10',
            teamIds: []
        }
    ];

    const mockTeams = [
        { id: 'team1', name: 'Development Team' },
        { id: 'team2', name: 'QA Team' },
        { id: 'team3', name: 'Design Team' }
    ];

    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnAddTeam = jest.fn();

    const defaultProps = {
        employees: mockEmployees,
        teams: mockTeams,
        canAdd: true,
        canEdit: true,
        canDelete: true,
        currentUserEmployeeId: '1',
        onAdd: mockOnAdd,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
        onAddTeam: mockOnAddTeam
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render team management container', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.team-management')).toBeInTheDocument();
        });

        it('should render All Employees heading', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('All Employees')).toBeInTheDocument();
        });

        it('should render employees table', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.employees-table')).toBeInTheDocument();
        });

        it('should render table element', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('should render table headers', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Position')).toBeInTheDocument();
            expect(screen.getByText('Department')).toBeInTheDocument();
            expect(screen.getByText('Salary')).toBeInTheDocument();
            expect(screen.getByText('Hire Date')).toBeInTheDocument();
            expect(screen.getByText('Teams')).toBeInTheDocument();
            expect(screen.getByText('Actions')).toBeInTheDocument();
        });

        it('should render all employees', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        });

        it('should render correct number of table rows', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            const rows = container.querySelectorAll('tbody tr');
            expect(rows.length).toBe(3);
        });

        it('should render team header', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.team-header')).toBeInTheDocument();
        });
    });

    describe('Add Employee Button', () => {
        it('should render Add Employee button when canAdd is true', () => {
            render(<TeamManagementTab {...defaultProps} canAdd={true} />);
            expect(screen.getByText('+ Add Employee')).toBeInTheDocument();
        });

        it('should not render Add Employee button when canAdd is false', () => {
            render(<TeamManagementTab {...defaultProps} canAdd={false} />);
            expect(screen.queryByText('+ Add Employee')).not.toBeInTheDocument();
        });

        it('should call onAdd when Add Employee button is clicked', () => {
            render(<TeamManagementTab {...defaultProps} />);
            fireEvent.click(screen.getByText('+ Add Employee'));
            expect(mockOnAdd).toHaveBeenCalled();
        });

        it('should call onAdd once per click', () => {
            render(<TeamManagementTab {...defaultProps} />);
            fireEvent.click(screen.getByText('+ Add Employee'));
            expect(mockOnAdd).toHaveBeenCalledTimes(1);
        });

        it('should have btn-add class', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('+ Add Employee')).toHaveClass('btn-add');
        });
    });

    describe('Add Team Button', () => {
        it('should always render Add Team button', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('+ Add Team')).toBeInTheDocument();
        });

        it('should render Add Team button when canAdd is false', () => {
            render(<TeamManagementTab {...defaultProps} canAdd={false} />);
            expect(screen.getByText('+ Add Team')).toBeInTheDocument();
        });

        it('should call onAddTeam when Add Team button is clicked', () => {
            render(<TeamManagementTab {...defaultProps} />);
            fireEvent.click(screen.getByText('+ Add Team'));
            expect(mockOnAddTeam).toHaveBeenCalled();
        });

        it('should call onAddTeam once per click', () => {
            render(<TeamManagementTab {...defaultProps} />);
            fireEvent.click(screen.getByText('+ Add Team'));
            expect(mockOnAddTeam).toHaveBeenCalledTimes(1);
        });

        it('should have btn-add class', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('+ Add Team')).toHaveClass('btn-add');
        });
    });

    describe('Employee Data Display', () => {
        it('should display employee names', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        });

        it('should display employee emails', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
            expect(screen.getByText('bob.johnson@example.com')).toBeInTheDocument();
        });

        it('should display employee positions', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('Software Engineer')).toBeInTheDocument();
            expect(screen.getByText('Product Manager')).toBeInTheDocument();
            expect(screen.getByText('Designer')).toBeInTheDocument();
        });

        it('should display employee departments', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('Engineering')).toBeInTheDocument();
            expect(screen.getByText('Product')).toBeInTheDocument();
            expect(screen.getByText('Design')).toBeInTheDocument();
        });

        it('should display formatted salaries', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('$75,000')).toBeInTheDocument();
            expect(screen.getByText('$90,000')).toBeInTheDocument();
            expect(screen.getByText('$70,000')).toBeInTheDocument();
        });

        it('should display formatted hire dates', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const date1 = new Date('2020-01-15').toLocaleDateString();
            const date2 = new Date('2019-06-20').toLocaleDateString();
            const date3 = new Date('2021-03-10').toLocaleDateString();
            expect(screen.getByText(date1)).toBeInTheDocument();
            expect(screen.getByText(date2)).toBeInTheDocument();
            expect(screen.getByText(date3)).toBeInTheDocument();
        });

        it('should display team names for employees with teams', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('Development Team, QA Team')).toBeInTheDocument();
            expect(screen.getByText('Development Team')).toBeInTheDocument();
        });

        it('should display empty string for employees with no teams', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            const rows = container.querySelectorAll('tbody tr');
            const bobRow = rows[2];
            const teamsCell = bobRow.querySelectorAll('td')[6];
            expect(teamsCell.textContent).toBe('');
        });
    });

    describe('Edit Button', () => {
        it('should render Edit button for all employees when canEdit is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={true} />);
            const editButtons = screen.getAllByText('Edit');
            expect(editButtons.length).toBe(3);
        });

        it('should not render Edit button when canEdit and canDelete are false', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={false} />);
            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });

        it('should render Edit button for other employees when canEdit is false but canDelete is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={true} />);
            const editButtons = screen.getAllByText('Edit');
            expect(editButtons.length).toBe(2);
        });

        it('should not render Edit button for current user when canEdit is false', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={true} currentUserEmployeeId="1" />);
            const editButtons = screen.getAllByText('Edit');
            editButtons.forEach(button => {
                const row = button.closest('tr');
                expect(row).not.toHaveTextContent('John Doe');
            });
        });

        it('should call onEdit with employee when Edit button is clicked', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);
            expect(mockOnEdit).toHaveBeenCalledWith(mockEmployees[0]);
        });

        it('should call onEdit once per click', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[1]);
            expect(mockOnEdit).toHaveBeenCalledTimes(1);
        });

        it('should have btn-edit class', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const editButtons = screen.getAllByText('Edit');
            expect(editButtons[0]).toHaveClass('btn-edit');
        });
    });

    describe('Delete Button', () => {
        it('should render Delete button for all employees when canDelete is true', () => {
            render(<TeamManagementTab {...defaultProps} canDelete={true} />);
            const deleteButtons = screen.getAllByText('Delete');
            expect(deleteButtons.length).toBe(3);
        });

        it('should not render Delete button when canDelete is false', () => {
            render(<TeamManagementTab {...defaultProps} canDelete={false} />);
            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });

        it('should call onDelete with employee id when Delete button is clicked', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            expect(mockOnDelete).toHaveBeenCalledWith('1');
        });

        it('should call onDelete once per click', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[2]);
            expect(mockOnDelete).toHaveBeenCalledTimes(1);
        });

        it('should have btn-delete class', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const deleteButtons = screen.getAllByText('Delete');
            expect(deleteButtons[0]).toHaveClass('btn-delete');
        });

        it('should call onDelete with correct employee id for second employee', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[1]);
            expect(mockOnDelete).toHaveBeenCalledWith('2');
        });
    });

    describe('View Only Display', () => {
        it('should display View Only when canEdit and canDelete are false', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={false} />);
            const viewOnlyElements = screen.getAllByText('View Only');
            expect(viewOnlyElements.length).toBe(3);
        });

        it('should not display View Only when canEdit is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={true} canDelete={false} />);
            expect(screen.queryByText('View Only')).not.toBeInTheDocument();
        });

        it('should not display View Only when canDelete is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={true} />);
            expect(screen.queryByText('View Only')).not.toBeInTheDocument();
        });

        it('should display View Only for current user when canEdit is false and canDelete is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={true} currentUserEmployeeId="1" />);
            const rows = screen.getAllByRole('row');
            const johnDoeRow = rows.find(row => row.textContent.includes('John Doe'));
            expect(johnDoeRow).not.toHaveTextContent('Edit');
            expect(johnDoeRow).toHaveTextContent('Delete');
        });

        it('should have no-actions class', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={false} />);
            const viewOnlyElements = screen.getAllByText('View Only');
            expect(viewOnlyElements[0]).toHaveClass('no-actions');
        });
    });

    describe('canEditEmployee Function', () => {
        it('should allow editing any employee when canEdit is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={true} />);
            const editButtons = screen.getAllByText('Edit');
            expect(editButtons.length).toBe(3);
        });

        it('should allow editing other employees when canEdit is false but canDelete is true', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={true} currentUserEmployeeId="1" />);
            const editButtons = screen.getAllByText('Edit');
            expect(editButtons.length).toBe(2);
        });

        it('should not allow editing current user when canEdit is false', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={true} currentUserEmployeeId="1" />);
            const rows = screen.getAllByRole('row');
            const johnDoeRow = rows.find(row => row.textContent.includes('John Doe'));
            expect(johnDoeRow).not.toHaveTextContent('Edit');
        });

        it('should not allow editing when both canEdit and canDelete are false', () => {
            render(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={false} />);
            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });
    });

    describe('Empty States', () => {
        it('should render empty table when employees array is empty', () => {
            render(<TeamManagementTab {...defaultProps} employees={[]} />);
            const { container } = render(<TeamManagementTab {...defaultProps} employees={[]} />);
            const rows = container.querySelectorAll('tbody tr');
            expect(rows.length).toBe(0);
        });

        it('should still render headers when employees array is empty', () => {
            render(<TeamManagementTab {...defaultProps} employees={[]} />);
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
        });

        it('should still render Add buttons when employees array is empty', () => {
            render(<TeamManagementTab {...defaultProps} employees={[]} />);
            expect(screen.getByText('+ Add Employee')).toBeInTheDocument();
            expect(screen.getByText('+ Add Team')).toBeInTheDocument();
        });
    });

    describe('Salary Formatting', () => {
        it('should format salary with thousand separators', () => {
            const employeeWithHighSalary = [{
                ...mockEmployees[0],
                salary: 150000
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithHighSalary} />);
            expect(screen.getByText('$150,000')).toBeInTheDocument();
        });

        it('should handle undefined salary', () => {
            const employeeWithoutSalary = [{
                ...mockEmployees[0],
                salary: undefined
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithoutSalary} />);
            expect(screen.getByText('$')).toBeInTheDocument();
        });

        it('should handle null salary', () => {
            const employeeWithNullSalary = [{
                ...mockEmployees[0],
                salary: null
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithNullSalary} />);
            expect(screen.getByText('$')).toBeInTheDocument();
        });

        it('should display zero salary', () => {
            const employeeWithZeroSalary = [{
                ...mockEmployees[0],
                salary: 0
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithZeroSalary} />);
            expect(screen.getByText('$0')).toBeInTheDocument();
        });
    });

    describe('Team Display', () => {
        it('should display multiple team names separated by commas', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('Development Team, QA Team')).toBeInTheDocument();
        });

        it('should display single team name', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('Development Team')).toBeInTheDocument();
        });

        it('should handle employee with undefined teamIds', () => {
            const employeeWithoutTeams = [{
                ...mockEmployees[0],
                teamIds: undefined
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithoutTeams} />);
            const { container } = render(<TeamManagementTab {...defaultProps} employees={employeeWithoutTeams} />);
            const teamsCell = container.querySelectorAll('tbody td')[6];
            expect(teamsCell.textContent).toBe('');
        });

        it('should handle employee with null teamIds', () => {
            const employeeWithNullTeams = [{
                ...mockEmployees[0],
                teamIds: null
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithNullTeams} />);
            const { container } = render(<TeamManagementTab {...defaultProps} employees={employeeWithNullTeams} />);
            const teamsCell = container.querySelectorAll('tbody td')[6];
            expect(teamsCell.textContent).toBe('');
        });

        it('should handle team not found in teams array', () => {
            const employeeWithInvalidTeam = [{
                ...mockEmployees[0],
                teamIds: ['nonexistent']
            }];
            render(<TeamManagementTab {...defaultProps} employees={employeeWithInvalidTeam} />);
            const { container } = render(<TeamManagementTab {...defaultProps} employees={employeeWithInvalidTeam} />);
            const rows = container.querySelectorAll('tbody tr');
            expect(rows.length).toBe(1);
        });
    });

    describe('Props Validation', () => {
        it('should handle all props correctly', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('All Employees')).toBeInTheDocument();
        });

        it('should update when employees prop changes', () => {
            const { rerender } = render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            const newEmployees = [{
                id: '4',
                firstName: 'New',
                lastName: 'Employee',
                email: 'new@example.com',
                position: 'Manager',
                department: 'Management',
                salary: 100000,
                hireDate: '2022-01-01',
                teamIds: []
            }];
            rerender(<TeamManagementTab {...defaultProps} employees={newEmployees} />);
            expect(screen.getByText('New Employee')).toBeInTheDocument();
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });

        it('should update when teams prop changes', () => {
            const { rerender } = render(<TeamManagementTab {...defaultProps} />);
            const newTeams = [{ id: 'team1', name: 'New Team Name' }];
            rerender(<TeamManagementTab {...defaultProps} teams={newTeams} />);
            expect(screen.getByText('New Team Name')).toBeInTheDocument();
        });

        it('should update when canAdd changes', () => {
            const { rerender } = render(<TeamManagementTab {...defaultProps} canAdd={true} />);
            expect(screen.getByText('+ Add Employee')).toBeInTheDocument();
            rerender(<TeamManagementTab {...defaultProps} canAdd={false} />);
            expect(screen.queryByText('+ Add Employee')).not.toBeInTheDocument();
        });

        it('should update when canEdit changes', () => {
            const { rerender } = render(<TeamManagementTab {...defaultProps} canEdit={true} />);
            expect(screen.getAllByText('Edit').length).toBe(3);
            rerender(<TeamManagementTab {...defaultProps} canEdit={false} canDelete={false} />);
            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });

        it('should update when canDelete changes', () => {
            const { rerender } = render(<TeamManagementTab {...defaultProps} canDelete={true} />);
            expect(screen.getAllByText('Delete').length).toBe(3);
            rerender(<TeamManagementTab {...defaultProps} canDelete={false} />);
            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });
    });

    describe('Button Actions', () => {
        it('should handle multiple clicks on Add Employee button', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const addButton = screen.getByText('+ Add Employee');
            fireEvent.click(addButton);
            fireEvent.click(addButton);
            expect(mockOnAdd).toHaveBeenCalledTimes(2);
        });

        it('should handle multiple clicks on Add Team button', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const addTeamButton = screen.getByText('+ Add Team');
            fireEvent.click(addTeamButton);
            fireEvent.click(addTeamButton);
            expect(mockOnAddTeam).toHaveBeenCalledTimes(2);
        });

        it('should handle clicks on different Edit buttons', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);
            fireEvent.click(editButtons[1]);
            expect(mockOnEdit).toHaveBeenCalledTimes(2);
            expect(mockOnEdit).toHaveBeenNthCalledWith(1, mockEmployees[0]);
            expect(mockOnEdit).toHaveBeenNthCalledWith(2, mockEmployees[1]);
        });

        it('should handle clicks on different Delete buttons', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            fireEvent.click(deleteButtons[1]);
            expect(mockOnDelete).toHaveBeenCalledTimes(2);
            expect(mockOnDelete).toHaveBeenNthCalledWith(1, '1');
            expect(mockOnDelete).toHaveBeenNthCalledWith(2, '2');
        });
    });

    describe('CSS Classes', () => {
        it('should have team-management class on container', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.team-management')).toBeInTheDocument();
        });

        it('should have team-header class on header', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.team-header')).toBeInTheDocument();
        });

        it('should have employees-table class on table container', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.employees-table')).toBeInTheDocument();
        });

        it('should have employee-actions class on actions cell', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('.employee-actions')).toBeInTheDocument();
        });

        it('should have btn-add class on Add Employee button', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('+ Add Employee')).toHaveClass('btn-add');
        });

        it('should have btn-add class on Add Team button', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('+ Add Team')).toHaveClass('btn-add');
        });

        it('should have btn-edit class on Edit buttons', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const editButtons = screen.getAllByText('Edit');
            editButtons.forEach(button => {
                expect(button).toHaveClass('btn-edit');
            });
        });

        it('should have btn-delete class on Delete buttons', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const deleteButtons = screen.getAllByText('Delete');
            deleteButtons.forEach(button => {
                expect(button).toHaveClass('btn-delete');
            });
        });
    });

    describe('Table Structure', () => {
        it('should have thead element', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('thead')).toBeInTheDocument();
        });

        it('should have tbody element', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            expect(container.querySelector('tbody')).toBeInTheDocument();
        });

        it('should have correct number of header cells', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            const headers = container.querySelectorAll('thead th');
            expect(headers.length).toBe(8);
        });

        it('should have correct number of data cells per row', () => {
            const { container } = render(<TeamManagementTab {...defaultProps} />);
            const firstRow = container.querySelector('tbody tr');
            const cells = firstRow.querySelectorAll('td');
            expect(cells.length).toBe(8);
        });
    });

    describe('Accessibility', () => {
        it('should have accessible table', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('should have accessible buttons', () => {
            render(<TeamManagementTab {...defaultProps} />);
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should have heading with proper level', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
        });

        it('should have proper heading text', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByRole('heading', { name: 'All Employees' })).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle employee with very long name', () => {
            const longNameEmployee = [{
                ...mockEmployees[0],
                firstName: 'VeryLongFirstName',
                lastName: 'VeryLongLastName'
            }];
            render(<TeamManagementTab {...defaultProps} employees={longNameEmployee} />);
            expect(screen.getByText('VeryLongFirstName VeryLongLastName')).toBeInTheDocument();
        });

        it('should handle employee with special characters in email', () => {
            const specialEmailEmployee = [{
                ...mockEmployees[0],
                email: 'test+special@example.com'
            }];
            render(<TeamManagementTab {...defaultProps} employees={specialEmailEmployee} />);
            expect(screen.getByText('test+special@example.com')).toBeInTheDocument();
        });

        it('should handle employee with unicode characters', () => {
            const unicodeEmployee = [{
                ...mockEmployees[0],
                firstName: '山田',
                lastName: '太郎'
            }];
            render(<TeamManagementTab {...defaultProps} employees={unicodeEmployee} />);
            expect(screen.getByText('山田 太郎')).toBeInTheDocument();
        });

        it('should handle very large salary', () => {
            const highSalaryEmployee = [{
                ...mockEmployees[0],
                salary: 10000000
            }];
            render(<TeamManagementTab {...defaultProps} employees={highSalaryEmployee} />);
            expect(screen.getByText('$10,000,000')).toBeInTheDocument();
        });

        it('should handle many teams', () => {
            const manyTeamsEmployee = [{
                ...mockEmployees[0],
                teamIds: ['team1', 'team2', 'team3']
            }];
            render(<TeamManagementTab {...defaultProps} employees={manyTeamsEmployee} />);
            expect(screen.getByText('Development Team, QA Team, Design Team')).toBeInTheDocument();
        });
    });

    describe('Integration', () => {
        it('should render complete component with all features', () => {
            render(<TeamManagementTab {...defaultProps} />);
            expect(screen.getByText('All Employees')).toBeInTheDocument();
            expect(screen.getByText('+ Add Employee')).toBeInTheDocument();
            expect(screen.getByText('+ Add Team')).toBeInTheDocument();
            expect(screen.getAllByText('Edit').length).toBe(3);
            expect(screen.getAllByText('Delete').length).toBe(3);
        });

        it('should allow complete user flow', () => {
            render(<TeamManagementTab {...defaultProps} />);
            fireEvent.click(screen.getByText('+ Add Employee'));
            expect(mockOnAdd).toHaveBeenCalled();
            fireEvent.click(screen.getAllByText('Edit')[0]);
            expect(mockOnEdit).toHaveBeenCalled();
            fireEvent.click(screen.getAllByText('Delete')[0]);
            expect(mockOnDelete).toHaveBeenCalled();
        });
    });
});

