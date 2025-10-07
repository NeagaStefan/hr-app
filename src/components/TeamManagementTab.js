import React from 'react';

function TeamManagementTab({
                               employees,
                               teams,
                               canAdd,
                               canEdit,
                               canDelete,
                               currentUserEmployeeId,
                               onAdd,
                               onEdit,
                               onDelete,
                               onAddTeam,
                           }) {
    const canEditEmployee = (employee) => {
        if (canEdit) return true;
        return canDelete && employee.id !== currentUserEmployeeId;

    };

    return (
        <div className="team-management">
            <div className="team-header">
                <h2>All Employees</h2>
                <div style={{display: 'flex', gap: '1rem'}}>
                    {canAdd && (
                        <button className="btn-add" onClick={onAdd}>
                            + Add Employee
                        </button>
                    )}
                    <button className="btn-add" onClick={onAddTeam}>
                        + Add Team
                    </button>
                </div>
            </div>

            <div className="employees-table">
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Hire Date</th>
                        <th>Teams</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.firstName} {employee.lastName}</td>
                            <td>{employee.email}</td>
                            <td>{employee.position}</td>
                            <td>{employee.department}</td>
                            <td>${employee.salary?.toLocaleString()}</td>
                            <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                            <td>{employee.teamIds?.map(teamId => teams.find(t => t.id === teamId)?.name).join(', ')}</td>
                            <td className="employee-actions">
                                {canEditEmployee(employee) && (
                                    <button className="btn-edit" onClick={() => onEdit(employee)}>
                                        Edit
                                    </button>
                                )}
                                {canDelete && (
                                    <button className="btn-delete" onClick={() => onDelete(employee.id)}>
                                        Delete
                                    </button>
                                )}
                                {!canEditEmployee(employee) && !canDelete &&
                                    <span className="no-actions">View Only</span>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeamManagementTab;
