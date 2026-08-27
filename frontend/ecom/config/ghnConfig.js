import axios from "axios";

const ghnToken = import.meta.env.VITE_GHN_TOKEN;

const addressApi = axios.create({
    baseURL: import.meta.env.VITE_GHN_API_URL || "https://online-gateway.ghn.vn/shiip/public-api/master-data",
    headers: {
        ...(ghnToken ? { Token: ghnToken } : {}),
        "Content-Type": "application/json"
    },
    timeout: 5000,
});

export default addressApi;
