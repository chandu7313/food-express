import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { userInfo } = useContext(AuthContext);

    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && userInfo.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
