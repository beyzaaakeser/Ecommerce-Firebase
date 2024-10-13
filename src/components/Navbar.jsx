import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {TiShoppingCart} from "react-icons/ti";
import {LuLogOut} from "react-icons/lu";
import {CartContext} from "../redux/CartContext.jsx";
import {auth} from "../firebase/index.js";

const Navbar = ({user}) => {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)

    const {totalQty} = useContext(CartContext);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        })
    }

    return (
        <div className="navbox">
            <div className='leftside'>
                <Link to='/'>
                    <img width={50} src="/ecommerce.svg" alt=""/>
                </Link>
            </div>
            {
                !user && <div className='rightside d-flex gap-3'>
                    <Link to="/signup" className='navlinks'>SING UP</Link>
                    <Link to="/login" className='navlinks'>LOGIN</Link>
                </div>
            }

            {
                user && <div className='rightside position-relative d-flex gap-3'>
                    <div className='d-flex gap-2 align-items-center'>

                        <div onClick={() => setIsOpen(!isOpen)}
                             className='p-2 cursor-pointer bg-secondary bg-opacity-25 rounded-circle '>
                            <img width={25} src="/user.svg" alt=""/>
                        </div>
                    </div>

                    {
                        isOpen && <div
                            className='d-flex rounded position-absolute top-0 end-100 bg-secondary py-1 px-2 bg-opacity-10 flex-column gap-2'>
                            <div
                                className='border-bottom px-2 py-1 text-capitalize fw-semibold text-primary text-center'>{user.name}</div>
                            <Link to={"/cart"} className='d-flex position-relative px-2 py-1 gap-2'>
                                <span
                                    className='position-absolute top-0 start-0 translate-middle badge text-success rounded-pill bg-success-subtle'>{totalQty ? totalQty : ""}</span>
                                <TiShoppingCart className='text-success' size={24}/> <span>Basket</span>
                            </Link>
                            <div onClick={handleLogout} className='d-flex cursor-pointer px-2 py-1 gap-2'>
                                <LuLogOut className='text-danger' size={20}/> <span>Logout</span>
                            </div>
                        </div>
                    }

                </div>
            }


        </div>
    );
};

export default Navbar;
