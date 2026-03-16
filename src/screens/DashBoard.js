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

    if (!user) return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;

    return (
        <div style={styles.page}>
            <div style={{
                ...styles.card,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0px)" : "translateY(40px)"
            }}>

                {/* HEADER */}
                <div style={styles.header}>
                    <h3
                        style={{...styles.userName, cursor:"pointer"}}
                        onClick={() => navigate("/profile")}>
                        👤 {user.userName}
                    </h3>
                    <button
                        onClick={handleLogout}
                        style={styles.logoutBtn}
                        onMouseOver={(e) => e.target.style.background = "#c62828"}
                        onMouseOut={(e) => e.target.style.background = "#e53935"}
                    >
                        Logout
                    </button>
                </div>

                {/* BODY */}
                <div style={styles.body}>
                    <h2 style={styles.title}>Account Overview</h2>

                    <div style={styles.accountBox}>
                        <p style={styles.label}>Account Number</p>
                        <p style={styles.accNo}>{user.accNo}</p>
                    </div>

                    <div style={styles.actions}>

                        <button
                            style={styles.actionBtn}
                            onClick={() => navigate("/balance")}
                        >
                            Check Balance
                        </button>

                        <button
                            style={styles.actionBtn}
                            onClick={() => navigate("/withdraw")}
                        >
                            Withdraw
                        </button>

                        <button
                            style={styles.actionBtn}
                            onClick={() => navigate("/deposit")}
                        >
                            Deposit
                        </button>

                        <button
                            style={styles.actionBtn}
                            onClick={() => navigate("/history")}
                        >
                            Transaction History
                        </button>

                    </div>


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
    card: {
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        padding: "30px",
        width: "100%",
        maxWidth: "550px",
        color: "white",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        transition: "all 0.6s ease"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },
    userName: {
        margin: 0,
        fontWeight: "500",
        fontSize: "18px"
    },
    logoutBtn: {
        padding: "8px 18px",
        background: "#e53935",
        border: "none",
        borderRadius: "20px",
        color: "white",
        fontSize: "14px",
        cursor: "pointer",
        transition: "0.3s"
    },
    body: {
        textAlign: "center"
    },
    title: {
        marginBottom: "25px",
        fontWeight: "600",
        letterSpacing: "1px"
    },
    accountBox: {
        marginBottom: "25px"
    },
    label: {
        fontSize: "14px",
        opacity: 0.7,
        marginBottom: "6px"
    },
    accNo: {
        fontSize: "24px",  // Bigger account number
        fontWeight: "700",
        letterSpacing: "2px",
        margin: 0
    },
    actions:{
    display:"flex",
    justifyContent:"space-between",
    marginTop:"30px",
    gap:"10px"
},

actionBtn:{
    flex:1,
    padding:"12px",
    borderRadius:"10px",
    border:"none",
    cursor:"pointer",
    background:"#2196f3",
    color:"white",
    fontSize:"15px",
    transition:"0.3s"
}
};

export default Dashboard;