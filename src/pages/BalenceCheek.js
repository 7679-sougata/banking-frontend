import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BalanceCheek = () => {

    const user = JSON.parse(localStorage.getItem("bankUser"));

    const [pin,setPin] = useState("");
    const [balance,setBalance] = useState(null);
    const [showError,setShowError] = useState(false);
    const [errorMsg,setErrorMsg] = useState("");

    const navigate = useNavigate();

    const checkBalance = async () => {

        try{

            // 1️⃣ check if pin already set
            const pinCheck = await fetch(
                `https://banking-backend-ltoj.onrender.com/pin/issetpin?userId=${user.userId}`
            );

            const isPinSet = await pinCheck.json();

            if(!isPinSet){
                setErrorMsg("PIN not set. Please go to Profile and set your PIN first.");
                setShowError(true);
                return;
            }

            // 2️⃣ call balance API
            const response = await fetch("https://banking-backend-ltoj.onrender.com/cash/cheekbalance",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    userId:user.userId,
                    accNo:user.accNo,
                    transactionPin:Number(pin)
                })
            });

            const data = await response.json();

            if(data === -1){
                setErrorMsg("Wrong PIN or Server Error");
                setShowError(true);
                setBalance(null);
            }else{
                setBalance(data);
            }

        }catch(error){
            console.log(error);
            setErrorMsg("Server is not responding");
            setShowError(true);
            setBalance(null);
        }
    };

    return(
        <div style={styles.page}>

            <div style={styles.card}>

                <h2>Check Balance</h2>

                <p style={styles.subtitle}>
                    Enter your transaction PIN to view account balance
                </p>

                <input
                    type="password"
                    placeholder="Enter Transaction PIN"
                    value={pin}
                    onChange={(e)=>setPin(e.target.value)}
                    style={styles.input}
                />

                <button onClick={checkBalance} style={styles.button}>
                    Check Balance
                </button>

                {balance !== null &&
                    <h3 style={styles.balance}>
                        Balance : ₹ {balance}
                    </h3>
                }

            </div>


            {showError && (

                <div style={styles.popupBg}>

                    <div style={styles.popup}>

                        <h3 style={{color:"#d32f2f"}}>
                            {errorMsg}
                        </h3>

                        {errorMsg.includes("PIN not set") && (

                            <button
                                style={styles.profileBtn}
                                onClick={()=>navigate("/profile")}
                            >
                                Go To Profile
                            </button>

                        )}

                        <button
                            style={styles.closeBtn}
                            onClick={()=>setShowError(false)}
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

page:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    fontFamily:"Arial"
},

card:{
    background:"rgba(255,255,255,0.08)",
    padding:"40px",
    borderRadius:"12px",
    textAlign:"center",
    color:"white",
    backdropFilter:"blur(10px)",
    boxShadow:"0 10px 30px rgba(0,0,0,0.4)",
    width:"320px"
},

subtitle:{
    fontSize:"13px",
    marginBottom:"20px",
    opacity:"0.8"
},

input:{
    width:"100%",
    padding:"12px",
    borderRadius:"6px",
    border:"none",
    outline:"none",
    marginBottom:"15px",
    boxSizing:"border-box"
},

button:{
    width:"100%",
    padding:"12px",
    background:"#1e88e5",
    border:"none",
    borderRadius:"6px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer",
    boxSizing:"border-box"
},


balance:{
    marginTop:"20px",
    color:"#00e676"
},

popupBg:{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.6)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
},

popup:{
    background:"white",
    padding:"30px",
    borderRadius:"10px",
    textAlign:"center",
    width:"280px"
},

closeBtn:{
    marginTop:"15px",
    padding:"8px 15px",
    background:"#d32f2f",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
},

profileBtn:{
    marginTop:"10px",
    padding:"8px 15px",
    background:"#1e88e5",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer",
    display:"block",
    width:"100%"
}

};

export default BalanceCheek;