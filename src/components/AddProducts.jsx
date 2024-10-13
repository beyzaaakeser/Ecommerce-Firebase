import React, {useState} from 'react';
import {FaImage} from "react-icons/fa";
import {db, storage} from "../firebase/index.js";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {collection, addDoc} from "firebase/firestore";
import Loading from "./loader/Loading.jsx";
import {Link} from "react-router-dom";
import {FaArrowRightToBracket} from "react-icons/fa6"; // Firestore işlemleri için importlar

const AddProducts = () => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState('');
    const [productImg, setProductImg] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState()

    const productImgHandler = (e) => {
        let selectedFile = e.target.files[0];

        if (selectedFile && selectedFile.type.startsWith("image")) {
            setProductImg(selectedFile);
            setError('');
        } else {
            setProductImg(null);
            setError("Please upload an image file");
        }
    }

    const addProducts = async (e) => {
        e.preventDefault();

        if (!productImg) {
            setError("No image file selected");
            return;
        }

        const storageRef = ref(storage, `product-images/${productImg.name}`);
        const uploadTask = uploadBytesResumable(storageRef, productImg);

        setIsLoading(true)
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        }, error => {
            setError(error.message);
        }, async () => {
            try {
                const url = await getDownloadURL(storageRef);

                // Firestore veritabanına ürün ekleme işlemi
                await addDoc(collection(db, "products"), {
                    productName: productName,
                    productPrice: Number(productPrice),
                    productImg: url,
                });

                setProductName('');
                setProductPrice("");
                setProductImg(null);
                setError('');
                document.getElementById("product-file").value = '';

                setIsLoading(false)

            } catch (err) {
                setError(err.message);
            }
        });

        e.target.reset();
    }

    return (
        <div className="container add-products-wrapper p-3">

            <div className="add-products">
                <h2 className='mt-3 text-center'>ADD PRODUCTS</h2>
                <hr/>
                <form className="form-group d-flex flex-column mt-5 mb-3 gap-4" autoComplete="off" onSubmit={addProducts}>
                    <div className="d-flex flex-column justify-content-center">
                        <label htmlFor="product-name">Product Name</label>
                        <input type="text"
                               onChange={(e) => setProductName(e.target.value)}
                               value={productName}
                               className="form-control" id="product-name" required/>
                    </div>

                    <div className="d-flex flex-column justify-content-center">
                        <label htmlFor="product-price">Product Price</label>
                        <input type="number"
                               onChange={(e) => setProductPrice(e.target.value)}
                               value={productPrice}
                               className="form-control" id="product-price" required/>
                    </div>

                    <div className="d-flex flex-column mt-md-2 h-100 flex-md-row gap-4 gap-md-3 ">

                        <div className="d-flex product-file flex-column justify-content-center ">
                            <label htmlFor="product-file"
                                   className='border-1 border h-100  rounded p-3 p-md-1 d-flex align-items-center justify-content-center align-middle cursor-pointer gap-2 fs-6'>
                                <FaImage size={24}/> Product Image
                            </label>
                            <input hidden={true} onChange={productImgHandler} id='product-file' type="file"/>
                        </div>

                        <button
                            className='add-button btn btn-success gap-2 d-flex align-items-center justify-content-center btn-sm '
                            disabled={isLoading}
                        >
                            {
                                isLoading && <Loading desingh={"spinner-border-sm"}/>
                            }
                            ADD
                        </button>
                    </div>


                </form>

                <div className='d-flex text-black fw-semibold justify-content-end mt-5'>
                    <Link to={'/'}>Home Page  <FaArrowRightToBracket /></Link>
                </div>


                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default AddProducts;
