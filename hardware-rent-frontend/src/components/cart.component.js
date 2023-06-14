import React from 'react';
import Table from '../Table';
import '../App.css';
import {Navigate} from "react-router-dom";
import OrdersService from "../services/orders.service";
import {Alert, Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ProductsService from "../services/products.service";
import ordersService from "../services/orders.service";
import MaterialReactTable from "material-react-table";

export default class Cart extends React.Component {

  constructor(props) {
    super(props);
    this.onChangeDueDate = this.onChangeDueDate.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    this.deleteOrderPosition = this.deleteOrderPosition.bind(this);

    this.state = {
      redirect: null,
      products: [],
      dueDate: "",
      errorMessage: undefined,
      successMessage: undefined,
      description: undefined
    };
  }
  componentDidMount() {
    this.setState({
      errorMessage: undefined,
      successMessage:undefined
    });
    const productsInCart = JSON.parse(localStorage.getItem("cart"))
    this.setState({products: productsInCart})
  }
  onChangeDueDate(e) {
    this.setState({
      dueDate: e.target.value + "T23:59:59"
    });
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  handleSubmitOrder(e) {
    e.preventDefault();

    this.setState({
      errorMessage: undefined,
      successMessage:undefined
    });
    const {dueDate, description} = this.state;
    let products = JSON.parse(localStorage.getItem("cart")).map(({id, quantity})=>
      ({
        productId: id,
        quantity,
      })
    )
    const body = {dueDate, description: description, orderDetails: products};
    console.log(body)

    OrdersService.postNewOrder(body).then(
      () => {
        localStorage.setItem("cart", JSON.stringify([]));
        this.setState({
          successMessage: "Created new order"
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
  deleteOrderPosition(productIdToDelete){
    let productsInCart = JSON.parse(localStorage.getItem("cart"))
    let productIndex = productsInCart.findIndex(product => product.id === productIdToDelete);
    productsInCart.splice(productIndex, 1);
    localStorage.setItem("cart", JSON.stringify(productsInCart));
    window.location.reload()
  }

  render() {
    const { products, errorMessage, successMessage} = this.state;
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
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
        <h1 className="d-flex justify-content-center">Cart</h1>
        {products.length>0?(<div>
          <MaterialReactTable   enableColumnResizing enableRowActions={true} renderRowActions={({ row }) => (
            <div>
              <button type="button" className="button bi-trash border-0 bg-transparent " onClick={()=>{this.deleteOrderPosition(row.original.id)}}/>
            </div>

          )}columns={columns()} data={formatProductsData()} />
          <Form
            onSubmit={this.handleSubmitOrder}
            className="card card-container bg-light p-3 mb-5"
            ref={c => {
              this.form = c;
            }}>
            <h2 className="text-center">Place Order</h2>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text"
                            placeholder="Type here your description"
                            onChange={this.onChangeDescription}/>
              <Form.Text className="text-muted">
                This field could be empty
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Due date</Form.Label>
              <Form.Control type="date"
                            placeholder="Type here due date"
                            onChange={this.onChangeDueDate}
                            required/>
              <Form.Text className="text-muted">
                Date should be greater then today date
              </Form.Text>
            </Form.Group>


            <Button variant="primary" type="submit" className="w-100 mb-3">
              Submit
            </Button>
          </Form>


        </div>):(
          <h2 className="text-center">No items in cart</h2>
        )}

      </div>
    );

  }
}