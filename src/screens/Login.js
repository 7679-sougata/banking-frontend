import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

    const [step, setStep] = useState("LOGIN");
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [animate, setAnimate] = useState(false);

    // ✅ Added loading states
    const [loginLoading, setLoginLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // =========================
    // STEP 1: LOGIN
    // =========================
    const handleLogin = async (e) => {
        e.preventDefault();

        if (loginLoading) return; // prevent multiple clicks
        setLoginLoading(true);

        setMessage("");

        try {
            const response = await axios.post(
                "https://banking-backend-ltoj.onrender.com/bank/login",
                loginData
            );

            if (response.data.message === "Success") {

                const id = Number(response.data.userId);
                console.log("LOGIN RESPONSE:", response.data);

                if (!id) {
                    setMessage("Invalid user ID from server.");
                    return;
                }

                localStorage.setItem("bankUser", JSON.stringify(response.data));
                setUserId(id);

                console.log("Sending OTP to user ID:", id);
                const sendOtpResponse = await axios.get(
                    "https://banking-backend-ltoj.onrender.com/otp/sendotp",
                    {
                        params: {
                            userId: id,
                            email: response.data.email
                        }
                    }
                );

                console.log("SEND OTP RESPONSE:", sendOtpResponse.data);

                if (sendOtpResponse.data === "OTP_SENT") {
                    setStep("OTP");
                } else {
                    setMessage("Failed to send OTP.");
                }

            } else {
                setMessage("Invalid Credentials.");
            }

        } catch (error) {
            setMessage("Login request failed.");
        } finally {
            setLoginLoading(false); // ✅ re-enable button
        }
    };

    // =========================
    // STEP 2: VERIFY OTP
    // =========================
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otpLoading) return; // prevent multiple clicks
        setOtpLoading(true);

        setMessage("");

        try {
            const verifyResponse = await axios.get(
                "https://banking-backend-ltoj.onrender.com/otp/verifyotp",
                {
                    params: {
                        userId: userId,
                        otp: otp
                    }
                }
            );

            if (verifyResponse.data === "Success") {
                navigate("/dashboard");
            } else {
                setMessage("Invalid OTP.");
            }

        } catch (error) {
            setMessage("OTP verification failed.");
        } finally {
            setOtpLoading(false); // ✅ re-enable button
        }
    };

    return (
        <div style={styles.page}>
            <div
                style={{
                    ...styles.card,
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateY(0px)" : "translateY(40px)"
                }}
            >
                <h2 style={styles.title}>
                    {step === "LOGIN" ? "Bank Login" : "Enter OTP"}
                </h2>

                {message && <p style={styles.error}>{message}</p>}

                {/* ================= LOGIN FORM ================= */}
                {step === "LOGIN" && (
                    <form onSubmit={handleLogin} style={styles.form}>

                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            style={styles.input}
                            onChange={(e) =>
                                setLoginData({ ...loginData, email: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            required
                            style={styles.input}
                            onChange={(e) =>
                                setLoginData({ ...loginData, password: e.target.value })
                            }
                        />

                        <button
                            type="submit"
                            disabled={loginLoading}
                            style={{
                                ...styles.button,
                                opacity: loginLoading ? 0.6 : 1,
                                cursor: loginLoading ? "not-allowed" : "pointer"
                            }}
                            onMouseOver={(e) => {
                                if (!loginLoading) e.target.style.background = "#1565c0";
                            }}
                            onMouseOut={(e) => {
                                if (!loginLoading) e.target.style.background = "#1e88e5";
                            }}
                        >
                            {loginLoading ? "Processing..." : "Login"}
                        </button>
                    </form>
                )}

                {/* ================= OTP FORM ================= */}
                {step === "OTP" && (
                    <form onSubmit={handleVerifyOtp} style={styles.form}>

                        <input
                            type="number"
                            placeholder="Enter OTP"
                            required
                            style={styles.input}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={otpLoading}
                            style={{
                                ...styles.button,
                                opacity: otpLoading ? 0.6 : 1,
                                cursor: otpLoading ? "not-allowed" : "pointer"
                            }}
                            onMouseOver={(e) => {
                                if (!otpLoading) e.target.style.background = "#1565c0";
                            }}
                            onMouseOut={(e) => {
                                if (!otpLoading) e.target.style.background = "#1e88e5";
                            }}
                        >
                            {otpLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {step === "LOGIN" && (
                    <p style={styles.signupText}>
                        Need an account?{" "}
                        <Link to="/signup" style={styles.link}>
                            Sign up here
                        </Link>
                    </p>
                )}
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
    signupText: {
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

export default Login;