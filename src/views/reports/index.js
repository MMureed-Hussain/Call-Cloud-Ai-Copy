/* eslint-disable */
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import Select from "react-select";
import { Row, Col, Card, CardHeader, CardTitle, Badge, Input, CardBody, FormGroup, Label } from "reactstrap";

//Redux
import { random } from "lodash"
import { useDispatch, useSelector } from "react-redux";
import { getCallsListWithCount, getRecordingByWorkspace, leadProfileStatusList } from "../../redux/calls";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from "prettier";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default () =>
{
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const reports = useSelector((state) => state.calls.reports);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const [labels, setLabels] = useState([]);
    const [profileStatus, setProfileStatus] = useState(null);
    const [clientStatus, setClientStatus] = useState(null);
    const [callStatus, setCallStatus] = useState(null);
    const [leadProfiles, setLeadProfiles] = useState(null);
    const [clientProfiles, setClientProfiles] = useState(null);
    const selectDefaultValue = { value: '', label: 'None' };
    const [data, setData] = useState({
        profile: 'lead',
        from_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        to_date: moment().format('YYYY-MM-DD'),
    });

    console.log(data, 're');
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
        labels,
        datasets: [
            {
                label: `Called`,
                data: (reports && reports.called.length) ? reports.called.map((report) => report.calls) : [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Current Calling',
                fill: false,
                borderDash: [5, 5],
                data: (reports && reports.calling.length) ? reports.calling.map((report) => report.calls) : [],
                borderColor: 'rgb(63, 107, 123)',
                backgroundColor: 'rgba(63, 107, 123, 0.5)',
            }
        ],
    };


    const profileTypeOptions = [
        { value: 'lead', label: 'Lead' },
        { value: 'client', label: 'Client' },
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

    const loadData = (options) =>
    {
        if (currentWorkspace) {
            let queryParams = {
                workspace_id: currentWorkspace.id,
                ...data,
                ...options,
            };
            dispatch(getCallsListWithCount(queryParams));
        }
    };

    useEffect(() =>
    {
        if (currentWorkspace) {

            dispatch(leadProfileStatusList({ id: currentWorkspace.id })).then(({ payload }) =>
            {

                if (payload && payload.lead_statuses) {
                    setProfileStatus(payload.lead_statuses);
                }

                if (payload && payload.lead_statuses) {
                    setCallStatus(payload.call_statuses);
                }

                if (payload && payload.call_profiles) {
                    setLeadProfiles(payload.call_profiles);
                }

                if (payload && payload.client_profiles) {
                    setClientProfiles(payload.client_profiles);
                }

                if (payload && payload.client_statuses) {
                    setClientStatus(payload.client_statuses);
                }

            });

            const privateChannel = window.Pusher.subscribe(`private-workspaces.${currentWorkspace.id}`)
            privateChannel.bind('WorkspaceCallRecordingStatus', (res) =>
            {
                dispatch(getRecordingByWorkspace({ id: currentWorkspace.id }));
                loadData();

            });

        }
    }, [currentWorkspace]);


    useEffect(() =>
    {
        loadData();
    }, [data, currentWorkspace]);


    useEffect(() =>
    {
        if (reports) {
            setLabels(reports.labels);
        }
    }, [reports]);


    const handleSelected = (op, sel) =>
    {
        let newOptions = [{ value: '', label: 'None' }, ...op];
        let selected = sel ? sel : '';
        console.log(sel, newOptions.filter(option => option.value === selected), 'selected');
        return newOptions.filter(option => option.value === selected);
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Card>
                <CardHeader className="py-1">
                    <CardTitle tag="h4">Live call report</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col lg="10">
                            <Row>
                                <Col lg="2">
                                    <FormGroup>
                                        <Label>Profile Type</Label>
                                        <Select
                                            options={profileTypeOptions}
                                            defaultValue={{ value: 'lead', label: 'Lead' }}
                                            onChange={e => handleSelectChange(e, 'profile')}
                                            placeholder="Profile Type"
                                            className="mb-2"
                                        />
                                    </FormGroup>
                                </Col>
                                {
                                    callStatus &&
                                    <Col lg="2">
                                        <FormGroup>
                                            <Label>Call Status</Label>
                                            <Select
                                                onChange={e => handleSelectChange(e, 'call_status')}
                                                options={[{ value: '', label: 'None' }, ...callStatus]}
                                                className="mb-2"
                                            />
                                        </FormGroup>
                                    </Col>
                                }

                                {(data && data.profile == 'lead') &&
                                    <>
                                        {leadProfiles &&
                                            <Col lg="2">
                                                <FormGroup>
                                                    <Label>Lead Profile</Label>
                                                    <Select
                                                        onChange={e => handleSelectChange(e, 'lead_profile')}
                                                        options={[{ value: '', label: 'None' }, ...leadProfiles]}
                                                        value={handleSelected(leadProfiles, data.lead_profile)}
                                                        className="mb-2"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }

                                        {profileStatus &&
                                            <Col lg="2">
                                                <FormGroup>
                                                    <Label>Profile status</Label>
                                                    <Select
                                                        onChange={e => handleSelectChange(e, 'lead_status')}
                                                        options={[{ value: '', label: 'None' }, ...profileStatus]}
                                                        value={handleSelected(profileStatus, data.lead_status)}
                                                        className="mb-2"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }
                                    </>
                                }

                                {(data && data.profile == 'client') &&
                                    <>
                                        {clientProfiles &&
                                            <Col lg="2">
                                                <FormGroup>
                                                    <Label>Client</Label>
                                                    <Select
                                                        onChange={e => handleSelectChange(e, 'client_profile')}
                                                        options={[{ value: '', label: 'None' }, ...clientProfiles,]}
                                                        value={handleSelected(clientProfiles, data.client_profile)}
                                                        className="mb-2"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }

                                        {clientStatus &&
                                            <Col lg="2">
                                                <FormGroup>
                                                    <Label>Client Status</Label>
                                                    <Select
                                                        onChange={e => handleSelectChange(e, 'client_status')}
                                                        options={[{ value: '', label: 'None' }, ...clientStatus,]}
                                                        value={handleSelected(clientStatus, data.client_status)}
                                                        className="mb-2"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }

                                    </>
                                }

                                <Col lg="2">
                                    <FormGroup>
                                        <Label>From</Label>
                                        <Input
                                            name="from_date"
                                            type="date" value={data.from_date}
                                            onChange={e => handleChange(e)}
                                            max={moment().format("YYYY-MM-DD")}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col lg="2">
                                    <FormGroup>
                                        <Label>To</Label>
                                        <Input
                                            name="to_date"
                                            type="date"
                                            value={data.to_date}
                                            onChange={e => handleChange(e)}
                                            max={moment().format("YYYY-MM-DD")}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            {reports && <span>Current Calling <Badge color="success" className="bg-light-success">{reports.currentCallsCount}</Badge> </span>}
                        </Col>
                    </Row>
                    <Row>
                        <Line options={options} data={charData} style={{ maxHeight: '500px' }} />
                    </Row>
                </CardBody>
            </Card>
        </>
    );
};
