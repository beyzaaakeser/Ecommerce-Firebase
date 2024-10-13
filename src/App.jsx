import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import SingUp from "./pages/SingUp.jsx";
import AddProducts from "./components/AddProducts.jsx";
import {ProductsContextProvider} from "./redux/ProductsContext.jsx";
import {db, auth} from "./firebase/index.js";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from 'firebase/auth'
import {doc, getDoc} from 'firebase/firestore';
import CartContextProvider from "./redux/CartContext.jsx";
import Cart from "./pages/Cart.jsx";
import Cashout from "./pages/Cashout.jsx";

function App() {

    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User is authenticated, fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'SignedUpUsersData', currentUser.uid));
                if (userDoc.exists()) {
                    setUser({
                        uid: currentUser.uid,
                        name: userDoc.data().name
                    });
                } else {
                    console.log("No such document!");
                }
                setIsAuth(true);
            } else {
                // User is not authenticated
                setIsAuth(false);
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (

        <CartContextProvider>
            <ProductsContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home user={user}/>}/>
                        <Route path='/addproducts' element={<AddProducts/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<SingUp/>}/>
                        <Route path="/cart" element={<Cart user={user}/>}/>
                        <Route path="/cashout" element={<Cashout user={user}/>}/>

                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </ProductsContextProvider>
        </CartContextProvider>
    )
}

export default App
