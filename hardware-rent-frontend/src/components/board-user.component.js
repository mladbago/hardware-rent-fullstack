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

export default class BoardUserComponent extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      redirect: null,
      products: [],
      orders: [],
      errorMessage: undefined,
      successMessage: undefined,
    };
  }
  componentDidMount() {
    this.setState({
      errorMessage: undefined,
      successMessage:undefined
    });
    OrdersService.getOrders().then((response)=>{

      this.setState({ orders: response.data});
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


  render() {
    const { orders, errorMessage, successMessage} = this.state;
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const getHeadings = (array) => {
      return Object.keys(array[0]);
    }
    const formatOrdersData = (array) => {
      let modifiedData = JSON.parse(JSON.stringify(array));
      return modifiedData;
    }
    const columns = (array) => {
      console.log("array:")

      console.log(array)
      let orders = array.map((row)=>
        {
          if(row !== "orderDetails" && row !== "orderDetails_id") {
          return {
            accessorKey: row,
            header: row}
          }else {
            //here
          }
      }
      );
      orders = orders.filter((order) => order !== undefined); // remove undefined values
      console.log(orders)
      return orders
    }

    return (

      <div className="container">
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
        <h1 className="d-flex justify-content-center">Orders</h1>
        {orders.length>0?(<div>
          <MaterialReactTable   enableColumnResizing columns={columns(getHeadings(orders))} data={formatOrdersData(orders)}
                                renderDetailPanel={({ row }) => //{console.log(row)}}
                                  (<MaterialReactTable columns={columns(getHeadings(row.original.orderDetails))} data={formatOrdersData(row.original.orderDetails)}/>)}
          />

        </div>):(
          <h2 className="text-center">No orders</h2>
        )}

      </div>
    );

  }
}