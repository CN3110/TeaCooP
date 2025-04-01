import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { setPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await setPassword(newPassword, confirmPassword);
            setSuccess(true);
        } catch (err) {
            setError(err);
        }
    };

    if (success) {
        return (
            <div className="success-message">
                <h3>Password set successfully!</h3>
                <p>Please login with your new password.</p>
            </div>
        );
    }

    return (
        <div className="set-password-container">
            <h2>Set Your Password</h2>
            <p>This is your first login. Please set a new password.</p>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div>
                    <label>New Password:</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <button type="submit">Set Password</button>
            </form>
        </div>
    );
};

export default SetPassword;