import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/orders';

class OrdersService {

  async postNewOrder(data) {
    return await axios.post(API_URL, data,{headers: authHeader()});
  }
  async getOrders(data) {
    return await axios.get(API_URL,{headers: authHeader()});
  }
}

export default new OrdersService();