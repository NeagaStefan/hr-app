import React from 'react';

function FeedbackModal({
    selectedTeamMember,
    feedbackText,
    feedbackError,
    aiSuggestion,
    loadingAISuggestion,
    onFeedbackTextChange,
    onGetAISuggestion,
    onUseAISuggestion,
    onSubmit,
    onCancel
}) {
    return (
        <div className="modal-overlay">
            <div className="modal feedback-modal">
                <h2>Give Feedback to {selectedTeamMember?.firstName} {selectedTeamMember?.lastName}</h2>

                {feedbackError && <div className="alert alert-error">{feedbackError}</div>}

                <div className="feedback-form">
                    <label>
                        Feedback Message
                        <textarea
                            className="feedback-textarea"
                            value={feedbackText}
                            onChange={(e) => onFeedbackTextChange(e.target.value)}
                            placeholder="Write your feedback here, or enter a prompt for AI-generated feedback (e.g., 'positive feedback for great teamwork' or 'constructive feedback on communication skills')"
                            rows="6"
                        />
                    </label>

                    <div className="ai-suggestion-section">
                        <button
                            type="button"
                            className="btn-ai-suggestion"
                            onClick={onGetAISuggestion}
                            disabled={!feedbackText.trim() || loadingAISuggestion}
                        >
                            {loadingAISuggestion ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating AI Suggestion...
                                </>
                            ) : (
                                <>
                                    ✨ Get AI Suggestion
                                </>
                            )}
                        </button>

                        <p className="ai-hint">
                            💡 Tip: Enter a brief prompt above, then click "Get AI Suggestion" to generate professional feedback
                        </p>
                    </div>

                    {aiSuggestion && (
                        <div className="ai-suggestion-box">
                            <div className="ai-suggestion-header">
                                <span className="ai-badge">AI Generated Suggestion</span>
                            </div>
                            <div className="ai-suggestion-content">
                                {aiSuggestion}
                            </div>
                            <button
                                type="button"
                                className="btn-use-suggestion"
                                onClick={onUseAISuggestion}
                            >
                                📝 Use This Suggestion
                            </button>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn-submit-feedback"
                        onClick={onSubmit}
                        disabled={!feedbackText.trim()}
                    >
                        Submit Feedback
                    </button>
                    <button
                        type="button"
                        className="btn-cancel-feedback"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;

