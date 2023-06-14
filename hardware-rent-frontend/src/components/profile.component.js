import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";


export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="container">

        {(this.state.userReady) ?
          <div className="card p-3">
            <header className="jumbotron">
              <h3>
                Username: <strong>{currentUser.username}</strong>
              </h3>
            </header>

            <strong>Authorities:</strong>
            <ul className="list-group list-group-light">
              {currentUser.authorities &&
                currentUser.authorities.map((authorityLine, index) => <li className="list-group-item" key={index}>{authorityLine.authority}</li>)}
            </ul>
          </div>: null}
      </div>
    );
  }
}