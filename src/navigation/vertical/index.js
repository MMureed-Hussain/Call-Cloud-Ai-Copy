/* eslint-disable */
import { useSelector } from "react-redux";
import { Layers, Loader, Home, Users, AlignJustify, UserCheck, Calendar, Circle, Bookmark, Phone, List, Slack, Grid, PieChart, Volume2, Clock } from "react-feather";


const navigation = () => {

  const user = useSelector((state) => state.auth.user);
  const tabs =
    [
      {
        id: "workspaceSetup",
        title: "Workspace Setup",
        icon: <Loader size={20} />,
        badge: "light-warning",
        children: [
          {
            id: "manageUsers",
            title: "Users",
            icon: <Users size={20} />,
            navLink: "/workspace/id/users",
          },
          {
            id: "leadlist",
            title: "Lead List",
            icon: <List size={20} />,
            navLink: "/workspace/leadlist",
          },
          {
            id: "queue",
            title: "Queue",
            icon: <Grid size={20} />,
            navLink: "/workspace/queue",
          },
          {
            id: "team",
            title: "Teams",
            icon: <Grid size={20} />,
            navLink: "/workspace/Team",
          },
          {
            id: "statuses",
            title: "Statuses",
            icon: <Home size={20} />,
            badge: "light-warning",
            children: [
              {
                id: "pipelines",
                title: "Pipelines",
                icon: <Circle size={20} />,
                navLink: "/pipelines",
              },
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
        ],
      },
      {
        id: "dashboard",
        title: "Dashboard",
        icon: <Home size={20} />,
        navLink: "/dashboard",
      },
      {
        id: "leadProfiles",
        title: "Lead Profiles",
        icon: <UserCheck size={20} />,
        navLink: "/leads",
      },
      {
        id: "callflow",
        title: "CallFlow",
        icon: <Loader size={20} />,
        navLink: "/workspace/callflow",
      },

      {
        id: "clients",
        title: "Clients",
        icon: <Users size={20} />,
        navLink: "/clients",
      },
      // {
      //   id: "bookingPages",
      //   title: "Booking Pages",
      //   icon: <Bookmark size={20} />,
      //   navLink: "/booking-pages",
      // },
      {
        id: "followups",
        title: "Follow-ups",
        icon: <Calendar size={20} />,
        navLink: "/followups",
      },
      // {
      //   id: "callProfiles",
      //   title: "Call Profiles",
      //   icon: <Phone size={20} />,
      //   navLink: "/profiles",
      // },
      {
        id: "workdiary",
        title: "Work diary",
        icon: <Clock size={20} />,
        navLink: "/workdiary",
      },
    ];


  //Add the tab if user role == company only
  if (user && user.role == 'company') {

    tabs.push({
      id: "call-overview",
      title: "Calls Overview",
      icon: <Phone size={20} />,
      navLink: "/call-overview",
    });

    tabs.push({
      id: "reports",
      title: "Reports",
      icon: <PieChart size={20} />,
      navLink: "/reports",
    });

    tabs.push({
      id: "campaigns",
      title: "Campaigns",
      icon: <Volume2 size={20} />,
      navLink: "/campaigns",
    });

  }

  return tabs;

}


export default navigation;
