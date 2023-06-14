import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/products';

class ProductsService {

  async getAllProducts() {
    return await axios.get(API_URL, {headers: authHeader()});
  }
  async postNewProduct(data) {

    return await axios.post(API_URL, data,{headers: authHeader()});
  }
  async deleteProduct(id) {
    return await axios.delete(API_URL + "/" + id, {headers: authHeader()});
  }
}

export default new ProductsService();