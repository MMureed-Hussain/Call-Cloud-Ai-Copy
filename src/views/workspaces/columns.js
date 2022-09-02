// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
// import Avatar from "@components/avatar";

// ** Store & Actions
import { store } from "@store/store";
import { deleteWorkspace } from "@store/workspaces";

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
const renderCreatedAt = (row) => row.createdAt;

export const columns = [
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
              to={`/apps/user/view/${row.id}`}
              onClick={() => store.dispatch(getUser(row.id))}
            >
              <FileText size={14} className="me-50" />
              <span className="align-middle">Details</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => e.preventDefault()}
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                store.dispatch(deleteWorkspace(row.id));
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
