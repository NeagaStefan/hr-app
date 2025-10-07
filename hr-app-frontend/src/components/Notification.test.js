import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from './Notification';

describe('Notification', () => {
    describe('Rendering', () => {
        it('should render notification with message', () => {
            render(<Notification message="Test notification" type="success" />);
            expect(screen.getByText('Test notification')).toBeInTheDocument();
        });

        it('should not render when message is null', () => {
            const { container } = render(<Notification message={null} type="success" />);
            expect(container.firstChild).toBeNull();
        });

        it('should not render when message is undefined', () => {
            const { container } = render(<Notification message={undefined} type="success" />);
            expect(container.firstChild).toBeNull();
        });

        it('should not render when message is empty string', () => {
            const { container } = render(<Notification message="" type="success" />);
            expect(container.firstChild).toBeNull();
        });

        it('should render with success type', () => {
            const { container } = render(<Notification message="Success message" type="success" />);
            expect(container.querySelector('.notification-toast.success')).toBeInTheDocument();
        });

        it('should render with error type', () => {
            const { container } = render(<Notification message="Error message" type="error" />);
            expect(container.querySelector('.notification-toast.error')).toBeInTheDocument();
        });

        it('should render with warning type', () => {
            const { container } = render(<Notification message="Warning message" type="warning" />);
            expect(container.querySelector('.notification-toast.warning')).toBeInTheDocument();
        });

        it('should render with info type', () => {
            const { container } = render(<Notification message="Info message" type="info" />);
            expect(container.querySelector('.notification-toast.info')).toBeInTheDocument();
        });
    });

    describe('Message Content', () => {
        it('should display short message', () => {
            render(<Notification message="OK" type="success" />);
            expect(screen.getByText('OK')).toBeInTheDocument();
        });

        it('should display long message', () => {
            const longMessage = 'This is a very long notification message that contains a lot of text to test how the component handles lengthy content';
            render(<Notification message={longMessage} type="info" />);
            expect(screen.getByText(longMessage)).toBeInTheDocument();
        });

        it('should display message with special characters', () => {
            const specialMessage = "User's data has been saved! 100% complete.";
            render(<Notification message={specialMessage} type="success" />);
            expect(screen.getByText(specialMessage)).toBeInTheDocument();
        });

        it('should display message with numbers', () => {
            render(<Notification message="You have 5 new messages" type="info" />);
            expect(screen.getByText('You have 5 new messages')).toBeInTheDocument();
        });

        it('should display message with emojis', () => {
            render(<Notification message="Success! ✓ Data saved" type="success" />);
            expect(screen.getByText('Success! ✓ Data saved')).toBeInTheDocument();
        });

        it('should display multiline message', () => {
            const multilineMessage = "Line 1\nLine 2\nLine 3";
            const { container } = render(<Notification message={multilineMessage} type="info" />);
            const element = container.querySelector('.notification-toast');
            expect(element).toBeInTheDocument();
            expect(element.textContent).toBe(multilineMessage);
        });
    });

    describe('CSS Classes', () => {
        it('should apply notification-toast class', () => {
            const { container } = render(<Notification message="Test" type="success" />);
            expect(container.querySelector('.notification-toast')).toBeInTheDocument();
        });

        it('should apply both notification-toast and type class', () => {
            const { container } = render(<Notification message="Test" type="error" />);
            const element = container.querySelector('.notification-toast');
            expect(element).toHaveClass('notification-toast');
            expect(element).toHaveClass('error');
        });

        it('should apply success class', () => {
            const { container } = render(<Notification message="Test" type="success" />);
            expect(container.querySelector('.success')).toBeInTheDocument();
        });

        it('should apply error class', () => {
            const { container } = render(<Notification message="Test" type="error" />);
            expect(container.querySelector('.error')).toBeInTheDocument();
        });

        it('should apply warning class', () => {
            const { container } = render(<Notification message="Test" type="warning" />);
            expect(container.querySelector('.warning')).toBeInTheDocument();
        });

        it('should apply info class', () => {
            const { container } = render(<Notification message="Test" type="info" />);
            expect(container.querySelector('.info')).toBeInTheDocument();
        });

        it('should handle custom type class', () => {
            const { container } = render(<Notification message="Test" type="custom-type" />);
            expect(container.querySelector('.custom-type')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle whitespace-only message', () => {
            const { container } = render(<Notification message="   " type="success" />);
            expect(container.querySelector('.notification-toast')).toBeInTheDocument();
        });

        it('should handle zero as message', () => {
            render(<Notification message={0} type="info" />);
            expect(screen.queryByText('0')).not.toBeInTheDocument();
        });

        it('should handle false as message', () => {
            const { container } = render(<Notification message={false} type="info" />);
            expect(container.firstChild).toBeNull();
        });

        it('should handle missing type prop', () => {
            const { container } = render(<Notification message="Test" />);
            expect(container.querySelector('.notification-toast')).toBeInTheDocument();
        });

        it('should handle null type', () => {
            const { container } = render(<Notification message="Test" type={null} />);
            expect(container.querySelector('.notification-toast')).toBeInTheDocument();
        });

        it('should handle undefined type', () => {
            const { container } = render(<Notification message="Test" type={undefined} />);
            expect(container.querySelector('.notification-toast')).toBeInTheDocument();
        });

        it('should handle empty string type', () => {
            const { container } = render(<Notification message="Test" type="" />);
            const element = container.querySelector('.notification-toast');
            expect(element).toBeInTheDocument();
        });

        it('should handle very long type string', () => {
            const longType = 'a'.repeat(1000);
            const { container } = render(<Notification message="Test" type={longType} />);
            expect(container.querySelector(`.${longType}`)).toBeInTheDocument();
        });
    });

    describe('Props Validation', () => {
        it('should render correctly with all props provided', () => {
            render(<Notification message="Complete notification" type="success" />);
            expect(screen.getByText('Complete notification')).toBeInTheDocument();
        });

        it('should render correctly with only message prop', () => {
            render(<Notification message="Message only" />);
            expect(screen.getByText('Message only')).toBeInTheDocument();
        });

        it('should not render with only type prop', () => {
            const { container } = render(<Notification type="success" />);
            expect(container.firstChild).toBeNull();
        });

        it('should not render with no props', () => {
            const { container } = render(<Notification />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe('Message Types', () => {
        it('should display success notification', () => {
            render(<Notification message="Operation completed successfully" type="success" />);
            expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
        });

        it('should display error notification', () => {
            render(<Notification message="An error occurred" type="error" />);
            expect(screen.getByText('An error occurred')).toBeInTheDocument();
        });

        it('should display warning notification', () => {
            render(<Notification message="Warning: Please review" type="warning" />);
            expect(screen.getByText('Warning: Please review')).toBeInTheDocument();
        });

        it('should display info notification', () => {
            render(<Notification message="For your information" type="info" />);
            expect(screen.getByText('For your information')).toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        it('should render as a div element', () => {
            const { container } = render(<Notification message="Test" type="success" />);
            expect(container.querySelector('div')).toBeInTheDocument();
        });

        it('should contain only the message text', () => {
            const { container } = render(<Notification message="Simple message" type="info" />);
            const element = container.querySelector('.notification-toast');
            expect(element.textContent).toBe('Simple message');
        });

        it('should not have any child elements', () => {
            const { container } = render(<Notification message="Test" type="success" />);
            const element = container.querySelector('.notification-toast');
            expect(element.children.length).toBe(0);
        });
    });

    describe('Conditional Rendering', () => {
        it('should return null for empty message', () => {
            const { container } = render(<Notification message="" type="success" />);
            expect(container.innerHTML).toBe('');
        });

        it('should return null for null message', () => {
            const { container } = render(<Notification message={null} type="success" />);
            expect(container.innerHTML).toBe('');
        });

        it('should return null for undefined message', () => {
            const { container } = render(<Notification message={undefined} type="success" />);
            expect(container.innerHTML).toBe('');
        });

        it('should render for truthy message', () => {
            const { container } = render(<Notification message="Truthy" type="success" />);
            expect(container.innerHTML).not.toBe('');
        });
    });

    describe('Re-rendering', () => {
        it('should update when message changes', () => {
            const { rerender } = render(<Notification message="First message" type="success" />);
            expect(screen.getByText('First message')).toBeInTheDocument();

            rerender(<Notification message="Second message" type="success" />);
            expect(screen.getByText('Second message')).toBeInTheDocument();
            expect(screen.queryByText('First message')).not.toBeInTheDocument();
        });

        it('should update when type changes', () => {
            const { container, rerender } = render(<Notification message="Test" type="success" />);
            expect(container.querySelector('.success')).toBeInTheDocument();

            rerender(<Notification message="Test" type="error" />);
            expect(container.querySelector('.error')).toBeInTheDocument();
            expect(container.querySelector('.success')).not.toBeInTheDocument();
        });

        it('should disappear when message becomes empty', () => {
            const { container, rerender } = render(<Notification message="Visible" type="success" />);
            expect(screen.getByText('Visible')).toBeInTheDocument();

            rerender(<Notification message="" type="success" />);
            expect(container.firstChild).toBeNull();
        });

        it('should appear when message becomes non-empty', () => {
            const { rerender } = render(<Notification message="" type="success" />);
            expect(screen.queryByText('Now visible')).not.toBeInTheDocument();

            rerender(<Notification message="Now visible" type="success" />);
            expect(screen.getByText('Now visible')).toBeInTheDocument();
        });
    });

    describe('HTML and Special Characters', () => {
        it('should render HTML entities as text', () => {
            render(<Notification message="&lt;div&gt;HTML&lt;/div&gt;" type="info" />);
            expect(screen.getByText('<div>HTML</div>')).toBeInTheDocument();
        });

        it('should handle quotes in message', () => {
            render(<Notification message='Message with "quotes"' type="info" />);
            expect(screen.getByText('Message with "quotes"')).toBeInTheDocument();
        });

        it('should handle single quotes in message', () => {
            render(<Notification message="Message with 'single quotes'" type="info" />);
            expect(screen.getByText("Message with 'single quotes'")).toBeInTheDocument();
        });

        it('should handle ampersands in message', () => {
            render(<Notification message="Rock & Roll" type="info" />);
            expect(screen.getByText('Rock & Roll')).toBeInTheDocument();
        });

        it('should handle less than and greater than symbols', () => {
            render(<Notification message="5 < 10 > 3" type="info" />);
            expect(screen.getByText('5 < 10 > 3')).toBeInTheDocument();
        });
    });
});
