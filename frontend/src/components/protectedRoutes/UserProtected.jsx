import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';


export const AdminProtected = ({ children }) => {

    const { role } = useSelector((state) => state.user);

    return role === "admin" ? children : <Navigate to="/" />;
};


export const SellerProtected = ({ children }) => {

    const { role } = useSelector((state) => state.user);

    return role === "seller" ? children : <Navigate to="/" />;
};

export const UserProtected = ({ children }) => {

    const { role } = useSelector((state) => state.user);

    return role === "customer" ? children : <Navigate to="/" />
}

export const UserOnlyProtected = ({ children }) => {

    const { role } = useSelector((state) => state.user);

    if (role === "admin") {
        return <Navigate to="/admin/dashboard" />
    } else if (role === "seller") {
        return <Navigate to="/seller" />
    }
    return children
}