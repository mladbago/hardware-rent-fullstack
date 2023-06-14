
import React from 'react';
import axios from 'axios';
import Table from './Table';
import './App.css';
import {getData} from "./requestManager";


export default class Orders extends React.Component {
  state = {
    available: false,
    data: []
  }
  componentDidUpdate(prevProps, prevState, snapshot)
  {
    if(prevState!==this.state.data)
      this.render();
  }
  componentDidMount() {

    const accessToken= "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiYWRtaW4iLCJleHAiOjE2ODM0ODM4MDksImlhdCI6MTY4MzQ4MDIwOSwic2NvcGUiOiIifQ.V_aYzGyNV_jq2301GPLmKj9yDeOUQP2om01BfzS56nI06rS1n2Av8blT5W2tYqT5DmjltEEz0dP7rg_LdE4cYzGC0cnQ6fDVWDlNYhtxODzflVzLzYslPH3UAM68ZZKR3Kj8cNkOk8PtSDZOdM8ZtwTi9uko_o-PH-KRyWakK7M2NPH5L33Dte19Lv3zoaxeJyDyYrTedE3XZHktCTdXj8cx1cAI5WzISqe7swWfXbjoNmhksf-EmoXfhkBg35WZRwOxLlkJNkR1t3PBuTds1bZoSTuN5ydSrKlkfVHeHYgnnw96KnmuUXZYEn_dDVa-tLCJAPujoDJpOMHPcqXwlg"
    const url = 'http://localhost:8080/orders';
    const self = this;
    getData(accessToken, url).then((data) => {
      self.setState({ data: data, available: true });
    });

  }


  render() {
    let here = this;
    const getHeadings = () => {


      return Object.keys(this.state.data[0]);


    }
    const formatProductsData = () => {

          let modifiedData = JSON.parse(JSON.stringify(this.state.data));
        modifiedData.map(row => {
          row["category"] = row["category"]["categoryName"]
        })
        return modifiedData;

    }

    if(!this.state.available) {return (<div>Loading ...</div>);
    }else if(this.state.data.length>0){
      return (
        <div className="container">
          {
            <Table theadData={getHeadings()} tbodyData={formatProductsData()}/>
          }
        </div>
      );
    }
  }
}