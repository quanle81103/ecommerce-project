import axios from "axios";

const addressApi = axios.create({
    baseURL: "https://online-gateway.ghn.vn/shiip/public-api/master-data",
    headers: {
        "Token": "3107ba7a-4069-11f1-bf12-e244fda9315f",
        "Content-Type": "application/json"
    },
    timeout: 5000,
});

export default addressApi;