import axios from "axios";

const api = axios.create({
    baseURL: "http://13.212.248.63:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 5000,
});

export default api;