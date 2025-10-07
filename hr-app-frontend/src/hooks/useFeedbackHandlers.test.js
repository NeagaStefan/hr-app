import { renderHook, act } from '@testing-library/react';
import { useFeedbackHandlers } from './useFeedbackHandlers';

describe('useFeedbackHandlers', () => {
    let mockGetAuthHeaders;
    let mockShowNotification;
    let mockFetchFeedbackGiven;
    let mockFetch;

    beforeEach(() => {
        mockGetAuthHeaders = jest.fn(() => ({ 'Content-Type': 'application/json' }));
        mockShowNotification = jest.fn();
        mockFetchFeedbackGiven = jest.fn();
        mockFetch = jest.fn();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        expect(result.current.showFeedbackModal).toBe(false);
        expect(result.current.selectedTeamMember).toBe(null);
        expect(result.current.feedbackText).toBe('');
        expect(result.current.feedbackError).toBe('');
        expect(result.current.aiSuggestion).toBe('');
        expect(result.current.loadingAISuggestion).toBe(false);
    });

    it('should open feedback modal with selected team member', () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
        });

        expect(result.current.showFeedbackModal).toBe(true);
        expect(result.current.selectedTeamMember).toEqual(teamMember);
        expect(result.current.feedbackText).toBe('');
        expect(result.current.feedbackError).toBe('');
    });

    it('should update feedback text', () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        act(() => {
            result.current.setFeedbackText('Great work on the project!');
        });

        expect(result.current.feedbackText).toBe('Great work on the project!');
    });

    it('should get AI suggestion successfully', async () => {
        const mockSuggestion = { suggestion: 'Consider highlighting specific achievements' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockSuggestion
        });

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
            result.current.setFeedbackText('performance review');
        });

        await act(async () => {
            await result.current.handleGetAISuggestion();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/feedback/suggest?employeeName=John Doe&context=performance%20review',
            { headers: { 'Content-Type': 'application/json' } }
        );
        expect(result.current.aiSuggestion).toBe('Consider highlighting specific achievements');
        expect(result.current.loadingAISuggestion).toBe(false);
    });

    it('should use default context when feedback text is empty', async () => {
        const mockSuggestion = { suggestion: 'AI suggestion' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockSuggestion
        });

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'Jane', lastName: 'Smith' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
        });

        await act(async () => {
            await result.current.handleGetAISuggestion();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/feedback/suggest?employeeName=Jane Smith&context=general%20performance',
            { headers: { 'Content-Type': 'application/json' } }
        );
    });

    it('should set loading state while fetching AI suggestion', async () => {
        let resolvePromise;
        const delayedPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockFetch.mockReturnValueOnce(delayedPromise);

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
        });

        const suggestionPromise = result.current.handleGetAISuggestion();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loadingAISuggestion).toBe(true);

        await act(async () => {
            resolvePromise({ ok: true, json: async () => ({ suggestion: 'test' }) });
            await suggestionPromise;
        });

        expect(result.current.loadingAISuggestion).toBe(false);
    });

    it('should handle error when getting AI suggestion', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
        });

        await act(async () => {
            await result.current.handleGetAISuggestion();
        });

        expect(result.current.loadingAISuggestion).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting AI suggestion:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('should use AI suggestion', async () => {
        const mockSuggestion = { suggestion: 'AI generated feedback' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockSuggestion
        });

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
        });

        await act(async () => {
            await result.current.handleGetAISuggestion();
        });

        expect(result.current.aiSuggestion).toBe('AI generated feedback');

        act(() => {
            result.current.handleUseAISuggestion();
        });

        expect(result.current.feedbackText).toBe('AI generated feedback');
        expect(result.current.aiSuggestion).toBe('');
    });

    it('should show error when feedback is empty', async () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(result.current.feedbackError).toBe('Feedback must be at least 10 characters long');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should show error when feedback is too short', async () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        act(() => {
            result.current.setFeedbackText('short');
        });

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(result.current.feedbackError).toBe('Feedback must be at least 10 characters long');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should show error when feedback is only whitespace', async () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        act(() => {
            result.current.setFeedbackText('     ');
        });

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(result.current.feedbackError).toBe('Feedback must be at least 10 characters long');
    });

    it('should submit feedback successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '5', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
            result.current.setFeedbackText('Excellent work on the project delivery!');
        });

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/feedback',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toEmployeeId: '5',
                    feedbackText: 'Excellent work on the project delivery!'
                })
            }
        );
        expect(result.current.showFeedbackModal).toBe(false);
        expect(mockShowNotification).toHaveBeenCalledWith('Feedback submitted successfully!', 'success');
        expect(mockFetchFeedbackGiven).toHaveBeenCalled();
    });

    it('should handle server error when submitting feedback', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Unauthorized access' })
        });

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '5', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
            result.current.setFeedbackText('Good performance overall');
        });

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(result.current.feedbackError).toBe('Unauthorized access');
    });

    it('should handle server error without message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => { throw new Error(); }
        });

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '5', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
            result.current.setFeedbackText('Good performance overall');
        });

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(result.current.feedbackError).toBe('Failed to submit feedback');
    });

    it('should handle network error when submitting feedback', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '5', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
            result.current.setFeedbackText('Good performance overall');
        });

        await act(async () => {
            await result.current.handleSubmitFeedback();
        });

        expect(result.current.feedbackError).toBe('Network error. Please try again.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error submitting feedback:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('should cancel feedback and reset state', () => {
        const { result } = renderHook(() =>
            useFeedbackHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchFeedbackGiven)
        );

        const teamMember = { id: '1', firstName: 'John', lastName: 'Doe' };

        act(() => {
            result.current.handleGiveFeedback(teamMember);
            result.current.setFeedbackText('Some feedback');
        });

        act(() => {
            result.current.handleCancelFeedback();
        });

        expect(result.current.showFeedbackModal).toBe(false);
        expect(result.current.selectedTeamMember).toBe(null);
        expect(result.current.feedbackText).toBe('');
        expect(result.current.feedbackError).toBe('');
    });
});
