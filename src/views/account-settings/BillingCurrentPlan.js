// ** React Imports
import { Fragment, useState, useEffect } from "react";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Modal,
  Input,
  Button,
  CardBody,
  Progress,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader,
} from "reactstrap";

// ** Demo Components
// import PricingCard from "@src/views/pages/pricing/PricingCards";

// ** Third Party Components
import axios from "axios";
axios.defaults.withCredentials = true;

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Styles
import "@styles/base/pages/page-pricing.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";

import ChangePlan from "./ChangePlan";
import toast from "react-hot-toast";
const MySwal = withReactContent(Swal);

const BillingCurrentPlan = ({ hasPaymentMethod, paymentMethodRef }) => {
  // ** States
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);

  const loadCurrentPlan = () => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/current-plan-details`)
      .then((res) => {
        setData(res.data.currentPlanDetails);
      });
  };
  useEffect(() => {
    loadCurrentPlan();
  }, []);

  const handleConfirmCancel = () => {
    return MySwal.fire({
      title: "",
      text: "Are you sure you would like to cancel your subscription?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .get(`${process.env.REACT_APP_API_ENDPOINT}/api/cancel-subscription`)
          .then((res) => {
            MySwal.fire({
              icon: "success",
              title: "Unsubscribed!",
              text: res.data.message,
              customClass: {
                confirmButton: "btn btn-success",
              },
            }).then(() => {
              window.location.href = "/profile?active_tab=billing";
            });
          });
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          text: "Unsubscription Cancelled!!",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };

  const handleChangePlanSuccess = () => {
    loadCurrentPlan();
    setShow(false);
  };

  if (!data) {
    return null;
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Current plan</CardTitle>
        </CardHeader>
        <CardBody className="my-2 py-25">
          <Row>
            <Col md="6">
              <div className="mb-2 pb-50">
                <h5>
                  Your Current Plan is <strong>{data.currentPlan.name}</strong>
                </h5>
                <span>{data.currentPlan.description}</span>
              </div>
              <div className="mb-2 pb-50">
                <h5>Active until {data.currentPlan.active_until}</h5>
                <span>
                  {
                    // prettier-ignore
                    data.currentPlan.is_free_plan ? "We will send you a notification upon Subscription expiration" : "Your subscription will auto renew!"
                  }
                </span>
              </div>
              {/* <div className="mb-2 mb-md-1">
                <h5>
                  $199 Per Month{" "}
                  <Badge color="light-primary" className="ms-50">
                    Popular
                  </Badge>
                </h5>
                <span>Standard plan for small to medium businesses</span>
              </div> */}
            </Col>
            <Col md="6">
              {/* <Alert color="warning">
                <h4 className="alert-heading">We need your attention!</h4>
                <div className="alert-body">your plan requires update</div>
              </Alert> */}
              <div className="plan-statistics pt-1">
                <div className="d-flex justify-content-between">
                  <h5 className="fw-bolder">Days</h5>
                  <h5 className="fw-bolder">
                    {data.currentPlan.remainingDays} of{" "}
                    {data.currentPlan.trial_days} Days
                  </h5>
                </div>
                <Progress
                  className="mb-50"
                  value={
                    (100 *
                      (data.currentPlan.trial_days -
                        data.currentPlan.remainingDays)) /
                    data.currentPlan.trial_days
                  }
                />
                <p className="mt-50">
                  {data.currentPlan.remainingDays} days remaining
                </p>
              </div>
            </Col>
            <Col xs={12}>
              <Button
                color="primary"
                className="me-1 mt-1"
                onClick={() => {
                  if (hasPaymentMethod) {
                    setShow(true);
                  } else {
                    toast.error("Please add payment method first!");
                    paymentMethodRef.current.scrollIntoView();
                  }
                }}
              >
                Change Plan
              </Button>
              <Button
                disabled={data.currentPlan.is_free_plan}
                outline
                color="danger"
                className="mt-1"
                onClick={handleConfirmCancel}
              >
                Cancel Subscription
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-xl"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          {show && (
            <ChangePlan
              handleChangePlanSuccess={handleChangePlanSuccess}
              currentPlan={data.currentPlan}
            />
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default BillingCurrentPlan;
