import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Withdraw = () => {

    const user = JSON.parse(localStorage.getItem("bankUser"));

    const [pin,setPin] = useState("");
    const [amount,setAmount] = useState("");
    const [showPopup,setShowPopup] = useState(false);
    const [popupMsg,setPopupMsg] = useState("");

    const navigate = useNavigate();

    const withdrawCash = async () => {

        try{

            // 1️⃣ check if pin is set
            const pinCheck = await fetch(
                `http://localhost:8088/pin/issetpin?userId=${user.userId}`
            );

            const isPinSet = await pinCheck.json();

            if(!isPinSet){
                setPopupMsg("PIN not set. Please go to Profile and set your PIN first.");
                setShowPopup(true);
                return;
            }

            // 2️⃣ withdraw api
            const response = await fetch("http://localhost:8088/cash/withdraw",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    userId:user.userId,
                    accNo:user.accNo,
                    transactionPin:Number(pin),
                    cash:Number(amount)
                })
            });

            const data = await response.text();

            setPopupMsg(data);
            setShowPopup(true);

        }catch(error){

            console.log(error);

            setPopupMsg("Server is not responding");
            setShowPopup(true);
        }
    };

    return(
        <div style={styles.page}>

            <div style={styles.card}>

                <h2>Withdraw Cash</h2>

                <p style={styles.subtitle}>
                    Enter amount and transaction PIN to withdraw money
                </p>

                <input
                    type="number"
                    placeholder="Enter Amount"
                    autoComplete="off"
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="number"
                    placeholder="Enter Transaction PIN"
                    value={pin}
                    autoComplete="off"
                    onChange={(e)=>setPin(e.target.value)}
                    style={styles.input}
                />

                <button onClick={withdrawCash} style={styles.button}>
                    Withdraw
                </button>

            </div>


            {showPopup && (

                <div style={styles.popupBg}>

                    <div style={styles.popup}>

                        <h3 style={{color:"#d32f2f"}}>
                            {popupMsg}
                        </h3>

                        {popupMsg.includes("PIN not set") && (

                            <button
                                style={styles.profileBtn}
                                onClick={()=>navigate("/profile")}
                            >
                                Go To Profile
                            </button>

                        )}

                        <button
                            style={styles.closeBtn}
                            onClick={()=>setShowPopup(false)}
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
    boxSizing:"border-box"   // important
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
    boxSizing:"border-box"   // important
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

export default Withdraw;