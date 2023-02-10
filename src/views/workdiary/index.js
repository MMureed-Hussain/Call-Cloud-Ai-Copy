/* eslint-disable */
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import Select from "react-select";
import { Row, Col, Button, Card, CardHeader, CardTitle, Badge, Table, Input, FormGroup, Label } from "reactstrap";
import PaginationWrapper from "@src/@core/components/custom/PaginationWrapper";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getSessionList } from "../../redux/timers";
import { getUsersOfWorkspace } from "../../redux/workspaces";
import { getTeamsByWorkspace } from "../../redux/campaigns";
import UserInfo from "../profiles/components/UserInfo";

export default () =>
{
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const per_page = useSelector((state) => state.layout.pagination.per_page);
    const timers = useSelector((state) => state.timers.timers);
    const teams = useSelector((state) => state.campaigns.teams);
    const workspaceusers = useSelector((state) => state.workspaces.workspaceusers);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const [data, setData] = useState({ sort: 'desc', orderby: 'created_at', per_page: per_page, search: '' });

    useEffect(() =>
    {
        if (currentWorkspace) {
            dispatch(getTeamsByWorkspace({ id: currentWorkspace.id }));
            dispatch(getUsersOfWorkspace({ id: currentWorkspace.id }));

        }


    }, [currentWorkspace]);


    useEffect(() =>
    {
        loadData();
    }, [data, currentWorkspace]);

    const loadData = (options) =>
    {
        if (currentWorkspace) {
            let queryParams = {
                workspace_id: currentWorkspace.id,
                ...data,
                ...options,
            };

            dispatch(getSessionList(queryParams));
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

    if (!timers.data) {
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
                    <CardTitle tag="h4"></CardTitle>
                </CardHeader>
                <div className="p-1">
                    <Row>
                        <Col lg="10">
                            <Row>
                                <Col lg="2">
                                    <FormGroup>
                                        <Select options={perPageOptions} onChange={e => handleSelectChange(e, 'per_page')} placeholder="Per Page" className="mb-2" />
                                    </FormGroup>
                                </Col>
                                {/* <Col lg="2">
                                    <FormGroup>
                                        <Select onChange={e => handleSelectChange(e, 'team_id')} options={[{ value: '', label: 'None' }, ...teams,]} className="mb-2" placeholder="Select Team" />
                                    </FormGroup>
                                </Col> */}
                                {user.role == 'company' &&
                                    <Col lg="4">
                                        <FormGroup>
                                            <Select onChange={e => handleSelectChange(e, 'user_id')} options={[{ value: '', label: 'None' }, ...workspaceusers,]} className="mb-2" placeholder="Select User" />
                                        </FormGroup>
                                    </Col>
                                }
                                <Col lg="2">
                                    <FormGroup>
                                        <Input name="from_date" type="date" value={data.from_date} onChange={e => handleChange(e)} placeholder="From date" />
                                    </FormGroup>
                                </Col>
                                <Col lg="2">
                                    <FormGroup>
                                        <Input name="to_date" type="date" value={data.to_date} onChange={e => handleChange(e)} placeholder="From date" />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        {/* <Col lg="2">
                            <FormGroup>
                                <Input name="search" value={data.search} onChange={e => handleChange(e)} placeholder="Search..." style={{ maxHeight: '40px' }} />
                            </FormGroup>
                        </Col> */}
                    </Row>
                </div>
                <div className="react-dataTable">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>User</th>
                                {/* <th>Team</th> */}
                                <th>Workspace</th>
                                <th>Logged In</th>
                                <th>Logged Out</th>
                                <th>Total Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timers.data && timers.data.map((row, ind) =>
                                <tr key={ind} >
                                    <td>
                                        <UserInfo
                                            name={`${row.user.first_name} ${row.user.last_name}`}
                                            email={row.user.email}
                                        />
                                    </td>
                                    <td>{row.workspace.name}</td>
                                    <td>{row.started_at}</td>
                                    <td>{row.stopped_at}</td>
                                    <td>{row.total_time}</td>
                                </tr>
                            )}

                            {(timers && !Boolean(timers.data.length)) && <tr><td colSpan={6} className="text-center">No data Found!</td></tr>}
                        </tbody>
                    </Table>
                </div>
                {/* <PaginationWrapper paginate={timers} callback={loadData} /> */}
            </Card>
        </>
    );
};
