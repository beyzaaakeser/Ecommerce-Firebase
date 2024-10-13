import React, {createContext} from 'react';
import {db} from "../firebase/index.js";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export const ProductsContext = createContext()

export class ProductsContextProvider extends React.Component{


    state = {
        products: []
    }

    componentDidMount() {
        const prevProducts = this.state.products;
        const productsCollection = collection(db, 'products');
        onSnapshot(productsCollection, (snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    prevProducts.push({
                        productId: change.doc.id,
                        productName: change.doc.data().productName,
                        productPrice: Number(change.doc.data().productPrice),
                        productImg: change.doc.data().productImg,
                    });
                }
                this.setState({ products: prevProducts });
            });
        });
    }


    render(){
        return (
            <ProductsContext.Provider value={{products: [...this.state.products]}} >
                {this.props.children}
            </ProductsContext.Provider>
        )
    }
}