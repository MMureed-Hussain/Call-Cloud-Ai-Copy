import React, { useState } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";

import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  TabContent,
  TabPane,
  CardText,
} from "reactstrap";

import {
  AlignLeft,
  Bell,
  Bookmark,
  Calendar,
  Clock,
  Settings,
} from "react-feather";
import GeneralTab from "./GeneralTab";
import CalendarSettings from "./CalendarSettings";

const CreateBookingPage = () => {
  const [activeList, setActiveLIst] = useState("1");

  const workspaceStore = useSelector((state) => state.workspaces);

  const toggleList = (list) => {
    if (activeList !== list) {
      setActiveLIst(list);
    }
  };

  return (
    <Row>
      <Col md="4" sm="12">
        <ListGroup tag="div">
          <ListGroupItem
            className={classnames("cursor-pointer py-2", {
              active: activeList === "1",
            })}
            onClick={() => toggleList("1")}
            action
          >
            <div className="d-flex">
              <Settings />
              <span style={{ marginLeft: "10px" }}>General</span>
            </div>
          </ListGroupItem>
          <ListGroupItem
            className={classnames("cursor-pointer py-2", {
              active: activeList === "2",
            })}
            onClick={() => toggleList("2")}
            action
          >
            <Calendar />
            <span style={{ marginLeft: "10px" }}>Calendar and Team</span>
          </ListGroupItem>
          <ListGroupItem
            className={classnames("cursor-pointer py-2", {
              active: activeList === "3",
            })}
            onClick={() => toggleList("3")}
            action
          >
            <Clock />
            <span style={{ marginLeft: "10px" }}>Times and Availability</span>
          </ListGroupItem>
          <ListGroupItem
            className={classnames("cursor-pointer py-2", {
              active: activeList === "4",
            })}
            onClick={() => toggleList("4")}
            action
          >
            <AlignLeft />
            <span style={{ marginLeft: "10px" }}>Booking Form</span>
          </ListGroupItem>
          <ListGroupItem
            className={classnames("cursor-pointer py-2", {
              active: activeList === "5",
            })}
            onClick={() => toggleList("5")}
            action
          >
            <Bell />
            <span style={{ marginLeft: "10px" }}>Notifications</span>
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col md="8" sm="12">
        <TabContent activeTab={activeList}>
          <TabPane tabId="1">
            <GeneralTab workspace={workspaceStore.currentWorkspace} />
          </TabPane>
          <TabPane tabId="2">
            <CalendarSettings />
          </TabPane>
          <TabPane tabId="3">
            <CardText>
              Dragée dessert sweet roll chocolate bar. Gummi bears I love dragée
              pie I love. Cake pastry I love cookie.
            </CardText>
            <CardText>
              Wafer cheesecake cheesecake. Pastry bonbon chocolate pastry
              pudding topping sweet roll lollipop. I love macaroon gummi bears
              cookie topping chocolate bar carrot cake.Sweet roll pastry
              chocolate cake tiramisu dessert marzipan pudding cake. Cake
              macaroon danish jelly beans I love chocolate cookie sugar plum.
              Jelly beans chocolate cake sugar plum carrot cake.
            </CardText>
          </TabPane>
          <TabPane tabId="4">
            <CardText>
              Muffin apple pie fruitcake. Chocolate cake chocolate cake oat cake
              I love soufflé brownie. I love marshmallow topping marshmallow I
              love.
            </CardText>
            <CardText>
              Caramels chocolate lollipop marshmallow croissant jelly beans
              jelly donut I love. Gummies toffee marshmallow ice cream biscuit.
              Candy sweet cupcake.Sugar plum cotton candy cupcake chocolate cake
              candy liquorice biscuit. Icing powder biscuit dragée gummies
              fruitcake I love. Sweet jelly-o fruitcake powder. Dessert gummi
              bears cake gingerbread tiramisu cake I love caramels dessert.
            </CardText>
          </TabPane>
          <TabPane tabId="5">
            <CardText>
              Muffin apple pie fruitcake. Chocolate cake chocolate cake oat cake
              I love soufflé brownie. I love marshmallow topping marshmallow I
              love.
            </CardText>
            <CardText>
              Caramels chocolate lollipop marshmallow croissant jelly beans
              jelly donut I love. Gummies toffee marshmallow ice cream biscuit.
              Candy sweet cupcake.Sugar plum cotton candy cupcake chocolate cake
              candy liquorice biscuit. Icing powder biscuit dragée gummies
              fruitcake I love. Sweet jelly-o fruitcake powder. Dessert gummi
              bears cake gingerbread tiramisu cake I love caramels dessert.
            </CardText>
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  );
};
export default CreateBookingPage;
