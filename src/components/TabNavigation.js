import React from 'react';

function TabNavigation({ activeTab, onTabChange, showTeamTab }) {
    return (
        <div className="tab-navigation">
            <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => onTabChange('profile')}
            >
                My Profile
            </button>
            {showTeamTab && (
                <button
                    className={activeTab === 'team' ? 'active' : ''}
                    onClick={() => onTabChange('team')}
                >
                    Team Management
                </button>
            )}
            <button
                className={activeTab === 'myteam' ? 'active' : ''}
                onClick={() => onTabChange('myteam')}
            >
                My Team
            </button>
            <button
                className={activeTab === 'absence' ? 'active' : ''}
                onClick={() => onTabChange('absence')}
            >
                Absence Requests
            </button>
        </div>
    );
}

export default TabNavigation;

