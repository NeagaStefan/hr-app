import {useEffect, useState} from 'react';

export const useTeamData = (auth, getAuthHeaders) => {
    const [teams, setTeams] = useState([]);
    const [managers, setManagers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const TEAMS_API_URL = 'http://localhost:8080/api/teams';
    const API_URL = 'http://localhost:8080/api/employees';

    const fetchTeams = async () => {
        try {
            const response = await fetch(TEAMS_API_URL, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setTeams(data);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await fetch(`${API_URL}/managers`, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setManagers(data);
            }
        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await fetch(`${TEAMS_API_URL}/my-team/members`, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setTeamMembers(data);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    useEffect(() => {
        if (auth) {
            fetchTeams();
        }
    }, [auth]);

    return {
        teams,
        managers,
        teamMembers,
        fetchTeams,
        fetchManagers,
        fetchTeamMembers
    };
};

