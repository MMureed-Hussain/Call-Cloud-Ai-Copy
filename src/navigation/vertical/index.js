import { Layers, Home, Users, AlignJustify, UserCheck, Calendar, Circle } from "react-feather";

export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  // {
  //   id: "workspaces",
  //   title: "Workspaces",
  //   icon: <Layers size={20} />,
  //   navLink: "/workspaces",
  // },
  {
    id: "manageUsers",
    title: "Users",
    icon: <Users size={20} />,
    navLink: "/workspace/id/users",
  },
  // {
  //   id: "bookingPages",
  //   title: "Booking Pages",
  //   icon: <Bookmark size={20} />,
  //   navLink: "/booking-pages",
  // },
  {
    id: "leadProfiles",
    title: "Lead Profiles",
    icon: <UserCheck size={20} />,
    navLink: "/leads",
  },
  {
    id: "pipelines",
    title: "Pipelines",
    icon: <Layers size={20} />,
    navLink: "/pipelines",
  },
  {
    id: "statuses",
    title: "Statuses",
    icon: <Home size={20} />,
    badge: "light-warning",
    children: [
      {
        id: "leadStatuses",
        title: "Lead",
        icon: <Circle size={20} />,
        navLink: "/lead-statuses",
      },
      {
        id: "callStatuses",
        title: "Call",
        icon: <Circle size={20} />,
        navLink: "/statuses",
      },
      {
        id: "clientStatuses",
        title: "Client",
        icon: <Circle size={20} />,
        navLink: "/client-statuses",
      },
    ],
  },

  {
    id: "clients",
    title: "Clients",
    icon: <Users size={20} />,
    navLink: "/clients",
  },
  {
    id: "followups",
    title: "Follow-ups",
    icon: <Calendar size={20} />,
    navLink: "/followups",
  },
];
