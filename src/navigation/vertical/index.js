import { Layers, Home, Users } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "workspaces",
    title: "Workspaces",
    icon: <Layers size={20} />,
    navLink: "/workspaces",
  },
  {
    id: "manageUsers",
    title: "Users",
    icon: <Users size={20} />,
    navLink: "/workspace/id/users",
  },
];
