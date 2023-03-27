// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { User, Lock, Bookmark, Link, Bell } from "react-feather";
import { useSelector } from "react-redux";

const Tabs = ({ activeTab, toggleTab }) => {
  const store = useSelector((state) => {
    return state.auth;
  });
  const workspaceUsers = useSelector((state) => state.workspaces.users);

  const transformedUsers = workspaceUsers.map((user) => ({
    value: user.id,
    label: user.name,
    email: user.email,
    userRole: user.userRole,
  }));
  const isAdmin = transformedUsers.find((user) => user.email === store.user.email && user.userRole === 'admin');


  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <User size={18} className="me-50" />
          <span className="fw-bold">Account</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <Lock size={18} className="me-50" />
          <span className="fw-bold">Security</span>
        </NavLink>
      </NavItem>
      
      {isAdmin &&
        <NavItem>
          <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
            <Bookmark size={18} className="me-50" />
            <span className="fw-bold">Billing & Plans</span>
          </NavLink>
        </NavItem>
      }
      {/*<NavItem>
        <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
          <Bell size={18} className='me-50' />
          <span className='fw-bold'>Notifications</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
          <Link size={18} className='me-50' />
          <span className='fw-bold'>Connections</span>
        </NavLink>
      </NavItem> */}
    </Nav>
  );
};

export default Tabs;
