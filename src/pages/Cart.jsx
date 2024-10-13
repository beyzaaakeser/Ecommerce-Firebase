import React, {useContext, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../firebase/index.js";
import {CartContext} from "../redux/CartContext.jsx";
import {IoAdd, IoRemove, IoTrashOutline} from "react-icons/io5";
import Navbar from "../components/Navbar.jsx";
import "../style/cart.css"

const Cart = ({user}) => {

    const {shoppingCart, dispatch, totalPrice, totalQty} = useContext(CartContext);

    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/login');
            }
        })
    })

    return (
        <>
            <Navbar user={user}/>
            <>
                {shoppingCart.length !== 0 && <h1>Cart</h1>}
                <div className='cart-container'>
                    {
                        shoppingCart.length === 0 && <>
                            <div>no items in your cart or slow internet causing trouble (Refresh the page) or you are not
                                logged in
                            </div>
                            <div><Link to="/">Return to Home page</Link></div>
                        </>
                    }
                    {shoppingCart && shoppingCart.map(cart => (
                        <div className='cart-card' key={cart.productId}>

                            <div className='cart-img rounded overflow-hidden'>
                                <img src={cart.productImg} alt="not found"/>
                            </div>

                            <div className='cart-name text-capitalize'>{cart.productName}</div>

                            <div className='cart-price-orignal'>${cart.productPrice.toFixed(2)}</div>

                            <div className='inc' onClick={() => dispatch({type: 'INC', id: cart.productId, cart})}>
                                <IoAdd size={24} color={"blue"}/>
                            </div>

                            <div className='quantity'>{cart.qty}</div>

                            <div className='dec' onClick={() => dispatch({type: 'DEC', id: cart.productId, cart})}>
                                <IoRemove size={24} color={"red"}/>
                            </div>

                            <div className='cart-price'>
                                ${cart.TotalProductPrice.toFixed(2)}
                            </div>

                            <button className='delete-btn'
                                    onClick={() => dispatch({type: 'DELETE', id: cart.productId, cart})}>
                                <IoTrashOutline size={24}/>
                            </button>
                        </div>
                    ))
                    }
                    {shoppingCart.length > 0 && <div className='cart-summary'>
                        <div className='cart-summary-heading mb-2'>
                            Cart-Summary
                        </div>
                        <div className='cart-summary-price'>
                            <span>Total Price</span>
                            <span>${Number(totalPrice).toFixed(2)}</span>
                        </div>
                        <div className='cart-summary-price'>
                            <span>Total Qty</span>
                            <span>{totalQty}</span>
                        </div>

                        {shoppingCart.length !== 0 && <Link to='/cashout' className='cashout-link'>
                            <button className='btn btn-success btn-md mt-3 w-100' >
                                Cash on delivery
                            </button>
                        </Link>}

                    </div>}
                </div>
            </>
        </>
    );
};

export default Cart;
