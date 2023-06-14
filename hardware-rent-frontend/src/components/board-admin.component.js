import React, { Component } from "react";

import CategoryService from "../services/categories.service";
import Form from 'react-bootstrap/Form';
import {Alert, Button} from "react-bootstrap";
import AuthService from "../services/auth.service";
import ProductsService from "../services/products.service";

export default class AdminUser extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitCategory = this.handleSubmitCategory.bind(this);
    this.handleSubmitProduct = this.handleSubmitProduct.bind(this);
    this.onChangeCategoryName = this.onChangeCategoryName.bind(this);
    this.onChangeCompanyName = this.onChangeCompanyName.bind(this);
    this.onChangeModel = this.onChangeModel.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeAvailableQuantity = this.onChangeAvailableQuantity.bind(this);
    this.onChangeOverallQuantity = this.onChangeOverallQuantity.bind(this);
    this.onChangeCategoryNameForProduct = this.onChangeCategoryNameForProduct.bind(this);



    this.state = {
      content: "",
      categoryName: undefined,
      companyName: undefined,
      model: undefined,
      price: undefined,
      availableQuantity: undefined,
      overallQuantity: undefined,
      categoryNameForProduct: undefined,
      successMessage: undefined,
      errorMessage: undefined
    };
  }
  handleSubmitCategory(e) {
    e.preventDefault();

    this.setState({
      errorMessage: undefined,
      successMessage:undefined
    });
    const {categoryName} = this.state;
    const body = {categoryName};
    CategoryService.postNewCategory(body).then(
      () => {
        this.setState({
          successMessage: "added category with name: " + categoryName
        });
      },
      error => {
        this.setState({
          errorMessage:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(), loading: false
        });
      }
    );

  }
  handleSubmitProduct(e) {
    e.preventDefault();

    this.setState({
      errorMessage: undefined,
      successMessage:undefined
    });
    const {companyName, model, price, availableQuantity, overallQuantity, categoryNameForProduct} = this.state;
    const categoryName = categoryNameForProduct;
    const body = {companyName, model, price, availableQuantity, overallQuantity, categoryName};

    ProductsService.postNewProduct(body).then(
      () => {
        this.setState({
          successMessage: "added product with model: " + model
        });
      },
      error => {
        this.setState({
          errorMessage:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );

  }

  onChangeCategoryName(e) {
    this.setState({
      categoryName: e.target.value
    });
  }
  onChangeCompanyName(e) {
    this.setState({
      companyName: e.target.value
    });
  }
  onChangeModel(e) {
    this.setState({
      model: e.target.value
    });
  }
  onChangePrice(e) {
    this.setState({
      price: e.target.value
    });
  }
  onChangeAvailableQuantity(e) {
    this.setState({
      availableQuantity: e.target.value
    });
  }
  onChangeOverallQuantity(e) {
    this.setState({
      overallQuantity: e.target.value
    });
  }
  onChangeCategoryNameForProduct(e) {
    this.setState({
      categoryNameForProduct: e.target.value
    });
  }

  render() {
    const { content, errorMessage ,successMessage} = this.state;
    return (
      <div className="container">
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
        <Form
          onSubmit={this.handleSubmitCategory}
          className="card card-container bg-light p-3 mb-5"
          ref={c => {
            this.form = c;
          }}>
          <h2 className="text-center">Add new category</h2>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text"
                          placeholder="Type here category name"
                          onChange={this.onChangeCategoryName}
                          required/>
            <Form.Text className="text-muted">
              Category name must be unique
            </Form.Text>
          </Form.Group>


          <Button variant="primary" type="submit" className="w-100 mb-3">
            Submit
          </Button>
        </Form>








        <Form
          onSubmit={this.handleSubmitProduct}
          className="card card-container bg-light p-3"
          ref={c => {
            this.form = c;
          }}>
          <h2 className="text-center">Add new product</h2>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text"
                          placeholder="Type here company name"
                          onChange={this.onChangeCompanyName}
                          required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Model</Form.Label>
            <Form.Control type="text"
                          placeholder="Type here model"
                          onChange={this.onChangeModel}
                          required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number"
                          placeholder="Type here price"
                          onChange={this.onChangePrice}
                          required/>
            <Form.Text className="text-muted">Price in zł</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Available Quantity</Form.Label>
            <Form.Control type="number"
                          placeholder="Type here available quantity"
                          onChange={this.onChangeAvailableQuantity}
                          required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Overall Quantity</Form.Label>
            <Form.Control type="number"
                          placeholder="Type here overall quantity"
                          onChange={this.onChangeOverallQuantity}
                          required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text"
                          placeholder="Type here overall quantity"
                          onChange={this.onChangeCategoryNameForProduct}
                          required/>
          </Form.Group>


          <Button variant="primary" type="submit" className="w-100 mb-3">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}