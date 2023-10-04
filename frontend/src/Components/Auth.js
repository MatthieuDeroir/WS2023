import React, { useState } from 'react';
import './Auth.css';
const { IP, PORT } = require('../config.js');

function Auth({ onAuthSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const response = await fetch(`${IP}:${PORT}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', username);
                onAuthSuccess();
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error during sign in:", error);
        }
    };

    const handleSignUp = async () => {
        try {
            const response = await fetch(`${IP}:${PORT}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                handleSignIn();  // After successful signup, auto sign in
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error during sign up:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign In</h2>
            <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default Auth;
