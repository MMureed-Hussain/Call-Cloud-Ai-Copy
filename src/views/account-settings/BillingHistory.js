// ** React Imports
import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

import axios from "axios";
axios.defaults.withCredentials = true;

// ** Third Party Components
import DataTable from "react-data-table-component";
import {
  Eye,
  Send,
  Edit,
  Info,
  Copy,
  File,
  Save,
  Trash,
  Printer,
  FileText,
  PieChart,
  Download,
  Clipboard,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  MoreVertical,
  ArrowDownCircle,
} from "react-feather";

// ** Reactstrap Imports
import {
  Card,
  Badge,
  CardTitle,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
} from "reactstrap";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

// ** Vars
// const invoiceStatusObj = {
//   Sent: { color: 'light-secondary', icon: Send },
//   Paid: { color: 'light-success', icon: CheckCircle },
//   Draft: { color: 'light-primary', icon: Save },
//   Downloaded: { color: 'light-info', icon: ArrowDownCircle },
//   'Past Due': { color: 'light-danger', icon: Info },
//   'Partial Payment': { color: 'light-warning', icon: PieChart }
// }

// const data = [
//   {
//     id: 4987,
//     issuedDate: '13 Dec 2019',
//     client: {
//       address: '7777 Mendez Plains',
//       company: 'Hall-Robbins PLC',
//       companyEmail: 'don85@johnson.com',
//       country: 'USA',
//       contact: '(616) 865-4180',
//       name: 'Jordan Stevenson'
//     },
//     service: 'Software Development',
//     total: 3428,
//     avatar: '',
//     invoiceStatus: 'Paid',
//     balance: '$724',
//     dueDate: '23 Apr 2019'
//   },
//   {
//     id: 4988,
//     issuedDate: '17 Jul 2019',
//     client: {
//       address: '04033 Wesley Wall Apt. 961',
//       company: 'Mccann LLC and Sons',
//       companyEmail: 'brenda49@taylor.info',
//       country: 'Haiti',
//       contact: '(226) 204-8287',
//       name: 'Stephanie Burns'
//     },
//     service: 'UI/UX Design & Development',
//     total: 5219,
//     avatar: require('@src/assets/images/avatars/10-small.png').default,
//     invoiceStatus: 'Downloaded',
//     balance: 0,
//     dueDate: '15 Dec 2019'
//   },
//   {
//     id: 4989,
//     issuedDate: '19 Oct 2019',
//     client: {
//       address: '5345 Robert Squares',
//       company: 'Leonard-Garcia and Sons',
//       companyEmail: 'smithtiffany@powers.com',
//       country: 'Denmark',
//       contact: '(955) 676-1076',
//       name: 'Tony Herrera'
//     },
//     service: 'Unlimited Extended License',
//     total: 3719,
//     avatar: require('@src/assets/images/avatars/1-small.png').default,
//     invoiceStatus: 'Paid',
//     balance: 0,
//     dueDate: '03 Nov 2019'
//   },
//   {
//     id: 4990,
//     issuedDate: '06 Mar 2020',
//     client: {
//       address: '19022 Clark Parks Suite 149',
//       company: 'Smith, Miller and Henry LLC',
//       companyEmail: 'mejiageorge@lee-perez.com',
//       country: 'Cambodia',
//       contact: '(832) 323-6914',
//       name: 'Kevin Patton'
//     },
//     service: 'Software Development',
//     total: 4749,
//     avatar: require('@src/assets/images/avatars/9-small.png').default,
//     invoiceStatus: 'Sent',
//     balance: 0,
//     dueDate: '11 Feb 2020'
//   },
//   {
//     id: 4991,
//     issuedDate: '08 Feb 2020',
//     client: {
//       address: '8534 Saunders Hill Apt. 583',
//       company: 'Garcia-Cameron and Sons',
//       companyEmail: 'brandon07@pierce.com',
//       country: 'Martinique',
//       contact: '(970) 982-3353',
//       name: 'Mrs. Julie Donovan MD'
//     },
//     service: 'UI/UX Design & Development',
//     total: 4056,
//     avatar: require('@src/assets/images/avatars/10-small.png').default,
//     invoiceStatus: 'Draft',
//     balance: '$815',
//     dueDate: '30 Jun 2019'
//   }
// ]

const columns = [
  {
    name: "#",
    // sortable: true,
    minWidth: "107px",
    selector: ({ id }) => id,
    cell: (row) => row.id,
  },
  // {
  //   name: 'Total',
  //   minWidth: '150px',
  //   selector: ({ total }) => total,
  //   cell: row => <span>${row.total || 0}</span>
  // },
  {
    minWidth: "200px",
    name: "Date",
    cell: (row) => row.createdAt,
    selector: ({ createdAt }) => createdAt,
  },
  {
    name: "Action",
    minWidth: "110px",
    sortable: true,
    cell: (row) => (
      <div className="column-action d-flex align-items-center">
        <Download size={17} id={`send-tooltip-${row.id}`} />
        <UncontrolledTooltip placement="top" target={`send-tooltip-${row.id}`}>
          Download Invoice
        </UncontrolledTooltip>
      </div>
    ),
  },
];

const BillingHistory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/api/invoices`, {
        perPage: 50,
        page: 1,
      })
      .then((res) => {
        setData(res.data.invoices);
      })
      .catch(() => {
        setData([]);
      });
  }, []);

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Billing History</CardTitle>
          {/* <UncontrolledButtonDropdown>
          <DropdownToggle outline caret>
            Export
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem className='w-100'>
              <Printer className='font-small-4 me-50' />
              <span>Print</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <FileText className='font-small-4 me-50' />
              <span>CSV</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <File className='font-small-4 me-50' />
              <span>Excel</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <Clipboard className='font-small-4 me-50' />
              <span>PDF</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <Copy className='font-small-4 me-50' />
              <span>Copy</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown> */}
        </CardHeader>
        <div className="invoice-list-dataTable react-dataTable">
          <DataTable
            noHeader
            responsive
            data={data}
            columns={columns}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
          />
        </div>
      </Card>
    </div>
  );
};

export default BillingHistory;
