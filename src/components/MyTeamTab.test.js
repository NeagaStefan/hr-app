import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyTeamTab from './MyTeamTab';

describe('MyTeamTab', () => {
    const mockOnGiveFeedback = jest.fn();

    const mockTeamMembers = [
        {
            id: 1,
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice.johnson@example.com',
            position: 'Software Engineer'
        },
        {
            id: 2,
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob.smith@example.com',
            position: 'Product Manager'
        },
        {
            id: 3,
            firstName: 'Carol',
            lastName: 'Williams',
            email: 'carol.williams@example.com',
            position: 'UX Designer'
        }
    ];

    const mockFeedbackReceived = [
        {
            id: 1,
            fromEmployee: {
                firstName: 'David',
                lastName: 'Brown'
            },
            feedbackText: 'Great job on the project presentation!',
            timestamp: '2025-10-01T10:00:00'
        },
        {
            id: 2,
            fromEmployee: {
                firstName: 'Emma',
                lastName: 'Davis'
            },
            feedbackText: 'Your code reviews are very thorough and helpful.',
            timestamp: '2025-09-15T14:30:00'
        }
    ];

    const mockFeedbackGiven = [
        {
            id: 3,
            toEmployee: {
                firstName: 'Frank',
                lastName: 'Wilson'
            },
            feedbackText: 'Excellent work on the new feature implementation.',
            timestamp: '2025-10-05T09:00:00'
        },
        {
            id: 4,
            toEmployee: {
                firstName: 'Grace',
                lastName: 'Martinez'
            },
            feedbackText: 'Keep up the great teamwork and collaboration.',
            timestamp: '2025-09-20T16:45:00'
        }
    ];

    const defaultProps = {
        teamMembers: [],
        feedbackReceived: [],
        feedbackGiven: [],
        onGiveFeedback: mockOnGiveFeedback
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the component with title', () => {
            render(<MyTeamTab {...defaultProps} />);
            expect(screen.getByRole('heading', { level: 2, name: 'My Team' })).toBeInTheDocument();
        });

        it('should render feedback sections with headings', () => {
            render(<MyTeamTab {...defaultProps} />);
            expect(screen.getByRole('heading', { level: 3, name: 'Feedback Received' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Feedback Given' })).toBeInTheDocument();
        });

        it('should show empty state when no team members', () => {
            render(<MyTeamTab {...defaultProps} />);
            expect(screen.getByText('No team members found.')).toBeInTheDocument();
        });

        it('should show empty state when no feedback received', () => {
            render(<MyTeamTab {...defaultProps} />);
            expect(screen.getByText('No feedback received yet.')).toBeInTheDocument();
        });

        it('should show empty state when no feedback given', () => {
            render(<MyTeamTab {...defaultProps} />);
            expect(screen.getByText('No feedback given yet.')).toBeInTheDocument();
        });
    });

    describe('Team Members Display', () => {
        it('should display all team members', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
            expect(screen.getByText('Bob Smith')).toBeInTheDocument();
            expect(screen.getByText('Carol Williams')).toBeInTheDocument();
        });

        it('should display team member emails', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            expect(screen.getByText('alice.johnson@example.com')).toBeInTheDocument();
            expect(screen.getByText('bob.smith@example.com')).toBeInTheDocument();
            expect(screen.getByText('carol.williams@example.com')).toBeInTheDocument();
        });

        it('should display team member positions', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            expect(screen.getByText('Software Engineer')).toBeInTheDocument();
            expect(screen.getByText('Product Manager')).toBeInTheDocument();
            expect(screen.getByText('UX Designer')).toBeInTheDocument();
        });

        it('should render correct number of team member cards', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const memberCards = container.querySelectorAll('.team-member-card');
            expect(memberCards.length).toBe(3);
        });

        it('should render Give Feedback button for each team member', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const feedbackButtons = screen.getAllByRole('button', { name: /Give Feedback/i });
            expect(feedbackButtons.length).toBe(3);
        });

        it('should display single team member correctly', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);

            expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
            expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
        });
    });

    describe('Feedback Received Display', () => {
        it('should display all received feedback', () => {
            render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);

            expect(screen.getByText('Great job on the project presentation!')).toBeInTheDocument();
            expect(screen.getByText('Your code reviews are very thorough and helpful.')).toBeInTheDocument();
        });

        it('should display sender names for received feedback', () => {
            render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);

            expect(screen.getByText('David Brown')).toBeInTheDocument();
            expect(screen.getByText('Emma Davis')).toBeInTheDocument();
        });

        it('should display timestamps for received feedback', () => {
            render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);

            const timestamps = screen.getAllByText(/10\/1\/2025|9\/15\/2025/);
            expect(timestamps.length).toBeGreaterThan(0);
        });

        it('should render received feedback in a list', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);

            const feedbackLists = container.querySelectorAll('.feedback-list');
            const feedbackItems = feedbackLists[0].querySelectorAll('.feedback-item');
            expect(feedbackItems.length).toBe(2);
        });

        it('should handle received feedback without sender', () => {
            const feedbackWithoutSender = [{
                id: 1,
                fromEmployee: null,
                feedbackText: 'Test feedback',
                timestamp: '2025-10-01T10:00:00'
            }];

            render(<MyTeamTab {...defaultProps} feedbackReceived={feedbackWithoutSender} />);

            expect(screen.getByText('Test feedback')).toBeInTheDocument();
        });
    });

    describe('Feedback Given Display', () => {
        it('should display all given feedback', () => {
            render(<MyTeamTab {...defaultProps} feedbackGiven={mockFeedbackGiven} />);

            expect(screen.getByText('Excellent work on the new feature implementation.')).toBeInTheDocument();
            expect(screen.getByText('Keep up the great teamwork and collaboration.')).toBeInTheDocument();
        });

        it('should display recipient names for given feedback', () => {
            render(<MyTeamTab {...defaultProps} feedbackGiven={mockFeedbackGiven} />);

            expect(screen.getByText('Frank Wilson')).toBeInTheDocument();
            expect(screen.getByText('Grace Martinez')).toBeInTheDocument();
        });

        it('should display timestamps for given feedback', () => {
            render(<MyTeamTab {...defaultProps} feedbackGiven={mockFeedbackGiven} />);

            const timestamps = screen.getAllByText(/10\/5\/2025|9\/20\/2025/);
            expect(timestamps.length).toBeGreaterThan(0);
        });

        it('should render given feedback in a list', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} feedbackGiven={mockFeedbackGiven} />);

            const feedbackLists = container.querySelectorAll('.feedback-list');
            expect(feedbackLists.length).toBe(2);

            const allFeedbackItems = container.querySelectorAll('.feedback-item');
            expect(allFeedbackItems.length).toBe(4);
        });

        it('should handle given feedback without recipient', () => {
            const feedbackWithoutRecipient = [{
                id: 1,
                toEmployee: null,
                feedbackText: 'Test feedback',
                timestamp: '2025-10-01T10:00:00'
            }];

            render(<MyTeamTab {...defaultProps} feedbackGiven={feedbackWithoutRecipient} />);

            expect(screen.getByText('Test feedback')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should call onGiveFeedback when Give Feedback button is clicked', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const firstFeedbackButton = screen.getAllByRole('button', { name: /Give Feedback/i })[0];
            fireEvent.click(firstFeedbackButton);

            expect(mockOnGiveFeedback).toHaveBeenCalledTimes(1);
            expect(mockOnGiveFeedback).toHaveBeenCalledWith(mockTeamMembers[0]);
        });

        it('should call onGiveFeedback with correct team member', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const secondFeedbackButton = screen.getAllByRole('button', { name: /Give Feedback/i })[1];
            fireEvent.click(secondFeedbackButton);

            expect(mockOnGiveFeedback).toHaveBeenCalledWith(mockTeamMembers[1]);
        });

        it('should handle multiple clicks on Give Feedback button', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const feedbackButton = screen.getAllByRole('button', { name: /Give Feedback/i })[0];
            fireEvent.click(feedbackButton);
            fireEvent.click(feedbackButton);
            fireEvent.click(feedbackButton);

            expect(mockOnGiveFeedback).toHaveBeenCalledTimes(3);
        });
    });

    describe('CSS Classes', () => {
        it('should apply correct class to main container', () => {
            const { container } = render(<MyTeamTab {...defaultProps} />);
            expect(container.querySelector('.my-team')).toBeInTheDocument();
        });

        it('should apply correct class to team members section', () => {
            const { container } = render(<MyTeamTab {...defaultProps} />);
            expect(container.querySelector('.team-members')).toBeInTheDocument();
        });

        it('should apply correct class to team member cards', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const memberCards = container.querySelectorAll('.team-member-card');
            expect(memberCards.length).toBe(3);
        });

        it('should apply correct class to member info', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);
            expect(container.querySelector('.member-info')).toBeInTheDocument();
        });

        it('should apply correct class to member name', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);
            expect(container.querySelector('.member-name')).toBeInTheDocument();
        });

        it('should apply correct class to member email', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);
            expect(container.querySelector('.member-email')).toBeInTheDocument();
        });

        it('should apply correct class to member position', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);
            expect(container.querySelector('.member-position')).toBeInTheDocument();
        });

        it('should apply correct class to member actions', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);
            expect(container.querySelector('.member-actions')).toBeInTheDocument();
        });

        it('should apply correct class to Give Feedback button', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);

            const button = screen.getByRole('button', { name: /Give Feedback/i });
            expect(button).toHaveClass('btn-give-feedback');
        });

        it('should apply correct class to feedback section', () => {
            const { container } = render(<MyTeamTab {...defaultProps} />);
            expect(container.querySelector('.feedback-section')).toBeInTheDocument();
        });

        it('should apply correct class to feedback lists', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} feedbackGiven={mockFeedbackGiven} />);

            const feedbackLists = container.querySelectorAll('.feedback-list');
            expect(feedbackLists.length).toBe(2);
        });

        it('should apply correct class to feedback items', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);

            const feedbackItems = container.querySelectorAll('.feedback-item');
            expect(feedbackItems.length).toBe(2);
        });

        it('should apply correct class to feedback sender', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);
            expect(container.querySelector('.feedback-sender')).toBeInTheDocument();
        });

        it('should apply correct class to feedback recipient', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackGiven={mockFeedbackGiven} />);
            expect(container.querySelector('.feedback-recipient')).toBeInTheDocument();
        });

        it('should apply correct class to feedback text', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);
            expect(container.querySelector('.feedback-text')).toBeInTheDocument();
        });

        it('should apply correct class to feedback date', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={mockFeedbackReceived} />);
            expect(container.querySelector('.feedback-date')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty arrays gracefully', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={[]} feedbackReceived={[]} feedbackGiven={[]} />);

            expect(screen.getByText('No team members found.')).toBeInTheDocument();
            expect(screen.getByText('No feedback received yet.')).toBeInTheDocument();
            expect(screen.getByText('No feedback given yet.')).toBeInTheDocument();
        });

        it('should handle team member with missing fields', () => {
            const incompleteTeamMember = [{
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                position: ''
            }];

            render(<MyTeamTab {...defaultProps} teamMembers={incompleteTeamMember} />);

            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('should handle very long feedback text', () => {
            const longFeedback = [{
                id: 1,
                fromEmployee: { firstName: 'Test', lastName: 'User' },
                feedbackText: 'A'.repeat(1000),
                timestamp: '2025-10-01T10:00:00'
            }];

            render(<MyTeamTab {...defaultProps} feedbackReceived={longFeedback} />);

            expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument();
        });

        it('should handle special characters in names', () => {
            const specialCharMember = [{
                id: 1,
                firstName: "O'Brien",
                lastName: 'Smith-Jones',
                email: 'test@example.com',
                position: 'Engineer'
            }];

            render(<MyTeamTab {...defaultProps} teamMembers={specialCharMember} />);

            expect(screen.getByText("O'Brien Smith-Jones")).toBeInTheDocument();
        });

        it('should handle special characters in email', () => {
            const specialEmailMember = [{
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'user+test@sub-domain.example.com',
                position: 'Engineer'
            }];

            render(<MyTeamTab {...defaultProps} teamMembers={specialEmailMember} />);

            expect(screen.getByText('user+test@sub-domain.example.com')).toBeInTheDocument();
        });

        it('should handle feedback with undefined employee properties', () => {
            const undefinedEmployeeFeedback = [{
                id: 1,
                fromEmployee: undefined,
                feedbackText: 'Test feedback',
                timestamp: '2025-10-01T10:00:00'
            }];

            render(<MyTeamTab {...defaultProps} feedbackReceived={undefinedEmployeeFeedback} />);

            expect(screen.getByText('Test feedback')).toBeInTheDocument();
        });

        it('should handle very old timestamps', () => {
            const oldFeedback = [{
                id: 1,
                fromEmployee: { firstName: 'Test', lastName: 'User' },
                feedbackText: 'Old feedback',
                timestamp: '2000-01-01T00:00:00'
            }];

            render(<MyTeamTab {...defaultProps} feedbackReceived={oldFeedback} />);

            expect(screen.getByText('Old feedback')).toBeInTheDocument();
        });

        it('should handle future timestamps', () => {
            const futureFeedback = [{
                id: 1,
                fromEmployee: { firstName: 'Test', lastName: 'User' },
                feedbackText: 'Future feedback',
                timestamp: '2030-12-31T23:59:59'
            }];

            render(<MyTeamTab {...defaultProps} feedbackReceived={futureFeedback} />);

            expect(screen.getByText('Future feedback')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<MyTeamTab {...defaultProps} />);

            const h2 = screen.getByRole('heading', { level: 2 });
            const h3Elements = screen.getAllByRole('heading', { level: 3 });

            expect(h2).toHaveTextContent('My Team');
            expect(h3Elements.length).toBe(2);
        });

        it('should have accessible buttons', () => {
            render(<MyTeamTab {...defaultProps} teamMembers={mockTeamMembers} />);

            const buttons = screen.getAllByRole('button', { name: /Give Feedback/i });
            buttons.forEach(button => {
                expect(button).toBeInTheDocument();
            });
        });
    });

    describe('Data Structure', () => {
        it('should render all team member information in correct structure', () => {
            const { container } = render(<MyTeamTab {...defaultProps} teamMembers={[mockTeamMembers[0]]} />);

            const card = container.querySelector('.team-member-card');
            const info = card.querySelector('.member-info');
            const actions = card.querySelector('.member-actions');

            expect(info).toBeInTheDocument();
            expect(actions).toBeInTheDocument();
            expect(info.querySelector('.member-name')).toBeInTheDocument();
            expect(info.querySelector('.member-email')).toBeInTheDocument();
            expect(info.querySelector('.member-position')).toBeInTheDocument();
        });

        it('should render feedback items with correct structure', () => {
            const { container } = render(<MyTeamTab {...defaultProps} feedbackReceived={[mockFeedbackReceived[0]]} />);

            const feedbackItem = container.querySelector('.feedback-item');
            expect(feedbackItem.querySelector('.feedback-sender')).toBeInTheDocument();
            expect(feedbackItem.querySelector('.feedback-text')).toBeInTheDocument();
            expect(feedbackItem.querySelector('.feedback-date')).toBeInTheDocument();
        });
    });

    describe('Integration', () => {
        it('should display all sections together correctly', () => {
            render(<MyTeamTab
                teamMembers={mockTeamMembers}
                feedbackReceived={mockFeedbackReceived}
                feedbackGiven={mockFeedbackGiven}
                onGiveFeedback={mockOnGiveFeedback}
            />);

            expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
            expect(screen.getByText('Great job on the project presentation!')).toBeInTheDocument();
            expect(screen.getByText('Excellent work on the new feature implementation.')).toBeInTheDocument();
        });

        it('should handle mixed data states', () => {
            render(<MyTeamTab
                teamMembers={mockTeamMembers}
                feedbackReceived={[]}
                feedbackGiven={mockFeedbackGiven}
                onGiveFeedback={mockOnGiveFeedback}
            />);

            expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
            expect(screen.getByText('No feedback received yet.')).toBeInTheDocument();
            expect(screen.getByText('Excellent work on the new feature implementation.')).toBeInTheDocument();
        });
    });
});

