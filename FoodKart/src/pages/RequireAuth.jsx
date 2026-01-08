import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role"); //Check role

    if(!user || role !== 'admin'){
        return <Navigate to="/login" replace />;
    }
    
    return children;
}