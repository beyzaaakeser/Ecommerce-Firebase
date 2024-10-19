import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../redux/CartContext.jsx';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/index.js';
import Navbar from '../components/Navbar.jsx';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Cashout = ({ user }) => {
  const navigate = useNavigate();
  const { shoppingCart, totalPrice, totalQty, dispatch } =
    useContext(CartContext);

  // State tanımlamaları
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cell, setCell] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'SignedUpUsersData', user.uid); // Kullanıcı verisi için referans al
        const unsubscribeUserData = onSnapshot(userRef, (snapshot) => {
          // Gerçek zamanlı güncellemeler için
          if (snapshot.exists()) {
            setName(snapshot.data().name);
            setEmail(snapshot.data().email);
          } else {
            console.error('Kullanıcı verisi mevcut değil');
          }
        });

        // Bileşen unmounted olduğunda kullanıcı veri dinleyicisini temizle
        return () => unsubscribeUserData();
      } else {
        navigate('/login');
      }
    });

    // Auth dinleyicisini temizle
    return () => unsubscribeAuth();
  }, []);

  const cashoutSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser; // Şu anki kullanıcıyı al
    if (user) {
      const date = new Date();
      const time = date.getTime();
      const docRef = doc(db, 'Buyer-info', user.uid + '_' + time); // Belge referansı oluştur

      try {
        await setDoc(docRef, {
          BuyerName: name,
          BuyerEmail: email,
          BuyerCell: cell,
          BuyerAddress: address,
          BuyerPayment: totalPrice,
          BuyerQuantity: totalQty,
        });

        // Form alanlarını sıfırla ve dispatch işlemi yap
        setCell('');
        setAddress('');
        dispatch({ type: 'EMPTY' });
        setSuccessMsg(
          'Siparişiniz başarıyla verilmiştir. 3 saniye sonra anasayfaya yönlendirileceksiniz.'
        );

        // 5 saniye sonra anasayfaya yönlendir
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <Navbar user={user} />

      <div className="container cashoutContainer">
        <h2>Cash out Details</h2>
        {successMsg && <div className="success-msg">{successMsg}</div>}
        <form
          autoComplete="off"
          className="form-group"
          onSubmit={cashoutSubmit}
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            disabled
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            disabled
          />

          <label htmlFor="Cell No">Cell No</label>
          <input
            type="number"
            className="form-control"
            required
            onChange={(e) => setCell(e.target.value)}
            value={cell}
            placeholder="Exp 03123456789"
          />

          <label htmlFor="Delivery Address">Delivery Address</label>
          <input
            type="text"
            className="form-control"
            required
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />

          <label htmlFor="Price To Pay">Price To Pay</label>
          <input
            type="number"
            className="form-control"
            required
            value={Number(totalPrice).toFixed(2)}
            disabled
          />

          <label htmlFor="Total No of Products">Total No of Products</label>
          <input
            type="number"
            className="form-control"
            required
            value={totalQty}
            disabled
          />

          <button type="submit" className="btn btn-success btn-md mybtn">
            SUBMIT
          </button>
        </form>
        {error && <span className="error-msg">{error}</span>}
      </div>
    </>
  );
};

export default Cashout;
