
export const LeadListTableColumn = [
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
  ];
  