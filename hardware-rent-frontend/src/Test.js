
import React from 'react';
import axios from 'axios';

export default class PersonList extends React.Component {
    state = {
        stateData: []
    }

    componentDidMount() {

        const session_url = 'http://localhost:8080/products';
        const uname = 'admin';
        const pass = 'admin';
        axios.get(session_url, {}, {
            auth: {
                username: uname,
                password: pass
            }
        }).then((response) => {
            //console.log(response.data)
            this.setState({stateData: response.data});
        }).catch((error) => {
            console.log(error);
        });

    }


    render() {

        return (
          <div>
              {JSON.stringify(this.state?.stateData)}
          </div>
        );
    }
}