import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useTeamData} from '../hooks/useTeamData';
import {useFeedbackData} from '../hooks/useFeedbackData';
import {useAbsenceData} from '../hooks/useAbsenceData';
import {useEmployeeForm} from '../hooks/useEmployeeForm';
import {useEmployeeData, useNotification} from '../hooks/useNotification';
import {useTeamHandlers} from '../hooks/useTeamHandlers';
import {useFeedbackHandlers} from '../hooks/useFeedbackHandlers';
import {useAbsenceHandlers, useEmployeeHandlers} from '../hooks/useAbsenceHandlers';
import Header from './Header';
import Notification from './Notification';
import TabNavigation from './TabNavigation';
import ProfileTab from './ProfileTab';
import TeamManagementTab from './TeamManagementTab';
import EmployeeFormModal from './EmployeeFormModal';
import TeamFormModal from './TeamFormModal';
import MyTeamTab from './MyTeamTab';
import FeedbackModal from './FeedbackModal';
import AbsenceTab from './AbsenceTab';
import AbsenceModal from './AbsenceModal';
import '../styles/HRDashboard.css';

function HRDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const {auth, logout} = useAuth();

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
    });

    const {notification, showNotification} = useNotification();
    const {
        employees,
        currentUserEmployee,
        currentUserEmployeeId,
        fetchProfile,
        fetchEmployees
    } = useEmployeeData(auth, getAuthHeaders);

    const {
        teams,
        managers,
        teamMembers,
        fetchTeams,
        fetchManagers,
        fetchTeamMembers
    } = useTeamData(auth, getAuthHeaders);

    const {
        feedbackReceived,
        feedbackGiven,
        fetchFeedbackReceived,
        fetchFeedbackGiven
    } = useFeedbackData(getAuthHeaders);

    const {
        absenceRequests,
        teamAbsenceRequests,
        fetchMyAbsenceRequests,
        fetchTeamAbsenceRequests
    } = useAbsenceData(getAuthHeaders);

    const {
        formData,
        setFormData,
        emailError,
        duplicateEmailError,
        setDuplicateEmailError,
        error,
        setError,
        handleInputChange,
        resetForm
    } = useEmployeeForm();

    const {
        isEditing,
        isAdding,
        handleEdit,
        handleAdd,
        handleSave,
        handleDelete,
        handleCancel
    } = useEmployeeHandlers(
        auth,
        getAuthHeaders,
        showNotification,
        formData,
        setFormData,
        emailError,
        setError,
        setDuplicateEmailError,
        fetchEmployees,
        fetchTeams
    );

    const {
        isAddingTeam,
        setIsAddingTeam,
        newTeamName,
        setNewTeamName,
        error: teamError,
        handleSaveTeam
    } = useTeamHandlers(getAuthHeaders, showNotification, fetchTeams);

    const {
        showFeedbackModal,
        selectedTeamMember,
        feedbackText,
        setFeedbackText,
        feedbackError,
        aiSuggestion,
        loadingAISuggestion,
        handleGiveFeedback,
        handleGetAISuggestion,
        handleUseAISuggestion,
        handleSubmitFeedback,
        handleCancelFeedback
    } = useFeedbackHandlers(getAuthHeaders, showNotification, fetchFeedbackGiven);

    const {
        showAbsenceModal,
        absenceFormData,
        absenceError,
        handleRequestAbsence,
        handleAbsenceInputChange,
        handleSubmitAbsenceRequest,
        handleCancelAbsenceRequest,
        handleRespondToAbsence
    } = useAbsenceHandlers(getAuthHeaders, showNotification, fetchMyAbsenceRequests, fetchTeamAbsenceRequests);

    const isManager = auth?.user?.roles?.includes('ROLE_MANAGER');
    const canEdit = auth?.user?.roles?.includes('ROLE_HR') || auth?.user?.roles?.includes('ROLE_ADMIN');
    const canAdd = auth?.user?.roles?.includes('ROLE_HR') || auth?.user?.roles?.includes('ROLE_ADMIN') || isManager;
    const canDelete = auth?.user?.roles?.includes('ROLE_ADMIN') || isManager;
    const isAdmin = auth?.user?.roles?.includes('ROLE_ADMIN');
    const showTeamTab = canEdit || isManager || isAdmin;

    useEffect(() => {
        if (auth && showTeamTab) {
            fetchEmployees();
        }
    }, [auth, showTeamTab]);

    useEffect(() => {
        if (auth && canAdd) {
            fetchManagers();
        }
    }, [auth, canAdd]);


    useEffect(() => {
        if (auth && activeTab === 'myteam') {
            fetchTeamMembers();
            fetchFeedbackReceived();
            fetchFeedbackGiven();
        }
    }, [auth, activeTab]);

    useEffect(() => {
        if (auth && activeTab === 'absence') {
            fetchMyAbsenceRequests();
            if (isManager || isAdmin) {
                fetchTeamAbsenceRequests();
            }
        }
    }, [auth, activeTab, isManager, isAdmin]);

    const handleProfileUpdated = () => {
        fetchProfile();
        showNotification('Profile updated successfully!', 'success');
    };

    return (
        <>
            <Notification message={notification.message} type={notification.type}/>

            <div className="hr-dashboard">
                <Header
                    username={auth?.user?.username}
                    role={auth?.user?.roles?.[0]}
                    onLogout={logout}
                />

                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    showTeamTab={showTeamTab}
                />

                {activeTab === 'profile' && (
                    <ProfileTab
                        currentUserEmployee={currentUserEmployee}
                        teams={teams}
                        onEditProfile={handleProfileUpdated}
                        getAuthHeaders={getAuthHeaders}
                    />
                )}

                {activeTab === 'team' && showTeamTab && (
                    <TeamManagementTab
                        employees={employees}
                        teams={teams}
                        managers={managers}
                        canAdd={canAdd}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        currentUserEmployeeId={currentUserEmployeeId}
                        onAdd={() => handleAdd(canAdd)}
                        onEdit={(employee) => handleEdit(employee, currentUserEmployeeId)}
                        onDelete={(id) => handleDelete(id, canDelete)}
                        onAddTeam={() => setIsAddingTeam(true)}
                        getAuthHeaders={getAuthHeaders}
                    />
                )}

                {activeTab === 'myteam' && (
                    <MyTeamTab
                        teamMembers={teamMembers}
                        feedbackReceived={feedbackReceived}
                        feedbackGiven={feedbackGiven}
                        onGiveFeedback={handleGiveFeedback}
                        getAuthHeaders={getAuthHeaders}
                    />
                )}

                {activeTab === 'absence' && (
                    <AbsenceTab
                        absenceRequests={absenceRequests}
                        teamAbsenceRequests={teamAbsenceRequests}
                        isManager={isManager}
                        isAdmin={isAdmin}
                        onRequestAbsence={handleRequestAbsence}
                        onRespondToAbsence={handleRespondToAbsence}
                    />
                )}

                {(isEditing || isAdding) && (
                    <EmployeeFormModal
                        isEditing={isEditing}
                        formData={formData}
                        error={error}
                        emailError={emailError}
                        duplicateEmailError={duplicateEmailError}
                        teams={teams}
                        managers={managers}
                        isManager={isManager}
                        onInputChange={handleInputChange}
                        onSave={handleSave}
                        onCancel={() => handleCancel(resetForm)}
                    />
                )}

                {isAddingTeam && (
                    <TeamFormModal
                        newTeamName={newTeamName}
                        error={teamError}
                        onNameChange={(e) => setNewTeamName(e.target.value)}
                        onSave={handleSaveTeam}
                        onCancel={() => setIsAddingTeam(false)}
                    />
                )}

                {showFeedbackModal && (
                    <FeedbackModal
                        selectedTeamMember={selectedTeamMember}
                        feedbackText={feedbackText}
                        feedbackError={feedbackError}
                        aiSuggestion={aiSuggestion}
                        loadingAISuggestion={loadingAISuggestion}
                        onFeedbackTextChange={setFeedbackText}
                        onGetAISuggestion={handleGetAISuggestion}
                        onUseAISuggestion={handleUseAISuggestion}
                        onSubmit={handleSubmitFeedback}
                        onCancel={handleCancelFeedback}
                    />
                )}

                {showAbsenceModal && (
                    <AbsenceModal
                        absenceFormData={absenceFormData}
                        absenceError={absenceError}
                        onInputChange={handleAbsenceInputChange}
                        onSubmit={handleSubmitAbsenceRequest}
                        onCancel={handleCancelAbsenceRequest}
                    />
                )}
            </div>
        </>
    );
}

export default HRDashboard;
