import React, {useContext} from 'react';
import {ProductsContext} from "../redux/ProductsContext.jsx";
import "../style/products.css"
import Loading from "./loader/Loading.jsx";
import {CartContext} from "../redux/CartContext.jsx";
import {toast} from "react-toastify";

const Products = () => {

    const {products} = useContext(ProductsContext);

    const {dispatch} = useContext(CartContext);

    const handleAddToCart = (product) => {
        dispatch({type: 'ADD_TO_CART', id: product.productId, product});
        toast.success("Product Added");
    };

    return (
        <>
            {products.length !== 0 && <h1>Products</h1>}
            <div className='products-container'>
                {!products ? <Loading/> : products.map(product => (
                    <div className='product-card' key={product.productId}>
                        <div className='product-img'>
                            <img src={product.productImg} alt="not found"/>
                        </div>
                        <div className='product-name'>
                            {product.productName}
                        </div>
                        <div className='product-price'>
                            $<span className='fw-semibold'>{product.productPrice}</span>
                        </div>
                        <button className='addcart-btn' onClick={() => handleAddToCart(product)}>ADD TO CART</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Products;
