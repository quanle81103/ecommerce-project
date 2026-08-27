import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMyShop, getUserInfo } from "../services/dataService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("Token")));
    const [isInitializing, setIsInitializing] = useState(true);

    const loadShop = useCallback(async () => {
        try {
            const response = await getMyShop();
            setShop(response);
            return response;
        } catch (error) {
            setShop(null);
            if (error.response?.status !== 404 && error.response?.status !== 403) throw error;
            return null;
        }
    }, []);

    const initializeAuth = useCallback(async () => {
        const token = localStorage.getItem("Token");
        if (!token) {
            setUser(null);
            setShop(null);
            setIsAuthenticated(false);
            setIsInitializing(false);
            return;
        }
        try {
            const currentUser = await getUserInfo();
            setUser(currentUser);
            setIsAuthenticated(true);
            await loadShop();
        } catch {
            localStorage.removeItem("Token");
            setUser(null);
            setShop(null);
            setIsAuthenticated(false);
        } finally {
            setIsInitializing(false);
        }
    }, [loadShop]);

    const logout = useCallback(() => {
        localStorage.removeItem("Token");
        setIsAuthenticated(false);
        setShop(null);
        setUser(null);
    }, []);

    useEffect(() => { initializeAuth(); }, [initializeAuth]);

    const value = useMemo(() => ({
        user, shop, isAuthenticated, isInitializing, initializeAuth, loadShop, logout
    }), [user, shop, isAuthenticated, isInitializing, initializeAuth, loadShop, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
