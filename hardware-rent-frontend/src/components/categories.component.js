import React from 'react';
import Table from '../Table';
import {MRTable} from './MRTable';

import '../App.css';
import {Navigate} from "react-router-dom";
import categoryService from "../services/categories.service";
import {Alert} from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import AuthService from "../services/auth.service";

export default class CategoriesComponent extends React.Component {

  constructor(props) {
    super(props);
    this.deleteCategory = this.deleteCategory.bind(this);

    this.state = {
      redirect: null,
      ready: false,
      errorMessage: undefined,
      categories: [],
      isAdmin: false

    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    const isAdmin = user.authorities.some(authority => authority.authority === 'ROLE_ADMIN')
    this.setState({isAdmin: isAdmin})
      categoryService.getAllCategories().then((response)=>{
        this.setState({ categories: response.data});
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
  deleteCategory(id) {
    categoryService.deleteCategory(id).then(
      ()=>{window.location.reload();}
    ).catch((error)=>{
      this.setState({errorMessage: error.message});
    });
  }



  render() {
    const { categories, errorMessage ,isAdmin} = this.state;
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const getHeadings = () => {
      return Object.keys(categories[0]);
    }
    const formatCategoriesData = () => {
      let modifiedData = JSON.parse(JSON.stringify(categories));
      return modifiedData;
    }

    const columns = () => {
      return getHeadings().map((row)=>
      ({
        accessorKey: row,
        header: row,
      })
    );
    }
      return (

        <div className="container">

          <h1 className="d-flex justify-content-center">Categories</h1>
          {categories.length>0?(
            //<MRTable/>
            <MaterialReactTable enableRowActions={true} renderRowActions={({ row }) => (
              <div>
                {isAdmin &&
                  <button type="button" className="button bi-trash border-0 bg-transparent " onClick={()=>{this.deleteCategory(row.original.id)}}/>}

              </div>

            )}
              columns={columns()} data={formatCategoriesData()} />
            //<Table theadData={getHeadings()} tbodyData={formatCategoriesData()} onDelete={this.deleteCategory}/>
          ):(
            <h2>No data</h2>
          )}
          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}

        </div>
      );
  }
}