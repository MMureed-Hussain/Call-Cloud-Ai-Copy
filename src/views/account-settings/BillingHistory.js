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
  Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const columns = [
  {
    name: "#",
    // sortable: true,
    minWidth: "107px",
    selector: ({ indexNo }) => indexNo,
    cell: (row) => row.indexNo,
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
        <Download
          style={{ cursor: "pointer" }}
          size={17}
          id={`send-tooltip-${row.id}`}
          onClick={() => row.handleDownloadInvoice(row.id)}
        />
        {row.downloadingPDF && (
          <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="primary" />
        )}
        <UncontrolledTooltip placement="top" target={`send-tooltip-${row.id}`}>
          {`Download Invoice ${row.downloadingPDF}`}
        </UncontrolledTooltip>
      </div>
    ),
  },
];

const BillingHistory = () => {
  const [data, setData] = useState([]);

  const handleDownloadInvoice = (id) => {
    setData((data) => {
      const newState = data.map((d) => {
        if (d.id === id) {
          d.downloadingPDF = true;
        }
        return { ...d };
      });
      return newState;
    });
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/invoice/${id}`)
      .then((res) => {
        setData((data) => {
          return data.map((d) => {
            if (d.id === id) {
              d.downloadingPDF = false;
            }
            return { ...d };
          });
        });
        window.location.href = res.data.invoicePDFLink;
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/api/invoices`, {
        perPage: 50,
        page: 1,
      })
      .then((res) => {
        const invoices = res.data.invoices.map((invoice, index) => {
          invoice.indexNo = index;
          invoice.downloadingPDF = false;
          invoice.handleDownloadInvoice = handleDownloadInvoice;
          return invoice;
        });
        setData(invoices);
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
