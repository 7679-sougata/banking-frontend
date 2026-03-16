import React, { useState } from "react";
import axios from "axios";

const Profile = () => {

    const user = JSON.parse(localStorage.getItem("bankUser"));

    const [showPopup, setShowPopup] = useState(false);
    // const [pinAlreadySet, setPinAlreadySet] = useState(false);
    const [, setPinAlreadySet] = useState(false);

    const [atmPin, setAtmPin] = useState("");
    const [transactionPin, setTransactionPin] = useState("");

    const [step, setStep] = useState("select");   // select | otp | newpin | setpin
    const [changeType, setChangeType] = useState(""); // atm | trans

    const [otp, setOtp] = useState("");
    const [newPin, setNewPin] = useState("");
    const [message, setMessage] = useState("");



    const checkPinStatus = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8088/pin/issetpin?userId=${user.userId}`
            );

            setPinAlreadySet(res.data);

            if(res.data){
                setStep("select");
            }else{
                setStep("setpin");
            }

            setShowPopup(true);

        } catch {
            setMessage("Error checking pin status");
        }
    };



    const savePin = async () => {

        const data = {
            userId: user.userId,
            atmPin: atmPin,
            transactionPin: transactionPin
        };

        try {

            await axios.post("http://localhost:8088/pin/savepin", data);

            setMessage("PIN saved successfully");

        } catch {
            setMessage("Error saving pin");
        }
    };



    const changeTransactionPin = async () => {

        try {

            await axios.get(
                `http://localhost:8088/otp/sendotp`,
                {
                    params:{
                        userId:user.userId,
                        email:user.email
                    }
                }
            );

            setChangeType("trans");
            setStep("otp");

        } catch {
            setMessage("Failed to send OTP");
        }
    };



    const changeAtmPin = async () => {

        try {

            await axios.get(
                `http://localhost:8088/otp/sendotp`,
                {
                    params:{
                        userId:user.userId,
                        email:user.email
                    }
                }
            );

            setChangeType("atm");
            setStep("otp");

        } catch {
            setMessage("Failed to send OTP");
        }
    };



    const verifyOtp = async () => {

        try {

            const res = await axios.get(
                `http://localhost:8088/otp/verifyotp`,
                {
                    params:{
                        userId:user.userId,
                        otp:otp
                    }
                }
            );

            if(res.data === "Success"){
                setStep("newpin");
                setMessage("");
            }else{
                setMessage("Invalid OTP");
            }

        } catch {
            setMessage("OTP verification failed");
        }

    };



    const submitNewPin = async () => {

        try {

            let url = "";
            let params = {};

            if(changeType === "trans"){
                url = "http://localhost:8088/pin/changetranspin";
                params = {userId:user.userId, transPin:newPin};
            }else{
                url = "http://localhost:8088/pin/changeatmpin";
                params = {userId:user.userId, atmPin:newPin};
            }

            const res = await axios.post(url,null,{params});

            if(res.data === "success" || res.data === "Success"){

                alert("PIN updated successfully");

                setShowPopup(false);     // close popup
                setStep("select");       // reset step
                setNewPin("");
                setOtp("");

            }

        } catch {
            setMessage("Failed to update PIN");
        }

    };



    return (
        <div style={styles.page}>

            <div style={styles.card}>

                <h2 style={styles.title}>User Profile</h2>

                <p style={styles.subtitle}>
                    Secure your account by setting your ATM PIN and Transaction PIN.
                </p>

                <button
                    style={styles.btn}
                    onClick={checkPinStatus}
                >
                    Set PIN
                </button>

            </div>


            {showPopup && (

                <div style={styles.popupBg}>

                    <div style={styles.popup}>


                        {step === "setpin" && (

                            <>
                                <h3 style={styles.popupTitle}>
                                    Set ATM & Transaction PIN
                                </h3>

                                <input
                                    type="password"
                                    placeholder="Enter ATM Pin (4 Digit)"
                                    value={atmPin}
                                    onChange={(e) => setAtmPin(e.target.value)}
                                    style={styles.input}
                                />

                                <input
                                    type="password"
                                    placeholder="Enter Transaction Pin (4 Digit)"
                                    value={transactionPin}
                                    onChange={(e) => setTransactionPin(e.target.value)}
                                    style={styles.input}
                                />

                                <div style={styles.btnRow}>
                                    <button style={styles.saveBtn} onClick={savePin}>
                                        Save PIN
                                    </button>

                                    <button
                                        style={styles.cancelBtn}
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}



                        {step === "select" && (

                            <>
                                <h3 style={styles.popupTitle}>
                                    PIN Already Set
                                </h3>

                                <p style={styles.popupText}>
                                    Choose what you want to change
                                </p>

                                <div style={styles.btnRow}>
                                    <button
                                        style={styles.saveBtn}
                                        onClick={changeTransactionPin}
                                    >
                                        Change Transaction PIN
                                    </button>
                                </div>

                                <div style={styles.btnRow}>
                                    <button
                                        style={styles.saveBtn}
                                        onClick={changeAtmPin}
                                    >
                                        Change ATM PIN
                                    </button>
                                </div>

                                <div style={styles.btnRow}>
                                    <button
                                        style={styles.cancelBtn}
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        )}



                        {step === "otp" && (

                            <>
                                <h3 style={styles.popupTitle}>OTP Verification</h3>

                                <p style={styles.popupText}>
                                    Enter the OTP sent to your email
                                </p>

                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e)=>setOtp(e.target.value)}
                                    style={styles.input}
                                />

                                <div style={styles.btnRow}>
                                    <button
                                        style={styles.saveBtn}
                                        onClick={verifyOtp}
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </>
                        )}



                        {step === "newpin" && (

                            <>
                                <h3 style={styles.popupTitle}>Enter New PIN</h3>

                                <input
                                    type="password"
                                    placeholder="Enter New PIN"
                                    value={newPin}
                                    onChange={(e)=>setNewPin(e.target.value)}
                                    style={styles.input}
                                />

                                <div style={styles.btnRow}>
                                    <button
                                        style={styles.saveBtn}
                                        onClick={submitNewPin}
                                    >
                                        Update PIN
                                    </button>
                                </div>
                            </>
                        )}



                        {message && (
                            <p style={{marginTop:"10px",color:"red"}}>
                                {message}
                            </p>
                        )}

                    </div>

                </div>

            )}

            <footer style={styles.footer}>
                © 2026 SecureBank. Your security is our priority.
            </footer>

        </div>
    );
};



