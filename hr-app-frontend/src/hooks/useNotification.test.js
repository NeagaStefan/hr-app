import {act, renderHook} from '@testing-library/react';
import {useNotification} from './useNotification';

describe('useNotification', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should initialize with empty notification', () => {
        const {result} = renderHook(() => useNotification());

        expect(result.current.notification).toEqual({message: '', type: ''});
    });

    it('should show notification with message and type', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('Success message', 'success');
        });

        expect(result.current.notification).toEqual({
            message: 'Success message',
            type: 'success'
        });
    });

    it('should show error notification', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('Error occurred', 'error');
        });

        expect(result.current.notification).toEqual({
            message: 'Error occurred',
            type: 'error'
        });
    });

    it('should show info notification', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('Information', 'info');
        });

        expect(result.current.notification).toEqual({
            message: 'Information',
            type: 'info'
        });
    });

    it('should clear notification after 3 seconds', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('Test message', 'success');
        });

        expect(result.current.notification).toEqual({
            message: 'Test message',
            type: 'success'
        });

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(result.current.notification).toEqual({message: '', type: ''});
    });

    it('should not clear notification before 3 seconds', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('Test message', 'success');
        });

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(result.current.notification).toEqual({
            message: 'Test message',
            type: 'success'
        });
    });

    it('should handle multiple notifications', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('First message', 'success');
        });

        expect(result.current.notification.message).toBe('First message');

        act(() => {
            jest.advanceTimersByTime(1000);
            result.current.showNotification('Second message', 'error');
        });

        expect(result.current.notification.message).toBe('Second message');

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(result.current.notification).toEqual({message: '', type: ''});
    });

    it('should reset timer when new notification is shown', () => {
        const {result} = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('First', 'success');
        });

        act(() => {
            jest.advanceTimersByTime(2500);
        });

        act(() => {
            result.current.showNotification('Second', 'info');
        });

        act(() => {
            jest.advanceTimersByTime(2500);
        });

        expect(result.current.notification).toEqual({
            message: 'Second',
            type: 'info'
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(result.current.notification).toEqual({message: '', type: ''});
    });
});

