/* eslint-disable */
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import { Row, Col, Card, CardHeader, CardTitle, Badge, Table, Input, FormGroup, CardBody } from "reactstrap";
import PaginationWrapper from "@src/@core/components/custom/PaginationWrapper";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getSessionList, setReload } from "../../redux/timers";
import { getUsersOfWorkspace } from "../../redux/workspaces";
import { getCompaignsByWorkspace, getTeamsByWorkspace } from "../../redux/campaigns";
import UserInfo from "../profiles/components/UserInfo";


export default () =>
{
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const per_page = useSelector((state) => state.layout.pagination.per_page);
    const timers = useSelector((state) => state.timers.timers);
    const total_time = useSelector((state) => state.timers.total_time);
    const total_call = useSelector((state) => state.timers.total_call);
    const calls = useSelector((state) => state.timers.calls);
    const reload = useSelector((state) => state.timers.reload);
    const teams = useSelector((state) => state.campaigns.teams);
    const workspaceusers = useSelector((state) => state.workspaces.workspaceusers);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const campaignsOptions = useSelector((state) => state.campaigns.campaignsOptions);
    const [data, setData] = useState({ sort: 'desc', orderby: 'created_at', per_page: per_page, search: '' });
     console.warn("timers", timers)

    useEffect(() =>
    {
        if (currentWorkspace) {
            dispatch(getTeamsByWorkspace({ id: currentWorkspace.id }));
            dispatch(getUsersOfWorkspace({ id: currentWorkspace.id }));
            dispatch(getCompaignsByWorkspace({ id: currentWorkspace.id }));

        }

    }, [currentWorkspace]);


    useEffect(() =>
    {
        if (reload) {
            dispatch(setReload(false));
            loadData();
        }
    }, [reload]);


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

    const averageCallsPerHour = () =>
    {
        if (total_call == 0 || total_time == '0:00:00') {
            return 0;
        }

        let time = total_time.split(':');
        let hr = parseInt(time[0]) ? parseInt(time[0]) : parseInt(time[1]) ? 1 : 0;
        return hr ? parseInt(total_call / hr) : 0;
    }


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: '',
            },
        },
    };

    const charData = {
        labels: calls.labels,
        datasets: [
            {
                label: `Calls`,
                data: calls.value,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

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
                <CardBody>
                    <Row>
                        <Col lg="2">
                            <span> Total Time <br /> <Badge color="success" className="bg-light-success">{total_time}</Badge></span>
                        </Col>
                        <Col lg="2">
                            <span> Total Call <br /> <Badge color="success" className="bg-light-success">{total_call}</Badge></span>
                        </Col>
                        <Col lg="2">
                            <span>Avg. Calls/Hr <br /> <Badge color="success" className="bg-light-success">{averageCallsPerHour()}</Badge></span>
                        </Col>
                    </Row>
                    <Row>
                        <Line options={options} data={charData} style={{ maxHeight: '500px' }} />
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardHeader className="py-1">
                    <CardTitle tag="h4"></CardTitle>
                </CardHeader>
                <div className="p-1">
                    <Row>
                        <Col lg="12">
                            <Row>
                                <Col lg="3">
                                    <div className="mb-1">
                                        <Select classNamePrefix='select' options={perPageOptions} onChange={e => handleSelectChange(e, 'per_page')} placeholder="Per Page" className="mb-2" />
                                    </div>
                                </Col>
                                {/* <Col lg="2">
                                    <div className="mb-1">
                                        <Select onChange={e => handleSelectChange(e, 'team_id')} options={[{ value: '', label: 'None' }, ...teams,]} className="mb-2" placeholder="Select Team" />
                                    </div>
                                </Col> */}
                                {user.role == 'company' &&
                                    <Col lg="3">
                                        <div className="mb-1">
                                            <Select classNamePrefix='select' onChange={e => handleSelectChange(e, 'user_id')} options={[{ value: '', label: 'None' }, ...workspaceusers,]} className="mb-2" placeholder="Select User" />
                                        </div>
                                    </Col>
                                }
                                <Col lg="3">
                                        <div className="mb-1">
                                            <Select classNamePrefix='select' onChange={e => handleSelectChange(e, 'campaign_id')} options={[{ value: '', label: 'None' }, ...campaignsOptions,]} className="mb-2" placeholder="Select Campaign" />
                                        </div>
                                    </Col><Col lg="3">
                                        <div className="mb-1">
                                        <Select onChange={e => handleSelectChange(e, 'team_id')} options={[{ value: '', label: 'None' }, ...teams,]} className="mb-2" placeholder="Select Team" />
                                        </div>
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
                        {/* <Col lg="2">
                            <div className="mb-1">
                                <Input name="search" value={data.search} onChange={e => handleChange(e)} placeholder="Search..." style={{ maxHeight: '40px' }} />
                            </div>
                        </Col> */}
                    </Row>
                </div>
                <div className="react-dataTable">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Campaign</th>
                                <th>Workspace</th>
                                <th>Start Time</th>
                                <th>End End</th>
                                <th>Total Time</th>
                                <th>Teams</th>
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
                                    <td>{row.campaign?.title}</td>
                                    <td>{row.workspace.name}</td>
                                    <td>{row.started_at}</td>
                                    <td>{row.stopped_at} {(row.stopped_at == null && row.session == 'ongoing') && <Badge color="success" className="bg-light-success">Ongoing</Badge>} </td>
                                    <td>{row.total_time}</td>
                                    <td>{row.team?.team_name}</td>
                                </tr>
                            )}

                            {(timers && !Boolean(timers.data.length)) && <tr><td colSpan={6} className="text-center">No data Found!</td></tr>}
                        </tbody>
                    </Table>
                </div>
                <PaginationWrapper paginate={timers} callback={loadData} />
            </Card>
        </>
    );
};
