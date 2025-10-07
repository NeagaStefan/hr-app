import {useState} from 'react';

export const useAbsenceData = (getAuthHeaders) => {
    const [absenceRequests, setAbsenceRequests] = useState([]);
    const [teamAbsenceRequests, setTeamAbsenceRequests] = useState([]);
    const ABSENCE_API_URL = 'http://localhost:8080/api/absence-requests';

    const fetchMyAbsenceRequests = async () => {
        try {
            const response = await fetch(`${ABSENCE_API_URL}/my-requests`, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setAbsenceRequests(data);
            }
        } catch (error) {
            console.error('Error fetching absence requests:', error);
        }
    };

    const fetchTeamAbsenceRequests = async () => {
        try {
            const response = await fetch(`${ABSENCE_API_URL}/team-requests`, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setTeamAbsenceRequests(data);
            }
        } catch (error) {
            console.error('Error fetching team absence requests:', error);
        }
    };

    return {
        absenceRequests,
        teamAbsenceRequests,
        fetchMyAbsenceRequests,
        fetchTeamAbsenceRequests
    };
};

