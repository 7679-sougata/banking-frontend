import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    // Safety check for localStorage to prevent "undefined" crashes
    const user = JSON.parse(localStorage.getItem("bankUser")) || {};
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [atmPin, setAtmPin] = useState("");
    const [transactionPin, setTransactionPin] = useState("");
    const [step, setStep] = useState("select");   // select | otp | newpin | setpin
    const [changeType, setChangeType] = useState(""); // atm | trans
    const [otp, setOtp] = useState("");
    const [newPin, setNewPin] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect to login if user data is missing
    if (!user.userId) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <h2 style={styles.title}>Session Expired</h2>
                    <button style={styles.mainBtn} onClick={() => navigate("/login")}>Login Again</button>
                </div>
            </div>
        );
    }

    const checkPinStatus = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://banking-backend-ltoj.onrender.com/pin/issetpin?userId=${user.userId}`
            );

            if(res.data){
                setStep("select");
            } else {
                setStep("setpin");
            }
            setShowPopup(true);
        } catch {
            setMessage("Error checking pin status");
        } finally {
            setLoading(false);
        }
    };

    const savePin = async () => {
        setLoading(true);
        const data = {
            userId: user.userId,
            atmPin: atmPin,
            transactionPin: transactionPin
        };
        try {
            await axios.post("https://banking-backend-ltoj.onrender.com/pin/savepin", data);
            setMessage("PIN saved successfully");
            setTimeout(() => setShowPopup(false), 1500);
        } catch {
            setMessage("Error saving pin");
        } finally {
            setLoading(false);
        }
    };

    const sendOtp = async (type) => {
        setLoading(true);
        try {
            await axios.get(`https://banking-backend-ltoj.onrender.com/otp/sendotp`, {
                params: { userId: user.userId, email: user.email }
            });
            setChangeType(type);
            setStep("otp");
            setMessage("");
        } catch {
            setMessage("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://banking-backend-ltoj.onrender.com/otp/verifyotp`, {
                params: { userId: user.userId, otp: otp }
            });
            if(res.data === "Success"){
                setStep("newpin");
                setMessage("");
            } else {
                setMessage("Invalid OTP");
            }
        } catch {
            setMessage("OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const submitNewPin = async () => {
        setLoading(true);
        try {
            let url = changeType === "trans" 
                ? "https://banking-backend-ltoj.onrender.com/pin/changetranspin" 
                : "https://banking-backend-ltoj.onrender.com/pin/changeatmpin";
            
            let params = changeType === "trans" 
                ? { userId: user.userId, transPin: newPin } 
                : { userId: user.userId, atmPin: newPin };

            const res = await axios.post(url, null, { params });
            if(res.data.toLowerCase() === "success"){
                alert("PIN updated successfully");
                setShowPopup(false);
                setStep("select");
                setNewPin("");
                setOtp("");
            }
        } catch {
            setMessage("Failed to update PIN");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <button 
                onClick={() => navigate(-1)} 
                style={styles.backButton}
                onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
                ← Back
            </button>

            <div style={styles.container}>
                <div style={styles.profileHeader}>
                    {/* Normal Profile Header without DP Style */}
                    <h2 style={styles.userName}>{user.userName || "User Profile"}</h2>
                    <span style={styles.badge}>Secure Account</span>
                </div>

                <div style={styles.infoGrid}>
                    <div style={styles.infoBox}>
                        <label style={styles.label}>Email Address</label>
                        <p style={styles.value}>{user.email || "N/A"}</p>
                    </div>
                    <div style={styles.infoBox}>
                        <label style={styles.label}>Aadhaar Number</label>
                        <p style={styles.value}>XXXX-XXXX-{user.AadhaarNo ? user.AadhaarNo.slice(-4) : "0000"}</p>
                    </div>
                    <div style={styles.infoBox}>
                        <label style={styles.label}>Account Number</label>
                        <p style={styles.value}>{user.accNo || "N/A"}</p>
                    </div>
                    <div style={styles.infoBox}>
                        <label style={styles.label}>Residential Address</label>
                        <p style={styles.value}>{user.address || "Sorry (Under Development)"}</p>
                    </div>
                </div>

                <hr style={styles.divider} />

                <div style={styles.actionSection}>
                    <h3 style={styles.sectionTitle}>Security Settings</h3>
                    <p style={styles.subtitle}>Update your security credentials</p>
                    
                    <button
                        style={{...styles.mainBtn, opacity: loading ? 0.7 : 1}}
                        onClick={checkPinStatus}
                        disabled={loading}
                    >
                        {loading ? "Checking..." : "Manage PIN Settings"}
                    </button>
                </div>
            </div>

            {showPopup && (
                <div style={styles.popupBg}>
                    <div style={styles.popup}>
                        <button onClick={() => setShowPopup(false)} style={styles.closeX}>&times;</button>
                        
                        {step === "setpin" && (
                            <>
                                <h3 style={styles.popupTitle}>Set Your PINs</h3>
                                <input type="password" placeholder="ATM Pin (4 Digit)" maxLength="4" value={atmPin} onChange={(e) => setAtmPin(e.target.value)} style={styles.input} />
                                <input type="password" placeholder="Transaction Pin (4 Digit)" maxLength="4" value={transactionPin} onChange={(e) => setTransactionPin(e.target.value)} style={styles.input} />
                                <button style={styles.saveBtn} onClick={savePin} disabled={loading}>{loading ? "Saving..." : "Save PINs"}</button>
                            </>
                        )}

                        {step === "select" && (
                            <>
                                <h3 style={styles.popupTitle}>Security Center</h3>
                                <button style={styles.menuBtn} onClick={() => sendOtp("trans")} disabled={loading}>Change Transaction PIN</button>
                                <button style={styles.menuBtn} onClick={() => sendOtp("atm")} disabled={loading}>Change ATM PIN</button>
                            </>
                        )}

                        {step === "otp" && (
                            <>
                                <h3 style={styles.popupTitle}>Verify OTP</h3>
                                <p style={styles.popupText}>Sent to: {user.email}</p>
                                <input type="text" placeholder="Enter 4-digit OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} style={styles.input} />
                                <button style={styles.saveBtn} onClick={verifyOtp} disabled={loading}>Verify & Continue</button>
                            </>
                        )}

                        {step === "newpin" && (
                            <>
                                <h3 style={styles.popupTitle}>Update {changeType === 'atm' ? 'ATM' : 'Transaction'} PIN</h3>
                                <input type="password" placeholder="Enter New PIN" value={newPin} onChange={(e)=>setNewPin(e.target.value)} style={styles.input} />
                                <button style={styles.saveBtn} onClick={submitNewPin} disabled={loading}>Update Now</button>
                            </>
                        )}

                        {message && <p style={{color: message.includes("success") ? "#00c853" : "#ff5252", marginTop: "10px", fontSize: "14px"}}>{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        color: "white",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px",
        position: "relative"
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
        backdropFilter: "blur(5px)",
        transition: "0.3s",
        zIndex: 10
    },
    container: {
        width: "100%",
        maxWidth: "600px",
        background: "rgba(255,255,255,0.08)",
        padding: "40px",
        borderRadius: "20px",
        backdropFilter: "blur(15px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.1)"
    },
    profileHeader: {
        textAlign: "center",
        marginBottom: "30px"
    },
    userName: { margin: "0", fontSize: "28px", fontWeight: "600", letterSpacing: "1px" },
    badge: {
        fontSize: "12px",
        background: "rgba(0, 200, 83, 0.2)",
        color: "#00c853",
        padding: "4px 12px",
        borderRadius: "20px",
        border: "1px solid #00c853",
        marginTop: "10px",
        display: "inline-block"
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        textAlign: "left"
    },
    infoBox: {
        background: "rgba(255,255,255,0.05)",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.05)"
    },
    label: { fontSize: "11px", textTransform: "uppercase", opacity: "0.6", letterSpacing: "1px" },
    value: { margin: "5px 0 0", fontSize: "14px", fontWeight: "500", wordBreak: "break-word" },
    divider: { border: "none", height: "1px", background: "rgba(255,255,255,0.1)", margin: "30px 0" },
    actionSection: { textAlign: "center" },
    sectionTitle: { margin: "0 0 10px", fontSize: "18px" },
    subtitle: { fontSize: "13px", opacity: "0.7", marginBottom: "20px" },
    mainBtn: {
        background: "#1e88e5",
        color: "white",
        border: "none",
        padding: "12px 30px",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s"
    },
    popupBg: {
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.75)",
        display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
    },
    popup: {
        background: "white",
        color: "#333",
        padding: "30px",
        borderRadius: "16px",
        width: "340px",
        textAlign: "center",
        position: "relative"
    },
    closeX: {
        position: "absolute", top: "10px", right: "15px",
        background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#999"
    },
    popupTitle: { marginBottom: "20px", color: "#111" },
    input: {
        width: "100%", padding: "12px", margin: "10px 0",
        borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box"
    },
    saveBtn: {
        width: "100%", padding: "12px", background: "#00c853",
        color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", marginTop: "10px", cursor: "pointer"
    },
    menuBtn: {
        width: "100%", padding: "12px", background: "#f5f5f5",
        color: "#1e88e5", border: "1px solid #1e88e5", borderRadius: "8px", 
        fontWeight: "bold", marginBottom: "10px", cursor: "pointer", transition: "0.2s"
    }
};

export default Profile;