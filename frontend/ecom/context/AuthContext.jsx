import { createContext, useContext, useState, useEffect } from "react";
import { getMyShop, getUserInfo } from "../services/dataService";
import { ca } from "zod/v4/locales";
const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        console.log("User changed:", user);
    }, [user]);

    const loadUser = async () => {
        try {
            const res = await getUserInfo();
            console.log("API uSer:", res);
            setUser(res);
        } catch (error) {  
            setUser(null);
        }
    };

    const loadShop = async () => {
        try {
            const res = await getMyShop();
            setShop(res);
        } catch (error) {
            setShop(null);
            throw error;
        }
    };

    const initializeAuth = async () => {
        const token = localStorage.getItem("Token");

        if (!token) {
            setIsAuthenticated(false);
            setShop(null);
            setUser(null);
            return;
        }

        setIsAuthenticated(true);

        await loadUser();

        try {
            await loadShop();
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error(error);
            }
        }
    };

    const logout = async () => {
        localStorage.removeItem("Token");
        setIsAuthenticated(false);
        setShop(null);
        setUser(null);
    }

    useEffect(() => {
        initializeAuth();
    }, []); 

    return (
        <AuthContext.Provider value={{user, shop, initializeAuth, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}