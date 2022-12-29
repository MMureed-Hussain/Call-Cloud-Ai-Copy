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
import StatusSidebar from "./components/StatusSidebar";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { debounce, map } from "lodash";
import CloneResourceSidebar from "../../@core/components/custom/CloneResourceSidebar";
import usePrevious from "../../utility/hooks/usePrevious";

export default ({
    moduleName,
    getStatuses,
    setStatuses,
    deleteStatus,
    updateStatusesOrder,
    cloneStatuses
}) => {
    // ** State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cloneSidebarOpen, setCloneSidebarOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const statuses = useSelector(
        (state) => state[moduleName]?.statuses
    );
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

    const onUpdate = (data) => {
        data = data.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
        dispatch(updateStatusesOrder(data));
    };

    const _onUpdate = useCallback(debounce(onUpdate, 1500), []);

    usePrevious(
        (prevValues) => {
            setIsLoading(false);
            if (
                prevValues.length &&
                JSON.stringify(map(prevValues, "id")) !==
                JSON.stringify(map(statuses, "id"))
            ) {
                _onUpdate(statuses);
            }
        },
        [statuses]
    );

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCloneSidebar = () => {
        setCloneSidebarOpen(!cloneSidebarOpen);
    };

    const onCloneSubmit = (data) => {
        return new Promise((resolve) => {
            dispatch(cloneStatuses(data)).then((res) => {
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
                    <CardTitle tag="h4">Statuses</CardTitle>
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
                            onClick={() => {
                                setSelectedStatus(null);
                                toggleSidebar();
                            }}
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
                        }}
                        delayOnTouchStart={true}
                        delay={2}
                    >
                        {statuses.map((item) => {
                            return (
                                <ListGroupItem className="draggable" key={item.id}>
                                    {item.is_default === 1 ? (
                                        <h5 className="mt-0">{item.name}</h5>
                                    ) : (
                                        <div className="d-flex justify-content-between">
                                            <h5 className="mt-0">{item.name}</h5>
                                                {!(item?.is_default) && <div className="d-flex">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle className="pe-1" tag="span">
                                                            <MoreVertical size={15} />
                                                        </DropdownToggle>
                                                        <DropdownMenu end>
                                                            <DropdownItem
                                                                onClick={() => {
                                                                    setSelectedStatus(item);
                                                                    toggleSidebar();
                                                                }}
                                                            >
                                                                <Edit size={15} />
                                                                <span className="align-middle ms-50">Edit</span>
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => dispatch(deleteStatus(item.id))
                                                                }
                                                            >
                                                                <Trash size={15} className="me-50" />
                                                                <span className="align-middle ms-50">Delete</span>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </div>}
                                        </div>
                                    )}
                                </ListGroupItem>
                            );
                        })}
                    </ReactSortable>
                </CardBody>
            </Card>
            {sidebarOpen && (
                <StatusSidebar
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    clientStatus={selectedStatus}
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