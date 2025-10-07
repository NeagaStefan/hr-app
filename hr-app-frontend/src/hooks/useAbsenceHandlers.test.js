import { renderHook, act } from '@testing-library/react';
import { useAbsenceHandlers } from './useAbsenceHandlers';

describe('useAbsenceHandlers', () => {
    let mockGetAuthHeaders;
    let mockShowNotification;
    let mockFetchMyAbsenceRequests;
    let mockFetchTeamAbsenceRequests;
    let mockFetch;

    beforeEach(() => {
        mockGetAuthHeaders = jest.fn(() => ({ 'Content-Type': 'application/json' }));
        mockShowNotification = jest.fn();
        mockFetchMyAbsenceRequests = jest.fn();
        mockFetchTeamAbsenceRequests = jest.fn();
        mockFetch = jest.fn();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        expect(result.current.showAbsenceModal).toBe(false);
        expect(result.current.absenceFormData).toEqual({
            startDate: '',
            endDate: '',
            type: 'VACATION',
            reason: ''
        });
        expect(result.current.absenceError).toBe('');
    });

    it('should open absence modal and reset form data', () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleRequestAbsence();
        });

        expect(result.current.showAbsenceModal).toBe(true);
        expect(result.current.absenceFormData).toEqual({
            startDate: '',
            endDate: '',
            type: 'VACATION',
            reason: ''
        });
        expect(result.current.absenceError).toBe('');
    });

    it('should update form data on input change', () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
        });

        expect(result.current.absenceFormData.startDate).toBe('2024-01-01');
    });

    it('should update multiple form fields', () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'type', value: 'SICK_LEAVE' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'reason', value: 'Medical appointment' }
            });
        });

        expect(result.current.absenceFormData.type).toBe('SICK_LEAVE');
        expect(result.current.absenceFormData.reason).toBe('Medical appointment');
    });

    it('should show error when start date is missing', async () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'endDate', value: '2024-01-10' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(result.current.absenceError).toBe('Start date and end date are required');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should show error when end date is missing', async () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(result.current.absenceError).toBe('Start date and end date are required');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should show error when end date is before start date', async () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-10' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'endDate', value: '2024-01-05' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(result.current.absenceError).toBe('End date must be after start date');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should submit absence request successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'endDate', value: '2024-01-10' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'reason', value: 'Family vacation' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/absence-requests',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate: '2024-01-01',
                    endDate: '2024-01-10',
                    type: 'VACATION',
                    reason: 'Family vacation'
                })
            }
        );
        expect(result.current.showAbsenceModal).toBe(false);
        expect(mockShowNotification).toHaveBeenCalledWith('Absence request submitted successfully!', 'success');
        expect(mockFetchMyAbsenceRequests).toHaveBeenCalled();
    });

    it('should handle server error when submitting absence request', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Overlapping absence request' })
        });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'endDate', value: '2024-01-10' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(result.current.absenceError).toBe('Overlapping absence request');
    });

    it('should handle server error without message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => { throw new Error(); }
        });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'endDate', value: '2024-01-10' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(result.current.absenceError).toBe('Failed to submit absence request');
    });

    it('should handle network error when submitting absence request', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
            result.current.handleAbsenceInputChange({
                target: { name: 'endDate', value: '2024-01-10' }
            });
        });

        await act(async () => {
            await result.current.handleSubmitAbsenceRequest();
        });

        expect(result.current.absenceError).toBe('Network error. Please try again.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error submitting absence request:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('should cancel absence request and reset form', () => {
        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        act(() => {
            result.current.handleRequestAbsence();
            result.current.handleAbsenceInputChange({
                target: { name: 'startDate', value: '2024-01-01' }
            });
        });

        act(() => {
            result.current.handleCancelAbsenceRequest();
        });

        expect(result.current.showAbsenceModal).toBe(false);
        expect(result.current.absenceFormData).toEqual({
            startDate: '',
            endDate: '',
            type: 'VACATION',
            reason: ''
        });
        expect(result.current.absenceError).toBe('');
    });

    it('should respond to absence request successfully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        await act(async () => {
            await result.current.handleRespondToAbsence(1, 'APPROVED', 'Looks good');
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/absence-requests/1/respond',
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'APPROVED',
                    managerComment: 'Looks good'
                })
            }
        );
        expect(mockShowNotification).toHaveBeenCalledWith('Request approved successfully!', 'success');
        expect(mockFetchTeamAbsenceRequests).toHaveBeenCalled();
    });

    it('should respond to absence request without comment', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        await act(async () => {
            await result.current.handleRespondToAbsence(2, 'REJECTED');
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/absence-requests/2/respond',
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'REJECTED',
                    managerComment: ''
                })
            }
        );
        expect(mockShowNotification).toHaveBeenCalledWith('Request rejected successfully!', 'success');
    });

    it('should handle error when responding to absence request', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Unauthorized' })
        });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        await act(async () => {
            await result.current.handleRespondToAbsence(1, 'APPROVED');
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Unauthorized', 'error');
    });

    it('should handle error without message when responding', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => { throw new Error(); }
        });

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        await act(async () => {
            await result.current.handleRespondToAbsence(1, 'APPROVED');
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Failed to respond to request', 'error');
    });

    it('should handle network error when responding to absence request', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() =>
            useAbsenceHandlers(mockGetAuthHeaders, mockShowNotification, mockFetchMyAbsenceRequests, mockFetchTeamAbsenceRequests)
        );

        await act(async () => {
            await result.current.handleRespondToAbsence(1, 'APPROVED');
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Network error. Please try again.', 'error');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error responding to absence request:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });
});

