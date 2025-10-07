import { renderHook, act } from '@testing-library/react';
import { useAbsenceData } from './useAbsenceData';

describe('useAbsenceData', () => {
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
        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        expect(result.current.absenceRequests).toEqual([]);
        expect(result.current.teamAbsenceRequests).toEqual([]);
    });

    it('should fetch my absence requests successfully', async () => {
        const mockData = [{ id: 1, type: 'Vacation' }, { id: 2, type: 'Sick Leave' }];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchMyAbsenceRequests();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/absence-requests/my-requests',
            { headers: { Authorization: 'Bearer token' } }
        );
        expect(result.current.absenceRequests).toEqual(mockData);
    });

    it('should handle error when fetching my absence requests', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchMyAbsenceRequests();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching absence requests:',
            expect.any(Error)
        );
        expect(result.current.absenceRequests).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    it('should not update state when my absence requests response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchMyAbsenceRequests();
        });

        expect(result.current.absenceRequests).toEqual([]);
    });

    it('should fetch team absence requests successfully', async () => {
        const mockData = [{ id: 3, employeeName: 'John' }, { id: 4, employeeName: 'Jane' }];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchTeamAbsenceRequests();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/absence-requests/team-requests',
            { headers: { Authorization: 'Bearer token' } }
        );
        expect(result.current.teamAbsenceRequests).toEqual(mockData);
    });

    it('should handle error when fetching team absence requests', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchTeamAbsenceRequests();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching team absence requests:',
            expect.any(Error)
        );
        expect(result.current.teamAbsenceRequests).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    it('should not update state when team absence requests response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchTeamAbsenceRequests();
        });

        expect(result.current.teamAbsenceRequests).toEqual([]);
    });

    it('should call getAuthHeaders when fetching requests', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

        const { result } = renderHook(() => useAbsenceData(mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchMyAbsenceRequests();
        });

        expect(mockGetAuthHeaders).toHaveBeenCalled();
    });
});