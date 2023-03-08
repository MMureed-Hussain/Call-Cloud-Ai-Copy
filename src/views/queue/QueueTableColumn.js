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
const queueRowCount = (row) => {
  let rowCount = 0;
  row.leadlist_records.map((data) => {
    rowCount = rowCount + Number(data.rows)
  })
  return rowCount;
}
export const QueueTableColumn = [
    {
      name: "Queue Name",
      sortable: true,
      minWidth: "172px",
      sortField: "leadlist_name",
      selector: (row) => row.queue_name,
      cell: (row) => row.queue_name,
  
    },
    {
      name: "Lists",
      sortable: true,
      minWidth: "172px",
      sortField: "lists",
      selector: (row) => row.leadlist_records.length,
      cell: (row) => row.leadlist_records.length,
    },
    {
      name: "Created On",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.created_at,
      cell: (row) => row.created_at,
    },
     {
      name: "Time Ago",
      sortable: false,
      minWidth: "172px",
      cell: (row) => {
        const daysAgo = Math.floor(new Date() - new Date(row.created_at)) / (1000 * 60 * 60 * 24)
        return ` ${Math.floor(daysAgo)} days`;
  
      },
    },
    {
      name: "Assigned Teams",
      sortable: false,
      minWidth: "172px",
      selector: (row) => row.teams.length,
      cell: (row) => row.teams.length,
  
    },
    {
      name: "Total Rows",
      sortable: false,
      minWidth: "172px",
      selector: (row) => queueRowCount(row)
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
                  row.handleDelete(row.id, row.joinedAt);
                  e.preventDefault();
                }}
              >
                <Trash size={15} className="me-50" />
                <span className="align-middle ms-50">
                  {row.joinedAt ? "Remove user" : "Delete Queue"}
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];