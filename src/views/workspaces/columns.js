// ** React Imports
/* eslint-disable */
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";


import {
Trash,
Edit,
MoreVertical,
FileText,
Trash2,
Archive,
} from "react-feather";

// ** Reactstrap Imports
import {
UncontrolledDropdown,
DropdownToggle,
DropdownMenu,
DropdownItem,
} from "reactstrap";

const renderCreatedAt = (row) => {
  return row.createdAt ? row.createdAt : "-";
};

const renderJoinedAt = (row) => {
  return row.joinedAt ? row.joinedAt : "-";
};

const renderClient = (row) => {
  if (row.avatar && row.avatar.length) {
    return <Avatar className="me-1" img={row.avatar} width="32" height="32" />;
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

const renderWorkspaceLogo = (row) => {
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
export const adminWorkspaceColumns = [
  {
    name: <Title />,
    sortable: true,
    minWidth: "200px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderWorkspaceLogo(row)}
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.name}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Created Atttt",
    sortable: true,
    minWidth: "172px",
    sortField: "createdAt",
    selector: (row) => row.createdAt,
    cell: (row) => renderCreatedAt(row),
  },
  {
    name: "Calls",
    sortable: false,
    minWidth: "172px",
    cell: () => "0",
  },
  {
    name: "Teams",
    sortable: true,
    minWidth: "172px",
    sortField: "users",
    selector: (row) => row.teams,
    cell: (row) => row.teams,
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
              tag={Link}
              className="w-100"
              to={`/workspace/${row.id}`}
            >
              <FileText size={14} className="me-50" />
              <span className="align-middle">Details</span>
            </DropdownItem>
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
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
export const userWorkspaceColumns = [
  {
    name: <Title />,
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderWorkspaceLogo(row)}
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.name}</span>
        </div>
      </div>
    ),
  },

  {
    name: "Joined At",
    sortable: true,
    minWidth: "172px",
    sortField: "joinedAt",
    selector: (row) => row.joinedAt,
    cell: (row) => renderJoinedAt(row),
  },
];

export const userColumns = [
  {
    name: <Title />,
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    selector: (row) => {
      return row.nickname ? row.nickname : row.name;
    },
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <span className="fw-bolder">
            {row.nickname ? row.nickname : row.name}
          </span>
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
    ),
  },

  {
    name: "Joined At",
    sortable: true,
    minWidth: "172px",
    sortField: "createdAt",
    selector: (row) => row.joinedAt,
    cell: (row) => renderJoinedAt(row),
  },
  {
    name: "Calls",
    sortable: false,
    minWidth: "172px",
    cell: () => "0",
  },
  {
    name: "Role",
    sortable: false,
    minWidth: "172px",
    cell: (row) => (row.userRole.toUpperCase()),
  },
  {
    className: "ms-5",
    name: "Actions",
    minWidth: "100px",
    maxWidth: "100px",
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

            {row.userRole !== "admin" &&
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  row.handleDelete(row.invitationId, row.joinedAt);
                  e.preventDefault();
                }}
              >
                <Trash2 size={14} className="me-50" />
                <span className="align-middle">
                  {row.joinedAt ? "Remove user" : "Cancel invitation"}
                </span>
              </DropdownItem>
            }
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];




