import React, { useEffect, useState } from "react";

const TransactionHistory = () => {

    const [transactions, setTransactions] = useState([]);
    const user = JSON.parse(localStorage.getItem("bankUser"));

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const response = await fetch(
                    `https://banking-backend-ltoj.onrender.com/cash/gethistory?accNo=${user.accNo}`,
                    { method: "POST" }
                );

                const data = await response.json();
                setTransactions(data);

            } catch (err) {
                console.error(err);
            }

        };

        loadHistory();

    }, [user.accNo]);

    const getTypeColor = (type) => {
        if (type === "DEPOSIT") return "#2e7d32";
        if (type === "WITHDRAW") return "#d32f2f";
        return "#333";
    };

    return (

        <div style={styles.page}>

            <div style={styles.container}>

                <h2 style={styles.title}>Transaction History</h2>

                <p style={styles.subtitle}>
                    SecureBank transaction records for your account
                </p>

                <div style={styles.tableWrapper}>

                    <table style={styles.table}>

                        <thead>

                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Time</th>
                            <th style={styles.th}>Available Balance</th>
                        </tr>

                        </thead>

                        <tbody>

                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="7" style={styles.noData}>
                                    No transactions found
                                </td>
                            </tr>
                        )}

                        {[...transactions].reverse().map((t) => (

                            <tr key={t.id} style={styles.tr}>

                                <td style={styles.td}>{t.id}</td>

                                <td style={{
                                    ...styles.td,
                                    color: getTypeColor(t.transactionType),
                                    fontWeight: "bold"
                                }}>
                                    {t.transactionType}
                                </td>

                                <td style={styles.td}>
                                    ₹ {t.TransactionAmount}
                                </td>

                                <td style={styles.td}>
                                    {t.transactionStatus}
                                </td>

                                <td style={styles.td}>
                                    {t.transactionDate}
                                </td>

                                <td style={styles.td}>
                                    {t.transactionTime}
                                </td>

                                <td style={styles.td}>
                                    ₹ {t.availableBalance}
                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <footer style={styles.footer}>
                SecureBank © 2026 | All transactions are protected with advanced banking security.
            </footer>

        </div>

    );

};

const styles = {

page:{
    minHeight:"100vh",
    background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    padding:"40px",
    fontFamily:"Arial",
    color:"white"
},

container:{
    width:"95%",
    maxWidth:"1100px",
    background:"rgba(255,255,255,0.08)",
    padding:"30px",
    borderRadius:"12px",
    backdropFilter:"blur(10px)",
    boxShadow:"0 10px 30px rgba(0,0,0,0.4)"
},

title:{
    textAlign:"center",
    marginBottom:"5px"
},

subtitle:{
    textAlign:"center",
    fontSize:"13px",
    opacity:"0.85",
    marginBottom:"25px"
},

tableWrapper:{
    overflowX:"auto",
    maxHeight:"400px",
    overflowY:"auto",
    borderRadius:"8px"
},

table:{
    width:"100%",
    borderCollapse:"collapse",
    background:"white",
    color:"black",
    borderRadius:"8px",
    overflow:"hidden"
},

th:{
    padding:"12px",
    background:"#1976d2",
    color:"white",
    textAlign:"center",
    position:"sticky",
    top:"0",
    zIndex:"1"
},

td:{
    padding:"12px",
    textAlign:"center",
    borderBottom:"1px solid #ddd",
    fontSize:"14px"
},

tr:{
    transition:"background 0.2s"
},

noData:{
    textAlign:"center",
    padding:"20px",
    fontSize:"14px"
},

footer:{
    marginTop:"30px",
    fontSize:"13px",
    opacity:"0.8"
}

};

export default TransactionHistory;