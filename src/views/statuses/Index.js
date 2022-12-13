// ** React Imports
import { useEffect, useState, useCallback } from "react";

// ** Third Party Components
import { ReactSortable } from "react-sortablejs";
import Skeleton from "react-loading-skeleton";
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
import { getStatuses, deleteStatus, setStatuses, updateStatusOrder, cloneStatuses } from "../../redux/statuses";
import CallStatusSidebar from "./components/CallStatusSidebar";
import { debounce } from "lodash";
import CloneResourceSidebar from "../../@core/components/custom/CloneResourceSidebar";

export default () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCallStatus, setSelectedCallStatus] = useState(null);
  const [cloneSidebarOpen, setCloneSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const statuses = useSelector((state) => state.statuses.statuses);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentWorkspace) {
      setIsLoading(true);
      dispatch(getStatuses({ workspace_id: currentWorkspace.id }));
    }
  }, [currentWorkspace]);

  useEffect(() => {
    setIsLoading(false);
  }, [statuses]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCloneSidebar = () => {
    setCloneSidebarOpen(!cloneSidebarOpen);
  };

  const onUpdate = (data) => {
    if (data.length) {
      data = data.map((item, index) => ({
        id: item.id,
        order: index + 1,
      }));
      dispatch(updateStatusOrder(data));
    }
  };

  const onCloneSubmit = (data) => {
    return new Promise(resolve => {
      dispatch(cloneStatuses(data)).then(res => {
        if (res.payload.data) {
          return resolve(true)
        }
        resolve(false)
      })
    })
  }

  const _onUpdate = useCallback(debounce(onUpdate, 1500), []);
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
              color="primary"
              className="me-1"
              onClick={toggleCloneSidebar}
            >
              Clone Statuses
            </Button>
            <Button
              color="primary"
              onClick={toggleSidebar}
            >
              Add Status
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <CardText>
            Click on the row and sort up or down to sort statuses.
          </CardText>
          <ReactSortable
            tag="ul"
            animation={300}
            className="list-group"
            list={statuses}
            setList={(data) => {
              dispatch(setStatuses(data));
              _onUpdate(data);
            }}
            delayOnTouchStart={true}
            delay={2}
          >
            {statuses.map((item) => {
              return (
                <ListGroupItem className="draggable" key={item.name}>
                  <div className="d-flex justify-content-between">
                    <h5 className="mt-0">{item.name}</h5>
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
          </ReactSortable>
        </CardBody>
      </Card>
      {sidebarOpen && (
        <CallStatusSidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          status={selectedCallStatus}
        />
      )}
      {cloneSidebarOpen && (
        <CloneResourceSidebar
          open={cloneSidebarOpen}
          toggleSidebar={toggleCloneSidebar}
          targetAction={onCloneSubmit}
        />
      )}
    </>
  );
};
