import { Layers, Home, Users, Bookmark, Phone } from "react-feather";

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
    id: "callProfiles",
    title: "Call Profiles",
    icon: <Phone size={20} />,
    navLink: "/profiles",
  },
];
