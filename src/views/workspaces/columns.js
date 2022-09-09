// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
// import { store } from "@store/store";
// import { deleteWorkspace } from "@store/workspaces";

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive,
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const renderName = (row) => {
  return row.nickname ? row.nickname : row.name;
};
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

export const adminWorkspaceColumns = [
  {
    name: "Name",
    sortable: true,
    minWidth: "172px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => renderName(row),
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
              // onClick={() => store.dispatch(getUser(row.id))}
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
    name: "Name",
    sortable: true,
    minWidth: "172px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => renderName(row),
  },
  {
    name: "Joined At",
    sortable: true,
    minWidth: "172px",
    sortField: "joinedAt",
    selector: (row) => row.joinedAt,
    cell: (row) => renderJoinedAt(row),
  },
  // {
  //   name: "Actions",
  //   minWidth: "100px",
  //   cell: (row) => (
  //     <div className="column-action">
  //       <UncontrolledDropdown>
  //         <DropdownToggle tag="div" className="btn btn-sm">
  //           <MoreVertical size={14} className="cursor-pointer" />
  //         </DropdownToggle>
  //         <DropdownMenu>
  //           <DropdownItem
  //             tag={Link}
  //             className="w-100"
  //             to={`/workspace/${row.id}`}
  //             // onClick={() => store.dispatch(getUser(row.id))}
  //           >
  //             <FileText size={14} className="me-50" />
  //             <span className="align-middle">Details</span>
  //           </DropdownItem>
  //           <DropdownItem
  //             tag="a"
  //             href="/"
  //             className="w-100"
  //             onClick={(e) => {
  //               row.handleEdit(row.id);
  //               e.preventDefault();
  //             }}
  //           >
  //             <Archive size={14} className="me-50" />
  //             <span className="align-middle">Edit</span>
  //           </DropdownItem>
  //           <DropdownItem
  //             tag="a"
  //             href="/"
  //             className="w-100"
  //             onClick={(e) => {
  //               row.handleDelete(row.id);
  //               e.preventDefault();
  //             }}
  //           >
  //             <Trash2 size={14} className="me-50" />
  //             <span className="align-middle">Delete</span>
  //           </DropdownItem>
  //         </DropdownMenu>
  //       </UncontrolledDropdown>
  //     </div>
  //   ),
  // },
];

export const userColumns = [
  {
    name: "Name",
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
          {/* <Link
            to={`/apps/user/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getUser(row.id))}
          > */}
          <span className="fw-bolder">
            {row.nickname ? row.nickname : row.name}
          </span>
          {/* </Link> */}
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
    ),
  },
  // {
  //   name: "Name",
  //   sortable: true,
  //   minWidth: "172px",
  //   sortField: "name",
  //   selector: (row) => {
  //     return row.nickname ? row.nickname : row.name;
  //   },
  //   cell: (row) => renderName(row),
  // },
  {
    name: "Joined At",
    sortable: true,
    minWidth: "172px",
    sortField: "createdAt",
    selector: (row) => row.joinedAt,
    cell: (row) => renderJoinedAt(row),
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
            {/* <DropdownItem
              tag={Link}
              className="w-100"
              to={`/workspace/${row.id}`}
              // onClick={() => store.dispatch(getUser(row.id))}
            >
              <FileText size={14} className="me-50" />
              <span className="align-middle">Details</span>
            </DropdownItem> */}
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
                row.handleDelete(row.invitationId, row.joinedAt);
                e.preventDefault();
              }}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">
                {row.joinedAt ? "Remove user" : "Cancel invitation"}
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
