import React, { useState } from 'react';
import axios from 'axios';

const BankApp = () => {
    // 1. Form States
    const [formData, setFormData] = useState({
        name: '', address: '', email: '', password: '', AadhaarNo: '', balance: 0
    });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    
    // 2. UI States
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null); // Tracks if someone is logged in

    const API_BASE_URL = "http://localhost:8088/bank";

    // Handle Account Creation
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/create`, formData);
            setMessage(`Success! Acc No: ${response.data.accNo}, ATM No: ${response.data.atmNo}`);
        } catch (error) {
            setMessage("Error creating account.");
        }
    };

    // Handle Login
    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Changed to a standard POST request
            const response = await axios.post(`${API_BASE_URL}/login`, loginData);

            if (response.data.message === "Success") {
                setUser(response.data); 
                setMessage(''); 
            } else {
                setMessage("Invalid Credentials.");
            }
        } catch (error) {
            console.error("Error details:", error); // Helpful for debugging
            setMessage("Login request failed. Check your backend server.");
        }
    };

    // Handle Logout
    const handleLogout = () => {
        setUser(null);
        setMessage("You have been successfully logged out.");
    };

    // ==========================================
    // VIEW 1: DASHBOARD (If logged in)
    // ==========================================
    if (user) {
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial' }}>
                <h2>Bank Dashboard</h2>
                <div style={{ border: '1px solid #4CAF50', padding: '20px', borderRadius: '8px', maxWidth: '300px' }}>
                    <h3>Welcome, {user.name}!</h3>
                    <p><strong>Account Number:</strong> {user.accNo}</p>
                    <p><strong>Current Balance:</strong> ₹{user.balance}</p>
                    <button 
                        onClick={handleLogout} 
                        style={{ background: '#f44336', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW 2: LOGIN & SIGNUP (If NOT logged in)
    // ==========================================
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Banking Demo</h2>
            {message && <p style={{ color: 'blue' }}><strong>Status:</strong> {message}</p>}

            <div style={{ display: 'flex', gap: '50px' }}>
                {/* Create Account Form */}
                <form onSubmit={handleCreateAccount} style={{ border: '1px solid #ccc', padding: '15px' }}>
                    <h3>Create Account</h3>
                    <input type="text" placeholder="Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} /><br/><br/>
                    <input type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} /><br/><br/>
                    {/* Added Password Field Here */}
                    <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} /><br/><br/>
                    <input type="text" placeholder="Aadhaar No" required onChange={(e) => setFormData({...formData, AadhaarNo: e.target.value})} /><br/><br/>
                    <input type="number" placeholder="Initial Balance" required onChange={(e) => setFormData({...formData, balance: e.target.value})} /><br/><br/>
                    <button type="submit">Create</button>
                </form>

                {/* Login Form */}
                <form onSubmit={handleLogin} style={{ border: '1px solid #ccc', padding: '15px', height: 'fit-content' }}>
                    <h3>Login</h3>
                    <input type="email" placeholder="Email" required onChange={(e) => setLoginData({...loginData, email: e.target.value})} /><br/><br/>
                    <input type="password" placeholder="Password" required onChange={(e) => setLoginData({...loginData, password: e.target.value})} /><br/><br/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default BankApp;