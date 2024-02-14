import React, { useState } from 'react';
import Register from "../view/Register"; // Make sure to import the Register view
import { useNavigate } from 'react-router-dom';

const RegisterPresenter = () => {
    const [registerStatus, setRegisterStatus] = useState({
        isRegistered: false,
        message: "",
    });

    const navigate = useNavigate();

    const handleRegister = async (username, email, password) => {
        try {
            const response = await fetch("http://localhost:5001/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setRegisterStatus({
                    isRegistered: true,
                    message: "Registration successful",
                });
                navigate('/login');
            } else {
                setRegisterStatus({
                    isRegistered: false,
                    message: data.message || "Registration failed",
                });
            }
        } catch (error) {
            setRegisterStatus({
                isRegistered: false,
                message: "An error occurred during registration.",
            });
        }
    };

    return (
        <div>
            {!registerStatus.isRegistered ? (
                <div>
                    <Register onRegister={handleRegister} />
                    <p>{registerStatus.message}</p>
                </div>
            ) : (
                <div>
                    <p>Registration successful! You can now log in.</p>
                </div>
            )}
        </div>
    );
};

export default RegisterPresenter;
