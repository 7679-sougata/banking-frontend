import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BalanceCheek = () => {
    const user = JSON.parse(localStorage.getItem("bankUser"));

    const [pin, setPin] = useState("");
    const [balance, setBalance] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const checkBalance = async () => {
        if (!pin) {
            setErrorMsg("Please enter your transaction PIN");
            setShowError(true);
            return;
        }

        setLoading(true);
        setBalance(null); // Reset balance view while checking

        try {
            // 1️⃣ check if pin already set
            const pinCheck = await fetch(
                `https://banking-backend-ltoj.onrender.com/pin/issetpin?userId=${user.userId}`
            );

            const isPinSet = await pinCheck.json();

            if (!isPinSet) {
                setErrorMsg("PIN not set. Please go to Profile and set your PIN first.");
                setShowError(true);
                setLoading(false);
                return;
            }

            // 2️⃣ call balance API
            const response = await fetch("https://banking-backend-ltoj.onrender.com/cash/cheekbalance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.userId,
                    accNo: user.accNo,
                    transactionPin: Number(pin)
                })
            });

            const data = await response.json();

            if (data === -1) {
                setErrorMsg("Incorrect PIN. Please try again.");
                setShowError(true);
            } else {
                setBalance(data);
            }

        } catch (error) {
            console.log(error);
            setErrorMsg("Server is not responding");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                style={styles.backButton}
                onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
                ← Back
            </button>

            <div style={styles.card}>
                <h2 style={styles.title}>Check Balance</h2>
                <p style={styles.subtitle}>Verify your identity to view your funds</p>

                <input
                    type="password"
                    placeholder="Enter Transaction PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    style={styles.input}
                    maxLength={6}
                />

                <button 
                    onClick={checkBalance} 
                    disabled={loading}
                    style={{
                        ...styles.button,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseOver={(e) => { if(!loading) e.target.style.background = "#1565c0" }}
                    onMouseOut={(e) => { if(!loading) e.target.style.background = "#1e88e5" }}
                >
                    {loading ? "Verifying..." : "Check Balance"}
                </button>

                {/* Professional Balance Card View */}
                {balance !== null && (
                    <div style={styles.balanceCard}>
                        <div style={styles.chip} />
                        <p style={styles.cardLabel}>Available Balance</p>
                        <h1 style={styles.balanceAmount}>₹ {balance.toLocaleString()}</h1>
                        <div style={styles.cardFooter}>
                            <span>{user.name}</span>
                            <span>XXXX {user.accNo.toString().slice(-4)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Popup */}
            {showError && (
                <div style={styles.popupBg}>
                    <div style={styles.popup}>
                        <h3 style={{ color: "#d32f2f", marginBottom: '15px' }}>{errorMsg}</h3>
                        {errorMsg.includes("PIN not set") && (
                            <button
                                style={styles.profileBtn}
                                onClick={() => navigate("/profile")}
                            >
                                Go To Profile
                            </button>
                        )}
                        <button
                            style={styles.closeBtn}
                            onClick={() => setShowError(false)}
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
        position: "relative",
        padding: "20px"
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
        backdropFilter: "blur(5px)",
        transition: "0.3s"
    },
    card: {
        background: "rgba(255,255,255,0.08)",
        padding: "35px",
        borderRadius: "20px",
        textAlign: "center",
        color: "white",
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        width: "100%",
        maxWidth: "380px"
    },
    title: { fontWeight: "600", marginBottom: "5px" },
    subtitle: { fontSize: "13px", marginBottom: "25px", opacity: "0.7" },
    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        outline: "none",
        marginBottom: "15px",
        boxSizing: "border-box",
        background: "rgba(255,255,255,0.15)",
        color: "white",
        textAlign: "center",
        fontSize: "18px",
        letterSpacing: "4px"
    },
    button: {
        width: "100%",
        padding: "14px",
        background: "#1e88e5",
        border: "none",
        borderRadius: "10px",
        color: "white",
        fontWeight: "bold",
        transition: "0.3s",
        fontSize: "16px"
    },
    balanceCard: {
        marginTop: "30px",
        background: "linear-gradient(135deg, #1e88e5, #1565c0)",
        borderRadius: "15px",
        padding: "20px",
        textAlign: "left",
        position: "relative",
        boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        animation: "fadeIn 0.5s ease"
    },
    chip: {
        width: "40px",
        height: "30px",
        background: "#ffd700",
        borderRadius: "4px",
        marginBottom: "15px",
        opacity: "0.8"
    },
    cardLabel: { fontSize: "12px", opacity: "0.8", margin: 0 },
    balanceAmount: { fontSize: "28px", margin: "5px 0", fontWeight: "700" },
    cardFooter: { 
        display: "flex", 
        justifyContent: "space-between", 
        fontSize: "12px", 
        marginTop: "15px",
        textTransform: "uppercase",
        letterSpacing: "1px"
    },
    popupBg: {
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000
    },
    popup: {
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
        width: "300px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
    },
    closeBtn: {
        width: "100%",
        padding: "10px",
        background: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    profileBtn: {
        width: "100%",
        padding: "10px",
        background: "#1e88e5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "10px",
        fontWeight: "bold"
    }
};

export default BalanceCheek;