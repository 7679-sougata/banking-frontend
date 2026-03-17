import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', address: '', email: '', password: '', AadhaarNo: '', balance: 0
    });
    const [message, setMessage] = useState('');
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://banking-backend-ltoj.onrender.com/bank/create", formData);
            alert("Account Created Successfully! Please login.");
            navigate('/login');
        } catch (error) {
            setMessage("Error creating account.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={{
                ...styles.card,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0px)" : "translateY(40px)"
            }}>
                <h2 style={styles.title}>Create Bank Account</h2>

                {message && <p style={styles.error}>{message}</p>}

                <form onSubmit={handleSignup} style={styles.form}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />

                    <input
                        type="text"
                        placeholder="Aadhaar Number"
                        required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, AadhaarNo: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />

                    <input
                        type="number"
                        placeholder="Initial Balance"
                        required
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
                    />

                    <button
                        type="submit"
                        style={styles.button}
                        onMouseOver={(e) => e.target.style.background = "#1565c0"}
                        onMouseOut={(e) => e.target.style.background = "#1e88e5"}
                    >
                        Create Account
                    </button>
                </form>

                <p style={styles.loginText}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px"
    },
    card: {
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        padding: "35px",
        width: "100%",
        maxWidth: "420px",
        color: "white",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        transition: "all 0.6s ease"
    },
    title: {
        textAlign: "center",
        marginBottom: "25px",
        fontWeight: "600",
        letterSpacing: "1px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
        fontSize: "14px",
        background: "rgba(255,255,255,0.15)",
        color: "white"
    },
    button: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        background: "#1e88e5",
        color: "white",
        transition: "0.3s",
        marginTop: "10px"
    },
    loginText: {
        textAlign: "center",
        marginTop: "20px",
        fontSize: "14px"
    },
    link: {
        color: "#4fc3f7",
        textDecoration: "none",
        fontWeight: "500"
    },
    error: {
        color: "#ff5252",
        textAlign: "center",
        marginBottom: "15px"
    }
};

export default Signup;