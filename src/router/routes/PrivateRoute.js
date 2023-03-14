// ** React Imports
import { Navigate, useLocation } from "react-router-dom";
import { Suspense } from "react";

// ** Context Imports
import { AbilityContext } from "@src/utility/context/Can";
import UiLoader from "@components/ui-loader";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@store/auth";
import { getData, recentlyAccessedWorkspaces } from "@store/workspaces";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import { logout } from "../../redux/auth";

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  // const user = JSON.parse(localStorage.getItem("userData"));
  const store = useSelector((state) => {
    return state.auth;
  });

  const location = useLocation();

  const dispatch = useDispatch();
  if (!store.user && store.loading) {
    dispatch(getUser()).then((data) => {
      if (data.payload.data.user) {
        dispatch(getData({ page: 1, perPage: 50 })).then(() => {
          dispatch(recentlyAccessedWorkspaces());
        });
      }
    });
  }

  if (store.loading) {
    return (
      <div className=" vh-100 vw-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
    // return <UiLoader blocking={true} />;
  }
  if (route) {
    let restrictedRoute = false;

    if (route.meta) {
      restrictedRoute = route.meta.restricted;
    }
    if (!store.user) {
      return <Navigate to="/login" />;
    }

    // if (
    //   store.user &&
    //   !store.user.emailVerified
    // ) {
    //   dispatch(logout(true));
    // }

    if (
      store.user &&
      !store.user.profileCompleted &&
      store.user.emailVerified &&
      location.pathname !== "/complete-profile"
    ) {
      return <Navigate to="/complete-profile" />;
    }

    if (
      store.user &&
      store.user.role === "company" &&
      store.user.profileCompleted &&
      store.user.emailVerified &&
      !store.user.isSubscribed &&
      location.pathname !== "/plans"
    ) {
      window.location.href = '/plans';
      return;
      // return <Navigate to="/plans" />;
    }

    if (store.user && restrictedRoute) {
      return <Navigate to="/" />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PrivateRoute;
