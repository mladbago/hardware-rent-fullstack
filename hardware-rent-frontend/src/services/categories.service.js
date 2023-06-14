import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/categories';

class CategoriesService {

  async getAllCategories() {
    return await axios.get(API_URL, {headers: authHeader()});
  }
  async postNewCategory(data) {
    return await axios.post(API_URL, data,{headers: authHeader()});
  }
  async deleteCategory(id) {
    return await axios.delete(API_URL + "/" + id, {headers: authHeader()});
  }
}

export default new CategoriesService();