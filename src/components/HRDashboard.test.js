import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import HRDashboard from './HRDashboard';
import {useAuth} from '../context/AuthContext';
import {useTeamData} from '../hooks/useTeamData';
import {useFeedbackData} from '../hooks/useFeedbackData';
import {useAbsenceData} from '../hooks/useAbsenceData';
import {useEmployeeForm} from '../hooks/useEmployeeForm';
import {useEmployeeData, useNotification} from '../hooks/useNotification';
import {useTeamHandlers} from '../hooks/useTeamHandlers';
import {useFeedbackHandlers} from '../hooks/useFeedbackHandlers';
import {useAbsenceHandlers, useEmployeeHandlers} from '../hooks/useAbsenceHandlers';

jest.mock('./Header', () => {
    return function MockHeader({username, role, onLogout}) {
        return (
            <div data-testid="header">
                <span>{username}</span>
                <span>{role}</span>
                <button onClick={onLogout}>Logout</button>
            </div>
        );
    };
});

jest.mock('./Notification', () => {
    return function MockNotification({message, type}) {
        return message ? <div data-testid="notification" className={type}>{message}</div> : null;
    };
});

jest.mock('./TabNavigation', () => {
    return function MockTabNavigation({activeTab, onTabChange, showTeamTab}) {
        return (
            <div data-testid="tab-navigation">
                <button onClick={() => onTabChange('profile')}>Profile</button>
                <button onClick={() => onTabChange('team')}>Team</button>
                <button onClick={() => onTabChange('myteam')}>My Team</button>
                <button onClick={() => onTabChange('absence')}>Absence</button>
                <span data-testid="show-team-tab">{showTeamTab ? 'true' : 'false'}</span>
            </div>
        );
    };
});

jest.mock('./ProfileTab', () => {
    return function MockProfileTab({onEditProfile}) {
        return (
            <div data-testid="profile-tab">
                <button onClick={onEditProfile}>Edit Profile</button>
            </div>
        );
    };
});

jest.mock('./TeamManagementTab', () => {
    return function MockTeamManagementTab({onAdd, onEdit, onDelete, onAddTeam}) {
        return (
            <div data-testid="team-management-tab">
                <button onClick={onAdd}>Add Employee</button>
                <button onClick={() => onEdit({id: 1})}>Edit Employee</button>
                <button onClick={() => onDelete(1)}>Delete Employee</button>
                <button onClick={onAddTeam}>Add Team</button>
            </div>
        );
    };
});

jest.mock('./MyTeamTab', () => {
    return function MockMyTeamTab({onGiveFeedback}) {
        return (
            <div data-testid="myteam-tab">
                <button onClick={() => onGiveFeedback({id: 1})}>Give Feedback</button>
            </div>
        );
    };
});

jest.mock('./AbsenceTab', () => {
    return function MockAbsenceTab({onRequestAbsence, onRespondToAbsence}) {
        return (
            <div data-testid="absence-tab">
                <button onClick={onRequestAbsence}>Request Absence</button>
                <button onClick={() => onRespondToAbsence(1, 'APPROVED', '')}>Respond</button>
            </div>
        );
    };
});

