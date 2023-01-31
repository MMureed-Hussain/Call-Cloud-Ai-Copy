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
  Badge,
} from "reactstrap";
import { MoreVertical, Edit, Trash } from "react-feather";
import PipelineSidebar from "./components/PipelineSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  getPipelines,
  setPipelines,
  deletePipeline,
  updatePipelinesOrder,
  clonePipelines,
} from "../../redux/pipelines";
import Skeleton from "react-loading-skeleton";
import { debounce, map } from "lodash";
import CloneResourceSidebar from "../../@core/components/custom/CloneResourceSidebar";
import usePrevious from "../../utility/hooks/usePrevious";

export default () => {
  // ** State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cloneSidebarOpen, setCloneSidebarOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pipelines = useSelector((state) => state.pipelines.pipelines);
  console.log("state pipelines", pipelines);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentWorkspace) {
      setIsLoading(true);
      dispatch(getPipelines({ workspace_id: currentWorkspace.id }));
    }
  }, [currentWorkspace]);

  const onUpdate = (data) => {
    data = data.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));
    dispatch(updatePipelinesOrder(data));
  };

  const _onUpdate = useCallback(debounce(onUpdate, 1500), []);

  usePrevious(
    (prevPipelines) => {
      setIsLoading(false);
      if (
        prevPipelines.length &&
        JSON.stringify(map(prevPipelines, "id")) !==
          JSON.stringify(map(pipelines, "id"))
      ) {
        _onUpdate(pipelines);
      }
    },
    [pipelines]
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCloneSidebar = () => {
    setCloneSidebarOpen(!cloneSidebarOpen);
  };

  const onCloneSubmit = (data) => {
    return new Promise((resolve) => {
      dispatch(clonePipelines(data)).then((res) => {
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
          {console.log("pipelines", pipelines)}
          <CardTitle tag="h4">Pipelines</CardTitle>
          <div className="d-flex align-items-center table-header-actions">
            <Button
              color="primary"
              className="me-1"
              onClick={toggleCloneSidebar}
            >
              Clone Pipelines
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setSelectedPipeline(null);
                toggleSidebar();
              }}
            >
              Add Pipeline
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <CardText>
            Click on the row and sort up or down to sort pipelines.
          </CardText>
          <ReactSortable
            tag="ul"
            animation={300}
            className="list-group"
            list={pipelines.map((x) => ({ ...x, chosen: true }))}
            setList={(data) => {
              dispatch(setPipelines(data));
            }}
            delayOnTouchStart={true}
            delay={2}
          >
            {pipelines.map((item) => {
              return (
                <ListGroupItem className="draggable" key={item.id}>
                  {item.is_default === 1 ? (
                    <h5 className="mt-0" style={{ color: item.color }}>
                      {item.name}{" "}
                      <Badge
                        color=""
                        style={{ background: "gray", color: "white" }}
                      >
                        {" "}
                        Default
                      </Badge>
                    </h5>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <h5 className="mt-0" style={{ color: item.color }}>
                        {item.name} <Badge color="success">Customized</Badge>
                      </h5>
                      {!item?.is_default && (
                        <div className="d-flex">
                          <UncontrolledDropdown>
                            <DropdownToggle className="pe-1" tag="span">
                              <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu end>
                              <DropdownItem
                                onClick={() => {
                                  setSelectedPipeline(item);
                                  toggleSidebar();
                                }}
                              >
                                <Edit size={15} />
                                <span className="align-middle ms-50">Edit</span>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>  dispatch(deletePipeline(item.id))
                                }
                              >
                                <Trash size={15} className="me-50" />
                                <span className="align-middle ms-50">
                                  Delete
                                </span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      )}
                    </div>
                  )}
                </ListGroupItem>
              );
            })}
          </ReactSortable>
        </CardBody>
      </Card>
      {sidebarOpen && (
        <PipelineSidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pipeline={selectedPipeline}
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
