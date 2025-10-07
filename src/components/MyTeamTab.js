import React from 'react';

function MyTeamTab({teamMembers, feedbackReceived, feedbackGiven, onGiveFeedback}) {
    return (
        <div className="my-team">
            <h2>My Team</h2>

            <div className="team-members">
                {teamMembers.length === 0 ? (
                    <p>No team members found.</p>
                ) : (
                    teamMembers.map(member => (
                        <div key={member.id} className="team-member-card">
                            <div className="member-info">
                                <div className="member-name">{member.firstName} {member.lastName}</div>
                                <div className="member-email">{member.email}</div>
                                <div className="member-position">{member.position}</div>
                            </div>
                            <div className="member-actions">
                                <button className="btn-give-feedback" onClick={() => onGiveFeedback(member)}>
                                    Give Feedback
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="feedback-section">
                <h3>Feedback Received</h3>
                {feedbackReceived.length === 0 ? (
                    <p>No feedback received yet.</p>
                ) : (
                    <ul className="feedback-list">
                        {feedbackReceived.map(feedback => (
                            <li key={feedback.id} className="feedback-item">
                                <div
                                    className="feedback-sender">{feedback.fromEmployee?.firstName} {feedback.fromEmployee?.lastName}</div>
                                <div className="feedback-text">{feedback.feedbackText}</div>
                                <div className="feedback-date">{new Date(feedback.timestamp).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>
                )}

                <h3>Feedback Given</h3>
                {feedbackGiven.length === 0 ? (
                    <p>No feedback given yet.</p>
                ) : (
                    <ul className="feedback-list">
                        {feedbackGiven.map(feedback => (
                            <li key={feedback.id} className="feedback-item">
                                <div
                                    className="feedback-recipient">{feedback.toEmployee?.firstName} {feedback.toEmployee?.lastName}</div>
                                <div className="feedback-text">{feedback.feedbackText}</div>
                                <div className="feedback-date">{new Date(feedback.timestamp).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MyTeamTab;

