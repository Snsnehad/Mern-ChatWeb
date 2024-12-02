import { useState } from 'react'
import './index.css'
import Login from './pages/login/Login';
import  Signup  from './pages/signup/Signup';
import Home from './pages/home/Home';
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
function App() {
  const {authUser} = useAuthContext();
  console.log(authUser);
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser? <Home /> : <Navigate to ="/login" />} />
        <Route path="/login" element={authUser? <Navigate to ="/" /> : <Login />} />
        <Route path="/signup" element={authUser? <Navigate to ="/" /> : <Signup />} />
      </Routes>
    </div>
  );
}

export default App
