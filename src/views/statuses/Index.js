// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import { ReactSortable } from "react-sortablejs";
// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Button,
  UncontrolledDropdown,
  ListGroupItem,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { MoreVertical, Edit, Trash } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { getStatuses, deleteStatus } from "../../redux/statuses";
import CallSliderSidebar from "./components/CallStatusesSidebar";

export default () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCallStatus, setSelectedCallStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const statuses = useSelector((state) => state.statuses.statuses);

  const dispatch = useDispatch();

  useEffect(() => {
    // if (currentWorkspace) {
    setIsLoading(true);
    dispatch(getStatuses());
    // }
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [statuses]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="vh-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Call Statuses</CardTitle>
          <div className="d-flex align-items-center table-header-actions">
            <Button
              className="add-new-user"
              color="primary"
              onClick={toggleSidebar}
            >
              Add Call-Status
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <CardText>
            Click and Check the status of each call in Call-Status.
          </CardText>
          {/* <ReactSortable
            tag="ul"
            animation={300}
            className="list-group"
            list={statuses}
            setList={(data) => {
              dispatch(setPipelines(data));
              _onUpdate(data);
            }}
            delayOnTouchStart={true}
            delay={2}
          > */}
          {statuses.map((item) => {
            return (
              <ListGroupItem className="draggable" key={item.name}>
                <div className="d-flex justify-content-between">
                  <h5 className="mt-0">{item.name}</h5>
                  <h5 className="mt-0">{item.order}</h5>
                  <div className="d-flex">
                    <UncontrolledDropdown>
                      <DropdownToggle className="pe-1" tag="span">
                        <MoreVertical size={15} />
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem
                          onClick={() => {
                            setSelectedCallStatus(item);
                            toggleSidebar();
                          }}
                        >
                          <Edit size={15} />
                          <span className="align-middle ms-50">Edit</span>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => dispatch(deleteStatus(item.id))}
                        >
                          <Trash size={15} className="me-50" />
                          <span className="align-middle ms-50">Delete</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
              </ListGroupItem>
            );
          })}
          {/* </ReactSortable> */}
        </CardBody>
      </Card>
      {sidebarOpen && (
        <CallSliderSidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pipeline={selectedCallStatus}
        />
      )}
    </>
  );
};
