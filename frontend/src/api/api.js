import axios from "axios"

const api = axios.create({
    baseURL: "https://question-form-rcqc.onrender.com/api", 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://rainbow-vacherin-596f62.netlify.app'
      }
});
  
export default api;