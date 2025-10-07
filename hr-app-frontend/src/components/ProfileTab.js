import React, { useState } from 'react';

function ProfileTab({ currentUserEmployee, teams, onEditProfile, getAuthHeaders }) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        teamIds: []
    });
    const [profileError, setProfileError] = useState('');
    const [profileEmailError, setProfileEmailError] = useState('');

    const API_URL = 'http://localhost:8080/api/employees';

    React.useEffect(() => {
        if (currentUserEmployee) {
            setProfileFormData({
                firstName: currentUserEmployee.firstName,
                lastName: currentUserEmployee.lastName,
                email: currentUserEmployee.email,
                position: currentUserEmployee.position,
                department: currentUserEmployee.department,
                teamIds: currentUserEmployee.teamIds || []
            });
        }
    }, [currentUserEmployee]);

    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setProfileError('');
        setProfileEmailError('');
    };

    const handleSaveProfile = async () => {
        setProfileError('');
        setProfileEmailError('');

        if (!profileFormData.firstName || !profileFormData.lastName || !profileFormData.email ||
            !profileFormData.position || !profileFormData.department) {
            setProfileError('All fields are required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(profileFormData.email)) {
            setProfileEmailError('Invalid email format');
            setProfileError('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/me`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(profileFormData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                if (response.status === 409) {
                    setProfileError(errorData?.message || 'Email address is already in use');
                    return;
                }

                if (response.status === 400 && errorData) {
                    setProfileError(errorData.message || 'Failed to update profile');
                } else {
                    setProfileError(errorData?.message || 'Failed to update profile');
                }
                return;
            }

            setIsEditingProfile(false);
            if (onEditProfile) {
                onEditProfile();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileError('Network error. Please try again.');
        }
    };

    if (!currentUserEmployee) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-card">
            <div className="profile-header">
                <h2>Personal Information</h2>
                <button className="btn-edit-profile" onClick={handleEditProfile}>
                    Edit Profile
                </button>
            </div>
            <div className="profile-details">
                <div className="profile-row">
                    <label>Name:</label>
                    <span>{currentUserEmployee.firstName} {currentUserEmployee.lastName}</span>
                </div>
                <div className="profile-row">
                    <label>Email:</label>
                    <span>{currentUserEmployee.email}</span>
                </div>
                <div className="profile-row">
                    <label>Position:</label>
                    <span>{currentUserEmployee.position}</span>
                </div>
                <div className="profile-row">
                    <label>Department:</label>
                    <span>{currentUserEmployee.department}</span>
                </div>
                <div className="profile-row">
                    <label>Salary:</label>
                    <span>${currentUserEmployee.salary?.toLocaleString()}</span>
                </div>
                <div className="profile-row">
                    <label>Hire Date:</label>
                    <span>{new Date(currentUserEmployee.hireDate).toLocaleDateString()}</span>
                </div>
                {currentUserEmployee.managerName && (
                    <div className="profile-row">
                        <label>Manager:</label>
                        <span>{currentUserEmployee.managerName}</span>
                    </div>
                )}
            </div>

            {isEditingProfile && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Profile</h2>
                        <p className="profile-edit-note">Note: You cannot edit your salary, hire date, or manager.</p>

                        {profileError && <div className="alert alert-error">{profileError}</div>}

                        <form className="employee-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name *"
                                    value={profileFormData.firstName}
                                    onChange={(e) => setProfileFormData({
                                        ...profileFormData,
                                        firstName: e.target.value
                                    })}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name *"
                                    value={profileFormData.lastName}
                                    onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email *"
                                value={profileFormData.email}
                                onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                                className={profileEmailError ? 'error' : ''}
                                required
                            />
                            {profileEmailError && <span className="field-error">{profileEmailError}</span>}
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="Position *"
                                    value={profileFormData.position}
                                    onChange={(e) => setProfileFormData({ ...profileFormData, position: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="Department *"
                                    value={profileFormData.department}
                                    onChange={(e) => setProfileFormData({
                                        ...profileFormData,
                                        department: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <label>Teams:</label>
                            <select
                                multiple
                                name="teamIds"
                                value={profileFormData.teamIds}
                                onChange={(e) => {
                                    const selectedTeamIds = Array.from(e.target.options)
                                        .filter(option => option.selected)
                                        .map(option => option.value);
                                    setProfileFormData({ ...profileFormData, teamIds: selectedTeamIds });
                                }}
                                className="team-select"
                            >
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            <small>Hold Ctrl (Cmd on Mac) to select multiple teams</small>
                            <div className="form-actions">
                                <button type="button" className="btn-save" onClick={handleSaveProfile}>
                                    Save Changes
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setIsEditingProfile(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileTab;

