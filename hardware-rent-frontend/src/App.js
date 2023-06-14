import './App.css';

import {
  Route,
  Routes,
  NavLink,
  HashRouter, Link,
} from "react-router-dom";
import ProductsComponent from "./components/products.component";
import Categories from "./components/categories.component";
import Cart from "./components/cart.component";

import Dropdown from 'react-bootstrap/Dropdown';
import AuthService from "./services/auth.service";



import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import {Component} from "react";
import {DropdownButton} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.authorities.some(authority => authority.authority === 'ROLE_MODERATOR'),
        showAdminBoard: user.authorities.some(authority => authority.authority === 'ROLE_ADMIN')
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    const cartItemsAmount = JSON.parse(localStorage.getItem("cart")).length;
    return (
      <div >

        <nav className="navbar navbar-expand navbar-dark bg-dark ">
          <Link  to={"/"} className="navbar-brand ps-2">
            Hardware Rent
          </Link>
          <div className="navbar-nav mr-auto">


            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User Board
                </Link>
              </li>
            )}
          </div>
          {currentUser && (

              <DropdownButton className=" nav-item" variant="text" title="Tables">
                <Dropdown.Item href="/products">
                  Products
                </Dropdown.Item>
                <Dropdown.Item href="/categories">
                  Categories
                </Dropdown.Item>
              </DropdownButton>
          )
          }
          {currentUser ? (


            <div className="navbar-nav ms-auto ">
                <Link  to={"/cart"} className="shadow-none nav-item btn nav-link bi-cart4"/>
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  My Profile
                </Link>
              </li>
              <li className="nav-item ">
                <a href="/login" className="nav-link " onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ms-auto ">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}

        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/products" element={<ProductsComponent />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />

          </Routes>
        </div>
      </div>
    );
  }
}

export default App;