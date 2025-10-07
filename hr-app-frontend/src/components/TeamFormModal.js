import React from 'react';

function TeamFormModal({ newTeamName, error, onNameChange, onSave, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Team</h2>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                    <label>
                        Team Name
                        <input
                            type="text"
                            value={newTeamName}
                            onChange={onNameChange}
                            placeholder="Enter team name"
                            required
                            autoFocus
                        />
                    </label>
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            Create Team
                        </button>
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeamFormModal;

