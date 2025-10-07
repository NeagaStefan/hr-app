import React from 'react';

function Notification({ message, type }) {
    if (!message) return null;

    return (
        <div className={`notification-toast ${type}`}>
            {message}
        </div>
    );
}

export default Notification;

