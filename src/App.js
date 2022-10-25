import React, { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
// ** Router Import
import Router from "./router/Router";

// ** Axios Imports
import axios from "axios";

import Maintenance from "./views/Maintenance";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const App = () => {
  const query = useQuery();

  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    const maintenanceMode = async () => {
      await  axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/maintenance_mode`).then(response => setMaintenance(response.data))
    }
    maintenanceMode();
  }, []);

  // Show success/error message in toast if any set from backend during redirect
  if (query.get("success_message")) {
    toast.success(query.get("success_message"));
    const href = window.location.href.split("?")[0];
    window.history.pushState({}, document.title, href);
  }

  if (query.get("error_message")) {
    toast.error(query.get("error_message"));
    const href = window.location.href.split("?")[0];
    window.history.pushState({}, document.title, href);
  }

  return (
    <>
    {maintenance && maintenance.value === '1' ? (
      <Maintenance message={maintenance.message} />
    ) : (
      <Suspense fallback={null}>
        <Router />
      </Suspense>
    )}
    </>
  );
};

export default App;
