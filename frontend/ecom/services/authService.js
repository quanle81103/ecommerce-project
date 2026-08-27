import api from "../config/axiosConfig";

export const response = async (email, password) => {
    const { data } = await api.post("/auth/login", {
        email, password
    });

    return data.data.token;
}


export const responseResetPassword = async (rawToken, password) => {
    const { data } = await api.post("/auth/reset-password", {
        rawToken, 
        password
    });

    return data.message;
}

export const responseForgetPassword = async (email) => {
    const { data } = await api.post("/auth/forget-password", {
        email
    });
    return data.message;
}

export const registerUser = async (request) => {
    const { data } = await api.post("/users/create", request);
    return data.data;
};
