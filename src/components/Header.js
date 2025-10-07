import React from 'react';

function Header({username, role, onLogout}) {
    return (
        <div className="dashboard-header">
            <h1>HR Management Dashboard</h1>
            <div className="header-actions">
                <span className="user-info">
                    Logged in as: <strong>{username}</strong>
                    ({role?.replace('ROLE_', '') || 'User'})
                </span>
                <button className="btn-logout" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Header;

