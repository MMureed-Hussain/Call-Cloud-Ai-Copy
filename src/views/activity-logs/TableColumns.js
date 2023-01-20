export const ActivityLogTableColumns = [
  {
    name: "Subject",
    sortable: true,
    width: "160px",
    sortField: "subject_type",
    selector: (row) => row.subject_type,
    cell: (row) => row.subject_type,
  },
  {
    name: "Batch",
    sortable: true,
    width: "160px",
    sortField: "batch_uuid",
    selector: (row) => row.batch_uuid,
    cell: (row) => row.batch_uuid
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