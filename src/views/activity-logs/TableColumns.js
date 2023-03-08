/* eslint-disable */
import moment from 'moment';
import UserCardCell from '../common/UserCardCell';
import {
  Badge
} from "reactstrap";

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
          return template(row.description);
        case "deleted":
          return template(row.description);
        case "updated":
          let list = [];
          Object.entries(row.properties.attributes).map((item) => {
            let updated = item[1];
            let old = row.properties.old[item[0]];
            let content = <div>
              <Badge className="text-dark" color="light">{item[0]}</Badge>
              <span>changed from</span>
              <Badge color="danger">{old}</Badge>
              <span>to</span>
              <Badge color="success">{updated}</Badge>
            </div>;
            list.push(content);
          });
          return template(<ul>
            { list.map((item, index) => <li className={ index !== list.length - 1 ? 'mb-1' : ""}>{item}</li>) }
          </ul>);
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