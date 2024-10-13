import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar.jsx";
import Products from "../components/Products.jsx";
import "../style/home.css"
import {useNavigate} from "react-router-dom";
import {auth} from "../firebase/index.js";

const Home = ({user}) => {

    const navigate = useNavigate();

    useEffect(() => {
        // forcing user to signup
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/login');
            }
        })

        return () => unsubscribe();
    })

    return (
        <div className="wrapper">
            <Navbar user={user}/>
            <Products/>
        </div>
    );
};

export default Home;

