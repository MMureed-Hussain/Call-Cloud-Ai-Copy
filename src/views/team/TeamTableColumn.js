
import
{ Trash,
  Edit,
  MoreVertical,
} from "react-feather";

// ** Reactstrap Imports
import
{ UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export const TeamTableColumn = [
    {
      name: "Team Name",
      sortable: true,
      minWidth: "172px",
      sortField: "leadlist_name",
      selector: (row) => row.team_name,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.team_name}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Created On",
      sortable: true,
      minWidth: "172px",
      sortField: "lists",
      selector: (row) => row.createdAt,
      
    },
    {
      name: "Users",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.users.length,
    },
    {
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
                <Edit size={15} />
                <span className="align-middle ms-50">Edit</span>
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
                <Trash size={15} className="me-50" />
                <span className="align-middle ms-50">
                  {row.joinedAt ? "Remove user" : "Delete Team"}
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];