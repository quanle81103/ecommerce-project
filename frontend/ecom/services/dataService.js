import api from "../config/axiosConfig";

export const responseCategory = async () => {
    const { data } = await api.get("/categories");
    return data.data;
};

export const responseBanner = async () => {
    const { data } = await api.get("/banners/visualize");
    return data.data;
};

export const getProducts = async (page = 0) => {
    const { data } = await api.get(`/products`, {
        params: {
            page
        }
    });
    return data.data;
};  

export const getProductsOfShop = async () => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get(`/products/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
}

export const deleteProduct = async(productId) => {
    const token = localStorage.getItem("Token");
    
    const { data } = await api.delete(`/products/product/delete/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
           productId 
        }
    });

    return data.data;
}

export const getProductById = async ( productId ) => {
    const { data } = await api.get(`/products/${productId}`, {
        params: {
            productId
        }
    })
    return data.data;
}


// also getCartItems
export const getCart = async () => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get(`/carts/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.data;
}

export const addItem = async(productId, quantity) => {
    const token = localStorage.getItem("Token");
    const { data } = await api.post("/cartitems/add", null ,{
        params: {
            productId, quantity
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.message;
}

export const getShopByProduct = async (productId) => {
    const token = localStorage.getItem("Token");
    const { data } = await api.get(`/shops/shop/${productId}`, {
        params: {
            productId
        },

        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.data;
}

export async function createConversation(shopId) {
    const token = localStorage.getItem("Token"); 
    
    const { data } = await api.post("/conversations", {
        shopId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.data;
}

export async function getMessages(conversationId) {
    const token = localStorage.getItem("Token");

    const { data } = await api.get(
        `/conversations/${conversationId}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return data.data;
}

export const getConversations = async () => {
    const token = localStorage.getItem("Token");

    const { data } = await api.get("/conversations", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
};

export const getConversationsOfBuyer = async () => {
    const token = localStorage.getItem("Token");

    const { data } = await api.get("/conversations/buyer", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
};

export const getConversationsOfSeller = async () => {
    const token = localStorage.getItem("Token");

    const { data } = await api.get("/conversations/seller", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
};

export const getUserInfo = async() => {
    const token = localStorage.getItem("Token");

    const { data } = await api.get("/users/get", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
};

export const getMyShop = async() => {
    const token = localStorage.getItem("Token");

    const {data} = await api.get("/shops/shop/my", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
}

export const getCategories = async() => {
    const {data} = await api.get("/categories");

    return data.data;
}

export const getBrands = async() => {
    const {data} = await api.get("/brands/all");

    return data.data;
}

export const calculateShippingFee = async(request) => {
    const token = localStorage.getItem("Token");
    const data = await api.post("/ghn/fee", request, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data.data;
}

export const createOrderFromCart = async(request) => {
    const token = localStorage.getItem("Token");
    const data = await api.post("/orders/create", request,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return data.data.data;
}

export const createVnpayPayment = async(totalAmount, txnRef) => {
    const token = localStorage.getItem("Token");

    const { data } = await api.get("/payment/vn-pay", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            amount: totalAmount, 
            TxnRef: txnRef
        }
    })

    return data.data.paymentUrl;
}


export const getPaymentStatus = async (txnRef) => {
    const token = localStorage.getItem("Token");

    const { data } = await api.get("/payment/status", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            txnRef
        }
    });

    return data.data;
};


export const cancelOrder = async(orderId) => {
    const token = localStorage.getItem("Token");
    const { data } = await api.put(`/orders/order/${orderId}/cancel`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data.data;
}