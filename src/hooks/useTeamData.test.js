import { renderHook, act, waitFor } from '@testing-library/react';
import { useTeamData } from './useTeamData';

describe('useTeamData', () => {
    let mockAuth;
    let mockGetAuthHeaders;
    let mockFetch;

    beforeEach(() => {
        mockAuth = true;
        mockGetAuthHeaders = jest.fn(() => ({ Authorization: 'Bearer token' }));
        mockFetch = jest.fn();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with empty arrays', () => {
        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        expect(result.current.teams).toEqual([]);
        expect(result.current.managers).toEqual([]);
        expect(result.current.teamMembers).toEqual([]);
    });

    it('should fetch teams on mount when auth is true', async () => {
        const mockTeams = [
            { id: '1', name: 'Team A' },
            { id: '2', name: 'Team B' }
        ];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTeams
        });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await waitFor(() => {
            expect(result.current.teams).toEqual(mockTeams);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/teams',
            { headers: { Authorization: 'Bearer token' } }
        );
    });

    it('should not fetch teams when auth is false', () => {
        mockAuth = false;

        renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should fetch teams again when auth changes to true', async () => {
        const mockTeams = [{ id: '1', name: 'Team A' }];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTeams
        });

        const { result, rerender } = renderHook(
            ({ auth }) => useTeamData(auth, mockGetAuthHeaders),
            { initialProps: { auth: false } }
        );

        expect(mockFetch).not.toHaveBeenCalled();

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTeams
        });

        rerender({ auth: true });

        await waitFor(() => {
            expect(result.current.teams).toEqual(mockTeams);
        });
    });

    it('should handle error when fetching teams', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching teams:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });

    it('should not update teams when response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        expect(result.current.teams).toEqual([]);
    });

    it('should fetch managers successfully', async () => {
        const mockManagers = [
            { id: '1', firstName: 'John', lastName: 'Manager' },
            { id: '2', firstName: 'Jane', lastName: 'Boss' }
        ];
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockManagers
        });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchManagers();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/employees/managers',
            { headers: { Authorization: 'Bearer token' } }
        );
        expect(result.current.managers).toEqual(mockManagers);
    });

    it('should handle error when fetching managers', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchManagers();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching managers:',
            expect.any(Error)
        );
        expect(result.current.managers).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    it('should not update managers when response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchManagers();
        });

        expect(result.current.managers).toEqual([]);
    });

    it('should fetch team members successfully', async () => {
        const mockMembers = [
            { id: '1', firstName: 'Alice', lastName: 'Developer' },
            { id: '2', firstName: 'Bob', lastName: 'Designer' }
        ];
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockMembers
        });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchTeamMembers();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/teams/my-team/members',
            { headers: { Authorization: 'Bearer token' } }
        );
        expect(result.current.teamMembers).toEqual(mockMembers);
    });

    it('should handle error when fetching team members', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchTeamMembers();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching team members:',
            expect.any(Error)
        );
        expect(result.current.teamMembers).toEqual([]);

        consoleErrorSpy.mockRestore();
    });

    it('should not update team members when response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await act(async () => {
            await result.current.fetchTeamMembers();
        });

        expect(result.current.teamMembers).toEqual([]);
    });

    it('should fetch all data types independently', async () => {
        const mockTeams = [{ id: '1', name: 'Team A' }];
        const mockManagers = [{ id: '1', firstName: 'Manager' }];
        const mockMembers = [{ id: '1', firstName: 'Member' }];

        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => mockTeams })
            .mockResolvedValueOnce({ ok: true, json: async () => mockManagers })
            .mockResolvedValueOnce({ ok: true, json: async () => mockMembers });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await waitFor(() => {
            expect(result.current.teams).toEqual(mockTeams);
        });

        await act(async () => {
            await result.current.fetchManagers();
        });

        expect(result.current.managers).toEqual(mockManagers);

        await act(async () => {
            await result.current.fetchTeamMembers();
        });

        expect(result.current.teamMembers).toEqual(mockMembers);
    });

    it('should call getAuthHeaders for all fetch operations', async () => {
        mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

        const { result } = renderHook(() => useTeamData(mockAuth, mockGetAuthHeaders));

        await waitFor(() => {
            expect(mockGetAuthHeaders).toHaveBeenCalled();
        });

        mockGetAuthHeaders.mockClear();

        await act(async () => {
            await result.current.fetchManagers();
        });

        expect(mockGetAuthHeaders).toHaveBeenCalled();

        mockGetAuthHeaders.mockClear();

        await act(async () => {
            await result.current.fetchTeamMembers();
        });

        expect(mockGetAuthHeaders).toHaveBeenCalled();
    });
});

