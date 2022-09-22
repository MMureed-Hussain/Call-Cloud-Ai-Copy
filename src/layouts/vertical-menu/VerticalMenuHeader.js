// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";

// ** Icons Imports
import { Disc, X, Circle } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";

import WorkspaceSwitcher from "./WorkspaceSwitcher.js";

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Vars
  const user = getUserData();

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <FontAwesomeIcon
          fontSize={10}
          icon={faThumbTack}
          data-tour="toggle-icon"
          className="toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faThumbTack}
          fontSize={10}
          data-tour="toggle-icon"
          className="toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <>
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item me-auto">
            <NavLink
              to={user ? getHomeRouteForLoggedInUser(user.role) : "/"}
              className="navbar-brand"
            >
              <span className="brand-logo">
                <img src={themeConfig.app.appLogoImage} alt="logo" />
              </span>
              <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
            </NavLink>
          </li>

          <li className="nav-item nav-toggle">
            <div className="nav-link modern-nav-toggle cursor-pointer">
              <Toggler />
              <X
                onClick={() => setMenuVisibility(false)}
                className="toggle-icon icon-x d-block d-xl-none"
                size={20}
              />
            </div>
          </li>
        </ul>
      </div>
      <div className="workspace-outer">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item w-100">
            <WorkspaceSwitcher />
          </li>
        </ul>
      </div>
    </>
  );
};

export default VerticalMenuHeader;
