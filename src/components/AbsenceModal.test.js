import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AbsenceModal from './AbsenceModal';

describe('AbsenceModal', () => {
    const mockOnInputChange = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    const defaultProps = {
        absenceFormData: {
            type: '',
            startDate: '',
            endDate: '',
            reason: ''
        },
        absenceError: null,
        onInputChange: mockOnInputChange,
        onSubmit: mockOnSubmit,
        onCancel: mockOnCancel
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the modal with title', () => {
            render(<AbsenceModal {...defaultProps} />);
            expect(screen.getByText('Request Absence')).toBeInTheDocument();
        });

        it('should render all form fields', () => {
            render(<AbsenceModal {...defaultProps} />);

            expect(screen.getByLabelText(/Type of Absence/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Reason \(Optional\)/i)).toBeInTheDocument();
        });

        it('should render all absence type options', () => {
            render(<AbsenceModal {...defaultProps} />);

            const typeSelect = screen.getByLabelText(/Type of Absence/i);
            expect(typeSelect).toContainHTML('<option value="">Select type...</option>');
            expect(typeSelect).toContainHTML('<option value="VACATION">Vacation</option>');
            expect(typeSelect).toContainHTML('<option value="SICK_LEAVE">Sick Leave</option>');
            expect(typeSelect).toContainHTML('<option value="PERSONAL">Personal</option>');
            expect(typeSelect).toContainHTML('<option value="OTHER">Other</option>');
        });

        it('should render submit and cancel buttons', () => {
            render(<AbsenceModal {...defaultProps} />);

            expect(screen.getByRole('button', { name: /Submit Request/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        });

        it('should display error message when absenceError is provided', () => {
            const errorMessage = 'You have exceeded your vacation days';
            render(<AbsenceModal {...defaultProps} absenceError={errorMessage} />);

            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toHaveClass('alert-error');
        });

        it('should not display error message when absenceError is null', () => {
            render(<AbsenceModal {...defaultProps} />);

            const alerts = screen.queryByRole('alert');
            expect(alerts).not.toBeInTheDocument();
        });
    });

    describe('Form Data Display', () => {
        it('should display pre-filled form data', () => {
            const filledProps = {
                ...defaultProps,
                absenceFormData: {
                    type: 'VACATION',
                    startDate: '2025-10-15',
                    endDate: '2025-10-20',
                    reason: 'Family vacation'
                }
            };

            render(<AbsenceModal {...filledProps} />);

            expect(screen.getByLabelText(/Type of Absence/i)).toHaveValue('VACATION');
            expect(screen.getByLabelText(/Start Date/i)).toHaveValue('2025-10-15');
            expect(screen.getByLabelText(/End Date/i)).toHaveValue('2025-10-20');
            expect(screen.getByLabelText(/Reason \(Optional\)/i)).toHaveValue('Family vacation');
        });
    });

    describe('User Interactions', () => {
        it('should call onInputChange when type is changed', () => {
            render(<AbsenceModal {...defaultProps} />);

            const typeSelect = screen.getByLabelText(/Type of Absence/i);
            fireEvent.change(typeSelect, { target: { name: 'type', value: 'VACATION' } });

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when start date is changed', () => {
            render(<AbsenceModal {...defaultProps} />);

            const startDateInput = screen.getByLabelText(/Start Date/i);
            fireEvent.change(startDateInput, { target: { name: 'startDate', value: '2025-10-15' } });

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when end date is changed', () => {
            render(<AbsenceModal {...defaultProps} />);

            const endDateInput = screen.getByLabelText(/End Date/i);
            fireEvent.change(endDateInput, { target: { name: 'endDate', value: '2025-10-20' } });

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onInputChange when reason is changed', () => {
            render(<AbsenceModal {...defaultProps} />);

            const reasonTextarea = screen.getByLabelText(/Reason \(Optional\)/i);
            fireEvent.change(reasonTextarea, { target: { name: 'reason', value: 'Family vacation' } });

            expect(mockOnInputChange).toHaveBeenCalledTimes(1);
        });

        it('should call onCancel when cancel button is clicked', () => {
            render(<AbsenceModal {...defaultProps} />);

            const cancelButton = screen.getByRole('button', { name: /Cancel/i });
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });

        it('should call onSubmit when form is submitted', () => {
            render(<AbsenceModal {...defaultProps} />);

            const submitButton = screen.getByRole('button', { name: /Submit Request/i });
            fireEvent.click(submitButton);

            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        it('should prevent default form submission', () => {
            render(<AbsenceModal {...defaultProps} />);

            const form = screen.getByRole('button', { name: /Submit Request/i }).closest('form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

            form.dispatchEvent(submitEvent);

            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('Form Validation', () => {
        it('should have required attribute on type select', () => {
            render(<AbsenceModal {...defaultProps} />);

            const typeSelect = screen.getByLabelText(/Type of Absence/i);
            expect(typeSelect).toBeRequired();
        });

        it('should have required attribute on start date input', () => {
            render(<AbsenceModal {...defaultProps} />);

            const startDateInput = screen.getByLabelText(/Start Date/i);
            expect(startDateInput).toBeRequired();
        });

        it('should have required attribute on end date input', () => {
            render(<AbsenceModal {...defaultProps} />);

            const endDateInput = screen.getByLabelText(/End Date/i);
            expect(endDateInput).toBeRequired();
        });

        it('should not have required attribute on reason textarea', () => {
            render(<AbsenceModal {...defaultProps} />);

            const reasonTextarea = screen.getByLabelText(/Reason \(Optional\)/i);
            expect(reasonTextarea).not.toBeRequired();
        });
    });

    describe('Accessibility', () => {
        it('should have proper label associations', () => {
            render(<AbsenceModal {...defaultProps} />);

            const typeSelect = screen.getByLabelText(/Type of Absence/i);
            const startDateInput = screen.getByLabelText(/Start Date/i);
            const endDateInput = screen.getByLabelText(/End Date/i);
            const reasonTextarea = screen.getByLabelText(/Reason \(Optional\)/i);

            expect(typeSelect).toHaveAttribute('name', 'type');
            expect(startDateInput).toHaveAttribute('name', 'startDate');
            expect(endDateInput).toHaveAttribute('name', 'endDate');
            expect(reasonTextarea).toHaveAttribute('name', 'reason');
        });

        it('should have appropriate input types', () => {
            render(<AbsenceModal {...defaultProps} />);

            expect(screen.getByLabelText(/Start Date/i)).toHaveAttribute('type', 'date');
            expect(screen.getByLabelText(/End Date/i)).toHaveAttribute('type', 'date');
        });
    });

    describe('CSS Classes', () => {
        it('should apply correct CSS classes to modal elements', () => {
            const { container } = render(<AbsenceModal {...defaultProps} />);

            expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
            expect(container.querySelector('.modal.absence-modal')).toBeInTheDocument();
        });

        it('should apply correct CSS classes to buttons', () => {
            render(<AbsenceModal {...defaultProps} />);

            const submitButton = screen.getByRole('button', { name: /Submit Request/i });
            const cancelButton = screen.getByRole('button', { name: /Cancel/i });

            expect(submitButton).toHaveClass('btn-save');
            expect(cancelButton).toHaveClass('btn-cancel');
        });

        it('should apply error alert class when error is present', () => {
            const { container } = render(<AbsenceModal {...defaultProps} absenceError="Error message" />);

            const errorDiv = container.querySelector('.alert.alert-error');
            expect(errorDiv).toBeInTheDocument();
        });
    });
});

