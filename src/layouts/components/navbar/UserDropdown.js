// ** React Imports
/* eslint-disable */
import { Link, Navigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import
{
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
  DollarSign,
} from "react-feather";

// ** Reactstrap Imports
import
{
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
// import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";

const defaultAvatar =
  require("@src/assets/images/avatars/avatar-blank.png").default;

import { useDispatch, useSelector } from "react-redux";

import { logout } from "@store/auth";
// import { getUsers } from "../../../redux/workspaces";
// import { useEffect } from "react";

const UserDropdown = () =>
{
  const dispatch = useDispatch();

  const store = useSelector((state) =>
  {
    return state.auth;
  });

  // const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
  const workspaceUsers = useSelector((state) => state.workspaces.users);

  // Transform the workspaceUsers array into an array of objects with the desired properties
  const transformedUsers = workspaceUsers.map((user) => ({
    value: user.id,
    label: user.name,
    email: user.email,
    userRole: user.userRole,
  }));

  // useEffect(() => {
  //   if (transformedUsers.length !== 0) {
  //     dispatch(getUsers({ id: currentWorkspace.id, perPage: 50, page: 1 }));
  //     console.log('userssll', transformedUsers);
  //   }
  // }, []);

  const isAdmin = transformedUsers.find(
    (user) => user.email === store.user.email && user.userRole === "admin"
  );

  const handleLogout = () =>
  {
    dispatch(logout());
  };

  if (!store.user) {
    return <p>...</p>;
  }

  // const isAdmin = store.user.userRole === "admin";
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}>
        {/* <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold m-0">{store.user.firstName}</span>
          <span className="user-status">Admin</span>
        </div> */}

        <Avatar
          img={store.user.avatar ? store.user.avatar : defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem
          tag={Link}
          to="/profile"
        // onClick={(e) => e.preventDefault()}
        >
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>

        {isAdmin && (
          <DropdownItem
            tag={Link}
            to="/profile?active_tab=billing"
          // onClick={(e) => e.preventDefault()}
          >
            <DollarSign size={14} className="me-75" />
            <span className="align-middle">Billing & Plans</span>
          </DropdownItem>
        )}

        {/* <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <Mail size={14} className="me-75" />
          <span className="align-middle">Inbox</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <CheckSquare size={14} className="me-75" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <MessageSquare size={14} className="me-75" />
          <span className="align-middle">Chats</span>
        </DropdownItem> */}
        <DropdownItem divider />
        {/* <DropdownItem
          tag={Link}
          to="/pages/"
          onClick={(e) => e.preventDefault()}
        >
          <Settings size={14} className="me-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <CreditCard size={14} className="me-75" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <HelpCircle size={14} className="me-75" />
          <span className="align-middle">FAQ</span>
        </DropdownItem> */}

        <DropdownItem onClick={() => handleLogout()}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
