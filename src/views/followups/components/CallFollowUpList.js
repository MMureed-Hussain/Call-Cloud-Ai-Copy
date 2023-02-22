/* eslint-disable */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import toast from "react-hot-toast";
import Select from "react-select";

// ** Reactstrap Imports
import { Row, Col, Button, Card, CardHeader, CardTitle, Badge, Table, Input } from "reactstrap";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getFollowups, setErrors } from "../../../redux/followups";
import { getPipelines } from "../../../redux/pipelines";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarCheck, faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";


export default () =>
{
    const dispatch = useDispatch();
    const per_page = useSelector((state) => state.layout.pagination.per_page);
    const followups = useSelector((state) => state.followups.followups);
    const pipelines = useSelector((state) => state.pipelines.pipelines);
    const [data, setData] = useState({ sort: 'desc', orderby: 'created_at', per_page: per_page, search: '', pipeline_id: '', type: '' });
    const currentWorkspace = useSelector(
        (state) => state.workspaces.currentWorkspace
    );

    useEffect(() =>
    {
        if (currentWorkspace) {
            dispatch(getPipelines({ workspace_id: currentWorkspace.id }));
        }
    }, [currentWorkspace]);


    useEffect(() =>
    {
        loadFollowUps();
    }, [data, currentWorkspace]);



    const loadFollowUps = (options) =>
    {
        if (currentWorkspace) {
            let queryParams = {
                workspace_id: currentWorkspace.id,
                ...data,
                ...options,
            };
            dispatch(getFollowups(queryParams));       
        }
    };

    const pipelineOptions = pipelines.map(pipeline => ({ value: pipeline.id, label: pipeline.name }));
    const typeOptions = [
        { value: '', label: 'None' },
        { value: 'google_meet', label: 'Video' },
        { value: 'phone', label: 'Phone' },
        { value: 'other', label: 'Other' }
    ];

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

    if (!followups.data) {
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
                    <CardTitle tag="h4">Follow Ups</CardTitle>
                </CardHeader>
                <div className="p-1">
                    <Row>
                        <Col lg="10">
                            <Row>
                                <Col lg="2">
                                    <Select options={perPageOptions} onChange={e => handleSelectChange(e, 'per_page')} placeholder="Per Page" className="mb-2" />
                                </Col>
                                <Col lg="3">
                                    <Select onChange={e => handleSelectChange(e, 'pipeline_id')} options={[{ value: '', label: 'None' }, ...pipelineOptions,]} placeholder="Select a pipeline" className="mb-2" />
                                </Col>
                                <Col lg="3">
                                    <Select onChange={e => handleSelectChange(e, 'type')} options={typeOptions} className="mb-2" placeholder="Select a meeting type" />
                                </Col>
                                <Col lg="4"></Col>
                            </Row>
                        </Col>
                        <Col lg="2">
                            <div className="d-flex align-center flex-wrap gap-4 mb-2">
                                <Input name="search" value={data.search} onChange={e => handleChange(e)} placeholder="Search business name..." style={{ maxHeight: '40px' }} />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="react-dataTable">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Pipeline</th>
                                <th>Meeting At</th>
                                <th>Delay</th>
                                <th>Type</th>
                                <th>Link</th>
                                <th>Notes</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {followups.data && followups.data.map((row, ind) =>
                                <tr key={ind} >
                                    <td>{row.callprofile.name}</td>
                                    <td>
                                        <Badge color="primary" className="bg-light-primary">{(row.callprofile && row.callprofile.pipeline) && row.callprofile.pipeline.name}</Badge>
                                    </td>
                                    <td>{row.meeting_at}</td>
                                    <td>{moment(row.meeting_at).fromNow()}</td>
                                    <td>
                                        {row.meeting_type == 'phone' && <FontAwesomeIcon className="text-primary" fontSize={20} icon={faPhone} />}
                                        {row.meeting_type == 'google_meet' && <FontAwesomeIcon className="text-info" fontSize={20} icon={faVideo} />}
                                        {row.meeting_type == 'other' && <Badge color="warning" className="bg-light-warning">Other</Badge>}
                                    </td>
                                    <td>
                                        {row.location && <span className="fw-bold text-primary cursor-pointer">{row.location}</span>}
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>{row.notes}</td>
                                    <td>{row.created_at}</td>
                                </tr>
                            )}

                            {(followups && !Boolean(followups.data.length)) && <tr><td colSpan={6} className="text-center">No data Found!</td></tr>}
                        </tbody>
                    </Table>
                </div>
                <Row>
                    <Col className="small">
                        {followups.data && <div className="my-2 ms-1"> Showing {followups.from} to {followups.to} of {followups.total} entries</div>}
                    </Col>
                    <Col>

                        {(followups && Boolean(followups.data.length)) && <ReactPaginate
                            previousLabel={""}
                            nextLabel={""}
                            pageCount={followups && followups.last_page !== 0 ? followups.last_page : 0}
                            activeClassName="active"
                            onPageChange={({ selected }) => loadFollowUps({ page: selected + 1 })}
                            pageClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            nextClassName={"page-item next"}
                            previousClassName={"page-item prev"}
                            previousLinkClassName={"page-link"}
                            pageLinkClassName={"page-link"}
                            containerClassName={
                                "pagination react-paginate justify-content-end my-2 pe-1"
                            }
                        />}

                    </Col>
                </Row>
            </Card>
        </>
    );
};
