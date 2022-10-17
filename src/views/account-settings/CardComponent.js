import { useState, useEffect } from "react";

// ** Reactstrap Imports
import { Button, Spinner, Label, Input, Row, Col } from "reactstrap";

import { Check, X } from "react-feather";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ** Third Party Components
import axios from "axios";
axios.defaults.withCredentials = true;
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useStripe, CardElement, useElements } from "@stripe/react-stripe-js";

const CardComponent = ({ refreshCardList }) => {
  const [subscribeLoader, setSubscribeLoader] = useState(false);
  // const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [makeDefault, setMakeDefault] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const authStore = useSelector((store) => store.auth);

  const loadClientSecret = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/get-client-secret`
    );
    if (res.data) {
      setClientSecret(res.data.client_secret);
    }
  };
  useEffect(() => {
    loadClientSecret();
  }, []);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setSubscribeLoader(true);
    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: authStore.user.name,
        },
        metadata: {
          action: "addPaymentMethod",
          makeDefault,
        },
      },
    });
    setSubscribeLoader(false);

    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      setErrorMessage(result.error.message);
    } else {
      // The payment has been processed!
      if (result.setupIntent.status === "succeeded") {
        toast.success("Payment method added successfully!");
        setClientSecret(null);
        setErrorMessage(null);
        loadClientSecret();
        setTimeout(() => {
          refreshCardList();
        }, 3000);
      }
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <Row>
        {/* <Col md="6"> */}
        {/* <div className="d-flex my-2 py-25 justify-content-center h-100 w-100">
            <Spinner size={"sm"} color="primary" />
          </div> */}
        <Skeleton height={20} />
        <Skeleton height={70} />
        {/* </Col> */}
      </Row>
    );
  }
  return (
    <>
      <CardElement />
      <p className="d-flex invalid-feedback">{errorMessage}</p>

      <div className="d-flex align-items-center">
        <div className="form-switch w-100">
          <Input
            // defaultChecked
            type="switch"
            onChange={(e) => {
              setMakeDefault(e.target.checked);
            }}
            value={makeDefault}
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
          <Label className="fw-bolder ms-1" for="save-card">
            Save this as the Default Payment Method
          </Label>
        </div>
      </div>
      <Button
        disabled={!stripe || subscribeLoader}
        className="mt-2"
        //   prettier-ignore
        style={{cursor: !stripe  ? "not-allowed" : "pointer" }}
        onClick={handleSubmit}
        //   disabled={!stripe}
        color="primary"
      >
        Add Payment Method
        {subscribeLoader && (
          <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />
        )}
      </Button>
    </>
  );
};

export default CardComponent;
