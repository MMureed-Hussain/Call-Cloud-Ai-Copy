// ** React Imports
import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import UiLoader from "@components/ui-loader";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@store/auth";

const PublicRoute = ({ children, route }) => {
  const store = useSelector((state) => {
    return state.auth;
  });

  const dispatch = useDispatch();

  if (!store.user && store.loading) {
    dispatch(getUser());
  }

  if (store.loading) {
    return <UiLoader blocking={true} />;
  }

  if (route) {
    const restrictedRoute = route.meta && route.meta.restricted;

    if (store.user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />;
    }

    if (store.user && route.path === "/login") {
      return <Navigate to="/home" />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PublicRoute;
