import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabNavigation from './TabNavigation';

describe('TabNavigation', () => {
    const mockOnTabChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render tab navigation container', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(container.querySelector('.tab-navigation')).toBeInTheDocument();
        });

        it('should render My Profile button', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('My Profile')).toBeInTheDocument();
        });

        it('should render My Team button', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('My Team')).toBeInTheDocument();
        });

        it('should render Absence Requests button', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('Absence Requests')).toBeInTheDocument();
        });

        it('should render Team Management button when showTeamTab is true', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Team Management')).toBeInTheDocument();
        });

        it('should not render Team Management button when showTeamTab is false', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
        });

        it('should render all four buttons when showTeamTab is true', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons.length).toBe(4);
        });

        it('should render three buttons when showTeamTab is false', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons.length).toBe(3);
        });
    });

    describe('Active Tab Styling', () => {
        it('should apply active class to My Profile button when activeTab is profile', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const profileButton = screen.getByText('My Profile');
            expect(profileButton).toHaveClass('active');
        });

        it('should not apply active class to My Profile button when activeTab is not profile', () => {
            render(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const profileButton = screen.getByText('My Profile');
            expect(profileButton).not.toHaveClass('active');
        });

        it('should apply active class to Team Management button when activeTab is team', () => {
            render(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const teamButton = screen.getByText('Team Management');
            expect(teamButton).toHaveClass('active');
        });

        it('should not apply active class to Team Management button when activeTab is not team', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const teamButton = screen.getByText('Team Management');
            expect(teamButton).not.toHaveClass('active');
        });

        it('should apply active class to My Team button when activeTab is myteam', () => {
            render(<TabNavigation activeTab="myteam" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const myTeamButton = screen.getByText('My Team');
            expect(myTeamButton).toHaveClass('active');
        });

        it('should not apply active class to My Team button when activeTab is not myteam', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const myTeamButton = screen.getByText('My Team');
            expect(myTeamButton).not.toHaveClass('active');
        });

        it('should apply active class to Absence Requests button when activeTab is absence', () => {
            render(<TabNavigation activeTab="absence" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const absenceButton = screen.getByText('Absence Requests');
            expect(absenceButton).toHaveClass('active');
        });

        it('should not apply active class to Absence Requests button when activeTab is not absence', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const absenceButton = screen.getByText('Absence Requests');
            expect(absenceButton).not.toHaveClass('active');
        });

        it('should apply empty string as className when button is not active', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const myTeamButton = screen.getByText('My Team');
            expect(myTeamButton).not.toHaveClass('active');
            expect(myTeamButton.className).toBe('');
        });

        it('should only have one active button at a time when activeTab is profile', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(1);
        });

        it('should only have one active button at a time when activeTab is team', () => {
            const { container } = render(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(1);
        });

        it('should only have one active button at a time when activeTab is myteam', () => {
            const { container } = render(<TabNavigation activeTab="myteam" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(1);
        });

        it('should only have one active button at a time when activeTab is absence', () => {
            const { container } = render(<TabNavigation activeTab="absence" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(1);
        });
    });

    describe('Click Handlers', () => {
        it('should call onTabChange with profile when My Profile button is clicked', () => {
            render(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const profileButton = screen.getByText('My Profile');
            fireEvent.click(profileButton);
            expect(mockOnTabChange).toHaveBeenCalledWith('profile');
        });

        it('should call onTabChange once when My Profile button is clicked', () => {
            render(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const profileButton = screen.getByText('My Profile');
            fireEvent.click(profileButton);
            expect(mockOnTabChange).toHaveBeenCalledTimes(1);
        });

        it('should call onTabChange with team when Team Management button is clicked', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const teamButton = screen.getByText('Team Management');
            fireEvent.click(teamButton);
            expect(mockOnTabChange).toHaveBeenCalledWith('team');
        });

        it('should call onTabChange once when Team Management button is clicked', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const teamButton = screen.getByText('Team Management');
            fireEvent.click(teamButton);
            expect(mockOnTabChange).toHaveBeenCalledTimes(1);
        });

        it('should call onTabChange with myteam when My Team button is clicked', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const myTeamButton = screen.getByText('My Team');
            fireEvent.click(myTeamButton);
            expect(mockOnTabChange).toHaveBeenCalledWith('myteam');
        });

        it('should call onTabChange once when My Team button is clicked', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const myTeamButton = screen.getByText('My Team');
            fireEvent.click(myTeamButton);
            expect(mockOnTabChange).toHaveBeenCalledTimes(1);
        });

        it('should call onTabChange with absence when Absence Requests button is clicked', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const absenceButton = screen.getByText('Absence Requests');
            fireEvent.click(absenceButton);
            expect(mockOnTabChange).toHaveBeenCalledWith('absence');
        });

        it('should call onTabChange once when Absence Requests button is clicked', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const absenceButton = screen.getByText('Absence Requests');
            fireEvent.click(absenceButton);
            expect(mockOnTabChange).toHaveBeenCalledTimes(1);
        });

        it('should call onTabChange even when clicking already active tab', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const profileButton = screen.getByText('My Profile');
            fireEvent.click(profileButton);
            expect(mockOnTabChange).toHaveBeenCalledWith('profile');
        });

        it('should handle multiple clicks on different buttons', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            fireEvent.click(screen.getByText('My Profile'));
            fireEvent.click(screen.getByText('Team Management'));
            fireEvent.click(screen.getByText('My Team'));
            fireEvent.click(screen.getByText('Absence Requests'));
            expect(mockOnTabChange).toHaveBeenCalledTimes(4);
        });

        it('should not call onTabChange when component initially renders', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(mockOnTabChange).not.toHaveBeenCalled();
        });
    });

    describe('Conditional Rendering', () => {
        it('should render Team Management button when showTeamTab is true', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Team Management')).toBeInTheDocument();
        });

        it('should not render Team Management button when showTeamTab is false', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
        });

        it('should not render Team Management button when showTeamTab is undefined', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={undefined} />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
        });

        it('should not render Team Management button when showTeamTab is null', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={null} />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
        });

        it('should always render My Profile button regardless of showTeamTab', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('My Profile')).toBeInTheDocument();
            rerender(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('My Profile')).toBeInTheDocument();
        });

        it('should always render My Team button regardless of showTeamTab', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('My Team')).toBeInTheDocument();
            rerender(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('My Team')).toBeInTheDocument();
        });

        it('should always render Absence Requests button regardless of showTeamTab', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Absence Requests')).toBeInTheDocument();
            rerender(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('Absence Requests')).toBeInTheDocument();
        });
    });

    describe('Button Order', () => {
        it('should render My Profile button first', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons[0].textContent).toBe('My Profile');
        });

        it('should render Team Management button second when showTeamTab is true', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons[1].textContent).toBe('Team Management');
        });

        it('should render My Team button second when showTeamTab is false', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons[1].textContent).toBe('My Team');
        });

        it('should render My Team button third when showTeamTab is true', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons[2].textContent).toBe('My Team');
        });

        it('should render Absence Requests button last when showTeamTab is false', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons[buttons.length - 1].textContent).toBe('Absence Requests');
        });

        it('should render Absence Requests button last when showTeamTab is true', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = container.querySelectorAll('button');
            expect(buttons[buttons.length - 1].textContent).toBe('Absence Requests');
        });
    });

    describe('Props Handling', () => {
        it('should handle activeTab prop correctly', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('My Profile')).toHaveClass('active');
            rerender(<TabNavigation activeTab="myteam" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.getByText('My Team')).toHaveClass('active');
        });

        it('should handle onTabChange prop correctly', () => {
            const mockHandler1 = jest.fn();
            const mockHandler2 = jest.fn();
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockHandler1} showTeamTab={false} />);
            fireEvent.click(screen.getByText('My Profile'));
            expect(mockHandler1).toHaveBeenCalled();
            rerender(<TabNavigation activeTab="profile" onTabChange={mockHandler2} showTeamTab={false} />);
            fireEvent.click(screen.getByText('My Team'));
            expect(mockHandler2).toHaveBeenCalled();
        });

        it('should handle showTeamTab prop change correctly', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
            rerender(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Team Management')).toBeInTheDocument();
        });

        it('should handle all tab values correctly', () => {
            const tabs = ['profile', 'team', 'myteam', 'absence'];
            tabs.forEach(tab => {
                const { container, unmount } = render(<TabNavigation activeTab={tab} onTabChange={mockOnTabChange} showTeamTab={true} />);
                const activeButtons = container.querySelectorAll('button.active');
                expect(activeButtons.length).toBe(1);
                unmount();
            });
        });

        it('should handle unknown activeTab value', () => {
            const { container } = render(<TabNavigation activeTab="unknown" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(0);
        });

        it('should handle empty string as activeTab', () => {
            const { container } = render(<TabNavigation activeTab="" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(0);
        });

        it('should handle null as activeTab', () => {
            const { container } = render(<TabNavigation activeTab={null} onTabChange={mockOnTabChange} showTeamTab={false} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(0);
        });

        it('should handle undefined as activeTab', () => {
            const { container } = render(<TabNavigation activeTab={undefined} onTabChange={mockOnTabChange} showTeamTab={false} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(0);
        });
    });

    describe('Button Attributes', () => {
        it('should render all buttons as button elements', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = container.querySelectorAll('button');
            buttons.forEach(button => {
                expect(button.tagName).toBe('BUTTON');
            });
        });

        it('should have correct className for active My Profile button', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const profileButton = screen.getByText('My Profile');
            expect(profileButton.className).toBe('active');
        });

        it('should have empty className for inactive My Profile button', () => {
            render(<TabNavigation activeTab="myteam" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const profileButton = screen.getByText('My Profile');
            expect(profileButton.className).toBe('');
        });

        it('should have onClick handler for all buttons', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = container.querySelectorAll('button');
            buttons.forEach(button => {
                expect(button.onclick).toBeDefined();
            });
        });
    });

    describe('Integration', () => {
        it('should allow switching between all tabs', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('My Profile')).toHaveClass('active');

            rerender(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Team Management')).toHaveClass('active');

            rerender(<TabNavigation activeTab="myteam" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('My Team')).toHaveClass('active');

            rerender(<TabNavigation activeTab="absence" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Absence Requests')).toHaveClass('active');
        });

        it('should maintain button functionality when showTeamTab changes', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            fireEvent.click(screen.getByText('My Profile'));
            expect(mockOnTabChange).toHaveBeenCalledWith('profile');

            mockOnTabChange.mockClear();
            rerender(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            fireEvent.click(screen.getByText('Team Management'));
            expect(mockOnTabChange).toHaveBeenCalledWith('team');
        });

        it('should handle rapid clicking', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const myTeamButton = screen.getByText('My Team');
            fireEvent.click(myTeamButton);
            fireEvent.click(myTeamButton);
            fireEvent.click(myTeamButton);
            expect(mockOnTabChange).toHaveBeenCalledTimes(3);
        });

        it('should maintain correct state after multiple re-renders', () => {
            const { rerender } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            rerender(<TabNavigation activeTab="team" onTabChange={mockOnTabChange} showTeamTab={true} />);
            rerender(<TabNavigation activeTab="myteam" onTabChange={mockOnTabChange} showTeamTab={true} />);
            rerender(<TabNavigation activeTab="absence" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByText('Absence Requests')).toHaveClass('active');
            expect(screen.getByText('My Profile')).not.toHaveClass('active');
            expect(screen.getByText('Team Management')).not.toHaveClass('active');
            expect(screen.getByText('My Team')).not.toHaveClass('active');
        });
    });

    describe('Accessibility', () => {
        it('should render buttons that are clickable', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                expect(button).toBeInTheDocument();
            });
        });

        it('should have proper button roles', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            const profileButton = screen.getByRole('button', { name: 'My Profile' });
            expect(profileButton).toBeInTheDocument();
        });

        it('should have accessible button text', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={true} />);
            expect(screen.getByRole('button', { name: 'My Profile' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Team Management' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'My Team' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Absence Requests' })).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle case-sensitive activeTab values', () => {
            const { container } = render(<TabNavigation activeTab="PROFILE" onTabChange={mockOnTabChange} showTeamTab={false} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(0);
        });

        it('should handle activeTab with whitespace', () => {
            const { container } = render(<TabNavigation activeTab=" profile " onTabChange={mockOnTabChange} showTeamTab={false} />);
            const activeButtons = container.querySelectorAll('button.active');
            expect(activeButtons.length).toBe(0);
        });

        it('should not break when onTabChange is called with different arguments', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={false} />);
            fireEvent.click(screen.getByText('My Profile'));
            fireEvent.click(screen.getByText('My Team'));
            fireEvent.click(screen.getByText('Absence Requests'));
            expect(mockOnTabChange).toHaveBeenCalledWith('profile');
            expect(mockOnTabChange).toHaveBeenCalledWith('myteam');
            expect(mockOnTabChange).toHaveBeenCalledWith('absence');
        });

        it('should render correctly with minimal props', () => {
            const { container } = render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} />);
            expect(container.querySelector('.tab-navigation')).toBeInTheDocument();
        });

        it('should handle showTeamTab as 0 (falsy)', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={0} />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
        });

        it('should handle showTeamTab as 1 (truthy)', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab={1} />);
            expect(screen.getByText('Team Management')).toBeInTheDocument();
        });

        it('should handle showTeamTab as empty string (falsy)', () => {
            render(<TabNavigation activeTab="profile" onTabChange={mockOnTabChange} showTeamTab="" />);
            expect(screen.queryByText('Team Management')).not.toBeInTheDocument();
        });
    });
});

