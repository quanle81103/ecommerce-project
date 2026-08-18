import api from "../config/axiosConfig";

export const getRevenueResponse = async () => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get("/seller/revenue", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
}

export const getTopProductResponse = async () => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get("/seller/revenue/best-seller", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
}

export const getRevenueChartResponse = async () => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get("/seller/revenue/chart", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
}

export const getSellerOrders = async ({page = 0,size = 10,status,keyword}) => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get("/seller/orders", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            page,size,status,keyword
        }
    });

    return data.data;
};

export const getSellerOrderDetail = async (orderId) => {

    const token = localStorage.getItem("Token");

    const { data } = await api.get(
        `/seller/orders/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return data.data;
};

export const updateSellerOrderStatus = async (orderId) => {
    const token = localStorage.getItem("Token");
    const { data } = await api.patch(
        `/seller/orders/${orderId}/status`,
        {
            orderStatus: "DELIVERED"
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return data.data;
};

export const handover = async (orderId) => {
    const token = localStorage.getItem("Token");
    const { data } = await api.post(`/seller/orders/${orderId}/handover`,
        { 
            orderStatus: "DELIVERED"
        },
        {headers: {
            Authorization: `Bearer ${token}`
        }}
    );

    return data.data;
}