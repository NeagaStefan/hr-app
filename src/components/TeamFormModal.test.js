import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamFormModal from './TeamFormModal';

describe('TeamFormModal', () => {
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render modal overlay', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
        });

        it('should render modal container', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.modal')).toBeInTheDocument();
        });

        it('should render Add New Team heading', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Add New Team')).toBeInTheDocument();
        });

        it('should render form element', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('form')).toBeInTheDocument();
        });

        it('should render Team Name label', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Team Name')).toBeInTheDocument();
        });

        it('should render input field', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toBeInTheDocument();
        });

        it('should render Create Team button', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Create Team')).toBeInTheDocument();
        });

        it('should render Cancel button', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });

        it('should render both buttons in form-actions container', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.form-actions')).toBeInTheDocument();
        });
    });

    describe('Input Field', () => {
        it('should display newTeamName value in input', () => {
            render(
                <TeamFormModal
                    newTeamName="Development Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('Development Team');
        });

        it('should display empty value when newTeamName is empty', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('');
        });

        it('should have text type for input', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveAttribute('type', 'text');
        });

        it('should have required attribute on input', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toBeRequired();
        });

        it('should have autoFocus attribute on input', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const input = screen.getByPlaceholderText('Enter team name');
            expect(input).toHaveFocus();
        });

        it('should have correct placeholder text', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveAttribute('placeholder', 'Enter team name');
        });

        it('should call onNameChange when input value changes', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const input = screen.getByPlaceholderText('Enter team name');
            fireEvent.change(input, {target: {value: 'QA Team'}});
            expect(mockOnNameChange).toHaveBeenCalled();
        });

        it('should call onNameChange once per change', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const input = screen.getByPlaceholderText('Enter team name');
            fireEvent.change(input, {target: {value: 'Test'}});
            expect(mockOnNameChange).toHaveBeenCalledTimes(1);
        });

        it('should pass event to onNameChange', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const input = screen.getByPlaceholderText('Enter team name');
            fireEvent.change(input, { target: { value: 'Test Team' } });
            expect(mockOnNameChange).toHaveBeenCalled();
            expect(mockOnNameChange).toHaveBeenCalledTimes(1);
        });

        it('should update value when newTeamName prop changes', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('');
            rerender(
                <TeamFormModal
                    newTeamName="Updated Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('Updated Team');
        });
    });

    describe('Error Handling', () => {
        it('should not display error when error prop is empty', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.queryByText(/alert/i)).not.toBeInTheDocument();
        });

        it('should display error message when error prop is provided', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error="Team name is required"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Team name is required')).toBeInTheDocument();
        });

        it('should apply alert class to error message', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error="Team name is required"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.alert')).toBeInTheDocument();
        });

        it('should apply alert-error class to error message', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error="Team name is required"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.alert-error')).toBeInTheDocument();
        });

        it('should apply both alert and alert-error classes', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error="Error message"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const errorDiv = container.querySelector('.alert.alert-error');
            expect(errorDiv).toBeInTheDocument();
        });

        it('should display different error messages', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error="First error"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('First error')).toBeInTheDocument();
            rerender(
                <TeamFormModal
                    newTeamName=""
                    error="Second error"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Second error')).toBeInTheDocument();
            expect(screen.queryByText('First error')).not.toBeInTheDocument();
        });

        it('should hide error when error prop becomes empty', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error="Error message"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Error message')).toBeInTheDocument();
            rerender(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.queryByText('Error message')).not.toBeInTheDocument();
        });

        it('should not display error when error is null', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error={null}
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error={null}
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.alert')).not.toBeInTheDocument();
        });

        it('should not display error when error is undefined', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error={undefined}
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.querySelector('.alert')).not.toBeInTheDocument();
        });

        it('should display error with special characters', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error="Error: Team name can't be empty!"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText("Error: Team name can't be empty!")).toBeInTheDocument();
        });

        it('should display long error messages', () => {
            const longError = 'This is a very long error message that contains detailed information about what went wrong';
            render(
                <TeamFormModal
                    newTeamName=""

                    error={longError}
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText(longError)).toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('should call onSave when form is submitted', () => {
            render(
                <TeamFormModal
                    newTeamName="Test Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const form = screen.getByText('Create Team').closest('form');
            fireEvent.submit(form);
            expect(mockOnSave).toHaveBeenCalled();
        });

        it('should call onSave once per submission', () => {
            render(
                <TeamFormModal
                    newTeamName="Test Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const form = screen.getByText('Create Team').closest('form');
            fireEvent.submit(form);
            expect(mockOnSave).toHaveBeenCalledTimes(1);
        });

        it('should prevent default form submission', () => {
            render(
                <TeamFormModal
                    newTeamName="Test Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const form = screen.getByText('Create Team').closest('form');
            const submitEvent = new Event('submit', {bubbles: true, cancelable: true});
            const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
            form.dispatchEvent(submitEvent);
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('should call onSave when Create Team button is clicked', () => {
            render(
                <TeamFormModal
                    newTeamName="Test Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Create Team'));
            expect(mockOnSave).toHaveBeenCalled();
        });

        it('should handle multiple form submissions', () => {
            render(
                <TeamFormModal
                    newTeamName="Test Team"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const form = screen.getByText('Create Team').closest('form');
            fireEvent.submit(form);
            fireEvent.submit(form);
            expect(mockOnSave).toHaveBeenCalledTimes(2);
        });
    });

    describe('Cancel Button', () => {
        it('should call onCancel when Cancel button is clicked', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Cancel'));
            expect(mockOnCancel).toHaveBeenCalled();
        });

        it('should call onCancel once per click', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Cancel'));
            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });

        it('should have type button on Cancel button', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Cancel')).toHaveAttribute('type', 'button');
        });

        it('should not submit form when Cancel button is clicked', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Cancel'));
            expect(mockOnSave).not.toHaveBeenCalled();
        });

        it('should handle multiple cancel clicks', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Cancel'));
            fireEvent.click(screen.getByText('Cancel'));
            expect(mockOnCancel).toHaveBeenCalledTimes(2);
        });
    });

    describe('Button Attributes', () => {
        it('should have submit type on Create Team button', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Create Team')).toHaveAttribute('type', 'submit');
        });

        it('should have btn-save class on Create Team button', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Create Team')).toHaveClass('btn-save');
        });

        it('should have btn-cancel class on Cancel button', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Cancel')).toHaveClass('btn-cancel');
        });

        it('should render both buttons as button elements', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Create Team').tagName).toBe('BUTTON');
            expect(screen.getByText('Cancel').tagName).toBe('BUTTON');
        });
    });

    describe('Component Structure', () => {
        it('should have modal-overlay as outer container', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(container.firstChild).toHaveClass('modal-overlay');
        });

        it('should have modal inside modal-overlay', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const overlay = container.querySelector('.modal-overlay');
            expect(overlay.querySelector('.modal')).toBeInTheDocument();
        });

        it('should have heading as first element in modal', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const modal = container.querySelector('.modal');
            expect(modal.children[0].tagName).toBe('H2');
        });

        it('should contain form element', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const modal = container.querySelector('.modal');
            expect(modal.querySelector('form')).toBeInTheDocument();
        });

        it('should have label wrapping input', () => {
            const {container} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const label = container.querySelector('label');
            expect(label.querySelector('input')).toBeInTheDocument();
        });
    });

    describe('Props Updates', () => {
        it('should update input value when newTeamName prop changes', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName="Initial"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('Initial');
            rerender(
                <TeamFormModal
                    newTeamName="Updated"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('Updated');
        });

        it('should update error display when error prop changes', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.queryByText('Error message')).not.toBeInTheDocument();
            rerender(
                <TeamFormModal
                    newTeamName=""
                    error="Error message"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Error message')).toBeInTheDocument();
        });

        it('should update callbacks when props change', () => {
            const newMockOnSave = jest.fn();
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            rerender(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={newMockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Create Team'));
            expect(newMockOnSave).toHaveBeenCalled();
            expect(mockOnSave).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('should have accessible form controls', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should have accessible buttons', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBe(2);
        });

        it('should have heading with proper level', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument();
        });

        it('should have proper heading text', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByRole('heading', {name: 'Add New Team'})).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string for newTeamName', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('');
        });

        it('should handle very long team names', () => {
            const longName = 'A'.repeat(200);
            render(
                <TeamFormModal
                    newTeamName={longName}
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue(longName);
        });

        it('should handle special characters in team name', () => {
            render(
                <TeamFormModal
                    newTeamName="Team @#$%"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('Team @#$%');
        });

        it('should handle unicode characters in team name', () => {
            render(
                <TeamFormModal
                    newTeamName="Team 日本語"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('Team 日本語');
        });

        it('should handle team name with whitespace', () => {
            render(
                <TeamFormModal
                    newTeamName="  Team Name  "
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByPlaceholderText('Enter team name')).toHaveValue('  Team Name  ');
        });

        it('should handle rapid input changes', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const input = screen.getByPlaceholderText('Enter team name');
            fireEvent.change(input, {target: {value: 'A'}});
            fireEvent.change(input, {target: {value: 'AB'}});
            fireEvent.change(input, {target: {value: 'ABC'}});
            expect(mockOnNameChange).toHaveBeenCalledTimes(3);
        });

        it('should handle form submission with empty team name', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const form = screen.getByText('Create Team').closest('form');
            fireEvent.submit(form);
            expect(mockOnSave).toHaveBeenCalled();
        });

        it('should render correctly with all empty props', () => {
            render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Add New Team')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter team name')).toBeInTheDocument();
        });
    });

    describe('Integration', () => {
        it('should maintain state consistency across multiple interactions', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            const input = screen.getByPlaceholderText('Enter team name');
            fireEvent.change(input, {target: {value: 'Test'}});
            rerender(
                <TeamFormModal
                    newTeamName="Test"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(input).toHaveValue('Test');
        });

        it('should allow typing, showing error, and submitting', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.change(screen.getByPlaceholderText('Enter team name'), {target: {value: 'New Team'}});
            rerender(
                <TeamFormModal
                    newTeamName="New Team"
                    error="Name already exists"
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            expect(screen.getByText('Name already exists')).toBeInTheDocument();
            fireEvent.click(screen.getByText('Create Team'));
            expect(mockOnSave).toHaveBeenCalled();
        });

        it('should handle complete user flow', () => {
            const {rerender} = render(
                <TeamFormModal
                    newTeamName=""
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.change(screen.getByPlaceholderText('Enter team name'), {target: {value: 'Team A'}});
            expect(mockOnNameChange).toHaveBeenCalled();
            rerender(
                <TeamFormModal
                    newTeamName="Team A"
                    error=""
                    onNameChange={mockOnNameChange}
                    onSave={mockOnSave}
                    onCancel={mockOnCancel}
                />
            );
            fireEvent.click(screen.getByText('Create Team'));
            expect(mockOnSave).toHaveBeenCalled();
        });
    });
});
