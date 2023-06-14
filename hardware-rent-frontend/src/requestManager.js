import React from 'react';
import axios from "axios";
export async function getData(accessToken,url)
{
  const username = "admin"
  const password = "admin"
  return axios
    .post("http://localhost:8080/" + "login", {},{headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      }})
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
}
