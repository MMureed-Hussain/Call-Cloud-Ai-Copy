import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  UncontrolledTooltip,
} from "reactstrap";

import DataTable from "react-data-table-component";

// ** Third Party Components
import axios from "axios";
axios.defaults.withCredentials = true;

import { ChevronDown, Clock } from "react-feather";
import Skeleton from "react-loading-skeleton";

const columns = [
  {
    name: "Status",
    // sortable: true,
    // minWidth: "107px",
    // selector: ({ indexNo }) => indexNo,
    cell: () => {
      return (
        <>
          <Clock
            id={`upcoming-invoice-status-tooltip`}
            className="text-primary"
          />
          <UncontrolledTooltip
            placement="top"
            target={`upcoming-invoice-status-tooltip`}
          >
            Upcoming
          </UncontrolledTooltip>
        </>
      );
    },
  },
  //   {
  //     name: "#",
  //     // sortable: true,
  //     // minWidth: "107px",
  //     cell: () => 1,
  //   },
  {
    name: "Total",
    minWidth: "150px",
    selector: ({ total }) => total,
    cell: (row) => <span>${row.total || 0}</span>,
  },
  //   {
  //     minWidth: "200px",
  //     name: "Date",
  //     cell: (row) => row.createdAt,
  //     selector: ({ createdAt }) => createdAt,
  //   },
  {
    minWidth: "200px",
    name: "Payment date",
    cell: (row) => row.nextPaymentAttempt,
    selector: ({ nextPaymentAttempt }) => nextPaymentAttempt,
  },
];

const UpcomingInvoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/upcoming-invoice`)
      .then((res) => {
        setInvoice(res.data.invoice);
        setInvoiceLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setInvoiceLoading(false);
      });
  }, []);

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Upcoming Invoice</CardTitle>
        </CardHeader>
        <div className="invoice-list-dataTable react-dataTable">
          <CardBody>
            {invoice ? (
              <DataTable
                noHeader
                responsive
                data={[invoice]}
                columns={columns}
                className="react-dataTable"
                sortIcon={<ChevronDown size={10} />}
              />
            ) : invoiceLoading ? (
              <>
                <Skeleton height={20} />
                <Skeleton height={20} />
              </>
            ) : (
              <p>No upcoming invoice is there yet!</p>
            )}
          </CardBody>
        </div>
      </Card>
    </div>
  );
};

export default UpcomingInvoice;
