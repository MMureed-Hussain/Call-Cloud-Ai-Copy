import ClientsTable from "./СlientsTable";
  
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Clients = () => {
    const store = useSelector((state) => {
        return state.auth;
    });

    if (!store.user) {
        return <Navigate to="/login" />;
    }
    return (
        <div>
        <ClientsTable />
        </div>
    );
};
  
export default Clients;
  