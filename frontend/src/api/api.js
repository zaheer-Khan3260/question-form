import axios from "axios"

const api = axios.create({
    baseURL: "https://question-form-api.vercel.app/api", 
    withCredentials: true 
});
  
export default api;