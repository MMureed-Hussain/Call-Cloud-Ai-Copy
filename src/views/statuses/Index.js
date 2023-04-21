/* eslint-disable */
import { Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import PaginationWrapper from "@src/@core/components/custom/PaginationWrapper";
import { Row, Col, Button, Card, CardHeader, CardTitle, Table, Input, FormGroup, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getStatuses, setReload, deleteStatus } from "../../redux/statuses";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import StatusSidebar from "./components/StatusSidebar";
import { statusOptions, perPageOptions } from "@utils";
import UserInfo from "../profiles/components/UserInfo";
import { Co } from "react-flags-select";
export default () =>
{
    const dispatch = useDispatch();
    const statusSidebarRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const per_page = useSelector((state) => state.layout.pagination.per_page);
    const statuses = useSelector((state) => state.statuses.statuses);
    const reload = useSelector((state) => state.statuses.reload);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const [data, setData] = useState({ sort: 'desc', orderby: 'created_at', per_page: per_page, type: [], });

    useEffect(() =>
    {
        loadData();
    }, [data, currentWorkspace]);


    useEffect(() =>
    {
        if (reload) {
            dispatch(setReload(false));
            loadData();
        }
    }, [reload]);

    const loadData = (options) =>
    {
        if (currentWorkspace) {
            let queryParams = { ...data, ...options };
            dispatch(getStatuses(queryParams));
        }
    };


    const handleSelectChange = (e, name) =>
    {
        let target = {
            name,
            type: 'input',
            value: e.value,
        };

        handleChange({ target });
    }


    const handleCheckbox = (e) =>
    {
        let statuses = e.target.checked ? [...data.type, e.target.value] : data.type.filter(item => item !== e.target.value);
        let target = {
            name: 'type',
            type: 'input',
            value: statuses,
        };

        handleChange({ target });

    }

    const handleChange = (e) =>
    {
        const key = e.target.name;
        const value = e.target.type == 'checkbox' ? e.target.checked : e.target.value;

        setData(data => ({
            ...data,
            [key]: value,
        }));

    }


    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!statuses.data) {
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
                <CardHeader className="py-1">
                    <CardTitle tag="h4">Statuses</CardTitle>
                    <Button onClick={() => statusSidebarRef.current.handleShow()}> Add Status</Button>
                </CardHeader>
                <div className="p-1">
                    <Row>
                        <Col lg="10">
                            <Row>
                                <Col lg="2">
                                    <Select classNamePrefix="select" options={perPageOptions} onChange={e => handleSelectChange(e, 'per_page')} placeholder="Per Page" className="mb-2" />
                                </Col>

                                {statusOptions && statusOptions.map((op, ind) =>
                                    <Col lg="2">
                                        <FormGroup className="mb-2" inline check key={ind}>
                                            <Label check>{op.value.replace('_', ' ')} {' '}</Label>
                                            <Input value={op.value} type="checkbox" onChange={(e) => handleCheckbox(e)} />
                                        </FormGroup>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="react-dataTable">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Created by</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statuses.data && statuses.data.map((row, ind) =>
                                <tr key={ind} >
                                    <td>{row.name}</td>
                                    <td>
                                        {row.type == 'CALL' && <Badge color="danger">{row.type}</Badge>}
                                        {row.type == 'CLIENT' && <Badge color="info">{row.type}</Badge>}
                                        {row.type == 'LEAD_PROFILE' && <Badge color="primary">{row.type.replace('_', ' ')}</Badge>}
                                        {row.type == 'PIPELINE' && <Badge color="success">{row.type}</Badge>}
                                    </td>
                                    <td>
                                        <UserInfo
                                            name={`${row.created_by.first_name} ${row.created_by.last_name}`}
                                            email={row.created_by.email}
                                        />
                                    </td>
                                    <td>{row.created_at}</td>
                                    <td>{row.updated_at}</td>
                                    <td>
                                        <div className="text-center">
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="cursor-pointer" tag="span">
                                                    <MoreVertical size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu container={"body"} end>
                                                    <DropdownItem onClick={() => statusSidebarRef.current.handleShow(row)} >
                                                        <Edit size={15} />
                                                        <span className="align-middle ms-50">Edit</span>
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => dispatch(deleteStatus(row.id))}>
                                                        <Trash size={15} />
                                                        <span className="align-middle ms-50">Delete</span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {(statuses && !Boolean(statuses.data.length)) && <tr><td colSpan={12} className="text-center">No data Found!</td></tr>}
                        </tbody>
                    </Table>
                </div>
                <PaginationWrapper paginate={statuses} callback={loadData} />
            </Card >

            {/* Modals */}
            <StatusSidebar ref={statusSidebarRef} />
        </>

    );
};
