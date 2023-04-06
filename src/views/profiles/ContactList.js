/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import Select from "react-select";
import
{
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { profileContactList, deleteProfileContact } from "../../redux/profiles";
import CreateUpdateContactSidebar from "./components/CreateUpdateContactSidebar";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
const MySwal = withReactContent(Swal);

export default () =>
{
  const dispatch = useDispatch();
  const params = useParams();
  const CreateUpdateContactSidebarRef = useRef(null);
  const per_page = useSelector((state) => state.layout.pagination.per_page);
  const reloadTable = useSelector((state) => state.profiles.reloadTable);
  const [contacts, setContacts] = useState({});
  const [data, setData] = useState({
    sort: "desc",
    orderby: "created_at",
    per_page: per_page,
    search: "",
    call_profile_id: params.id,
  });
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  useEffect(() =>
  {
    loadList();
  }, [data, reloadTable]);

  const loadList = (options) =>
  {
    if (currentWorkspace) {
      let queryParams = {
        workspace_id: currentWorkspace.id,
        ...data,
        ...options,
      };

      dispatch(
        profileContactList({
          id: params.id,
          params: queryParams,
        })
      ).then(({ payload }) =>
      {
        setContacts(payload.data);
      });
    }
  };

  const perPageOptions = [
    { value: 15, label: 15 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
  ];

  const handleSelectChange = (e, name) =>
  {
    let target = {
      name,
      type: "input",
      value: e.value,
    };

    handleChange({ target });
  };

  const handleChange = (e) =>
  {
    const key = e.target.name;
    const value =
      e.target.type == "checkbox" ? e.target.checked : e.target.value;

    setData((data) => ({
      ...data,
      [key]: value,
    }));
  };
  if (!contacts.data) {
    return (
      <div className="vh-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
  }

  const handleDelete = (id) =>
  {
    MySwal.fire({
      text: "Are you sure you?",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then((result) =>
    {
      if (result.isConfirmed) {
        dispatch(deleteProfileContact(id));
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Contact List</CardTitle>
          <Button
            onClick={() => CreateUpdateContactSidebarRef.current.handleShow()}
          >
            {" "}
            Add Contact
          </Button>
        </CardHeader>
        <div className="p-1">
          <Row>
            <Col lg="10">
              <Row>
                <Col lg="2">
                  <Select
                    options={perPageOptions}
                    onChange={(e) => handleSelectChange(e, "per_page")}
                    placeholder="Per page"
                    className="mb-2"
                  />
                </Col>
              </Row>
            </Col>
            <Col lg="2">
              <Input
                className="mb-2"
                name="search"
                value={data.search}
                onChange={(e) => handleChange(e)}
                placeholder="Search..."
                style={{ maxHeight: "50px" }}
              />
            </Col>
          </Row>
        </div>
        <div className="react-dataTable">
          <Table responsive>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Job Title</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Note</th>
                <th>Added by</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.data &&
                contacts.data.map((row, ind) => (
                  <tr key={ind}>
                    <td>{row.first_name}</td>
                    <td>{row.last_name}</td>
                    <td>{row.job_title}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>{row.note}</td>
                    <td>{row.addedby.first_name}</td>
                    <td>{row.created_at}</td>
                    <td>
                      <div className="d-flex">
                        <UncontrolledDropdown>
                          <DropdownToggle className="pe-1" tag="span">
                            <MoreVertical
                              className="cursor-pointer"
                              size={15}
                            />
                          </DropdownToggle>
                          <DropdownMenu container={"body"} end>
                            <DropdownItem
                              onClick={() =>
                                CreateUpdateContactSidebarRef.current.handleShow(
                                  row
                                )
                              }
                            >
                              <Edit size={15} />
                              <span className="align-middle ms-50">Edit</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => handleDelete(row.id)}>
                              <Trash size={15} />
                              <span className="align-middle ms-50">Delete</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </td>
                  </tr>
                ))}

              {contacts && !Boolean(contacts.data.length) && (
                <tr>
                  {" "}
                  <td className="text-center" colSpan={7}>
                    There are no records to display
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <Row>
          <Col className="small">
            {contacts && Boolean(contacts.data.length) && (
              <div className="my-2 ms-1">
                {" "}
                Showing {contacts.from} to {contacts.to} of {contacts.total}{" "}
                entries
              </div>
            )}
          </Col>
          <Col>
            {contacts && Boolean(contacts.data.length) && (
              <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                pageCount={
                  contacts && contacts.last_page !== 0 ? contacts.last_page : 0
                }
                activeClassName="active"
                onPageChange={({ selected }) =>
                  loadList({ page: selected + 1 })
                }
                pageClassName={"page-item"}
                nextLinkClassName={"page-link"}
                nextClassName={"page-item next"}
                previousClassName={"page-item prev"}
                previousLinkClassName={"page-link"}
                pageLinkClassName={"page-link"}
                containerClassName={
                  "pagination react-paginate justify-content-end my-5 pe-1"
                }
              />
            )}
          </Col>
        </Row>
      </Card>

      {/* Sidebar */}
      <CreateUpdateContactSidebar ref={CreateUpdateContactSidebarRef} />
    </>
  );
};
