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
  Trash,
  Eye,
  Edit,
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
// import { dispatch } from "react-hot-toast/dist/core/store";
// import { useDispatch } from "react-redux";
// import {deleteQueueFromWorkspace} from '../../redux/workspaces'

// const renderName = (row) => {
//   return row.nickname ? row.nickname : row.name;
// };
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

const queueRowCount = (row) => {
  let rowCount = 0;
  row.leadlist_records.map((data) => {
    rowCount = rowCount + Number(data.rows)
  })
return rowCount;
}

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
          {/* <Link
            to={`/apps/user/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getUser(row.id))}
          > */}
          <span className="fw-bolder">{row.name}</span>
          {/* </Link> */}
          {/* <small className="text-truncate text-muted mb-0">{row.email}</small> */}
        </div>
      </div>
    ),
  },
  // {
  //   name: "Name",
  //   sortable: true,
  //   minWidth: "172px",
  //   sortField: "name",
  //   selector: (row) => row.name,
  //   cell: (row) => renderName(row),
  // },
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
    // sortField: "createdAt",
    // selector: (row) => row.createdAt,
    cell: () => "0",
  },
  {
    name: "Users",
    sortable: true,
    minWidth: "172px",
    sortField: "users",
    selector: (row) => row.users,
    cell: (row) => row.users,
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
    name: <Title />,
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderWorkspaceLogo(row)}
        <div className="d-flex flex-column">
          {/* <Link
            to={`/apps/user/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getUser(row.id))}
          > */}
          <span className="fw-bolder">{row.name}</span>
          {/* </Link> */}
          {/* <small className="text-truncate text-muted mb-0">{row.email}</small> */}
        </div>
      </div>
    ),
  },
  // {
  //   name: "Name",
  //   sortable: true,
  //   minWidth: "172px",
  //   sortField: "name",
  //   selector: (row) => row.name,
  //   cell: (row) => renderName(row),
  // },
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
    name: "Calls",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    // selector: (row) => row.joinedAt,
    cell: () => "0",
  },
  {
    name: "Role",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    // selector: (row) => row.joinedAt,
    cell: () => "Member",
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

export const LeadlistColumns = [
  {
    name: "Leadlist Name",
    sortable: true,
    minWidth: "172px",
    sortField: "leadlist_name",
    selector: (row) => row.workspace_lead.lead_name,
    cell: (row) => row.workspace_lead.lead_name,
    // row.business_name
  },
  {
    name: "Business Name",
    sortable: true,
    minWidth: "172px",
    sortField: "business_name",
    selector: (row) => row.business_name,
    cell: (row) => row.business_name
    // row.business_name
  },
  {
    name: "Phone Number",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.business_phone,
    cell: (row) => row.business_phone,
  },
  {
    name: "Website",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    // selector: (row) => row.joinedAt,
    cell: (row) => row.business_website,
  },
  {
    name: "Country",
    sortable: false,
    minWidth: "172px",
    cell: (row) => row.business_country,

    // sortField: "createdAt",
    // selector: (row) => row.workspace.name,
    // cell: (row) => row.workspace.name
  },
  {
    name: "City",
    sortable: false,
    minWidth: "172px",
    cell: (row) => row.business_city,

  },
  

  {
    name: "File Name",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.file_name,
    cell: (row) => row.file_name
  },

  // {
  //   name: "Workspace Name",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   selector: (row) => row.workspace.name,
  //   cell: (row) => row.workspace.name
  // },
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
  //           {/* <DropdownItem
  //             tag={Link}
  //             className="w-100"
  //             to={`/workspace/${row.id}`}
  //             // onClick={() => store.dispatch(getUser(row.id))}
  //           >
  //             <FileText size={14} className="me-50" />
  //             <span className="align-middle">Details</span>
  //           </DropdownItem> */}
  //           {/* <DropdownItem
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
  //           </DropdownItem> */}

  //           <DropdownItem
  //             tag="a"
  //             href="/"
  //             className="w-100"
  //             onClick={(e) => {
  //               row.handleDelete(row.id, row.joinedAt);
  //               e.preventDefault();
  //             }}
  //           >
  //             <Trash2 size={14} className="me-50" />
  //             <span className="align-middle">
  //               {row.joinedAt ? "Remove user" : "Cancel invitation"}
  //             </span>
  //           </DropdownItem>
  //         </DropdownMenu>
  //       </UncontrolledDropdown>
  //     </div>
  //   ),
  // },
];

//new table

export const NewTable = [
  {
    name: "Lead List Name",
    sortable: true,
    minWidth: "172px",
    sortField: "leadlist_name",
    
    selector: (row) => row.leadlist_name,
    cell: (row) => row.leadlist_name,
    
    // row.business_name
  },
  {
    name: "File Name",
    sortable: true,
    minWidth: "172px",
    sortField: "business_name",
    selector: (row) => row.file_name,
    cell: (row) => row.file_name
    // row.business_name
  },
  {
    name: "Upload On",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.createdAt,
    cell: (row) => row.createdAt,
  },
  {
    name: "Upload By",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    // selector: (row) => row.joinedAt,
    cell: (row) => row.user_id,
  },
  // {
  //   name: "Time Ago",
  //   sortable: false,
  //   minWidth: "172px",
  //   cell: (row) => row.business_country,
  //   // sortField: "createdAt",
  //   // selector: (row) => row.workspace.name,
  //   // cell: (row) => row.workspace.name
  // },
  // {
  //   name: "In Queue",
  //   sortable: false,
  //   minWidth: "172px",
  //   cell: (row) => row.business_city,

  // },
  

  {
    name: "Rows",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.rows,
    cell: (row) => row.rows
  },

  {
    name: "Columns",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.columns,
    cell: (row) => row.columns
  },
];

export const QueueTable = [
  {
    name: "Queue Name",
    sortable: true,
    minWidth: "172px",
    sortField: "leadlist_name",
    selector: (row) => row.queue_name,
    cell: (row) => row.queue_name,
    
    // row.business_name
  },
  {
    name: "Lists",
    sortable: true,
    minWidth: "172px",
    sortField: "lists",
    selector: (row) => row.leadlist_records.length,
    cell: (row) => row.leadlist_records.length,
    // row.business_name
  },
  {
    name: "Created On",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.created_at,
    cell: (row) => row.created_at,
  },
  // {
  //   name: "Created By",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   // selector: (row) => row.joinedAt,
  //   cell: (row) => row.user_id,
  // },
  // {
  //   name: "Updated At",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   selector: (row) => row.updated_at,
  //   cell: (row) => row.updated_at,
  // },

  {
    name: "Time Ago",
    sortable: false,
    minWidth: "172px",
    cell: (row) => {
      // console.log('-------------------');
      // console.log(new Date(row.created_at));
      // console.log(new Date());
      // const minutes = Math.floor(new Date() - new Date(row.created_at)) / (1000 * 60)
      // const seconds = minutes % 60;
      // console.log('minutes:', minutes);
      // console.log('seconds:', seconds);
      const daysAgo = Math.floor(new Date() - new Date(row.created_at)) / (1000 * 60 * 60 * 24)
      // console.log('-------------------');
      return ` ${Math.floor(daysAgo)} days`;

    },
    // sortField: "createdAt",
    // selector: (row) => row.workspace.name,
    // cell: (row) => row.workspace.name
  },
  {
    name: "Assigned Users",
    sortable: false,
    minWidth: "172px",
    selector: (row) => row.users.length,
    cell: (row) => row.users.length,

  },
  

  {
    name: "Total Rows",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => queueRowCount(row)
    // cell: (row) => row.rows
  },

  // {
  //   name: "Columns",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   selector: (row) => row.columns,
  //   cell: (row) => row.columns
  // },
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
              // onClick={() => {
              //   deleteQueueFromWorkspace(`${process.env.REACT_APP_API_ENDPOINT}/api/queues/delete/${row.id}`
              //   )
              // }}
         
            >
              <Trash size={15} className="me-50"/>
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

export const teamTable = [
  // {
  //   name: "Team Name",
  //   sortable: true,
  //   minWidth: "172px",
  //   sortField: "leadlist_name",
  //   selector: (row) => row.queue_name,
  //   cell: (row) => row.queue_name,
    
  //   // row.business_name
  // },
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
    // cell: (row) => row.leadlist_records.length,
    // row.business_name
  },
  {
    name: "Users",
    sortable: false,
    minWidth: "172px",
    // sortField: "createdAt",
    selector: (row) => row.users.length,
    // cell: (row) => row.created_at,
  },
  // {
  //   name: "Created By",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   // selector: (row) => row.joinedAt,
  //   cell: (row) => row.user_id,
  // },
  // {
  //   name: "Updated At",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   selector: (row) => row.updated_at,
  //   cell: (row) => row.updated_at,
  // },

  // {
  //   name: "Time Ago",
  //   sortable: false,
  //   minWidth: "172px",
  //   cell: (row) => row.business_country,
  //   // sortField: "createdAt",
  //   // selector: (row) => row.workspace.name,
  //   // cell: (row) => row.workspace.name
  // },
  // {
  //   name: "Assigned Users",
  //   sortable: false,
  //   minWidth: "172px",
  //   selector: (row) => row.users.length,
  //   cell: (row) => row.users.length,

  // },
  

  // {
  //   name: "Total Rows",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   selector: (row) => row.rows,
  //   cell: (row) => row.rows
  // },

  // {
  //   name: "Columns",
  //   sortable: false,
  //   minWidth: "172px",
  //   // sortField: "createdAt",
  //   selector: (row) => row.columns,
  //   cell: (row) => row.columns
  // },
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
              // onClick={() => {
              //   deleteQueueFromWorkspace(`${process.env.REACT_APP_API_ENDPOINT}/api/queues/delete/${row.id}`
              //   )
              // }}
         
            >
              <Trash size={15} className="me-50"/>
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