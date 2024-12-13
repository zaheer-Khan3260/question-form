import axios from "axios"

const api = axios.create({
    baseURL:  process.env.REACT_APP_BACKEND_SERVER_URL, 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://rainbow-vacherin-596f62.netlify.app'
      }
});
  
export default api;