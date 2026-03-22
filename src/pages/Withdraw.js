import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Withdraw = () => {
    const user = JSON.parse(localStorage.getItem("bankUser"));

    const [pin, setPin] = useState("");
    const [amount, setAmount] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for logic

    const navigate = useNavigate();

    const withdrawCash = async () => {
        // Basic validation
        if (!amount || !pin) {
            setPopupMsg("Please enter both amount and PIN");
            setShowPopup(true);
            return;
        }

        setLoading(true); // Disable button

        try {
            // 1️⃣ check if pin is set
            const pinCheck = await fetch(
                `https://banking-backend-ltoj.onrender.com/pin/issetpin?userId=${user.userId}`
            );

            const isPinSet = await pinCheck.json();

            if (!isPinSet) {
                setPopupMsg("PIN not set. Please go to Profile and set your PIN first.");
                setShowPopup(true);
                setLoading(false); // Enable button if it stops here
                return;
            }

            // 2️⃣ withdraw api
            const response = await fetch("https://banking-backend-ltoj.onrender.com/cash/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.userId,
                    accNo: user.accNo,
                    transactionPin: Number(pin),
                    cash: Number(amount)
                })
            });

            const data = await response.text();
            setPopupMsg(data);
            setShowPopup(true);
            if (response.ok) {
                setAmount("");
                setPin("");
            }

        } catch (error) {
            console.log(error);
            setPopupMsg("Server is not responding");
            setShowPopup(true);
        } finally {
            setLoading(false); // Re-enable button
        }
    };

    return (
        <div style={styles.page}>
            {/* Back Button in Top Left */}
            <button 
                onClick={() => navigate(-1)} 
                style={styles.backButton}
                onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
                ← Back
            </button>

            <div style={styles.card}>
                <h2 style={styles.title}>Withdraw Cash</h2>

                <p style={styles.subtitle}>
                    Enter amount and transaction PIN to withdraw money
                </p>

                <input
                    type="number"
                    placeholder="Enter Amount"
                    autoComplete="off"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password" // Changed to password for security
                    placeholder="Enter Transaction PIN"
                    value={pin}
                    autoComplete="off"
                    onChange={(e) => setPin(e.target.value)}
                    style={styles.input}
                />

                <button 
                    onClick={withdrawCash} 
                    disabled={loading}
                    style={{
                        ...styles.button,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseOver={(e) => { if(!loading) e.target.style.background = "#1565c0" }}
                    onMouseOut={(e) => { if(!loading) e.target.style.background = "#1e88e5" }}
                >
                    {loading ? "Processing..." : "Withdraw"}
                </button>
            </div>

            {showPopup && (
                <div style={styles.popupBg}>
                    <div style={styles.popup}>
                        <h3 style={{ color: "#333", marginBottom: "20px" }}>{popupMsg}</h3>

                        {popupMsg.includes("PIN not set") && (
                            <button
                                style={styles.profileBtn}
                                onClick={() => navigate("/profile")}
                            >
                                Go To Profile
                            </button>
                        )}

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
        position: "relative" // Needed for absolute positioning of back button
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
        backdropFilter: "blur(5px)"
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
        maxWidth: "350px"
    },
    title: {
        marginBottom: "10px",
        fontWeight: "600"
    },
    subtitle: {
        fontSize: "13px",
        marginBottom: "25px",
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
        boxSizing: "border-box",
        marginTop: "10px"
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
        borderRadius: "12px",
        textAlign: "center",
        width: "300px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },
    closeBtn: {
        marginTop: "10px",
        padding: "10px 20px",
        background: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        fontWeight: "bold"
    },
    profileBtn: {
        marginBottom: "10px",
        padding: "10px 20px",
        background: "#1e88e5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        fontWeight: "bold"
    }
};

export default Withdraw;