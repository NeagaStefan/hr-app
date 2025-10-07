import {useState} from 'react';

export const useTeamHandlers = (getAuthHeaders, showNotification, fetchTeams) => {
    const [isAddingTeam, setIsAddingTeam] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [error, setError] = useState('');

    const TEAMS_API_URL = 'http://localhost:8080/api/teams';

    const handleSaveTeam = async () => {
        if (!newTeamName) {
            setError('Team name is required');
            return;
        }

        try {
            const response = await fetch(TEAMS_API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({name: newTeamName})
            });

            if (response.ok) {
                setNewTeamName('');
                setIsAddingTeam(false);
                fetchTeams();
                showNotification('Team created successfully!', 'success');
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.message || 'Failed to create team');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        }
    };

    return {
        isAddingTeam,
        setIsAddingTeam,
        newTeamName,
        setNewTeamName,
        error,
        handleSaveTeam
    };
};

