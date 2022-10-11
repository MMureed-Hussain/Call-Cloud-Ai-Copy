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
  AlertTriangle,
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
  Modal,
  ModalBody,
  ModalHeader,
  Col,
  Button,
  CardBody,
} from "reactstrap";

import classnames from "classnames";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import toast from "react-hot-toast";

const columns = [
  {
    name: "Status",
    // sortable: true,
    // minWidth: "107px",
    // selector: ({ indexNo }) => indexNo,
    cell: (row) => {
      if (row.status === "paid") {
        return (
          <>
            <CheckCircle
              id={`invoice-status-tooltip-${row.indexNo}`}
              className="text-primary"
            />
            <UncontrolledTooltip
              placement="top"
              target={`invoice-status-tooltip-${row.indexNo}`}
            >
              Paid
            </UncontrolledTooltip>
          </>
        );
      }

      if (row.status === "open") {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => row.handlePayInvoice(row.id)}
          >
            <AlertTriangle
              id={`invoice-status-tooltip-${row.indexNo}`}
              className="text-danger"
            />
            <UncontrolledTooltip
              placement="top"
              target={`invoice-status-tooltip-${row.indexNo}`}
            >
              Pay now
            </UncontrolledTooltip>
          </div>
        );
      }

      return null;
    },
  },
  {
    name: "#",
    // sortable: true,
    // minWidth: "107px",
    selector: ({ indexNo }) => indexNo,
    cell: (row) => row.indexNo,
  },
  {
    name: "Total",
    minWidth: "150px",
    selector: ({ total }) => total,
    cell: (row) => <span>${row.total || 0}</span>,
  },
  // {
  //   name: "Status",
  //   minWidth: "150px",
  //   // selector: ({ total }) => total,
  //   cell: (row) => row.status,
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
          {`Download Invoice`}
        </UncontrolledTooltip>
      </div>
    ),
  },
];

const BillingHistory = ({ paymentMethods }) => {
  const [data, setData] = useState([]);
  const [payInvoiceModal, setPayInvoiceModal] = useState(false);
  const [payInvoiceId, setPayInvoiceId] = useState(null);
  const [payingInvoice, setPayingInvoice] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    // prettier-ignore
    return paymentMethods.filter((card) => card.isPrimary).length ? paymentMethods.filter((card) => card.isPrimary)[0].id : null;
  });

  useEffect(() => {
    // prettier-ignore
    paymentMethods.filter((card) => card.isPrimary).length ? setSelectedPaymentMethod(paymentMethods.filter((card) => card.isPrimary)[0].id) : setSelectedPaymentMethod(null);
  }, [paymentMethods]);

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

  const handlePayInvoice = (id) => {
    console.log(id);
    setPayInvoiceModal(true);
    setPayInvoiceId(id);
  };

  const handlePayInvoiceAPI = () => {
    if (payInvoiceId && selectedPaymentMethod) {
      setPayingInvoice(true);

      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/api/pay-invoice`, {
          invoice_id: payInvoiceId,
          payment_method: selectedPaymentMethod,
        })
        .then((res) => {
          toast.success(res.data.message);
          setPayInvoiceId(null);
          setPayInvoiceModal(false);
          setPayingInvoice(false);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
          setPayingInvoice(false);
        });
    }
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
          invoice.handlePayInvoice = handlePayInvoice;
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
        <CardBody>
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
        </CardBody>
      </Card>

      <Modal
        isOpen={payInvoiceModal}
        toggle={() => setPayInvoiceModal(!payInvoiceModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setPayInvoiceModal(!payInvoiceModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          {payInvoiceModal && (
            <Col lg="12" className="mt-2 mt-lg-0">
              <h6 className="fw-bolder mb-2">Select Payment Method</h6>
              <div className="added-cards">
                {paymentMethods.map((card, index) => {
                  // const isLastCard =
                  //   index === paymentMethods[paymentMethods.length - 1];
                  return (
                    <Card
                      style={{ cursor: "pointer" }}
                      key={index}
                      onClick={() => setSelectedPaymentMethod(card.id)}
                      className={
                        // prettier-ignore
                        selectedPaymentMethod === card.id ? "shadow-lg bordered border-primary" : "shadow bordered"
                      }
                    >
                      <div className={classnames("cardMaster rounded p-2")}>
                        <div className="d-flex justify-content-between flex-sm-row flex-column">
                          <div className="card-information">
                            <img
                              src={card.imgSrc}
                              alt={card.imgAlt}
                              className="mb-1 img-fluid"
                            />
                            <div className="d-flex align-items-center mb-50">
                              {/* <h6 className="mb-0">{card.name}</h6> */}
                              {card.isPrimary && (
                                <Badge color="light-primary" className="ms-50">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <span className="card-number ">
                              **** **** ****{" "}
                              {card.cardNumber.substring(
                                card.cardNumber.length - 4
                              )}
                            </span>
                          </div>
                          <div className="d-flex flex-column text-start text-lg-end">
                            <span className="mt-2">
                              Card expires at {card.expiryDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                <Button
                  disabled={!selectedPaymentMethod}
                  // size="sm"
                  onClick={() => {
                    handlePayInvoiceAPI();
                  }}
                  color="primary"
                  // className="mx-auto"
                >
                  Pay Invoice
                  {payingInvoice && (
                    <Spinner
                      style={{ marginLeft: "5px" }}
                      size={"sm"}
                      color="white"
                    />
                  )}
                </Button>
              </div>
            </Col>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default BillingHistory;
