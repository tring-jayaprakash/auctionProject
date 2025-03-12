import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const userName = localStorage.getItem("user");
    return userName ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoutes;
