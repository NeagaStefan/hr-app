import { renderHook, act } from '@testing-library/react';
import { useFeedbackData } from './useFeedbackData';

describe('useFeedbackData', () => {
    let mockGetAuthHeaders;
    let mockFetch;

    beforeEach(() => {
        mockGetAuthHeaders = jest.fn(() => ({ Authorization: 'Bearer token' }));
        mockFetch = jest.fn();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with empty arrays', () => {
        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        expect(result.current.feedbackReceived).toEqual([]);
        expect(result.current.feedbackGiven).toEqual([]);
    });

    it('should fetch feedback received successfully', async () => {
        const mockData = [
            { id: 1, feedbackText: 'Great work!', fromEmployeeName: 'John' },
            { id: 2, feedbackText: 'Keep it up!', fromEmployeeName: 'Jane' }
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackReceived();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/feedback/received',
            { headers: { Authorization: 'Bearer token' } }
        );
        expect(result.current.feedbackReceived).toEqual(mockData);
    });

    it('should handle error when fetching feedback received', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackReceived();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching feedback received:',
            expect.any(Error)
        );
        expect(result.current.feedbackReceived).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    it('should not update state when feedback received response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackReceived();
        });

        expect(result.current.feedbackReceived).toEqual([]);
    });

    it('should fetch feedback given successfully', async () => {
        const mockData = [
            { id: 3, feedbackText: 'Needs improvement', toEmployeeName: 'Bob' },
            { id: 4, feedbackText: 'Excellent presentation', toEmployeeName: 'Alice' }
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackGiven();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/feedback/given',
            { headers: { Authorization: 'Bearer token' } }
        );
        expect(result.current.feedbackGiven).toEqual(mockData);
    });

    it('should handle error when fetching feedback given', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackGiven();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching feedback given:',
            expect.any(Error)
        );
        expect(result.current.feedbackGiven).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    it('should not update state when feedback given response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackGiven();
        });

        expect(result.current.feedbackGiven).toEqual([]);
    });

    it('should call getAuthHeaders when fetching feedback', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackReceived();
        });

        expect(mockGetAuthHeaders).toHaveBeenCalled();
    });

    it('should fetch both feedback types independently', async () => {
        const receivedData = [{ id: 1, feedbackText: 'Received' }];
        const givenData = [{ id: 2, feedbackText: 'Given' }];

        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => receivedData })
            .mockResolvedValueOnce({ ok: true, json: async () => givenData });

        const { result } = renderHook(() => useFeedbackData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchFeedbackReceived();
        });

        expect(result.current.feedbackReceived).toEqual(receivedData);
        expect(result.current.feedbackGiven).toEqual([]);

        await act(async () => {
            await result.current.fetchFeedbackGiven();
        });

        expect(result.current.feedbackReceived).toEqual(receivedData);
        expect(result.current.feedbackGiven).toEqual(givenData);
    });
});

