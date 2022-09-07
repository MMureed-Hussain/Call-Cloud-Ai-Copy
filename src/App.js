import React, { Suspense } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
// ** Router Import
import Router from "./router/Router";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const App = () => {
  const query = useQuery();

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
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
