// ** React Imports
/* eslint-disable */
import { Outlet } from "react-router-dom";


import { useSelector } from "react-redux";
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";
import NavbarComponent from "./components/navbar";

import SidebarComponent from "./vertical-menu";
import Footer from "./components/Footer";
// const CustomNavbar = (props) => {
//   console.log(props);
//   return <p className="mb-0">Custom Navbar</p>;
// };

const CustomMenu = (props) =>
{

  const layoutStore = useSelector((state) => state.layout);
  const workspaceStore = useSelector((state) => state.workspaces);
  const authStore = useSelector((state) => state.auth);

  // check role wise routes
  let menuData = props.menuData;
  if (authStore.user && authStore.user.role !== "company") {
    menuData = menuData.filter((menu) => menu.id !== "manageUsers");
  } else {
    if (workspaceStore.currentWorkspace) {
      menuData = menuData.map((menu) =>
      {
        if (menu.id === "manageUsers") {
          menu.navLink = `/workspace/${workspaceStore.currentWorkspace.id}/users`;
        }
        return menu;
      });
    }
  }


  const isHidden = layoutStore.menuHidden;

  return !isHidden ? (
    <SidebarComponent
      skin={props.skin}
      menu={null}
      menuData={menuData}
      menuCollapsed={props.menuCollapsed}
      menuVisibility={props.menuVisibility}
      setMenuCollapsed={props.setMenuCollapsed}
      setMenuVisibility={props.setMenuVisibility}
    />
  ) : null;
};

const VerticalLayout = (props) =>
{
  const menuData = navigation();


  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout
      menuData={menuData}
      navbar={(props) => <NavbarComponent {...props} />}
      {...props}
      menu={(props) => <CustomMenu {...props} />}
      footer={<Footer />}
    >
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
