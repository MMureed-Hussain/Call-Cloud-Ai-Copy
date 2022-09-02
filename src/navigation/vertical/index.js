import { Layers, Home } from "react-feather";

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
];
