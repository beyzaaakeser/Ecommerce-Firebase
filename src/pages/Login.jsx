import React, {useState} from 'react';
import {auth, db} from "../firebase/index.js";
import {Link, useNavigate} from "react-router-dom";
import "../style/login.css"
import {signInWithEmailAndPassword} from "firebase/auth";
import {toast} from "react-toastify";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const login = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast.success("Login successful")
                setEmail('');
                setPassword('');
                setError('');
                navigate('/');
            }).catch(err => toast.error(err.message));
    }

    return (
        <div className='container'>

            <div className='login-container'>

                <div className='login-img'>
                    <img src="/login.png" alt=""/>
                </div>

                <div className='login-info'>
                    <h2>Login</h2>
                    <br/>
                    <form autoComplete="off" className='form-group' onSubmit={login}>
                        <label htmlFor="email">Email</label>
                        <input type="email" className='form-control' required
                               onChange={(e) => setEmail(e.target.value)} value={email}/>
                        <br/>
                        <label htmlFor="password">Password</label>
                        <input type="password" className='form-control' required
                               onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <br/>
                        <button type="submit" className='btn btn-outline-info btn-md mybtn'>LOGIN</button>
                    </form>
                    {error && <span className='error-msg'>{error}</span>}
                    <br/>
                    <span>Don't have an account?
                        <Link to="/signup"> Register Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
};

export default Login;
