import moment from 'moment';
import UserCardCell from '../common/UserCardCell';

export const ActivityLogTableColumns = [
  {
    name: "User",
    sortable: true,
    width: "200px",
    sortField: "causer_type",
    selector: (row) => row.causer.name,
    cell: (row) => <UserCardCell user={row.causer}/>,
  },
  {
    name: "Description",
    sortable: false,
    minWidth: "500px",
    grow: 1,
    selector: (row) => row.description,
    cell: (row) => {
      return (
        <>
          <div className='d-flex flex-column'>
            <span>{ row.subject.name }</span>
            <ul>
              { row.description.map((item, index) => <li key={index}>{ item }</li>) }
            </ul>
          </div>
        </>
      );
    }
  },
  {
    name: "Created At",
    sortable: false,
    width: "190px",
    cell: (row) => moment(row.created_at).format('YYYY-MM-DD HH:MM'),
  }
];