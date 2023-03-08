// ** Icons Imports
import {
  Trash,
  Edit,
  MoreVertical,
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//leadlist table
export const NewTable = [
    {
      name: "Lead List Name",
      sortable: true,
      minWidth: "172px",
      sortField: "leadlist_name",
      selector: (row) => row.leadlist_name,
      cell: (row) => row.leadlist_name,      
    },
    {
      name: "File Name",
      sortable: true,
      minWidth: "172px",
      sortField: "business_name",
      selector: (row) => row.file_name,
      cell: (row) => row.file_name
    },
    {
      name: "Upload On",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.createdAt,
      cell: (row) => row.createdAt,
    },
    {
      name: "Upload By",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.user_id,
      cell: (row) => row.user_id,
    },
    {
      name: "Rows",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.rows,
      cell: (row) => row.rows
    },
  
    {
      name: "Columns",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.columns,
      cell: (row) => row.columns
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
                  {row.joinedAt ? "Remove Lead List" : "Delete Lead List"}
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];