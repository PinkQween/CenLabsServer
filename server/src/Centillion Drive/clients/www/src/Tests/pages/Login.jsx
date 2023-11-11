import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/user'; // Import the useUser hook

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { updateUser } = useUser(); // Use the useUser hook to access user data

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://auth.cendrive.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                const responseData = await response.json();

                // Check if responseData contains the user data
                if (responseData.user) {
                    // Redirect to the dashboard after successful login
                    navigate('/testssss/dashboard');

                    // Save user data to the context
                    updateUser(responseData.user);
                } else {
                    // Handle the case where user data is missing in the response
                    console.error('User data is missing in the response');
                }
            } else {
                // Handle login error
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default Login;
