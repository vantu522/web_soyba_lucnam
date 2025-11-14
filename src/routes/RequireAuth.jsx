import { Navigate } from "react-router-dom";
import { getToken } from "../config/auth";

const isAuthenticated = (isAdmin = false) => {
  return !!getToken(isAdmin);
}

const RequireAuth = ({ children, isAdmin = false }) => {
  return isAuthenticated(isAdmin) ? 
    children : 
    <Navigate to={isAdmin ? "/admin/dang-nhap" : "/dang-nhap"} />;
}

export default RequireAuth;