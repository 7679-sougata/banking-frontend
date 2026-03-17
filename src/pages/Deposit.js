import React, { useState } from "react";

const Deposit = () => {

    const user = JSON.parse(localStorage.getItem("bankUser"));

    const [amount,setAmount] = useState("");
    const [showPopup,setShowPopup] = useState(false);
    const [popupMsg,setPopupMsg] = useState("");

    const depositCash = async () => {

        if(amount === ""){
            setPopupMsg("Please enter amount");
            setShowPopup(true);
            return;
        }

        try{

            const response = await fetch("https://banking-backend-ltoj.onrender.com/cash/deposit",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    userId:user.userId,
                    accNo:user.accNo,
                    balance:Number(amount)
                })
            });

            const data = await response.text();

            setPopupMsg(data);
            setShowPopup(true);
            setAmount("");

        }catch(error){

            setPopupMsg("Server is not responding");
            setShowPopup(true);
        }
    };

    return(
        <div style={styles.page}>

            <div style={styles.card}>

                <h2>Deposit Cash</h2>

                <p style={styles.subtitle}>
                    Enter the amount you want to deposit into your account
                </p>

                <input
                    placeholder="Enter Amount"
                    value={amount}
                    autoComplete="off"
                    onChange={(e)=>{
                        const value = e.target.value;
                        if(/^\d*$/.test(value)){
                            setAmount(value);
                        }
                    }}
                    style={styles.input}
                />

                <button onClick={depositCash} style={styles.button}>
                    Deposit
                </button>

                <div style={styles.footer}>
                    <p>
                        Your money is securely deposited in your account.
                        Please verify the amount before confirming the transaction.
                    </p>
                </div>

            </div>


            {showPopup && (

                <div style={styles.popupBg}>

                    <div style={styles.popup}>

                        <h3>{popupMsg}</h3>

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

footer:{
    marginTop:"20px",
    fontSize:"12px",
    opacity:"0.8"
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
    width:"260px"
},

closeBtn:{
    marginTop:"15px",
    padding:"8px 15px",
    background:"#d32f2f",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
}

};

export default Deposit;