jest.mock('./EmployeeFormModal', () => {
    return function MockEmployeeFormModal({isEditing, onSave, onCancel}) {
        return (
            <div data-testid="employee-form-modal">
                <span>{isEditing ? 'Editing' : 'Adding'}</span>
                <button onClick={onSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        );
    };
});

jest.mock('./TeamFormModal', () => {
    return function MockTeamFormModal({onSave, onCancel}) {
        return (
            <div data-testid="team-form-modal">
                <button onClick={onSave}>Save Team</button>
                <button onClick={onCancel}>Cancel Team</button>
            </div>
        );
    };
});

jest.mock('./FeedbackModal', () => {
    return function MockFeedbackModal({onSubmit, onCancel}) {
        return (
            <div data-testid="feedback-modal">
                <button onClick={onSubmit}>Submit Feedback</button>
                <button onClick={onCancel}>Cancel Feedback</button>
            </div>
        );
    };
});

jest.mock('./AbsenceModal', () => {
    return function MockAbsenceModal({onSubmit, onCancel}) {
        return (
            <div data-testid="absence-modal">
                <button onClick={onSubmit}>Submit Absence</button>
                <button onClick={onCancel}>Cancel Absence</button>
            </div>
        );
    };
});

// Mock all hooks
jest.mock('../context/AuthContext');
jest.mock('../hooks/useTeamData');
jest.mock('../hooks/useFeedbackData');
jest.mock('../hooks/useAbsenceData');
jest.mock('../hooks/useEmployeeForm');
jest.mock('../hooks/useNotification');
jest.mock('../hooks/useTeamHandlers');
jest.mock('../hooks/useFeedbackHandlers');
jest.mock('../hooks/useAbsenceHandlers');

describe('HRDashboard', () => {
    const mockLogout = jest.fn();
    const mockShowNotification = jest.fn();
    const mockFetchProfile = jest.fn();
    const mockFetchEmployees = jest.fn();
    const mockFetchTeams = jest.fn();
    const mockFetchManagers = jest.fn();
    const mockFetchTeamMembers = jest.fn();
    const mockFetchFeedbackReceived = jest.fn();
    const mockFetchFeedbackGiven = jest.fn();
    const mockFetchMyAbsenceRequests = jest.fn();
    const mockFetchTeamAbsenceRequests = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockResetForm = jest.fn();
    const mockHandleEdit = jest.fn();
    const mockHandleAdd = jest.fn();
    const mockHandleSave = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleCancel = jest.fn();
    const mockHandleSaveTeam = jest.fn();
    const mockHandleGiveFeedback = jest.fn();
    const mockHandleSubmitFeedback = jest.fn();
    const mockHandleCancelFeedback = jest.fn();
    const mockHandleRequestAbsence = jest.fn();
    const mockHandleSubmitAbsenceRequest = jest.fn();
    const mockHandleCancelAbsenceRequest = jest.fn();
    const mockHandleRespondToAbsence = jest.fn();

    const defaultAuth = {
        user: {
            username: 'admin@example.com',
            roles: ['ROLE_ADMIN']
        },
        token: 'test-token'
    };

    const setupMocks = (authOverrides = {}, hookOverrides = {}) => {
        useAuth.mockReturnValue({
            auth: {...defaultAuth, ...authOverrides},
            logout: mockLogout
        });

        useNotification.mockReturnValue({
            notification: {message: '', type: ''},
            showNotification: mockShowNotification
        });

        useEmployeeData.mockReturnValue({
            employees: [],
            currentUserEmployee: null,
            currentUserEmployeeId: null,
            fetchProfile: mockFetchProfile,
            fetchEmployees: mockFetchEmployees,
            ...hookOverrides.employeeData
        });

        useTeamData.mockReturnValue({
            teams: [],
            managers: [],
            teamMembers: [],
            fetchTeams: mockFetchTeams,
            fetchManagers: mockFetchManagers,
            fetchTeamMembers: mockFetchTeamMembers,
            ...hookOverrides.teamData
        });

        useFeedbackData.mockReturnValue({
            feedbackReceived: [],
            feedbackGiven: [],
            fetchFeedbackReceived: mockFetchFeedbackReceived,
            fetchFeedbackGiven: mockFetchFeedbackGiven,
            ...hookOverrides.feedbackData
        });

        useAbsenceData.mockReturnValue({
            absenceRequests: [],
            teamAbsenceRequests: [],
            fetchMyAbsenceRequests: mockFetchMyAbsenceRequests,
            fetchTeamAbsenceRequests: mockFetchTeamAbsenceRequests,
            ...hookOverrides.absenceData
        });

        useEmployeeForm.mockReturnValue({
            formData: {},
            setFormData: jest.fn(),
            emailError: null,
            duplicateEmailError: false,
            setDuplicateEmailError: jest.fn(),
            error: null,
            setError: jest.fn(),
            handleInputChange: mockHandleInputChange,
            resetForm: mockResetForm,
            ...hookOverrides.employeeForm
        });

        useEmployeeHandlers.mockReturnValue({
            isEditing: false,
            isAdding: false,
            handleEdit: mockHandleEdit,
            handleAdd: mockHandleAdd,
            handleSave: mockHandleSave,
            handleDelete: mockHandleDelete,
            handleCancel: mockHandleCancel,
            ...hookOverrides.employeeHandlers
        });

        useTeamHandlers.mockReturnValue({
            isAddingTeam: false,
            setIsAddingTeam: jest.fn(),
            newTeamName: '',
            setNewTeamName: jest.fn(),
            error: null,
            handleSaveTeam: mockHandleSaveTeam,
            ...hookOverrides.teamHandlers
        });

        useFeedbackHandlers.mockReturnValue({
            showFeedbackModal: false,
            selectedTeamMember: null,
            feedbackText: '',
            setFeedbackText: jest.fn(),
            feedbackError: null,
            aiSuggestion: null,
            loadingAISuggestion: false,
            handleGiveFeedback: mockHandleGiveFeedback,
            handleGetAISuggestion: jest.fn(),
            handleUseAISuggestion: jest.fn(),
            handleSubmitFeedback: mockHandleSubmitFeedback,
            handleCancelFeedback: mockHandleCancelFeedback,
            ...hookOverrides.feedbackHandlers
        });

        useAbsenceHandlers.mockReturnValue({
            showAbsenceModal: false,
            absenceFormData: {},
            absenceError: null,
            handleRequestAbsence: mockHandleRequestAbsence,
            handleAbsenceInputChange: jest.fn(),
            handleSubmitAbsenceRequest: mockHandleSubmitAbsenceRequest,
            handleCancelAbsenceRequest: mockHandleCancelAbsenceRequest,
            handleRespondToAbsence: mockHandleRespondToAbsence,
            ...hookOverrides.absenceHandlers
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        setupMocks();
    });

    describe('Rendering', () => {
        it('should render the dashboard with header', () => {
            render(<HRDashboard/>);
            expect(screen.getByTestId('header')).toBeInTheDocument();
        });

        it('should render tab navigation', () => {
            render(<HRDashboard/>);
            expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
        });

        it('should render profile tab by default', () => {
            render(<HRDashboard/>);
            expect(screen.getByTestId('profile-tab')).toBeInTheDocument();
        });

        it('should pass username and role to header', () => {
            render(<HRDashboard/>);
            expect(screen.getByText('admin@example.com')).toBeInTheDocument();
            expect(screen.getByText('ROLE_ADMIN')).toBeInTheDocument();
        });
    });

    describe('Tab Navigation', () => {
        it('should switch to team tab when clicked', () => {
            render(<HRDashboard/>);

            const teamButton = screen.getByText('Team');
            fireEvent.click(teamButton);

            expect(screen.getByTestId('team-management-tab')).toBeInTheDocument();
        });

        it('should switch to myteam tab when clicked', () => {
            render(<HRDashboard/>);

            const myTeamButton = screen.getByText('My Team');
            fireEvent.click(myTeamButton);

            expect(screen.getByTestId('myteam-tab')).toBeInTheDocument();
        });

        it('should switch to absence tab when clicked', () => {
            render(<HRDashboard/>);

            const absenceButton = screen.getByText('Absence');
            fireEvent.click(absenceButton);

            expect(screen.getByTestId('absence-tab')).toBeInTheDocument();
        });

        it('should switch back to profile tab', () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Team'));
            fireEvent.click(screen.getByText('Profile'));

            expect(screen.getByTestId('profile-tab')).toBeInTheDocument();
        });
    });

    describe('Role-based Access', () => {
        it('should show team tab for admin users', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('show-team-tab')).toHaveTextContent('true');
        });

        it('should show team tab for HR users', () => {
            setupMocks({user: {roles: ['ROLE_HR']}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('show-team-tab')).toHaveTextContent('true');
        });

        it('should show team tab for manager users', () => {
            setupMocks({user: {roles: ['ROLE_MANAGER']}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('show-team-tab')).toHaveTextContent('true');
        });

        it('should not show team tab for regular users', () => {
            setupMocks({user: {roles: ['ROLE_USER']}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('show-team-tab')).toHaveTextContent('false');
        });

        it('should not render team management tab for regular users', () => {
            setupMocks({user: {roles: ['ROLE_USER']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Team'));
            expect(screen.queryByTestId('team-management-tab')).not.toBeInTheDocument();
        });
    });

    describe('Data Fetching on Mount', () => {
        it('should fetch employees on mount for admin users', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            render(<HRDashboard/>);

            expect(mockFetchEmployees).toHaveBeenCalled();
        });

        it('should fetch managers on mount for admin users', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            render(<HRDashboard/>);

            expect(mockFetchManagers).toHaveBeenCalled();
        });

        it('should not fetch employees for regular users', () => {
            setupMocks({user: {roles: ['ROLE_USER']}});
            render(<HRDashboard/>);

            expect(mockFetchEmployees).not.toHaveBeenCalled();
        });
    });

    describe('Data Fetching on Tab Change', () => {
        it('should fetch team data when switching to myteam tab', async () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('My Team'));

            await waitFor(() => {
                expect(mockFetchTeamMembers).toHaveBeenCalled();
                expect(mockFetchFeedbackReceived).toHaveBeenCalled();
                expect(mockFetchFeedbackGiven).toHaveBeenCalled();
            });
        });

        it('should fetch absence data when switching to absence tab', async () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Absence'));

            await waitFor(() => {
                expect(mockFetchMyAbsenceRequests).toHaveBeenCalled();
            });
        });

        it('should fetch team absence requests for managers', async () => {
            setupMocks({user: {roles: ['ROLE_MANAGER']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Absence'));

            await waitFor(() => {
                expect(mockFetchTeamAbsenceRequests).toHaveBeenCalled();
            });
        });

        it('should not fetch team absence requests for regular users', async () => {
            setupMocks({user: {roles: ['ROLE_USER']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Absence'));

            await waitFor(() => {
                expect(mockFetchMyAbsenceRequests).toHaveBeenCalled();
                expect(mockFetchTeamAbsenceRequests).not.toHaveBeenCalled();
            });
        });
    });

    describe('Employee Management', () => {
        it('should show employee form modal when adding', () => {
            setupMocks({}, {employeeHandlers: {isAdding: true}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('employee-form-modal')).toBeInTheDocument();
            expect(screen.getByText('Adding')).toBeInTheDocument();
        });

        it('should show employee form modal when editing', () => {
            setupMocks({}, {employeeHandlers: {isEditing: true}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('employee-form-modal')).toBeInTheDocument();
            expect(screen.getByText('Editing')).toBeInTheDocument();
        });

        it('should handle add employee action', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Team'));
            fireEvent.click(screen.getByText('Add Employee'));

            expect(mockHandleAdd).toHaveBeenCalled();
        });

        it('should handle edit employee action', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Team'));
            fireEvent.click(screen.getByText('Edit Employee'));

            expect(mockHandleEdit).toHaveBeenCalled();
        });

        it('should handle delete employee action', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Team'));
            fireEvent.click(screen.getByText('Delete Employee'));

            expect(mockHandleDelete).toHaveBeenCalled();
        });

        it('should handle cancel employee form', () => {
            setupMocks({}, {employeeHandlers: {isAdding: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Cancel'));

            expect(mockHandleCancel).toHaveBeenCalledWith(mockResetForm);
        });

        it('should handle save employee', () => {
            setupMocks({}, {employeeHandlers: {isAdding: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Save'));

            expect(mockHandleSave).toHaveBeenCalled();
        });
    });

    describe('Team Management', () => {
        it('should show team form modal when adding team', () => {
            setupMocks({}, {teamHandlers: {isAddingTeam: true}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('team-form-modal')).toBeInTheDocument();
        });

        it('should handle add team action', () => {
            setupMocks({user: {roles: ['ROLE_ADMIN']}});
            const mockSetIsAddingTeam = jest.fn();
            setupMocks({}, {teamHandlers: {setIsAddingTeam: mockSetIsAddingTeam}});

            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Team'));
            fireEvent.click(screen.getByText('Add Team'));

            expect(mockSetIsAddingTeam).toHaveBeenCalledWith(true);
        });

        it('should handle save team', () => {
            setupMocks({}, {teamHandlers: {isAddingTeam: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Save Team'));

            expect(mockHandleSaveTeam).toHaveBeenCalled();
        });

        it('should handle cancel team form', () => {
            const mockSetIsAddingTeam = jest.fn();
            setupMocks({}, {teamHandlers: {isAddingTeam: true, setIsAddingTeam: mockSetIsAddingTeam}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Cancel Team'));

            expect(mockSetIsAddingTeam).toHaveBeenCalledWith(false);
        });
    });

    describe('Feedback Management', () => {
        it('should show feedback modal when giving feedback', () => {
            setupMocks({}, {feedbackHandlers: {showFeedbackModal: true}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
        });

        it('should handle give feedback action', () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('My Team'));
            fireEvent.click(screen.getByText('Give Feedback'));

            expect(mockHandleGiveFeedback).toHaveBeenCalled();
        });

        it('should handle submit feedback', () => {
            setupMocks({}, {feedbackHandlers: {showFeedbackModal: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Submit Feedback'));

            expect(mockHandleSubmitFeedback).toHaveBeenCalled();
        });

        it('should handle cancel feedback', () => {
            setupMocks({}, {feedbackHandlers: {showFeedbackModal: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Cancel Feedback'));

            expect(mockHandleCancelFeedback).toHaveBeenCalled();
        });
    });

    describe('Absence Management', () => {
        it('should show absence modal when requesting absence', () => {
            setupMocks({}, {absenceHandlers: {showAbsenceModal: true}});
            render(<HRDashboard/>);

            expect(screen.getByTestId('absence-modal')).toBeInTheDocument();
        });

        it('should handle request absence action', () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Absence'));
            fireEvent.click(screen.getByText('Request Absence'));

            expect(mockHandleRequestAbsence).toHaveBeenCalled();
        });

        it('should handle submit absence request', () => {
            setupMocks({}, {absenceHandlers: {showAbsenceModal: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Submit Absence'));

            expect(mockHandleSubmitAbsenceRequest).toHaveBeenCalled();
        });

        it('should handle cancel absence request', () => {
            setupMocks({}, {absenceHandlers: {showAbsenceModal: true}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Cancel Absence'));

            expect(mockHandleCancelAbsenceRequest).toHaveBeenCalled();
        });

        it('should handle respond to absence', () => {
            setupMocks({user: {roles: ['ROLE_MANAGER']}});
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Absence'));
            fireEvent.click(screen.getByText('Respond'));

            expect(mockHandleRespondToAbsence).toHaveBeenCalled();
        });
    });

    describe('Profile Management', () => {
        it('should handle profile update', () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Edit Profile'));

            expect(mockFetchProfile).toHaveBeenCalled();
            expect(mockShowNotification).toHaveBeenCalledWith('Profile updated successfully!', 'success');
        });
    });

    describe('Logout', () => {
        it('should call logout when logout button is clicked', () => {
            render(<HRDashboard/>);

            fireEvent.click(screen.getByText('Logout'));

            expect(mockLogout).toHaveBeenCalled();
        });
    });

    describe('Notification Display', () => {
        it('should display notification when message exists', () => {
            useNotification.mockReturnValue({
                notification: {message: 'Test notification', type: 'success'},
                showNotification: mockShowNotification
            });

            render(<HRDashboard/>);

            expect(screen.getByTestId('notification')).toBeInTheDocument();
            expect(screen.getByText('Test notification')).toBeInTheDocument();
        });

        it('should not display notification when message is empty', () => {
            render(<HRDashboard/>);

            expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null auth gracefully', () => {
            useAuth.mockReturnValue({
                auth: null,
                logout: mockLogout
            });

            render(<HRDashboard/>);

            expect(screen.getByTestId('header')).toBeInTheDocument();
        });

        it('should handle missing user roles', () => {
            setupMocks({user: {username: 'test@example.com', roles: undefined}});

            render(<HRDashboard/>);

            expect(screen.getByTestId('show-team-tab')).toHaveTextContent('false');
        });

        it('should handle empty roles array', () => {
            setupMocks({user: {username: 'test@example.com', roles: []}});

            render(<HRDashboard/>);

            expect(screen.getByTestId('show-team-tab')).toHaveTextContent('false');
        });
    });

    describe('CSS Classes', () => {
        it('should apply hr-dashboard class to main container', () => {
            const {container} = render(<HRDashboard/>);

            expect(container.querySelector('.hr-dashboard')).toBeInTheDocument();
        });
    });
});

