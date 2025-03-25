import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const userName = localStorage.getItem("token");
    return userName ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoutes;
