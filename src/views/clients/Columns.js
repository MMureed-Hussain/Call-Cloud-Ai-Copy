// ** React Imports


// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions

// ** Icons Imports
import {
  MoreVertical,
  Trash2,
  Archive,
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const renderCreatedAt = (row) => {
  return row.createdAt ? row.createdAt : "-";
};

const renderCompanyLogo = (row) => {
  if (row.logo && row.logo.length) {
    return <Avatar className="me-1" img={row.logo} width="32" height="32" />;
  } else {
    return (
      <Avatar
        initials
        className="me-1"
        color={row.avatarColor || "light-primary"}
        content={row.name || "John Doe"}
      />
    );
  }
};
const Title = () => (
  <div
    style={{ paddingLeft: "45px" }}
    className="d-flex justify-content-center align-items-center"
  >
    Name
  </div>
);

const renderStatus = (row) => {
    if (row.status) {
        return (
            <Badge color="success" pill>Active</Badge>
        );
    } else {
        return (
            <Badge color="danger" pill>Inactive</Badge>
        );
    }
    return row.status ? row.status : "-";
};

export const adminCompanyColumns = [
  {
    name: <Title />,
    sortable: true,
    minWidth: "200px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderCompanyLogo(row)}
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.name}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Created At",
    sortable: true,
    minWidth: "172px",
    sortField: "createdAt",
    selector: (row) => row.createdAt,
    cell: (row) => renderCreatedAt(row),
  },
  {
    name: "Users",
    sortable: true,
    minWidth: "172px",
    sortField: "users",
    selector: (row) => row.users,
    cell: (row) => row.users,
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "172px",
    sortField: "status",
    selector: (row) => row.status,
    cell: (row) => renderStatus(row),
  },
  {
    name: "Actions",
    minWidth: "100px",
    cell: (row) => (
      <div className="column-action">
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                row.handleEdit(row.id);
                e.preventDefault();
              }}
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>

            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                row.handleDelete(row.id);
                e.preventDefault();
              }}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">Remove Company</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
