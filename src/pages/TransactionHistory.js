import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import it as a function

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const user = JSON.parse(localStorage.getItem("bankUser"));
    const navigate = useNavigate();

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

    // PDF Generation Logic
    const downloadPDF = () => {
    // 1. Create the doc instance
    const doc = new jsPDF();

    // 2. Add Bank Header
    doc.setFontSize(22);
    doc.setTextColor(30, 136, 229); // Professional Blue
    doc.text("SECUREBANK", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Official Transaction Statement", 14, 28);

    // 3. Add User Info (Using Optional Chaining to prevent crashes)
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Account Holder: ${user?.userName || "N/A"}`, 14, 40);
    doc.text(`Account Number: ${user?.accNo || "N/A"}`, 14, 46);
    doc.text(`Statement Date: ${new Date().toLocaleDateString()}`, 14, 52);

    // 4. Prepare Table Data
    const tableColumn = ["ID", "Type", "Amount", "Status", "Date", "Time", "Balance"];
    
    // We reverse it so newest transactions are at the top of the PDF
    const tableRows = [...transactions].reverse().map(t => [
        t.id,
        t.transactionType,
        `INR ${t.TransactionAmount}`,
        t.transactionStatus,
        t.transactionDate,
        t.transactionTime,
        `INR ${t.availableBalance}`
    ]);

    // 5. CALL THE FUNCTION DIRECTLY
    // This is the most reliable way to fix "autoTable is not a function"
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60, // Start after the header info
        theme: 'grid',
        headStyles: { 
            fillColor: [30, 136, 229], 
            halign: 'center',
            fontSize: 10 
        },
        columnStyles: {
            2: { fontStyle: 'bold' }, // Bold the Amount column
            6: { fontStyle: 'bold' }  // Bold the Balance column
        },
        styles: { 
            fontSize: 9, 
            halign: 'center',
            valign: 'middle' 
        },
        margin: { top: 20 }
    });

    // 6. Save the PDF
    doc.save(`Statement_${user?.accNo || "User"}.pdf`);
};

    const getTypeColor = (type) => {
        if (type === "DEPOSIT") return "#2e7d32";
        if (type === "WITHDRAW") return "#d32f2f";
        return "#333";
    };

    return (
        <div style={styles.page}>
            <button 
                onClick={() => navigate(-1)} 
                style={styles.backButton}
            >
                ← Back
            </button>

            <div style={styles.container}>
                <div style={styles.headerRow}>
                    <div style={{ textAlign: 'left' }}>
                        <h2 style={styles.title}>Transaction History</h2>
                        <p style={styles.subtitle}>SecureBank records for your account</p>
                    </div>
                    
                    {/* New Download Button */}
                    <button onClick={downloadPDF} style={styles.downloadBtn}>
                        📥 Download PDF
                    </button>
                </div>

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
                                <th style={styles.th}>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={styles.noData}>No transactions found</td>
                                </tr>
                            )}
                            {[...transactions].reverse().map((t) => (
                                <tr key={t.id} style={styles.tr}>
                                    <td style={styles.td}>{t.id}</td>
                                    <td style={{ ...styles.td, color: getTypeColor(t.transactionType), fontWeight: "bold" }}>
                                        {t.transactionType}
                                    </td>
                                    <td style={styles.td}>₹ {t.TransactionAmount}</td>
                                    <td style={styles.td}>{t.transactionStatus}</td>
                                    <td style={styles.td}>{t.transactionDate}</td>
                                    <td style={styles.td}>{t.transactionTime}</td>
                                    <td style={styles.td}>₹ {t.availableBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <footer style={styles.footer}>
                SecureBank © 2026 | Encrypted Transaction Statement
            </footer>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        fontFamily: "'Segoe UI', sans-serif",
        color: "white",
        position: "relative"
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "15px"
    },
    downloadBtn: {
        background: "#00c853",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "0.3s",
        boxShadow: "0 4px 15px rgba(0, 200, 83, 0.3)"
    },
    backButton: {
        position: "absolute", top: "20px", left: "20px",
        background: "rgba(255,255,255,0.1)", color: "white",
        border: "1px solid rgba(255,255,255,0.2)", padding: "8px 15px",
        borderRadius: "8px", cursor: "pointer", fontSize: "14px", backdropFilter: "blur(5px)"
    },
    container: {
        width: "95%", maxWidth: "1100px",
        background: "rgba(255,255,255,0.08)", padding: "30px",
        borderRadius: "16px", backdropFilter: "blur(12px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)", marginTop: "40px"
    },
    title: { margin: "0", fontWeight: "600" },
    subtitle: { fontSize: "13px", opacity: "0.85", margin: "5px 0 0" },
    tableWrapper: { overflowX: "auto", maxHeight: "500px", borderRadius: "8px" },
    table: { width: "100%", borderCollapse: "collapse", background: "rgba(255, 255, 255, 0.95)", color: "#333" },
    th: { padding: "15px", background: "#1e88e5", color: "white", position: "sticky", top: "0", zIndex: "1" },
    td: { padding: "12px", textAlign: "center", borderBottom: "1px solid #eee", fontSize: "14px" },
    footer: { marginTop: "auto", paddingTop: "30px", fontSize: "12px", opacity: "0.7", textAlign: "center" }
};

export default TransactionHistory;