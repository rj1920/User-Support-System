import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { AuthProvider } from "./components/Authprovider";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Support from "./components/Support";
import Admin from "./components/Admin";


export default function App() {


  return (
    <AuthProvider>
    <>
    <Navbar/>
    <Routes>
      <Route exact path="/" element= {<Login/>}/>
      <Route exact path="/dashboard" element= {<Dashboard/>}/>
      <Route exact path="/signup" element = {<Signup/>}/>
      <Route exact path="/support" element = {<Support/>}/>
      <Route exact path="/admin" element = {<Admin/>}/>
    </Routes>
    </>
    </AuthProvider>
  )
}