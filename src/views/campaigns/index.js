/* eslint-disable */
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import PaginationWrapper from "@src/@core/components/custom/PaginationWrapper";
import { Row, Col, Button, Card, CardHeader, CardTitle, Table, Input, FormGroup, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignsList, getTeamsByWorkspace, setReload, deleteCampaign } from "../../redux/campaigns";
import CampaignSidebar from './components/CampaignSidebar';
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
export default () =>
{
    const dispatch = useDispatch();
    const campaignSidebarRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const per_page = useSelector((state) => state.layout.pagination.per_page);
    const campaigns = useSelector((state) => state.campaigns.campaigns);
    const reload = useSelector((state) => state.campaigns.reload);
    const teams = useSelector((state) => state.campaigns.teams);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const [data, setData] = useState({ sort: 'desc', orderby: 'created_at', per_page: per_page, search: '', from_date: '', to_date: '' });

    useEffect(() =>
    {
        if (currentWorkspace) {
            dispatch(getTeamsByWorkspace({ id: currentWorkspace.id }));
        }
    }, [currentWorkspace]);


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
            let queryParams = {
                workspace_id: currentWorkspace.id,
                ...data,
                ...options,
            };
            
            dispatch(getCampaignsList(queryParams));
        }
    };

    const perPageOptions = [
        { value: 15, label: 15 },
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 100, label: 100 }
    ];
    const statusOptions = [
        { value: '', label: 'None' },
        { value: 0, label: 'Inactive' },
        { value: 1, label: 'Active' },
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

    if (!campaigns.data) {
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
                    <CardTitle tag="h4">Campaigns</CardTitle>
                    <Button onClick={() => campaignSidebarRef.current.handleShow()}>
                        Add Campaign
                    </Button>
                </CardHeader>
                <div className="p-1">
                    <Row>
                        <Col lg="10">
                            <Row>
                                <Col lg="3">
                                    <Select classNamePrefix="select" options={perPageOptions} onChange={e => handleSelectChange(e, 'per_page')} placeholder="Per Page" className="mb-2" />
                                </Col>
                                <Col lg="3">
                                    <Select classNamePrefix="select" onChange={e => handleSelectChange(e, 'team_id')} options={[{ value: '', label: 'None' }, ...teams,]} className="mb-2" placeholder="Select Team" />
                                </Col>
                                <Col lg="2">
                                    <Select classNamePrefix="select" onChange={e => handleSelectChange(e, 'status')} options={statusOptions} className="mb-2" placeholder="Status" />
                                </Col>
                                <Col lg="2">
                                    <div className="mb-1">
                                        <Input name="from_date" type="date" value={data.from_date} onChange={e => handleChange(e)} placeholder="From date" />
                                    </div>
                                </Col>
                                <Col lg="2">
                                    <div className="mb-1">
                                        <Input name="to_date" type="date" value={data.to_date} onChange={e => handleChange(e)} placeholder="From date" />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="2">
                            <div className="d-flex align-center flex-wrap gap-4 mb-2">
                                <Input name="search" value={data.search} onChange={e => handleChange(e)} placeholder="Search..." style={{ maxHeight: '40px' }} />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="react-dataTable">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>Team</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.data && campaigns.data.map((row, ind) =>
                                <tr key={ind} >
                                    <td style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: '20ch' }}>{row.title}  </td>
                                    <td style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: '10ch' }}>{row.description} </td>
                                    <td>
                                        <Badge
                                            color={`${row.status ? 'success' : 'danger'}`}
                                            className={`badge-glow`}>
                                            {row.status ? 'ACTIVE' : 'INACTIVE'}
                                        </Badge>
                                    </td>
                                    <td>{row.start_date}</td>
                                    <td>{row.team.team_name}</td>
                                    <td>{row.created_at}</td>
                                    <td>{row.updated_at}</td>
                                    <td>
                                        <div className="text-center">
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="cursor-pointer" tag="span">
                                                    <MoreVertical size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu container={"body"} end>
                                                    <DropdownItem onClick={() => campaignSidebarRef.current.handleShow(row)} >
                                                        <Edit size={15} />
                                                        <span className="align-middle ms-50">Edit</span>
                                                    </DropdownItem>
                                                    {/* <DropdownItem onClick={() => dispatch(deleteCampaign(row.id))}>
                                                        <Trash size={15} />
                                                        <span className="align-middle ms-50">Delete</span>
                                                    </DropdownItem> */}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {(campaigns && !Boolean(campaigns.data.length)) && <tr><td colSpan={12} className="text-center">No data Found!</td></tr>}
                        </tbody>
                    </Table>
                </div>
                <PaginationWrapper paginate={campaigns} callback={loadData} />
            </Card>

            {/* Modals */}
            <CampaignSidebar teams={teams} ref={campaignSidebarRef} />
        </>

    );
};
