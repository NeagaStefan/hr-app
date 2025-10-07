import { renderHook, act } from '@testing-library/react';
import { useTeamHandlers } from './useTeamHandlers';

describe('useTeamHandlers', () => {
    let mockGetAuthHeaders;
    let mockShowNotification;
    let mockFetchTeams;
    let mockFetch;

    beforeEach(() => {
        mockGetAuthHeaders = jest.fn(() => ({ 'Content-Type': 'application/json' }));
        mockShowNotification = jest.fn();
        mockFetchTeams = jest.fn();
        mockFetch = jest.fn();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        expect(result.current.isAddingTeam).toBe(false);
        expect(result.current.newTeamName).toBe('');
        expect(result.current.error).toBe('');
    });

    it('should update isAddingTeam state', () => {
        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setIsAddingTeam(true);
        });

        expect(result.current.isAddingTeam).toBe(true);
    });

    it('should update newTeamName state', () => {
        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('Engineering Team');
        });

        expect(result.current.newTeamName).toBe('Engineering Team');
    });

    it('should show error when team name is empty', async () => {
        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(result.current.error).toBe('Team name is required');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should save team successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('DevOps Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/teams',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'DevOps Team' })
            }
        );
        expect(result.current.newTeamName).toBe('');
        expect(result.current.isAddingTeam).toBe(false);
        expect(mockFetchTeams).toHaveBeenCalled();
        expect(mockShowNotification).toHaveBeenCalledWith('Team created successfully!', 'success');
    });

    it('should handle server error with message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Team name already exists' })
        });

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('Duplicate Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(result.current.error).toBe('Team name already exists');
        expect(mockFetchTeams).not.toHaveBeenCalled();
    });

    it('should handle server error without message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('Test Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(result.current.error).toBe('Failed to create team');
    });

    it('should handle server error when json parsing fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => { throw new Error('Invalid JSON'); }
        });

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('Test Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(result.current.error).toBe('Failed to create team');
    });

    it('should handle network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('Test Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(result.current.error).toBe('Network error. Please try again.');
        expect(mockFetchTeams).not.toHaveBeenCalled();
    });

    it('should call getAuthHeaders when saving team', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('New Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(mockGetAuthHeaders).toHaveBeenCalled();
    });

    it('should not reset error when team name is provided', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useTeamHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchTeams)
        );

        act(() => {
            result.current.setNewTeamName('Valid Team');
        });

        await act(async () => {
            await result.current.handleSaveTeam();
        });

        expect(result.current.error).toBe('');
    });
});
