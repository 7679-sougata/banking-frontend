import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

    const [animate, setAnimate] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});

    // ✅ SIMPLE REFS (BEST)
    const featuresRef = useRef(null);
    const aboutRef = useRef(null);
    const servicesRef = useRef(null);
    const contactRef = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleSections(prev => ({
                        ...prev,
                        [entry.target.id]: true
                    }));
                }
            });
        }, { threshold: 0.2 });

        // observe all sections
        [featuresRef, aboutRef, servicesRef, contactRef, footerRef].forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>

                <div style={styles.headerTop}>
                    <h2 style={styles.logo}>SecureBank</h2>
                    <Link to="/login">
                        <button style={styles.headerBtn}>Login</button>
                    </Link>
                </div>

                <div style={styles.headerBottom}>
                    <a href="#features" style={styles.link}>Features</a>
                    <a href="#about" style={styles.link}>About</a>
                    <a href="#services" style={styles.link}>Services</a>
                    <a href="#contact" style={styles.link}>Contact</a>
                </div>

            </div>

            {/* HERO */}
            <div style={{
                ...styles.heroCard,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0px)" : "translateY(40px)"
            }}>
                <h1 style={styles.title}>Welcome to SecureBank</h1>
                <p style={styles.subtitle}>
                    Experience a smarter way to manage your finances. SecureBank provides seamless banking,
                    instant transactions, and powerful insights to help you stay in control of your money.
                </p>
                <div style={styles.buttonContainer}>
                    <Link to="/login"><button style={styles.loginBtn}>Login</button></Link>
                    <Link to="/signup"><button style={styles.signupBtn}>Create Account</button></Link>
                </div>
            </div>

            {/* FEATURES */}
            <div id="features" ref={featuresRef}
                style={{ ...styles.section, ...getAnim(visibleSections.features) }}>
                <h2 style={styles.sectionTitle}>Powerful Features</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>🔒 Advanced Security Protection</div>
                    <div style={styles.card}>⚡ Lightning Fast Transfers</div>
                    <div style={styles.card}>📊 Smart Financial Insights</div>
                    <div style={styles.card}>🌐 24/7 Online Access</div>
                </div>
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3"
                    style={styles.image}
                    alt="Secure banking dashboard" />
            </div>

            {/* ABOUT */}
            <div id="about" ref={aboutRef}
                style={{ ...styles.section, ...getAnim(visibleSections.about) }}>
                <h2 style={styles.sectionTitle}>About SecureBank</h2>
                <p style={styles.text}>
                    SecureBank is built with a mission to simplify digital banking for everyone.
                </p>
                <p style={styles.text}>
                    Our platform ensures complete data protection and transparency.
                </p>
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                    style={styles.image}
                    alt="Digital banking experience" />
            </div>

            {/* SERVICES */}
            <div id="services" ref={servicesRef}
                style={{ ...styles.section, ...getAnim(visibleSections.services) }}>
                <h2 style={styles.sectionTitle}>Our Services</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>💳 Account Management</div>
                    <div style={styles.card}>📈 Transaction History</div>
                    <div style={styles.card}>💸 Instant Payments</div>
                    <div style={styles.card}>🔔 Notifications</div>
                </div>
                <img src="https://thumbs.dreamstime.com/b/professional-suit-safeguards-digital-banking-protective-shield-ensuring-secure-online-transactions-investments-383435264.jpg"
                    style={styles.image}
                    alt="Secure online transaction protection" />
            </div>

            {/* CONTACT */}
            <div id="contact" ref={contactRef}
                style={{ ...styles.section, ...getAnim(visibleSections.contact) }}>
                <h2 style={styles.sectionTitle}>Contact Us</h2>
                <p style={styles.text}>📧 Email: fullstack7679@gmail.com</p>
                <p style={styles.text}>📞 Phone: 9883373000</p>
            </div>

            {/* FOOTER */}
            <div id="footer" ref={footerRef}
                style={{ ...styles.footer, ...getAnim(visibleSections.footer) }}>
                <h3>SecureBank</h3>
                <p>Your trusted digital banking partner.</p>
                <p>📧 fullstack7679@gmail.com | 📞 9883373000</p>
                <p style={{ marginTop: "10px", fontSize: "12px", color: "#aaa" }}>
                    © 2026 SecureBank. All rights reserved.
                </p>
            </div>

        </div>
    );
};

const getAnim = (visible) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(50px)",
    transition: "all 0.6s ease"
});

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "Segoe UI, sans-serif",
        padding: "20px",
        scrollBehavior: "smooth"
    },

    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#111827",
        padding: "12px 15px",
        marginBottom: "20px"
    },

    headerTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    headerBottom: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
        marginTop: "8px"
    },

    logo: {
        color: "white",
        fontWeight: "700"
    },

    link: {
        color: "#e5e7eb",
        textDecoration: "none",
        fontSize: "13px"
    },

    headerBtn: {
        padding: "6px 14px",
        background: "#2563eb",
        border: "none",
        borderRadius: "20px",
        color: "white"
    },

    heroCard: {
        margin: "0 auto 60px",
        padding: "40px",
        background: "#1f2937",
        borderRadius: "18px",
        textAlign: "center",
        color: "white"
    },

    title: { fontSize: "32px" },
    subtitle: { margin: "20px 0" },

    buttonContainer: {
        display: "flex",
        gap: "15px",
        justifyContent: "center",
        flexWrap: "wrap"
    },

    loginBtn: {
        padding: "10px 20px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "20px"
    },

    signupBtn: {
        padding: "10px 20px",
        border: "2px solid #22c55e",
        color: "#22c55e",
        background: "transparent",
        borderRadius: "20px"
    },

    section: {
        maxWidth: "900px",
        margin: "60px auto",
        textAlign: "center",
        color: "white",
        padding: "0 10px",
        scrollMarginTop: "130px"
    },

    sectionTitle: {
        marginBottom: "20px"
    },

    grid: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center"
    },

    card: {
        padding: "20px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "10px",
        minWidth: "200px"
    },

    text: {
        opacity: 0.85,
        marginBottom: "10px"
    },

    image: {
        width: "100%",
        marginTop: "20px",
        borderRadius: "10px"
    },

    footer: {
        textAlign: "center",
        color: "#ccc",
        marginTop: "80px"
    }
};

export default Home;