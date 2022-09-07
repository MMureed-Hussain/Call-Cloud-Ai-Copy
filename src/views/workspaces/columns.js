// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
// import Avatar from "@components/avatar";

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

const renderName = (row) => row.name;
const renderCreatedAt = (row) => {
  return row.createdAt ? row.createdAt : "-";
};

const renderJoinedAt = (row) => {
  return row.joinedAt ? row.joinedAt : "-";
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
    minWidth: "172px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => renderName(row),
  },
  {
    name: "Joined At",
    sortable: true,
    minWidth: "172px",
    sortField: "createdAt",
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
