// ** React Imports
import React, { Fragment, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

// ** Third Party Components
// import axios from "axios";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Demo Components
import Tabs from "./Tabs";
// import Breadcrumbs from "@components/breadcrumbs";
import BillingTabContent from "./BillingTabContent";
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";
// import ConnectionsTabContent from "./ConnectionsTabContent";
// import NotificationsTabContent from "./NotificationsTabContent";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

import { useSelector } from "react-redux";
// import { getUser } from "@store/auth";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const AccountSettings = () => {
  // ** States
  const query = useQuery();
  const [activeTab, setActiveTab] = useState(() => {
    // check default active tab
    if (query.get("active_tab")) {
      const href = window.location.href.split("?")[0];
      window.history.pushState({}, document.title, href);
      if (query.get("active_tab") === "billing") {
        return "3";
      } else {
        return "1";
      }
    } else {
      return "1";
    }
  });

  // const [activeTab, setActiveTab] = useState("1");
  // console.log("useQuery", useQuery);
  // const [data] = useState(null);

  // check current route if it is /complete-profile or /profile
  const location = useLocation();
  const store = useSelector((state) => {
    return state.auth;
  });

  const toggleTab = (tab) => {
    // console.log(tab, setActiveTab);
    setActiveTab(tab);
  };

  if (
    store.user &&
    store.user.profileCompleted &&
    location.pathname === "/complete-profile"
  ) {
    if (store.user.role === "company") {
      return <Navigate to="/setup-workspaces" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  // useEffect(() => {
  //   axios
  //     .get("/account-setting/data")
  //     .then((response) => setData(response.data));
  // }, []);

  return (
    <Fragment>
      {/* <Breadcrumbs
        title="Account Settings"
        data={[{ title: "Pages" }, { title: "Account Settings" }]}
      /> */}
      {store.user ? (
        <Row>
          {location.pathname === "/profile" ? (
            <Col xs={12}>
              <Tabs
                className="mb-2"
                activeTab={activeTab}
                toggleTab={toggleTab}
              />

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <AccountTabContent data={store.user} />
                </TabPane>
                <TabPane tabId="2">
                  <SecurityTabContent />
                </TabPane>
                <TabPane tabId="3">
                  <BillingTabContent />
                </TabPane>
                <TabPane tabId="4">{/* <NotificationsTabContent /> */}</TabPane>
                <TabPane tabId="5">{/* <ConnectionsTabContent /> */}</TabPane>
              </TabContent>
            </Col>
          ) : (
            <Col className="mx-auto" xs={8}>
              <div className="height-100 d-flex justify-content-center align-items-center">
                <img
                  height={22}
                  src={themeConfig.app.appLogoImage}
                  alt="logo"
                />
                <h2 className="brand-text text-primary ms-1 mb-0">CallCloud</h2>
              </div>
              <AccountTabContent data={store.user} />
            </Col>
          )}
        </Row>
      ) : null}
    </Fragment>
  );
};

export default AccountSettings;
