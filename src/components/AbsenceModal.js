import React from 'react';

function AbsenceModal({
    absenceFormData,
    absenceError,
    onInputChange,
    onSubmit,
    onCancel
}) {
    return (
        <div className="modal-overlay">
            <div className="modal absence-modal">
                <h2>Request Absence</h2>

                {absenceError && <div className="alert alert-error">{absenceError}</div>}

                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                    <label>
                        Type of Absence
                        <select
                            name="type"
                            value={absenceFormData.type}
                            onChange={onInputChange}
                            required
                        >
                            <option value="">Select type...</option>
                            <option value="VACATION">Vacation</option>
                            <option value="SICK_LEAVE">Sick Leave</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </label>

                    <label>
                        Start Date
                        <input
                            type="date"
                            name="startDate"
                            value={absenceFormData.startDate}
                            onChange={onInputChange}
                            required
                        />
                    </label>

                    <label>
                        End Date
                        <input
                            type="date"
                            name="endDate"
                            value={absenceFormData.endDate}
                            onChange={onInputChange}
                            required
                        />
                    </label>

                    <label>
                        Reason (Optional)
                        <textarea
                            name="reason"
                            value={absenceFormData.reason}
                            onChange={onInputChange}
                            placeholder="Provide a reason for your absence request..."
                            rows="4"
                        />
                    </label>

                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            Submit Request
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

export default AbsenceModal;

