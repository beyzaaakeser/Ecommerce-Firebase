import {toast} from "react-toastify";



export const CartReducer = (state, action) => {

    const { shoppingCart, totalPrice, totalQty } = state;

    let product;
    let updatedPrice;
    let updatedQty;

    switch (action.type) {

        case 'ADD_TO_CART':

            const check = shoppingCart.find(product => product.productId === action.id);
            if (!check) {
                // Ürün sepette değilse yeni ürün ekle
                product = { ...action.product, qty: 1, TotalProductPrice: action.product.productPrice };
                updatedQty = totalQty + 1;
                updatedPrice = totalPrice + product.productPrice;

                return {
                    shoppingCart: [product, ...shoppingCart],
                    totalPrice: updatedPrice,
                    totalQty: updatedQty,
                };


            } else {
                // Eğer ürün zaten sepette varsa, miktarını artır
                const updatedCart = shoppingCart.map(item =>
                    item.productId === action.id
                        ? { ...item, qty: item.qty + 1, TotalProductPrice: (item.qty + 1) * item.productPrice }
                        : item
                );
                updatedQty = totalQty + 1;
                updatedPrice = totalPrice + check.productPrice;

                return {
                    shoppingCart: updatedCart,
                    totalPrice: updatedPrice,
                    totalQty: updatedQty
                };
            }

        case 'INC':
            const incCart = shoppingCart.map(item =>
                item.productId === action.id
                    ? { ...item, qty: item.qty + 1, TotalProductPrice: (item.qty + 1) * item.productPrice }
                    : item
            );
            updatedQty = totalQty + 1;
            updatedPrice = totalPrice + action.cart.productPrice;

            return {
                shoppingCart: incCart,
                totalPrice: updatedPrice,
                totalQty: updatedQty
            };

        case 'DEC':

            const found = shoppingCart.find(item => item.productId === action.id);

            let decCart;

            if (found.qty > 1 ) {
                decCart = shoppingCart.map(item =>
                    item.productId === action.id && item.qty > 1
                        ? { ...item, qty: item.qty - 1, TotalProductPrice: (item.qty - 1) * item.productPrice }
                        : item
                );
                updatedPrice = totalPrice - action.cart.productPrice;
                updatedQty = totalQty - 1;

            }else{
                decCart = shoppingCart.filter(item => item.productId !== action.id);
                updatedPrice = totalPrice - action.cart.productPrice;
                updatedQty = totalQty - 1;
            }

            return {
                shoppingCart: decCart,
                totalPrice: updatedPrice,
                totalQty: updatedQty
            };

        case 'DELETE':
            const filteredCart = shoppingCart.filter(item => item.productId !== action.id);
            updatedQty = totalQty - action.cart.qty;
            updatedPrice = totalPrice - action.cart.qty * action.cart.productPrice;

            return {
                shoppingCart: filteredCart,
                totalPrice: updatedPrice,
                totalQty: updatedQty
            };

        case 'EMPTY':
            return {
                shoppingCart: [],
                totalPrice: 0,
                totalQty: 0
            };

        default:
            return state;
    }
};
