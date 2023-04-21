/* eslint-disable */
import { Link, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import PaginationWrapper from "@src/@core/components/custom/PaginationWrapper";
import { Row, Col, Button, Card, CardHeader, CardTitle, Table, Input, FormGroup, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles, setReloadTable } from "../../redux/profiles";
import { getStatusesOptions } from "../../redux/statuses";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import PhoneInput from "react-phone-input-2";
import UserInfo from "./components/UserInfo";
import ProfileSidebar from "./components/ProfileSidebar";

const getProfileType = (path) => { return path === '/leads' ? 'lead' : 'client' };

export default () =>
{

    const location = useLocation();
    const dispatch = useDispatch();
    const profileType = getProfileType(location.pathname);
    const profileSidebarRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const per_page = useSelector((state) => state.layout.pagination.per_page);
    const profiles = useSelector((state) => state.profiles.profiles);
    const reload = useSelector((state) => state.profiles.reloadTable);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const [data, setData] = useState({ sort: 'desc', orderby: 'created_at', per_page: per_page, search: '', type: profileType });

    const clientOptions = useSelector((state) => state.statuses.client_options);
    const leadOptions = useSelector((state) => state.statuses.lead_options);
    const pipelineOptions = useSelector((state) => state.statuses.pipeline_options);

    useEffect(() =>
    {
        dispatch(getStatusesOptions());
    }, []);


    useEffect(() =>
    {
        loadData();
    }, [data, currentWorkspace]);

    useEffect(() =>
    {
        if (reload) {
            dispatch(setReloadTable(false));
            loadData();
        }
    }, [reload]);


    const loadData = (options) =>
    {
        if (currentWorkspace) {
            let queryParams = {
                workspace_id: currentWorkspace.id,
                ...data,
                ...options,
            };
            dispatch(getProfiles(queryParams));
        }
    };

    const perPageOptions = [
        { value: 15, label: 15 },
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 100, label: 100 }
    ];

    const handleSelectChange = (e, name) =>
    {
        let target = {
            name,
            type: 'input',
            value: e.value,
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

    if (!profiles.data) {
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
                    <CardTitle tag="h4"> {profileType == 'lead' ? 'Lead Profile' : 'Client Profile'}</CardTitle>
                    {profileType == 'lead' && <Button onClick={() => profileSidebarRef.current.handleShow(null)}>Add Profile</Button>}
                </CardHeader>
                <div className="p-1">
                    <Row>
                        <Col lg="10">
                            <Row>
                                <Col lg="2">
                                    <Select
                                        classNamePrefix="select"
                                        options={perPageOptions}
                                        onChange={e => handleSelectChange(e, 'per_page')}
                                        placeholder="Per Page" className="mb-2"
                                    />
                                </Col>
                                <Col lg="2">
                                    <Select
                                        classNamePrefix="select"
                                        onChange={e => handleSelectChange(e, 'status_id')}
                                        options={profileType == 'client' ? [{ value: '', label: 'None' }, ...clientOptions] : [{ value: '', label: 'None' }, ...leadOptions]}
                                        className="mb-2"
                                        placeholder={profileType == 'client' ? 'Client Status' : 'Lead Status'}
                                    />
                                </Col>
                                <Col lg="2">
                                    <Select
                                        classNamePrefix="select"
                                        onChange={e => handleSelectChange(e, 'pipeline_id')}
                                        options={[{ value: '', label: 'None' }, ...pipelineOptions]}
                                        className="mb-2"
                                        placeholder="Pipeline"
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="2">
                            <div className="d-flex align-center flex-wrap gap-4 mb-2">
                                <Input
                                    name="search"
                                    value={data.search}
                                    onChange={e => handleChange(e)}
                                    placeholder="Search..."
                                    style={{ maxHeight: '40px' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="react-dataTable">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Pipeline</th>
                                <th>Created By</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.data && profiles.data.map((row, ind) =>
                                <tr key={ind} >
                                    <td>
                                        <Link to={`/${row.type === "lead" ? "leads" : "clients"}/${row.id}`}>
                                            {row.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <PhoneInput className="phone-placeholder" country={"us"} value={row.phone} disableSearchIcon disabled />
                                    </td>
                                    <td>
                                        {(row.type == 'lead' && row.lead_status) && <Badge color="warning">{row?.lead_status.name}</Badge>}
                                        {(row.type == 'client' && row.client_status) && <Badge color="warning">{row?.client_status.name}</Badge>}
                                    </td>
                                    <td>
                                        {row?.pipeline && <Badge color="info">{row?.pipeline.name}</Badge>}
                                    </td>
                                    <td>
                                        {row.created_by &&

                                            <UserInfo
                                                name={`${row.created_by.first_name} ${row.created_by.last_name}`}
                                                email={row.created_by.email}
                                            />
                                        }
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
                                                    <DropdownItem onClick={() => profileSidebarRef.current.handleShow(row)} >
                                                        <Edit size={15} />
                                                        <span className="align-middle ms-50">Edit</span>
                                                    </DropdownItem>
                                                    {/* <DropdownItem onClick={() => dispatch(deleteResource(row.id))}>
                                                        <Trash size={15} />
                                                        <span className="align-middle ms-50">Delete</span>
                                                    </DropdownItem> */}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {(profiles && !Boolean(profiles.data.length)) && <tr><td colSpan={12} className="text-center">No data Found!</td></tr>}
                        </tbody>
                    </Table>
                </div>
                <PaginationWrapper paginate={profiles} callback={loadData} />
            </Card>

            {/* Modals */}
            <ProfileSidebar
                pipelineOptions={pipelineOptions}
                leadOptions={leadOptions}
                clientOptions={clientOptions}
                type={profileType}
                ref={profileSidebarRef}
            />
        </>

    );
};
