import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    return (
        <div style={styles.page}>
            <div
                style={{
                    ...styles.heroCard,
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateY(0px)" : "translateY(40px)"
                }}
            >
                <h1 style={styles.title}>Welcome to SecureBank</h1>
                <p style={styles.subtitle}>
                    Your secure and trusted digital banking platform.
                    Manage accounts, track balances, and control your finances with confidence.
                </p>

                <div style={styles.buttonContainer}>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <button
                            style={styles.loginBtn}
                            onMouseOver={(e) => e.target.style.background = "#1565c0"}
                            onMouseOut={(e) => e.target.style.background = "#1e88e5"}
                        >
                            Login
                        </button>
                    </Link>

                    <Link to="/signup" style={{ textDecoration: "none" }}>
                        <button
                            style={styles.signupBtn}
                            onMouseOver={(e) => {
                                e.target.style.background = "#00c853";
                                e.target.style.color = "white";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = "transparent";
                                e.target.style.color = "#00e676";
                            }}
                        >
                            Create Account
                        </button>
                    </Link>
                </div>
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
    heroCard: {
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        borderRadius: "18px",
        padding: "50px",
        maxWidth: "650px",
        textAlign: "center",
        color: "white",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        transition: "all 0.6s ease"
    },
    title: {
        fontSize: "36px",
        fontWeight: "700",
        marginBottom: "20px",
        letterSpacing: "1px"
    },
    subtitle: {
        fontSize: "16px",
        opacity: 0.85,
        marginBottom: "35px",
        lineHeight: "1.6"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap"
    },
    loginBtn: {
        padding: "12px 28px",
        borderRadius: "30px",
        border: "none",
        background: "#1e88e5",
        color: "white",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.3s"
    },
    signupBtn: {
        padding: "12px 28px",
        borderRadius: "30px",
        border: "2px solid #00e676",
        background: "transparent",
        color: "#00e676",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.3s"
    }
};

export default Home;