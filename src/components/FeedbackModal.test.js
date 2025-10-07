import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackModal from './FeedbackModal';

describe('FeedbackModal', () => {
    const mockOnFeedbackTextChange = jest.fn();
    const mockOnGetAISuggestion = jest.fn();
    const mockOnUseAISuggestion = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    const mockTeamMember = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    };

    const defaultProps = {
        selectedTeamMember: mockTeamMember,
        feedbackText: '',
        feedbackError: null,
        aiSuggestion: null,
        loadingAISuggestion: false,
        onFeedbackTextChange: mockOnFeedbackTextChange,
        onGetAISuggestion: mockOnGetAISuggestion,
        onUseAISuggestion: mockOnUseAISuggestion,
        onSubmit: mockOnSubmit,
        onCancel: mockOnCancel
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render modal with team member name in title', () => {
            render(<FeedbackModal {...defaultProps} />);
            expect(screen.getByText(/Give Feedback to John Doe/i)).toBeInTheDocument();
        });

        it('should render feedback textarea', () => {
            render(<FeedbackModal {...defaultProps} />);
            expect(screen.getByPlaceholderText(/Write your feedback here/i)).toBeInTheDocument();
        });

        it('should render AI suggestion button', () => {
            render(<FeedbackModal {...defaultProps} />);
            expect(screen.getByRole('button', { name: /Get AI Suggestion/i })).toBeInTheDocument();
        });

        it('should render AI hint text', () => {
            render(<FeedbackModal {...defaultProps} />);
            expect(screen.getByText(/Tip: Enter a brief prompt above/i)).toBeInTheDocument();
        });

        it('should render Submit Feedback button', () => {
            render(<FeedbackModal {...defaultProps} />);
            expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeInTheDocument();
        });

        it('should render Cancel button', () => {
            render(<FeedbackModal {...defaultProps} />);
            expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        });

        it('should display error message when feedbackError is provided', () => {
            const errorMessage = 'Failed to submit feedback';
            render(<FeedbackModal {...defaultProps} feedbackError={errorMessage} />);

            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toHaveClass('alert-error');
        });

        it('should not display error message when feedbackError is null', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);
            expect(container.querySelector('.alert-error')).not.toBeInTheDocument();
        });

        it('should not display AI suggestion box when aiSuggestion is null', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);
            expect(container.querySelector('.ai-suggestion-box')).not.toBeInTheDocument();
        });

        it('should display AI suggestion box when aiSuggestion is provided', () => {
            const suggestion = 'Great work on the project!';
            render(<FeedbackModal {...defaultProps} aiSuggestion={suggestion} />);

            expect(screen.getByText('AI Generated Suggestion')).toBeInTheDocument();
            expect(screen.getByText(suggestion)).toBeInTheDocument();
        });
    });

    describe('Form Data Display', () => {
        it('should display feedback text in textarea', () => {
            const feedbackText = 'Excellent teamwork on the recent project';
            render(<FeedbackModal {...defaultProps} feedbackText={feedbackText} />);

            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);
            expect(textarea).toHaveValue(feedbackText);
        });

        it('should display empty textarea when no feedback text', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="" />);

            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);
            expect(textarea).toHaveValue('');
        });
    });

    describe('User Interactions', () => {
        it('should call onFeedbackTextChange when textarea value changes', () => {
            render(<FeedbackModal {...defaultProps} />);

            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);
            fireEvent.change(textarea, { target: { value: 'New feedback text' } });

            expect(mockOnFeedbackTextChange).toHaveBeenCalledTimes(1);
            expect(mockOnFeedbackTextChange).toHaveBeenCalledWith('New feedback text');
        });

        it('should call onGetAISuggestion when AI button is clicked', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="positive feedback" />);

            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            fireEvent.click(aiButton);

            expect(mockOnGetAISuggestion).toHaveBeenCalledTimes(1);
        });

        it('should call onUseAISuggestion when Use This Suggestion button is clicked', () => {
            const suggestion = 'Great work on the project!';
            render(<FeedbackModal {...defaultProps} aiSuggestion={suggestion} />);

            const useButton = screen.getByRole('button', { name: /Use This Suggestion/i });
            fireEvent.click(useButton);

            expect(mockOnUseAISuggestion).toHaveBeenCalledTimes(1);
        });

        it('should call onSubmit when Submit Feedback button is clicked', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="Some feedback" />);

            const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
            fireEvent.click(submitButton);

            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        it('should call onCancel when Cancel button is clicked', () => {
            render(<FeedbackModal {...defaultProps} />);

            const cancelButton = screen.getByRole('button', { name: /Cancel/i });
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('Button States', () => {
        it('should disable AI suggestion button when feedback text is empty', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="" />);

            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            expect(aiButton).toBeDisabled();
        });

        it('should disable AI suggestion button when feedback text is only whitespace', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="   " />);

            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            expect(aiButton).toBeDisabled();
        });

        it('should enable AI suggestion button when feedback text is provided', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="positive feedback" />);

            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            expect(aiButton).not.toBeDisabled();
        });

        it('should disable AI suggestion button when loading', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="positive feedback" loadingAISuggestion={true} />);

            const aiButton = screen.getByRole('button', { name: /Generating AI Suggestion/i });
            expect(aiButton).toBeDisabled();
        });

        it('should disable Submit Feedback button when feedback text is empty', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="" />);

            const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
            expect(submitButton).toBeDisabled();
        });

        it('should disable Submit Feedback button when feedback text is only whitespace', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="   " />);

            const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
            expect(submitButton).toBeDisabled();
        });

        it('should enable Submit Feedback button when feedback text is provided', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="Some feedback" />);

            const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
            expect(submitButton).not.toBeDisabled();
        });
    });

    describe('Loading State', () => {
        it('should show loading state on AI button when loadingAISuggestion is true', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="positive" loadingAISuggestion={true} />);

            expect(screen.getByText(/Generating AI Suggestion/i)).toBeInTheDocument();
        });

        it('should display spinner when loading AI suggestion', () => {
            const { container } = render(<FeedbackModal {...defaultProps} feedbackText="positive" loadingAISuggestion={true} />);

            expect(container.querySelector('.spinner')).toBeInTheDocument();
        });

        it('should show normal button text when not loading', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="positive" loadingAISuggestion={false} />);

            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            expect(aiButton).toBeInTheDocument();
            expect(screen.queryByText(/Generating AI Suggestion/i)).not.toBeInTheDocument();
        });
    });

    describe('AI Suggestion Box', () => {
        it('should render AI suggestion with correct content', () => {
            const suggestion = 'Your communication skills have improved significantly this quarter.';
            render(<FeedbackModal {...defaultProps} aiSuggestion={suggestion} />);

            expect(screen.getByText(suggestion)).toBeInTheDocument();
        });

        it('should render Use This Suggestion button when AI suggestion is present', () => {
            const suggestion = 'Great work!';
            render(<FeedbackModal {...defaultProps} aiSuggestion={suggestion} />);

            expect(screen.getByRole('button', { name: /Use This Suggestion/i })).toBeInTheDocument();
        });

        it('should render AI badge in suggestion box', () => {
            const suggestion = 'Great work!';
            render(<FeedbackModal {...defaultProps} aiSuggestion={suggestion} />);

            expect(screen.getByText('AI Generated Suggestion')).toBeInTheDocument();
        });
    });

    describe('Textarea Properties', () => {
        it('should have correct label text', () => {
            render(<FeedbackModal {...defaultProps} />);

            expect(screen.getByText('Feedback Message')).toBeInTheDocument();
        });

        it('should have rows attribute set to 6', () => {
            render(<FeedbackModal {...defaultProps} />);

            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);
            expect(textarea).toHaveAttribute('rows', '6');
        });

        it('should have correct placeholder text', () => {
            render(<FeedbackModal {...defaultProps} />);

            const textarea = screen.getByPlaceholderText(/Write your feedback here, or enter a prompt for AI-generated feedback/i);
            expect(textarea).toBeInTheDocument();
        });
    });

    describe('CSS Classes', () => {
        it('should apply correct CSS classes to modal elements', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);

            expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
            expect(container.querySelector('.modal.feedback-modal')).toBeInTheDocument();
        });

        it('should apply correct CSS class to feedback form', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);

            expect(container.querySelector('.feedback-form')).toBeInTheDocument();
        });

        it('should apply correct CSS class to textarea', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);

            const textarea = container.querySelector('.feedback-textarea');
            expect(textarea).toBeInTheDocument();
        });

        it('should apply correct CSS class to AI suggestion section', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);

            expect(container.querySelector('.ai-suggestion-section')).toBeInTheDocument();
        });

        it('should apply correct CSS class to AI button', () => {
            const { container } = render(<FeedbackModal {...defaultProps} />);

            expect(container.querySelector('.btn-ai-suggestion')).toBeInTheDocument();
        });

        it('should apply correct CSS classes to action buttons', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="text" />);

            const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
            const cancelButton = screen.getByRole('button', { name: /Cancel/i });

            expect(submitButton).toHaveClass('btn-submit-feedback');
            expect(cancelButton).toHaveClass('btn-cancel-feedback');
        });

        it('should apply correct CSS classes to AI suggestion box when displayed', () => {
            const { container } = render(<FeedbackModal {...defaultProps} aiSuggestion="Test suggestion" />);

            expect(container.querySelector('.ai-suggestion-box')).toBeInTheDocument();
            expect(container.querySelector('.ai-suggestion-header')).toBeInTheDocument();
            expect(container.querySelector('.ai-suggestion-content')).toBeInTheDocument();
            expect(container.querySelector('.btn-use-suggestion')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null selectedTeamMember gracefully', () => {
            render(<FeedbackModal {...defaultProps} selectedTeamMember={null} />);

            expect(screen.getByText(/Give Feedback to/i)).toBeInTheDocument();
        });

        it('should handle team member with no lastName', () => {
            const memberWithoutLastName = { id: 1, firstName: 'John', lastName: '' };
            render(<FeedbackModal {...defaultProps} selectedTeamMember={memberWithoutLastName} />);

            expect(screen.getByText(/Give Feedback to John/i)).toBeInTheDocument();
        });

        it('should handle empty aiSuggestion string', () => {
            const { container } = render(<FeedbackModal {...defaultProps} aiSuggestion="" />);

            // Empty string is falsy, so suggestion box should not render
            expect(container.querySelector('.ai-suggestion-box')).not.toBeInTheDocument();
        });

        it('should handle long feedback text', () => {
            const longText = 'A'.repeat(1000);
            render(<FeedbackModal {...defaultProps} feedbackText={longText} />);

            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);
            expect(textarea).toHaveValue(longText);
        });

        it('should handle long AI suggestion', () => {
            const longSuggestion = 'This is a very long AI suggestion. '.repeat(50);
            const { container } = render(<FeedbackModal {...defaultProps} aiSuggestion={longSuggestion} />);

            const suggestionContent = container.querySelector('.ai-suggestion-content');
            expect(suggestionContent).toBeInTheDocument();
            expect(suggestionContent.textContent).toBe(longSuggestion);
        });
    });

    describe('Button Types', () => {
        it('should have type="button" on all buttons', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="text" aiSuggestion="suggestion" />);

            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            const useButton = screen.getByRole('button', { name: /Use This Suggestion/i });
            const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
            const cancelButton = screen.getByRole('button', { name: /Cancel/i });

            expect(aiButton).toHaveAttribute('type', 'button');
            expect(useButton).toHaveAttribute('type', 'button');
            expect(submitButton).toHaveAttribute('type', 'button');
            expect(cancelButton).toHaveAttribute('type', 'button');
        });
    });

    describe('Accessibility', () => {
        it('should have modal with proper heading hierarchy', () => {
            render(<FeedbackModal {...defaultProps} />);

            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent(/Give Feedback to John Doe/i);
        });

        it('should have label associated with textarea', () => {
            render(<FeedbackModal {...defaultProps} />);

            const label = screen.getByText('Feedback Message');
            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);

            expect(label).toBeInTheDocument();
            expect(textarea).toBeInTheDocument();
        });
    });

    describe('Multiple Interactions', () => {
        it('should handle typing, getting AI suggestion, and submitting', () => {
            const { rerender } = render(<FeedbackModal {...defaultProps} />);

            // Type feedback
            const textarea = screen.getByPlaceholderText(/Write your feedback here/i);
            fireEvent.change(textarea, { target: { value: 'positive feedback' } });
            expect(mockOnFeedbackTextChange).toHaveBeenCalledWith('positive feedback');

            // Update props to reflect state change
            rerender(<FeedbackModal {...defaultProps} feedbackText="positive feedback" />);

            // Get AI suggestion
            const aiButton = screen.getByRole('button', { name: /Get AI Suggestion/i });
            fireEvent.click(aiButton);
            expect(mockOnGetAISuggestion).toHaveBeenCalled();

            // Update with AI suggestion
            rerender(<FeedbackModal {...defaultProps} feedbackText="positive feedback" aiSuggestion="Great work!" />);

            // Use AI suggestion
            const useButton = screen.getByRole('button', { name: /Use This Suggestion/i });
            fireEvent.click(useButton);
            expect(mockOnUseAISuggestion).toHaveBeenCalled();
        });

        it('should allow canceling after typing feedback', () => {
            render(<FeedbackModal {...defaultProps} feedbackText="Some feedback" />);

            const cancelButton = screen.getByRole('button', { name: /Cancel/i });
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalled();
        });
    });
});

