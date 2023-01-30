/* eslint-disable */
import moment from 'moment';
import UserCardCell from '../common/UserCardCell';

export const ActivityLogTableColumns = [
  {
    name: "User",
    sortable: true,
    width: "250px",
    sortField: "causer_type",
    selector: (row) => row.causer.name,
    cell: (row) => <UserCardCell user={row.causer}/>,
  },
  {
    name: "Description",
    sortable: false,
    minWidth: "400px",
    grow: 1,
    cell: (row) => {
      let template = children => (
        <div className='d-flex flex-column'>
          {children}
        </div>
      );

      switch (row.event) {
        case "created":
        case "deleted":
          return template(row.description);
        case "updated":
          return template("Coming");
      }
    }
  },
  {
    name: "Created At",
    sortable: false,
    width: "190px",
    cell: (row) => moment(row.created_at).format('YYYY-MM-DD HH:MM'),
  }
];