import {useState} from 'react';

export const useFeedbackData = (getAuthHeaders) => {
    const [feedbackReceived, setFeedbackReceived] = useState([]);
    const [feedbackGiven, setFeedbackGiven] = useState([]);
    const FEEDBACK_API_URL = 'http://localhost:8080/api/feedback';

    const fetchFeedbackReceived = async () => {
        try {
            const response = await fetch(`${FEEDBACK_API_URL}/received`, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setFeedbackReceived(data);
            }
        } catch (error) {
            console.error('Error fetching feedback received:', error);
        }
    };

    const fetchFeedbackGiven = async () => {
        try {
            const response = await fetch(`${FEEDBACK_API_URL}/given`, {headers: getAuthHeaders()});
            if (response.ok) {
                const data = await response.json();
                setFeedbackGiven(data);
            }
        } catch (error) {
            console.error('Error fetching feedback given:', error);
        }
    };

    return {
        feedbackReceived,
        feedbackGiven,
        fetchFeedbackReceived,
        fetchFeedbackGiven
    };
};

