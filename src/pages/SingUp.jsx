import React, {useState} from 'react';
import { createUserWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc} from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import '../style/singup.css';
import {db, auth} from "../firebase/index.js";
import {toast} from "react-toastify";

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const signup = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password).then((cred) => {
            // Add user data to Firestore
            setDoc(doc(db, 'SignedUpUsersData', cred.user.uid), {
                name: name,
                email: email,
                password: password
            }).then(() => {
                toast.success("Your account has been created. You can log in");
                setName('');
                setEmail('');
                setPassword('');
                setError('');
                navigate("/login")
            }).catch(err => setError(err.message));
        }).catch((err) => {
            toast.error("Error " + err.message);
        });
    };

    return (
        <div className='container'>
            <div className='signup-container'>
                <div className='signup'>

                    <div className='sign-img'>
                        <img src="/register.png" alt=""/>
                    </div>


                    <div className='sign-info'>
                        <h2>Sign up</h2>
                        <br/>
                        <form autoComplete="off" className='form-group' onSubmit={signup}>
                            <label htmlFor="name">Name</label>
                            <input type="text" className='form-control' required
                                   onChange={(e) => setName(e.target.value)} value={name}/>
                            <br/>
                            <label htmlFor="email">Email</label>
                            <input type="email" className='form-control' required
                                   onChange={(e) => setEmail(e.target.value)} value={email}/>
                            <br/>
                            <label htmlFor="password">Password</label>
                            <input type="password" className='form-control' required
                                   onChange={(e) => setPassword(e.target.value)} value={password}/>
                            <br/>
                            <div className='btn-container'>
                                <button type="submit" className='btn btn-outline-success btn-md mybtn'>REGISTER</button>
                                <br/>
                                <span>Already have an account?
                                <Link to="/login"> Login Here</Link>
                            </span>
                            </div>
                        </form>
                        {error && <span className='error-msg alert alert-danger'>{error}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
