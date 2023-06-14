import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import AuthService from "../services/auth.service";
import { withRouter } from '../common/with-router';
import {Alert, Button} from "react-bootstrap";

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      errorMessage: "",
      loading: false
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      errorMessage: undefined,
      loading:true
    });

      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        () => {
          AuthService.login(this.state.username, this.state.password).then(
            () => {
              this.props.router.navigate("/profile");
              window.location.reload();
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

  render() {
    const {errorMessage, loading} = this.state
    return (
      <div className="container w-25">
        <div className="row">
          <Form
            onSubmit={this.handleRegister}
            className="col-10 card card-container bg-light p-3 mb-5 justify-content-center align-items-center"
          >
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="card-img-top rounded-circle mb-2 w-50"
            />
            <Form.Group
              className="col-12 mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text"
                            placeholder="Enter username"
                            onChange={this.onChangeUsername}
                            required/>
            </Form.Group>
            <Form.Group
              className="col-12 mb-2">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email"
                            placeholder="Enter e-mail"
                            onChange={this.onChangeEmail}
                            required/>
            </Form.Group>
            <Form.Group className="col-12 mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"
                            placeholder="Enter password"
                            onChange={this.onChangePassword}
                            required/>
            </Form.Group>
            <Button className="col-12 mb-2" variant="primary" type="submit">
              {loading && <div className="spinner-grow spinner-grow-sm" role="status"/>}
              <span className="sr-only">Submit</span>

            </Button>
          </Form>
        </div>
        <div className="row col-11">{errorMessage && (<Alert variant="danger" className="text-center">{errorMessage}</Alert>)}</div>
      </div>
    );
  }
}
export default withRouter(Register);