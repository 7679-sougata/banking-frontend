import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('bankUser');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
            setTimeout(() => setAnimate(true), 100);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('bankUser');
        navigate('/login');
    };

    if (!user) return (
        <div style={styles.page}>
            <p style={{ color: "white" }}>Loading Secure Environment...</p>
        </div>
    );

    return (
        <div style={styles.page}>
            <div style={{
                ...styles.card,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0px)" : "translateY(30px)"
            }}>

                {/* HEADER SECTION */}
                <div style={styles.header}>
                    <div style={styles.userSection} onClick={() => navigate("/profile")}>
                        <div style={styles.miniAvatar}>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                        <div>
                            <p style={styles.welcomeText}>Welcome back,</p>
                            <h3 style={styles.userName}>{user.userName || "User"} ❯</h3>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={styles.logoutBtn}
                        onMouseOver={(e) => e.target.style.background = "rgba(255, 82, 82, 0.2)"}
                        onMouseOut={(e) => e.target.style.background = "transparent"}
                    >
                        Logout
                    </button>
                </div>

                {/* VIRTUAL CARD SECTION */}
                <div style={styles.virtualCard}>
                    <div style={styles.cardTop}>
                        <span style={styles.bankName}>SecureBank Platinum</span>
                        <div style={styles.chip}></div>
                    </div>
                    <div style={styles.cardMid}>
                        <p style={styles.cardLabel}>Account Number</p>
                        <h2 style={styles.accNoDisplay}>
                            {user.accNo ? user.accNo.toString().replace(/\d(?=\d{4})/g, "• ") : "•••• •••• ••••"}
                        </h2>
                    </div>
                    <div style={styles.cardBottom}>
                        <span style={styles.cardHolder}>{user.name}</span>
                        <span style={styles.expiry}>EXP: 12/29</span>
                    </div>
                </div>

                {/* QUICK ACTIONS GRID */}
                <div style={styles.body}>
                    <h4 style={styles.sectionTitle}>Quick Actions</h4>
                    <div style={styles.actionGrid}>
                        <button style={styles.gridBtn} onClick={() => navigate("/balance")}>
                            <span style={styles.icon}>💰</span>
                            Check Balance
                        </button>
                        <button style={styles.gridBtn} onClick={() => navigate("/deposit")}>
                            <span style={styles.icon}>📥</span>
                            Deposit
                        </button>
                        <button style={styles.gridBtn} onClick={() => navigate("/withdraw")}>
                            <span style={styles.icon}>📤</span>
                            Withdraw
                        </button>
                        <button style={styles.gridBtn} onClick={() => navigate("/history")}>
                            <span style={styles.icon}>📜</span>
                            History
                        </button>
                    </div>
                </div>

                <footer style={styles.footer}>
                    Your session is encrypted with 256-bit SSL security
                </footer>
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
        backdropFilter: "blur(16px)",
        borderRadius: "24px",
        padding: "30px",
        width: "100%",
        maxWidth: "480px",
        color: "white",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },
    userSection: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer"
    },
    miniAvatar: {
        width: "40px",
        height: "40px",
        background: "linear-gradient(45deg, #1e88e5, #00c853)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "18px"
    },
    welcomeText: { fontSize: "12px", opacity: 0.6, margin: 0 },
    userName: { margin: 0, fontSize: "16px", fontWeight: "600" },
    logoutBtn: {
        padding: "6px 14px",
        background: "transparent",
        border: "1px solid rgba(255, 82, 82, 0.5)",
        borderRadius: "8px",
        color: "#ff5252",
        fontSize: "12px",
        cursor: "pointer",
        transition: "0.3s"
    },
    virtualCard: {
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
        marginBottom: "35px",
        position: "relative",
        overflow: "hidden"
    },
    chip: {
        width: "35px",
        height: "25px",
        background: "linear-gradient(135deg, #f6d365, #fda085)",
        borderRadius: "4px",
        opacity: 0.8
    },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" },
    bankName: { fontSize: "12px", fontWeight: "500", opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px" },
    cardMid: { marginBottom: "25px" },
    cardLabel: { fontSize: "10px", textTransform: "uppercase", opacity: 0.6, marginBottom: "5px" },
    accNoDisplay: { fontSize: "20px", letterSpacing: "3px", margin: 0, fontWeight: "600" },
    cardBottom: { display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.9, textTransform: "uppercase" },
    sectionTitle: { textAlign: "left", fontSize: "14px", opacity: 0.7, marginBottom: "15px", fontWeight: "500" },
    actionGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px"
    },
    gridBtn: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "15px",
        padding: "20px",
        color: "white",
        cursor: "pointer",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        fontWeight: "500"
    },
    icon: { fontSize: "24px" },
    footer: {
        marginTop: "30px",
        fontSize: "10px",
        opacity: 0.4,
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px"
    }
};

// Hover effect logic (inline styles don't support :hover easily, 
// so you can add this to your CSS file or use the onMouseOver pattern if needed)
// Added a basic implementation in the actionGrid buttons would involve state 
// or the onMouseOver trick used in the logout button.

export default Dashboard;