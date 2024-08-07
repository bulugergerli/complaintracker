import axios from 'axios';
import { Cookies } from 'react-cookie';


const cookies = new Cookies();
const token = cookies.get('token');

const axiosInstance = axios.create({
  baseURL: 'https://32p9qxhuoe.execute-api.eu-central-1.amazonaws.com/v1',

  headers: { 'Authorization': token }
});

export default axiosInstance;