const styles = {

page:{
    height:"100vh",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    color:"white",
    fontFamily:"Arial"
},

card:{
    padding:"45px",
    background:"rgba(255,255,255,0.08)",
    borderRadius:"12px",
    textAlign:"center",
    backdropFilter:"blur(10px)",
    boxShadow:"0 8px 25px rgba(0,0,0,0.3)"
},

title:{
    marginBottom:"10px"
},

subtitle:{
    fontSize:"14px",
    opacity:"0.85",
    marginBottom:"25px"
},

btn:{
    padding:"12px 25px",
    background:"#00c853",
    border:"none",
    color:"white",
    borderRadius:"6px",
    cursor:"pointer",
    fontSize:"15px",
    fontWeight:"bold"
},

popupBg:{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.65)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
},

popup:{
    background:"white",
    color:"black",
    padding:"30px",
    borderRadius:"10px",
    width:"320px",
    textAlign:"center",
    boxShadow:"0 10px 30px rgba(0,0,0,0.3)"
},

popupTitle:{
    marginBottom:"8px"
},

popupText:{
    fontSize:"13px",
    marginBottom:"15px",
    color:"#555"
},

input:{
    width:"100%",
    padding:"10px",
    margin:"10px 0",
    borderRadius:"5px",
    border:"1px solid #ccc",
    outline:"none"
},

btnRow:{
    marginTop:"10px"
},

saveBtn:{
    padding:"9px 16px",
    background:"#2e7d32",
    color:"white",
    border:"none",
    marginRight:"10px",
    borderRadius:"5px",
    cursor:"pointer"
},

cancelBtn:{
    padding:"9px 16px",
    background:"#d32f2f",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
},

footer:{
    position:"absolute",
    bottom:"15px",
    fontSize:"12px",
    opacity:"0.8"
}

};

export default Profile;