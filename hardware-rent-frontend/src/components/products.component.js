import React from 'react';
import Table from '../Table';
import '../App.css';
import {Navigate} from "react-router-dom";
import ProductsService from "../services/products.service";
import productsService from "../services/products.service";
import {Alert} from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import Action from "material-react-table";

import {Box, CircularProgress, Fab, Icon, IconButton} from "@mui/material";
import { render } from "react-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {ValuePointer as tableIcons} from "@sinclair/typebox/value";
import {Edit} from "@mui/icons-material";
import AuthService from "../services/auth.service";

export default class ProductsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.decreaseProductAvailabilityAndAddToCart = this.decreaseProductAvailabilityAndAddToCart.bind(this);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.replaceProductsFromCart = this.replaceProductsFromCart.bind(this);


    this.state = {
      redirect: null,
      products: [],
      errorMessage: undefined,
      cartNotEmpty: false,
      isAdmin: false
    };
  }
   componentDidMount() {
      const user = AuthService.getCurrentUser();
      const isAdmin = user.authorities.some(authority => authority.authority === 'ROLE_ADMIN')
       this.setState({cartNotEmpty: JSON.parse(localStorage.getItem("cart")).length>0, isAdmin: isAdmin})

     ProductsService.getAllProducts().then((response)=>{
        let products = this.replaceProductsFromCart(response.data);

        this.setState({ products: products});

      }).catch( (error)=>{
        this.setState({
          errorMessage:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      });

  }
  replaceProductsFromCart(productsFromResponse){
    const productsInCart = JSON.parse(localStorage.getItem("cart"));
    let updatedProductsFromResponse = JSON.parse(JSON.stringify(productsFromResponse));
    console.log(productsInCart)
    productsInCart.forEach(function(product) {
      let index = productsFromResponse.findIndex(p => p.id === product.id);
      console.log(index,product)
      updatedProductsFromResponse[index] = {...updatedProductsFromResponse[index],availableQuantity: updatedProductsFromResponse[index].availableQuantity - product.quantity};
    });
    return updatedProductsFromResponse;
  }
  deleteProduct(id) {
    const {cartNotEmpty} = this.state;
    if(!cartNotEmpty){
      productsService.deleteProduct(id).then(
        ()=>{window.location.reload();}
      ).catch((error)=>{
        this.setState({errorMessage: error.message});
      });
    }else {
      alert("cart not empty")
    }

  }
  addProductToCart(product){
    let cart = JSON.parse(localStorage.getItem("cart"));
    const index = cart.findIndex(p => p.id === product.id); // find the index of the product in the array
    if (index !== -1) {
      cart[index] = {...cart[index],quantity: cart[index].quantity + 1}; // replace the product object at the index with the new product object
    }else {
      cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(JSON.parse(localStorage.getItem("cart")))
  }
  decreaseProductAvailabilityAndAddToCart(id, number){

    const {products} = this.state
      const updatedProducts = products.map(product => {
        if (product.id === id && product.availableQuantity >0) {
          const productToAddToCart= { id: product.id,companyName: product.companyName,model: product.model,price: product.price, quantity: 1, categoryName: product.categoryName}
          this.addProductToCart(productToAddToCart);

          const productToReturn = { ...product, availableQuantity: product.availableQuantity - number}
          return productToReturn;
        } else {
          return product;
        }
      })
    this.setState({products: updatedProducts})
    }
    onDeleteHandle

  render() {
    const { products, errorMessage, cartNotEmpty, isAdmin} = this.state;
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const getHeadings = () => {
      return Object.keys(products[0]);
    }
    const formatProductsData = () => {
      let modifiedData = JSON.parse(JSON.stringify(products));
      return modifiedData;
    }
    const columns = () => {
      let products = getHeadings().map((row)=>
        ({
          accessorKey: row,
          header: row,
        })
      );

      return products
    }


      return (

        <div className="container">

          <h1 className="d-flex justify-content-center">Products</h1>
          {products.length>0?(
            //<Table theadData={getHeadings()} tbodyData={formatProductsData()} onDelete={this.deleteProduct} onAddToCart={this.decreaseProductAvailabilityAndAddToCart}/>
            <MaterialReactTable enableRowActions={true} renderRowActions={({ row }) => (
                <div>
                  <button type="button" className="button bi-basket2 border-0 bg-transparent " onClick={()=>{this.decreaseProductAvailabilityAndAddToCart(row.original.id, 1)}}/>
                  {isAdmin &&
                    <button type="button" className="button bi-trash border-0 bg-transparent " onClick={()=>{this.deleteProduct(row.original.id)}}/>}

                </div>

            )}
              columns={columns()} data={formatProductsData()} />

          ):(
            <h2>No data</h2>
          )}
          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}

        </div>
      );

  }
}