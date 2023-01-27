/*eslint-disable*/
// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@src/router/routes/PublicRoute";
import PrivateRoute from "@src/router/routes/PrivateRoute";

// ** Utils
import { isObjEmpty } from "@utils";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/dashboard";

const Home = lazy(() => import("../../views/Home"));
const Workspaces = lazy(() => import("../../views/workspaces/Workspaces"));
// prettier-ignore
const WorkspaceDetails = lazy(() => import("../../views/workspaces/WorkspaceDetails"));
// prettier-ignore
const WorkspaceManageUsers = lazy(() => import("../../views/workspaces/WorkspaceManageUsers"));
const WorkspaceManageLeadlist = lazy(() => import("../../views/workspaces/WorkspaceManageLeadlist"));
const WorkspaceManageQueue = lazy(() => import("../../views/queue/WorkspaceManageQueue"));
const WorkspaceManageTeam = lazy(() => import("../../views/team/WorkspaceManageTeam"));
const WorkspaceManageCallFlow = lazy(() => import("../../views/callflow/WorkspaceManageCallFlow"));

const Login = lazy(() => import("../../views/Login"));
const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const ResetPassword = lazy(() => import("../../views/ResetPassword"));
const Error = lazy(() => import("../../views/Error"));
const AccountSettings = lazy(() => import("../../views/account-settings"));
// prettier-ignore
const SetupWorkspaces = lazy(() => import("../../views/account-settings/SetupWorkspaces"));
// prettier-ignore
const InviteUsers = lazy(() => import("../../views/account-settings/InviteUsers"));
const VerifyEmail = lazy(() => import("../../views/VerifyEmail"));
// prettier-ignore
const BookingPages = lazy(() => import("../../views/booking-pages/BookingPages"));
// prettier-ignore
const CreateBookingPage = lazy(() => import("../../views/booking-pages/CreateBookingPage"));
const Plans = lazy(() => import("../../views/plans"));
// const Clients = lazy(() => import("../../views/clients"));
const Followups = lazy(() => import("../../views/followups"));
const Profiles = lazy(() => import("../../views/profiles/Index"));

const CallProfileView = lazy(() => import("../../views/profiles/View"));
const Pipelines = lazy(() => import("../../views/pipelines/Index"));
const CallStatuses = lazy(() => import("../../views/call-statuses/Index"));
const ClientStatuses = lazy(() => import("../../views/client-statuses/index"));
const LeadStatuses = lazy(() => import("../../views/lead-statuses/Index"));
const Calls = lazy(() => import("../../views/calls/index"));
const Reports = lazy(() => import("../../views/reports/index"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
    meta: {
      isPrivate: false,
    },
  },
  {
    path: "/dashboard",
    element: <Home />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/profile",
    element: <AccountSettings />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/complete-profile",
    element: <AccountSettings />,
    meta: {
      isPrivate: true,
      layout: "blank",
    },
  },
  {
    path: "/plans",
    element: <Plans />,
    meta: {
      isPrivate: true,
      // layout: "blank",
    },
  },
  {
    path: "/setup-workspaces",
    element: <SetupWorkspaces />,
    meta: {
      isPrivate: true,
      layout: "blank",
    },
  },
  {
    path: "/invite-users",
    element: <InviteUsers />,
    meta: {
      isPrivate: true,
      layout: "blank",
    },
  },
  {
    path: "/workspaces",
    element: <Workspaces />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/workspace/:id",
    element: <WorkspaceDetails />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/workspace/:id/users",
    element: <WorkspaceManageUsers />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/workspace/leadlist",
    element: <WorkspaceManageLeadlist />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/workspace/queue",
    element: <WorkspaceManageQueue />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/workspace/team",
    element: <WorkspaceManageTeam />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/workspace/callflow",
    element: <WorkspaceManageCallFlow />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/leads",
    element: <Profiles />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/leads/:id",
    element: <CallProfileView />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/clients",
    element: <Profiles />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/clients/:id",
    element: <CallProfileView />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/pipelines",
    element: <Pipelines />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/lead-statuses",
    element: <LeadStatuses />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/statuses",
    element: <CallStatuses />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/client-statuses",
    element: <ClientStatuses />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      isPrivate: false,
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
      isPrivate: false,
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
      isPrivate: false,
    },
  },
  {
    path: "/reset-password/:resetToken",
    element: <ResetPassword />,
    meta: {
      layout: "blank",
      isPrivate: false,
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
      isPrivate: false,
    },
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
    meta: {
      layout: "blank",
      isPrivate: true,
    },
  },

  {
    path: "/followups",
    element: <Followups />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/call-overview",
    element: <Calls />,
    meta: {
      isPrivate: true,
    },
  },
  {
    path: "/reports",
    element: <Reports />,
    meta: {
      isPrivate: true,
    },
  },

  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
      isPrivate: false,
    },
  },
  // {
  //   path: "/clients",
  //   element: <Clients />,
  //   meta: {
  //     isPrivate: true,
  //   },
  // },
];

const getRouteMeta = (route) =>
{
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) =>
{
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) =>
    {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = route.meta.isPrivate ? PrivateRoute : PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment;
          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) =>
{
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) =>
  {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
