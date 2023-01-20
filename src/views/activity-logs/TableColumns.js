export const ActivityLogTableColumns = [
  {
    name: "User",
    sortable: true,
    width: "160px",
    sortField: "causer_type",
    selector: (row) => row.causer.name,
    cell: (row) => row.causer.name,
  },
  {
    name: "Description",
    sortable: false,
    width: "160px",
    selector: (row) => row.description,
    cell: (row) => row.description
  },
  {
    name: "Changes",
    sortable: false,
    minWidth: "196px",
    cell: (row) => {
      return (<ul className="d-flex flex-column">
        {row.changes.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>);
    },
  }
];