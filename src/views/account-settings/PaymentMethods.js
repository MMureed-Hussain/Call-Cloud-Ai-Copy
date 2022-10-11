// ** React Imports
import { Fragment, useState, useEffect } from "react";

import Swal from "sweetalert2";

// import { useForm, Controller } from 'react-hook-form'
import withReactContent from "sweetalert2-react-content";

// ** Styles
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";

const MySwal = withReactContent(Swal);

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  Spinner,
} from "reactstrap";

// ** Third Party Components
import classnames from "classnames";

import axios from "axios";
axios.defaults.withCredentials = true;

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
import { Elements } from "@stripe/react-stripe-js";

import CardComponent from "./CardComponent";
import toast from "react-hot-toast";
const PaymentMethods = ({ setHasPaymentMethod, data, setData }) => {
  // ** States

  const [deleteLoader, setDeleteLoader] = useState(false);
  const [makeDefaultLoader, setMakeDefaultLoader] = useState(false);

  const loadPaymentMethods = () => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/payment-methods`)
      .then((res) => {
        console.log(res);
        const paymentMethods = res.data.paymentMethods;
        // const paymentMethods = [
        //   {
        //     id: "1",
        //     brand: "visa",
        //     is_primary: true,
        //     last4: "1234",
        //     expiryDate: "04/24",
        //   },
        //   {
        //     id: "2",
        //     brand: "visa",
        //     is_primary: false,
        //     last4: "2345",
        //     expiryDate: "04/24",
        //   },
        //   {
        //     id: "3",
        //     brand: "visa",
        //     is_primary: false,
        //     last4: "3456",
        //     expiryDate: "04/24",
        //   },
        // ];
        const data = paymentMethods.map((paymentMethod) => {
          let imgSrc =
            require(`@src/assets/images/icons/payments/visa.png`).default;

          if (
            [
              "visa",
              "visa-cc",
              "uatp-cc",
              "mastercard",
              "mastercard-cc",
              "maestro-cc",
              "jcb",
              "discover",
              "diners",
              "amex-cc",
              "american-ex",
            ].includes(paymentMethod.brand)
          ) {
            // prettier-ignore
            const cardImage = ["jcb", "discover", "diners"].includes(paymentMethod.brand) ? `${paymentMethod.brand}-cc` : paymentMethod.brand;
            imgSrc =
              require(`@src/assets/images/icons/payments/${cardImage}.png`).default;
          }
          return {
            expiryDate: paymentMethod.expiryDate,
            imgAlt: paymentMethod.brand,
            badgeColor: "primary",
            isPrimary: paymentMethod.is_primary,
            cardNumber: paymentMethod.last4,
            imgSrc,
            id: paymentMethod.id,
          };
        });
        if (data.length) {
          setHasPaymentMethod(true);
        }
        setData(data);
      });
  };

  const handleDeletePaymentMethod = (id) => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "Are you sure you would like to delete this payment method?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        // redirect to login page

        setDeleteLoader(true);
        axios
          .delete(
            `${process.env.REACT_APP_API_ENDPOINT}/api/payment-method/${id}`
          )
          .then((res) => {
            toast.success(res.data.message);
            loadPaymentMethods();
            setDeleteLoader(false);
          })
          .catch((e) => {
            toast.error(e.response.data.message);
            setDeleteLoader(false);
          });
      }
    });
  };

  const handleMakeDefaultPaymentMethod = (id) => {
    setMakeDefaultLoader(id);
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/default-payment-method/${id}`
      )
      .then((res) => {
        toast.success(res.data.message);
        loadPaymentMethods();
        setMakeDefaultLoader(false);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
        setMakeDefaultLoader(false);
      });
  };
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const refreshCardList = () => {
    loadPaymentMethods();
  };
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Payment Methods</CardTitle>
        </CardHeader>
        <CardBody className="my-1 py-25">
          <Row className="gx-4">
            <Col lg="6">
              <div className="mt-2">
                <Elements stripe={stripePromise}>
                  <CardComponent refreshCardList={refreshCardList} />
                </Elements>
              </div>
            </Col>
            <Col lg="6" className="mt-2 mt-lg-0">
              <h6 className="fw-bolder mb-2">My Cards</h6>
              <div className="added-cards">
                {data.map((card, index) => {
                  const isLastCard = index === data[data.length - 1];
                  return (
                    <div
                      key={index}
                      className={classnames("cardMaster rounded border p-2", {
                        "mb-1": !isLastCard,
                      })}
                    >
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
                          <div className="d-flex order-sm-0 order-1 mt-1 mt-sm-0">
                            {/* <Button
                              outline
                              color="primary"
                              className="me-75"
                              onClick={() => openEditModal(card)}
                            >
                              Edit
                            </Button> */}
                            <Button
                              disabled={card.isPrimary}
                              size="sm"
                              onClick={() => {
                                handleMakeDefaultPaymentMethod(card.id);
                              }}
                              color="primary"
                              className="mx-2"
                            >
                              Make Default
                              {makeDefaultLoader === card.id && (
                                <Spinner
                                  style={{ marginLeft: "5px" }}
                                  size={"sm"}
                                  color="white"
                                />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeletePaymentMethod(card.id)}
                              outline
                            >
                              Delete
                              {deleteLoader && (
                                <Spinner
                                  style={{ marginLeft: "5px" }}
                                  size={"sm"}
                                  color="white"
                                />
                              )}
                            </Button>
                          </div>
                          <span className="mt-2">
                            Card expires at {card.expiryDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      {/* <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
        onClosed={() => setModalCardType("")}
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1">
            {selectedCondition ? "Edit" : "Add New"} Card
          </h1>
          <p className="text-center">
            {
              //prettier-ignore
              selectedCondition ? "Edit your saved card details" : "Add card for future billing"
            }
          </p>
          <Form tag={Row} className="gy-1 gx-2 mt-75">
            <Col xs={12}>
              <Label className="form-label" for="credit-card">
                Card Number
              </Label>
              <InputGroup>
                <Cleave
                  id="credit-card"
                  className="form-control"
                  value={selectedCondition ? selected.cardNumber : ""}
                  placeholder="1356 3215 6548 7898"
                  options={{
                    creditCard: true,
                    onCreditCardTypeChanged: (type) => {
                      setModalCardType(type);
                    },
                  }}
                />
                {cardType !== "" && cardType !== "unknown" ? (
                  <InputGroupText>
                    <img
                      height="24"
                      alt="card-type"
                      src={cardsObj[modalCardType]}
                    />
                  </InputGroupText>
                ) : null}
              </InputGroup>
            </Col>
            <Col md={6}>
              <Label className="form-label" for="card-name">
                Name On Card
              </Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                defaultValue={selectedCondition ? selected.name : ""}
              />
            </Col>
            <Col xs={6} md={3}>
              <Label className="form-label" for="exp-date">
                Exp. Date
              </Label>
              <Cleave
                id="exp-date"
                placeholder="MM/YY"
                className="form-control"
                options={{ delimiter: "/", blocks: [2, 2] }}
                value={selectedCondition ? selected.expiryDate : ""}
              />
            </Col>
            <Col xs={6} md={3}>
              <Label className="form-label" for="cvv">
                CVV
              </Label>
              <Cleave
                id="cvv"
                placeholder="654"
                className="form-control"
                options={{ blocks: [3] }}
                value={selectedCondition ? selected.cardCvc : ""}
              />
            </Col>
            <Col xs={12}>
              <div className="d-flex align-items-center">
                <div className="form-switch w-100">
                  <Input
                    defaultChecked
                    type="switch"
                    name="save-card"
                    id="save-card"
                  />
                  <Label className="form-check-label" for="save-card">
                    <span className="switch-icon-left">
                      <Check size={14} />
                    </span>
                    <span className="switch-icon-right">
                      <X size={14} />
                    </span>
                  </Label>
                  <Label
                    className="form-check-label fw-bolder ms-1"
                    for="save-card"
                  >
                    Save Card for future billing?
                  </Label>
                </div>
              </div>
            </Col>
            <Col className="text-center mt-1" xs={12}>
              <Button
                className="me-1"
                color="primary"
                onClick={() => setShow(!show)}
              >
                Submit
              </Button>
              <Button color="secondary" outline onClick={() => setShow(!show)}>
                Cancel
              </Button>
            </Col>
          </Form>
        </ModalBody>
      </Modal> */}
    </Fragment>
  );
};

export default PaymentMethods;
