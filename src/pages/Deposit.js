import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added useNavigate

const Deposit = () => {
    const user = JSON.parse(localStorage.getItem("bankUser"));
    const navigate = useNavigate(); // Initialize navigate

    const [amount, setAmount] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const depositCash = async () => {
        if (amount === "") {
            setPopupMsg("Please enter amount");
            setShowPopup(true);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://banking-backend-ltoj.onrender.com/cash/deposit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.userId,
                    accNo: user.accNo,
                    balance: Number(amount)
                })
            });

            const data = await response.text();

            setPopupMsg(data);
            setShowPopup(true);
            setAmount("");

        } catch (error) {
            setPopupMsg("Server is not responding");
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Back Button added here */}
            <button 
                onClick={() => navigate(-1)} 
                style={styles.backButton}
                onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
                ← Back
            </button>

            <div style={styles.card}>
                <h2 style={styles.title}>Deposit Cash</h2>

                <p style={styles.subtitle}>
                    Enter the amount you want to deposit into your account
                </p>

                <input
                    placeholder="Enter Amount"
                    value={amount}
                    autoComplete="off"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setAmount(value);
                        }
                    }}
                    style={styles.input}
                />

                <button 
                    onClick={depositCash} 
                    disabled={loading}
                    style={{
                        ...styles.button,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                        if(!loading) e.target.style.background = "#1565c0";
                    }}
                    onMouseOut={(e) => {
                        if(!loading) e.target.style.background = "#1e88e5";
                    }}
                >
                    {loading ? "Processing..." : "Deposit"}
                </button>

                <div style={styles.footer}>
                    <p>
                        Your money is securely deposited in your account.
                        Please verify the amount before confirming the transaction.
                    </p>
                </div>
            </div>

            {showPopup && (
                <div style={styles.popupBg}>
                    <div style={styles.popup}>
                        <h3 style={{ color: "#333" }}>{popupMsg}</h3>
                        <button
                            style={styles.closeBtn}
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative" // Crucial for absolute positioning of back button
    },
    backButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "rgba(255,255,255,0.1)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "8px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        transition: "0.3s",
        backdropFilter: "blur(5px)",
        zIndex: 10
    },
    card: {
        background: "rgba(255,255,255,0.08)",
        padding: "40px",
        borderRadius: "16px",
        textAlign: "center",
        color: "white",
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        width: "100%",
        maxWidth: "320px"
    },
    title: {
        marginBottom: "10px",
        fontWeight: "600"
    },
    subtitle: {
        fontSize: "13px",
        marginBottom: "20px",
        opacity: "0.8"
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
        marginBottom: "15px",
        boxSizing: "border-box",
        background: "rgba(255,255,255,0.15)",
        color: "white"
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "#1e88e5",
        border: "none",
        borderRadius: "8px",
        color: "white",
        fontWeight: "600",
        transition: "0.3s",
        boxSizing: "border-box"
    },
    footer: {
        marginTop: "20px",
        fontSize: "12px",
        opacity: "0.8"
    },
    popupBg: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    popup: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        width: "260px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
    },
    closeBtn: {
        marginTop: "15px",
        padding: "8px 15px",
        background: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        width: "100%"
    }
};

export default Deposit;