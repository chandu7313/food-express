import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    );

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', {
            email: email.trim(),
            password: password.trim()
        });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
