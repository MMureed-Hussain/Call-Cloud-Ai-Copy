// ** React Imports
import { useEffect, useState, useCallback } from "react";
// ** Third Party Components
import { ReactSortable } from "react-sortablejs";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  ListGroupItem,
  Button,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { MoreVertical, Edit, Trash } from "react-feather";
import ClientStatusSidebar from "./components/ClientStatusSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientStatuses,
  setClientStatuses,
  deleteClientStatus,
  updateClientStatusesOrder,
  cloneClientStatuses,
} from "../../redux/clientStatuses";
import Skeleton from "react-loading-skeleton";
import { debounce, map } from "lodash";
import CloneResourceSidebar from "../../@core/components/custom/CloneResourceSidebar";
import usePrevious from "../../utility/hooks/usePrevious";

export default () => {
  // ** State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cloneSidebarOpen, setCloneSidebarOpen] = useState(false);
  const [selectedClientStatus, setSelectedClientStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const clientStatuses = useSelector(
    (state) => state.clientStatuses.clientStatuses
  );
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentWorkspace) {
      setIsLoading(true);
      dispatch(getClientStatuses({ workspace_id: currentWorkspace.id }));
    }
  }, [currentWorkspace]);

  const onUpdate = (data) => {
    data = data.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));
    dispatch(updateClientStatusesOrder(data));
  };

  const _onUpdate = useCallback(debounce(onUpdate, 1500), []);

  usePrevious(
    (prevValues) => {
      setIsLoading(false);
      if (
        prevValues.length &&
        JSON.stringify(map(prevValues, "id")) !==
          JSON.stringify(map(clientStatuses, "id"))
      ) {
        _onUpdate(clientStatuses);
      }
    },
    [clientStatuses]
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCloneSidebar = () => {
    setCloneSidebarOpen(!cloneSidebarOpen);
  };

  const onCloneSubmit = (data) => {
    return new Promise((resolve) => {
      dispatch(cloneClientStatuses(data)).then((res) => {
        if (res.payload.data) {
          return resolve(true);
        }
        resolve(false);
      });
    });
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
          <CardTitle tag="h4">Client Statuses</CardTitle>
          <div className="d-flex align-items-center table-header-actions">
            {/* <Button
              color="primary"
              className="me-1"
              onClick={toggleCloneSidebar}
            >
            Clone Statuses
            </Button> */}
            <Button
              color="primary"
              onClick={() => {
                setSelectedClientStatus(null);
                toggleSidebar();
              }}
            >
              Add Status
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <CardText>
            Click on the row and sort up or down to sort client statuses.
          </CardText>
          <ReactSortable
            tag="ul"
            animation={300}
            className="list-group"
            list={clientStatuses}
            setList={(data) => {
              dispatch(setClientStatuses(data));
            }}
            delayOnTouchStart={true}
            delay={2}
          >
            {clientStatuses.map((item) => {
              return (
                <ListGroupItem className="draggable" key={item.name}>
                  {item.is_default === 1 ? (
                    <h5 className="mt-0">{item.name}</h5>
                  ) : (
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
                                setSelectedClientStatus(item);
                                toggleSidebar();
                              }}
                            >
                              <Edit size={15} />
                              <span className="align-middle ms-50">Edit</span>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => dispatch(deleteClientStatus(item.id))
                              }
                            >
                              <Trash size={15} className="me-50" />
                              <span className="align-middle ms-50">Delete</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  )}
                  {/* <div className="d-flex justify-content-between">
                    <h5 className="mt-0">{item.name}</h5>
                    <div className="d-flex">
                      <UncontrolledDropdown>
                        <DropdownToggle className="pe-1" tag="span">
                          <MoreVertical size={15} />
                        </DropdownToggle>
                        <DropdownMenu end>
                          <DropdownItem
                            onClick={() => {
                              setSelectedLeadStatus(item);
                              toggleSidebar();
                            }}
                          >
                            <Edit size={15} />
                            <span className="align-middle ms-50">Edit</span>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => dispatch(deleteLeadStatus(item.id))}
                          >
                            <Trash size={15} className="me-50" />
                            <span className="align-middle ms-50">Delete</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div> */}
                </ListGroupItem>
              );
            })}
          </ReactSortable>
        </CardBody>
      </Card>
      {sidebarOpen && (
        <ClientStatusSidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          clientStatus={selectedClientStatus}
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
