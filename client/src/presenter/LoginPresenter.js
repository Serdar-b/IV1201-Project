import React, { useState } from 'react';
import Login from "../view/login"; 
import { useNavigate } from 'react-router-dom';

const LoginPresenter = () => {
    const [loginStatus, setLoginStatus] = useState({
        isLoggedIn: false,
        message: "",
        user: null,
    });

    const navigate = useNavigate();
    const handleLogin = async (username, password) => {
        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log('User set in localStorage:', localStorage.getItem('user'));
                setLoginStatus({
                    isLoggedIn: true,
                    message: "Login successful",
                    user: data.user,
                });
                
                navigate('/dashboard');
            } else {
                setLoginStatus({
                    isLoggedIn: false,
                    message: "Invalid credentials",
                    user: null,
                });
            }
        } catch (error) {
            setLoginStatus({
                isLoggedIn: false,
                message: "An error occurred while logging in.",
                user: null,
            });
        }
    };

    return (
        <div>
            {!loginStatus.isLoggedIn ? (
                <div>
                    <Login onLogin={handleLogin} />
                    <p>{loginStatus.message}</p>
                </div>
            ) : (
                // Redirect or display success message
                <div>
                    {/* <p>Welcome, {loginStatus.user.name}!</p> */}
                </div>
            )}
        </div>
    );
};

export default LoginPresenter;
