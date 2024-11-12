'use client'

import React, { createContext, useReducer } from 'react';
import { authReducer } from '@/views/store/context/authReducer';
import { authInitState } from '@/views/store/context/authInitState';
import { setAuthInfor, clearAuthInfor } from '@/views/store/context/authActions';

export const AuthContext = createContext();

export const AuthProvider  = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, authInitState);

    // console.log('state: ', state);

    // Hàm đăng nhập
    const login = (email, role) => {
        setAuthInfor(dispatch, email, role);
        console.log('Login success, email:', email, 'role:', role);
    };

    //hàm đăng xuất
    const logout = () => {
        clearAuthInfor(dispatch);
    };

    // console.log('AuthProvider state:', state);

    return (      

        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}