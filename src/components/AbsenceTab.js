import React, { useState } from 'react';

function AbsenceTab({
                        absenceRequests,
                        teamAbsenceRequests,
                        isManager,
                        isAdmin,
                        onRequestAbsence,
                        onRespondToAbsence
                    }) {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return '#28a745';
            case 'REJECTED':
                return '#dc3545';
            case 'PENDING':
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };

    const formatAbsenceType = (type) => {
        return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    const filterRequests = (requests) => {
        return requests.filter(req => {
            const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
            const matchesType = typeFilter === 'ALL' || req.type === typeFilter;
            return matchesStatus && matchesType;
        });
    };

    const myFilteredRequests = filterRequests(absenceRequests);
    const teamFilteredRequests = filterRequests(teamAbsenceRequests || []);

    return (
        <div className="absence-management">
            <h2>Absence Requests</h2>

            <div className="absence-header">
                <button className="btn-request-absence" onClick={onRequestAbsence}>
                    + Request Absence
                </button>
            </div>

            <div className="absence-filters">
                <label>
                    Filter by Status
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </label>

                <label>
                    Filter by Type
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="ALL">All Types</option>
                        <option value="VACATION">Vacation</option>
                        <option value="SICK_LEAVE">Sick Leave</option>
                        <option value="PERSONAL">Personal</option>
                        <option value="OTHER">Other</option>
                    </select>
                </label>
            </div>

            <div className="absence-section">
                <h3>My Requests</h3>
                {myFilteredRequests.length === 0 ? (
                    <p className="empty-state">No absence requests yet.</p>
                ) : (
                    <div className="absence-list">
                        {myFilteredRequests.map(request => (
                            <div key={request.id} className="absence-card">
                                <div className="absence-header-row">
                                    <div className="absence-dates">
                                        <span className="absence-date-label">From:</span>
                                        <span
                                            className="absence-date">{new Date(request.startDate).toLocaleDateString()}</span>
                                        <span className="absence-date-separator">→</span>
                                        <span className="absence-date-label">To:</span>
                                        <span
                                            className="absence-date">{new Date(request.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="absence-status"
                                         style={{backgroundColor: getStatusColor(request.status)}}>
                                        {request.status}
                                    </div>
                                </div>
                                <div className="absence-type">{formatAbsenceType(request.type)}</div>
                                {request.reason && (
                                    <div className="absence-reason">
                                        <strong>Reason:</strong> {request.reason}
                                    </div>
                                )}
                                {request.managerComment && (
                                    <div className="absence-manager-comment">
                                        <strong>Manager Comment:</strong> {request.managerComment}
                                    </div>
                                )}
                                <div className="absence-footer">
                                    <span
                                        className="absence-requested">Requested: {new Date(request.requestedAt).toLocaleString()}</span>
                                    {request.respondedAt && (
                                        <span
                                            className="absence-responded">Responded: {new Date(request.respondedAt).toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(isManager || isAdmin) && (
                <div className="absence-section">
                    <h3>Team Requests {teamFilteredRequests.filter(r => r.status === 'PENDING').length > 0 &&
                        <span
                            className="pending-badge">{teamFilteredRequests.filter(r => r.status === 'PENDING').length} pending</span>}
                    </h3>
                    {teamFilteredRequests.length === 0 ? (
                        <p className="empty-state">No team absence requests.</p>
                    ) : (
                        <div className="absence-list">
                            {teamFilteredRequests.map(request => (
                                <div key={request.id} className="absence-card">
                                    <div className="absence-header-row">
                                        <div className="absence-employee-name">
                                            {request.employee.firstName} {request.employee.lastName}
                                        </div>
                                        <div className="absence-status"
                                             style={{backgroundColor: getStatusColor(request.status)}}>
                                            {request.status}
                                        </div>
                                    </div>
                                    <div className="absence-dates">
                                        <span className="absence-date-label">From:</span>
                                        <span
                                            className="absence-date">{new Date(request.startDate).toLocaleDateString()}</span>
                                        <span className="absence-date-separator">→</span>
                                        <span className="absence-date-label">To:</span>
                                        <span
                                            className="absence-date">{new Date(request.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="absence-type">{formatAbsenceType(request.type)}</div>
                                    {request.reason && (
                                        <div className="absence-reason">
                                            <strong>Reason:</strong> {request.reason}
                                        </div>
                                    )}
                                    {request.status === 'PENDING' && (
                                        <div className="absence-actions">
                                            <button
                                                className="btn-approve-absence"
                                                onClick={() => {
                                                    const comment = prompt('Optional comment:');
                                                    onRespondToAbsence(request.id, 'APPROVED', comment || '');
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-reject-absence"
                                                onClick={() => {
                                                    const comment = prompt('Rejection reason (optional):');
                                                    onRespondToAbsence(request.id, 'REJECTED', comment || '');
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {request.managerComment && (
                                        <div className="absence-manager-comment">
                                            <strong>Manager Comment:</strong> {request.managerComment}
                                        </div>
                                    )}
                                    <div className="absence-footer">
                                        <span
                                            className="absence-requested">Requested: {new Date(request.requestedAt).toLocaleString()}</span>
                                        {request.respondedAt && (
                                            <span
                                                className="absence-responded">Responded: {new Date(request.respondedAt).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AbsenceTab;
