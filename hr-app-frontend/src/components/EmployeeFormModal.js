import React from 'react';

function EmployeeFormModal({
    isEditing,
    formData,
    error,
    emailError,
    duplicateEmailError,
    teams,
    managers,
    isManager,
    onInputChange,
    onSave,
    onCancel
}) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <form className="employee-form">
                    <div className="form-row">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name *"
                            value={formData.firstName}
                            onChange={onInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name *"
                            value={formData.lastName}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={onInputChange}
                        className={`${formData.email ? (emailError ? 'error' : 'valid') : ''} ${duplicateEmailError ? 'duplicate-error' : ''}`}
                        required
                    />
                    {emailError && <span className="field-error">{emailError}</span>}
                    <div className="form-row">
                        <input
                            type="text"
                            name="position"
                            placeholder="Position *"
                            value={formData.position}
                            onChange={onInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department *"
                            value={formData.department}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary *"
                            value={formData.salary}
                            onChange={onInputChange}
                            min="0"
                            step="0.01"
                            required
                        />
                        <input
                            type="date"
                            name="hireDate"
                            placeholder="Hire Date *"
                            value={formData.hireDate}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    {!isManager && (
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={onInputChange}
                            className="manager-select"
                            required
                        >
                            <option value="">Select Manager *</option>
                            {managers.map(manager => (
                                <option key={manager.id} value={manager.id}>
                                    {manager.firstName} {manager.lastName} ({manager.position})
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        multiple
                        name="teamIds"
                        value={formData.teamIds}
                        onChange={onInputChange}
                        className="team-select"
                        required
                    >
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                    <div className="form-actions">
                        <button type="button" className="btn-save" onClick={onSave}>
                            Save
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

export default EmployeeFormModal;

