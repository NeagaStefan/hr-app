import {useState} from 'react';

export const useFeedbackHandlers = (getAuthHeaders, showNotification, fetchFeedbackGiven) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [loadingAISuggestion, setLoadingAISuggestion] = useState(false);

    const FEEDBACK_API_URL = 'http://localhost:8080/api/feedback';

    const handleGiveFeedback = (teamMember) => {
        setSelectedTeamMember(teamMember);
        setShowFeedbackModal(true);
        setFeedbackText('');
        setFeedbackError('');
    };

    const handleGetAISuggestion = async () => {
        setLoadingAISuggestion(true);
        try {
            const context = feedbackText || 'general performance';
            const response = await fetch(
                `${FEEDBACK_API_URL}/suggest?employeeName=${selectedTeamMember.firstName} ${selectedTeamMember.lastName}&context=${encodeURIComponent(context)}`,
                {headers: getAuthHeaders()}
            );
            if (response.ok) {
                const data = await response.json();
                setAiSuggestion(data.suggestion);
            }
        } catch (error) {
            console.error('Error getting AI suggestion:', error);
        } finally {
            setLoadingAISuggestion(false);
        }
    };

    const handleUseAISuggestion = () => {
        setFeedbackText(aiSuggestion);
        setAiSuggestion('');
    };

    const handleSubmitFeedback = async () => {
        setFeedbackError('');

        if (!feedbackText || feedbackText.trim().length < 10) {
            setFeedbackError('Feedback must be at least 10 characters long');
            return;
        }

        try {
            const response = await fetch(FEEDBACK_API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    toEmployeeId: selectedTeamMember.id,
                    feedbackText: feedbackText
                })
            });

            if (response.ok) {
                setShowFeedbackModal(false);
                showNotification('Feedback submitted successfully!', 'success');
                fetchFeedbackGiven();
            } else {
                const errorData = await response.json().catch(() => null);
                setFeedbackError(errorData?.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setFeedbackError('Network error. Please try again.');
        }
    };

    const handleCancelFeedback = () => {
        setShowFeedbackModal(false);
        setSelectedTeamMember(null);
        setFeedbackText('');
        setFeedbackError('');
    };

    return {
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
    };
};

