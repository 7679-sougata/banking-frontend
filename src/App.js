import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Signup from './screens/SignUp';
import Login from './screens/Login';
import Dashboard from './screens/DashBoard';
import Profile from './screens/Profile';
import BalanceCheek from './pages/BalenceCheek';
import Withdraw from './pages/Withdraw';
import Deposit from './pages/Deposit';
import TransactionHistory from './pages/TransactionHistory';
function App() {
  return (
    <Router>
      <Routes>
        {/* These define which component loads for which URL */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/balance" element={<BalanceCheek />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/history" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;