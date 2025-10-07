import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import AbsenceTab from './AbsenceTab';

describe('AbsenceTab', () => {
    const mockOnRequestAbsence = jest.fn();
    const mockOnRespondToAbsence = jest.fn();

    const mockAbsenceRequests = [
        {
            id: 1,
            type: 'VACATION',
            startDate: '2025-10-15',
            endDate: '2025-10-20',
            reason: 'Family vacation',
            status: 'PENDING',
            requestedAt: '2025-10-01T10:00:00',
            respondedAt: null,
            managerComment: null
        },
        {
            id: 2,
            type: 'SICK_LEAVE',
            startDate: '2025-09-10',
            endDate: '2025-09-12',
            reason: 'Flu',
            status: 'APPROVED',
            requestedAt: '2025-09-08T08:00:00',
            respondedAt: '2025-09-09T09:00:00',
            managerComment: 'Get well soon!'
        },
        {
            id: 3,
            type: 'PERSONAL',
            startDate: '2025-08-05',
            endDate: '2025-08-05',
            reason: 'Personal matter',
            status: 'REJECTED',
            requestedAt: '2025-08-01T14:00:00',
            respondedAt: '2025-08-02T10:00:00',
            managerComment: 'Already too many people off that day'
        }
    ];

    const mockTeamAbsenceRequests = [
        {
            id: 4,
            employee: {firstName: 'John', lastName: 'Doe'},
            type: 'VACATION',
            startDate: '2025-11-01',
            endDate: '2025-11-05',
            reason: 'Holiday',
            status: 'PENDING',
            requestedAt: '2025-10-05T10:00:00',
            respondedAt: null,
            managerComment: null
        },
        {
            id: 5,
            employee: {firstName: 'Jane', lastName: 'Smith'},
            type: 'SICK_LEAVE',
            startDate: '2025-10-01',
            endDate: '2025-10-02',
            reason: 'Cold',
            status: 'APPROVED',
            requestedAt: '2025-09-30T08:00:00',
            respondedAt: '2025-09-30T10:00:00',
            managerComment: 'Approved'
        }
    ];

    const defaultProps = {
        absenceRequests: [],
        teamAbsenceRequests: [],
        isManager: false,
        isAdmin: false,
        onRequestAbsence: mockOnRequestAbsence,
        onRespondToAbsence: mockOnRespondToAbsence
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the component with title', () => {
            render(<AbsenceTab {...defaultProps} />);
            expect(screen.getByText('Absence Requests')).toBeInTheDocument();
        });

        it('should render request absence button', () => {
            render(<AbsenceTab {...defaultProps} />);
            expect(screen.getByRole('button', {name: /Request Absence/i})).toBeInTheDocument();
        });

        it('should render both filter dropdowns', () => {
            render(<AbsenceTab {...defaultProps} />);

            expect(screen.getByLabelText(/Filter by Status/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Filter by Type/i)).toBeInTheDocument();
        });

        it('should render My Requests section', () => {
            render(<AbsenceTab {...defaultProps} />);
            expect(screen.getByText('My Requests')).toBeInTheDocument();
        });

        it('should show empty state when no absence requests', () => {
            render(<AbsenceTab {...defaultProps} />);
            expect(screen.getByText('No absence requests yet.')).toBeInTheDocument();
        });

        it('should not render Team Requests section when user is not manager or admin', () => {
            render(<AbsenceTab {...defaultProps} />);
            expect(screen.queryByText('Team Requests')).not.toBeInTheDocument();
        });

        it('should render Team Requests section when user is manager', () => {
            render(<AbsenceTab {...defaultProps} isManager={true}/>);
            expect(screen.getByText(/Team Requests/i)).toBeInTheDocument();
        });

        it('should render Team Requests section when user is admin', () => {
            render(<AbsenceTab {...defaultProps} isAdmin={true}/>);
            expect(screen.getByText(/Team Requests/i)).toBeInTheDocument();
        });
    });

    describe('My Requests Display', () => {
        it('should display absence requests', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={mockAbsenceRequests}/>);

            const absenceCards = container.querySelectorAll('.absence-card');
            expect(absenceCards.length).toBe(3);

            const absenceTypes = container.querySelectorAll('.absence-type');
            const typeTexts = Array.from(absenceTypes).map(el => el.textContent);
            expect(typeTexts).toContain('Vacation');
            expect(typeTexts).toContain('Sick Leave');
            expect(typeTexts).toContain('Personal');
        });

        it('should display request status with correct styling', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={mockAbsenceRequests}/>);

            const statusElements = container.querySelectorAll('.absence-status');
            expect(statusElements.length).toBeGreaterThan(0);

            // Check for status colors
            const pendingStatus = Array.from(statusElements).find(el => el.textContent === 'PENDING');
            expect(pendingStatus).toHaveStyle({backgroundColor: '#ffc107'});

            const approvedStatus = Array.from(statusElements).find(el => el.textContent === 'APPROVED');
            expect(approvedStatus).toHaveStyle({backgroundColor: '#28a745'});

            const rejectedStatus = Array.from(statusElements).find(el => el.textContent === 'REJECTED');
            expect(rejectedStatus).toHaveStyle({backgroundColor: '#dc3545'});
        });

        it('should display request dates', () => {
            render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[0]]}/>);

            expect(screen.getAllByText('From:')[0]).toBeInTheDocument();
            expect(screen.getAllByText('To:')[0]).toBeInTheDocument();
        });

        it('should display reason when provided', () => {
            render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[0]]}/>);

            expect(screen.getByText('Family vacation')).toBeInTheDocument();
        });

        it('should display manager comment when provided', () => {
            render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[1]]}/>);

            expect(screen.getByText('Get well soon!')).toBeInTheDocument();
        });

        it('should display requested timestamp', () => {
            render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[0]]}/>);

            expect(screen.getByText(/Requested:/i)).toBeInTheDocument();
        });

        it('should display responded timestamp when available', () => {
            render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[1]]}/>);

            expect(screen.getByText(/Responded:/i)).toBeInTheDocument();
        });
    });

    describe('Team Requests Display', () => {
        it('should display team member names', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        it('should show pending badge with correct count', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            expect(screen.getByText('1 pending')).toBeInTheDocument();
        });

        it('should not show pending badge when no pending requests', () => {
            const approvedRequests = mockTeamAbsenceRequests.filter(r => r.status === 'APPROVED');
            const {container} = render(<AbsenceTab {...defaultProps} isManager={true}
                                                   teamAbsenceRequests={approvedRequests}/>);

            expect(container.querySelector('.pending-badge')).not.toBeInTheDocument();
        });

        it('should show approve and reject buttons for pending requests', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            expect(screen.getByRole('button', {name: /Approve/i})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /Reject/i})).toBeInTheDocument();
        });

        it('should not show approve/reject buttons for non-pending requests', () => {
            const approvedRequests = mockTeamAbsenceRequests.filter(r => r.status === 'APPROVED');
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={approvedRequests}/>);

            expect(screen.queryByRole('button', {name: /Approve/i})).not.toBeInTheDocument();
            expect(screen.queryByRole('button', {name: /Reject/i})).not.toBeInTheDocument();
        });

        it('should show empty state when no team requests', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={[]}/>);

            expect(screen.getByText('No team absence requests.')).toBeInTheDocument();
        });
    });

    describe('Filters', () => {
        it('should have all status filter options', () => {
            render(<AbsenceTab {...defaultProps} />);

            const statusSelect = screen.getByLabelText(/Filter by Status/i);
            expect(statusSelect).toContainHTML('<option value="ALL">All Statuses</option>');
            expect(statusSelect).toContainHTML('<option value="PENDING">Pending</option>');
            expect(statusSelect).toContainHTML('<option value="APPROVED">Approved</option>');
            expect(statusSelect).toContainHTML('<option value="REJECTED">Rejected</option>');
        });

        it('should have all type filter options', () => {
            render(<AbsenceTab {...defaultProps} />);

            const typeSelect = screen.getByLabelText(/Filter by Type/i);
            expect(typeSelect).toContainHTML('<option value="ALL">All Types</option>');
            expect(typeSelect).toContainHTML('<option value="VACATION">Vacation</option>');
            expect(typeSelect).toContainHTML('<option value="SICK_LEAVE">Sick Leave</option>');
            expect(typeSelect).toContainHTML('<option value="PERSONAL">Personal</option>');
            expect(typeSelect).toContainHTML('<option value="OTHER">Other</option>');
        });

        it('should filter requests by status', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={mockAbsenceRequests}/>);

            const statusSelect = screen.getByLabelText(/Filter by Status/i);
            fireEvent.change(statusSelect, {target: {value: 'APPROVED'}});

            const absenceCards = container.querySelectorAll('.absence-card');
            expect(absenceCards.length).toBe(1);

            const absenceType = container.querySelector('.absence-type');
            expect(absenceType.textContent).toBe('Sick Leave');
        });

        it('should filter requests by type', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={mockAbsenceRequests}/>);

            const typeSelect = screen.getByLabelText(/Filter by Type/i);
            fireEvent.change(typeSelect, {target: {value: 'VACATION'}});

            const absenceCards = container.querySelectorAll('.absence-card');
            expect(absenceCards.length).toBe(1);

            const absenceType = container.querySelector('.absence-type');
            expect(absenceType.textContent).toBe('Vacation');
        });

        it('should filter requests by both status and type', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={mockAbsenceRequests}/>);

            const statusSelect = screen.getByLabelText(/Filter by Status/i);
            const typeSelect = screen.getByLabelText(/Filter by Type/i);

            fireEvent.change(statusSelect, {target: {value: 'APPROVED'}});
            fireEvent.change(typeSelect, {target: {value: 'SICK_LEAVE'}});

            const absenceCards = container.querySelectorAll('.absence-card');
            expect(absenceCards.length).toBe(1);

            const absenceType = container.querySelector('.absence-type');
            expect(absenceType.textContent).toBe('Sick Leave');
        });

        it('should show all requests when filters are set to ALL', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={mockAbsenceRequests}/>);

            const statusSelect = screen.getByLabelText(/Filter by Status/i);
            const typeSelect = screen.getByLabelText(/Filter by Type/i);

            fireEvent.change(statusSelect, {target: {value: 'PENDING'}});
            fireEvent.change(typeSelect, {target: {value: 'VACATION'}});

            // Reset filters
            fireEvent.change(statusSelect, {target: {value: 'ALL'}});
            fireEvent.change(typeSelect, {target: {value: 'ALL'}});

            const absenceCards = container.querySelectorAll('.absence-card');
            expect(absenceCards.length).toBe(3);
        });

        it('should apply filters to team requests as well', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            const statusSelect = screen.getByLabelText(/Filter by Status/i);
            fireEvent.change(statusSelect, {target: {value: 'PENDING'}});

            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should call onRequestAbsence when request button is clicked', () => {
            render(<AbsenceTab {...defaultProps} />);

            const requestButton = screen.getByRole('button', {name: /Request Absence/i});
            fireEvent.click(requestButton);

            expect(mockOnRequestAbsence).toHaveBeenCalledTimes(1);
        });

        it('should call onRespondToAbsence with APPROVED when approve button is clicked', () => {
            // Mock window.prompt
            global.prompt = jest.fn(() => 'Looks good');

            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            const approveButton = screen.getByRole('button', {name: /Approve/i});
            fireEvent.click(approveButton);

            expect(global.prompt).toHaveBeenCalledWith('Optional comment:');
            expect(mockOnRespondToAbsence).toHaveBeenCalledWith(4, 'APPROVED', 'Looks good');
        });

        it('should call onRespondToAbsence with REJECTED when reject button is clicked', () => {
            // Mock window.prompt
            global.prompt = jest.fn(() => 'Not enough coverage');

            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            const rejectButton = screen.getByRole('button', {name: /Reject/i});
            fireEvent.click(rejectButton);

            expect(global.prompt).toHaveBeenCalledWith('Rejection reason (optional):');
            expect(mockOnRespondToAbsence).toHaveBeenCalledWith(4, 'REJECTED', 'Not enough coverage');
        });

        it('should handle empty comment when approving', () => {
            global.prompt = jest.fn(() => null);

            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            const approveButton = screen.getByRole('button', {name: /Approve/i});
            fireEvent.click(approveButton);

            expect(mockOnRespondToAbsence).toHaveBeenCalledWith(4, 'APPROVED', '');
        });

        it('should handle empty comment when rejecting', () => {
            global.prompt = jest.fn(() => null);

            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            const rejectButton = screen.getByRole('button', {name: /Reject/i});
            fireEvent.click(rejectButton);

            expect(mockOnRespondToAbsence).toHaveBeenCalledWith(4, 'REJECTED', '');
        });
    });

    describe('Helper Functions', () => {
        it('should format SICK_LEAVE type correctly', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[1]]}/>);

            const absenceType = container.querySelector('.absence-type');
            expect(absenceType.textContent).toBe('Sick Leave');
        });

        it('should format VACATION type correctly', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[0]]}/>);

            const absenceType = container.querySelector('.absence-type');
            expect(absenceType.textContent).toBe('Vacation');
        });

        it('should format PERSONAL type correctly', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[2]]}/>);

            const absenceType = container.querySelector('.absence-type');
            expect(absenceType.textContent).toBe('Personal');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null teamAbsenceRequests gracefully', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={null}/>);

            expect(screen.getByText('No team absence requests.')).toBeInTheDocument();
        });

        it('should handle undefined teamAbsenceRequests gracefully', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={undefined}/>);

            expect(screen.getByText('No team absence requests.')).toBeInTheDocument();
        });

        it('should handle request without reason', () => {
            const requestWithoutReason = {
                ...mockAbsenceRequests[0],
                reason: null
            };

            render(<AbsenceTab {...defaultProps} absenceRequests={[requestWithoutReason]}/>);

            expect(screen.queryByText(/Reason:/i)).not.toBeInTheDocument();
        });

        it('should handle request without manager comment', () => {
            const requestWithoutComment = {
                ...mockAbsenceRequests[0],
                managerComment: null
            };

            render(<AbsenceTab {...defaultProps} absenceRequests={[requestWithoutComment]}/>);

            expect(screen.queryByText(/Manager Comment:/i)).not.toBeInTheDocument();
        });

        it('should handle request without respondedAt', () => {
            const requestWithoutResponse = {
                ...mockAbsenceRequests[0],
                respondedAt: null
            };

            render(<AbsenceTab {...defaultProps} absenceRequests={[requestWithoutResponse]}/>);

            expect(screen.queryByText(/Responded:/i)).not.toBeInTheDocument();
        });
    });

    describe('CSS Classes', () => {
        it('should apply correct CSS classes to main container', () => {
            const {container} = render(<AbsenceTab {...defaultProps} />);

            expect(container.querySelector('.absence-management')).toBeInTheDocument();
        });

        it('should apply correct CSS classes to absence cards', () => {
            const {container} = render(<AbsenceTab {...defaultProps} absenceRequests={[mockAbsenceRequests[0]]}/>);

            expect(container.querySelector('.absence-card')).toBeInTheDocument();
        });

        it('should apply correct CSS class to request absence button', () => {
            render(<AbsenceTab {...defaultProps} />);

            const button = screen.getByRole('button', {name: /Request Absence/i});
            expect(button).toHaveClass('btn-request-absence');
        });

        it('should apply correct CSS classes to action buttons', () => {
            render(<AbsenceTab {...defaultProps} isManager={true} teamAbsenceRequests={mockTeamAbsenceRequests}/>);

            const approveButton = screen.getByRole('button', {name: /Approve/i});
            const rejectButton = screen.getByRole('button', {name: /Reject/i});

            expect(approveButton).toHaveClass('btn-approve-absence');
            expect(rejectButton).toHaveClass('btn-reject-absence');
        });
    });
});

