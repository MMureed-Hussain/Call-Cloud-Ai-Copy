import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Spinner,
} from "reactstrap";

import {
  useStripe,
  //   Elements,
  CardElement,
  useElements,
} from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

import axios from "axios";
axios.defaults.withCredentials = true;

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentSetup = ({ selectedPrice, data, cardSectionRef }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [subscribeLoader, setSubscribeLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const elements = useElements();
  const stripe = useStripe();

  const authStore = useSelector((store) => store.auth);
  console.log("authStore", authStore);
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
          action: "subscribe",
          price: selectedPrice,
        },
      },
    });
    setSubscribeLoader(false);

    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      setErrorMessage(result.error.message);
    } else {
      // The payment has been processed!
      console.log("result", result);
      if (result.setupIntent.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  //   const options = {
  //     // passing the client secret obtained in step 2
  //     clientSecret,
  //     // Fully customizable with appearance API.
  //     // appearance: {/*...*/},
  //   };

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/get-client-secret`
      );
      console.log("res", res);
      if (res.data) {
        setClientSecret(res.data.client_secret);
      }
    })();
  }, []);
  //   console.log(data);
  // prettier-ignore
  const selectedPlanObject = data.filter((plan) => plan.active_prices.filter((price) => price.id === selectedPrice).length)[0];

  // prettier-ignore
  const selectedPriceObject = selectedPlanObject && selectedPlanObject.active_prices.filter((price) => price.id === selectedPrice)[0];

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Payment Details</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          {clientSecret && (
            <div ref={cardSectionRef} style={{ display: "content" }}>
              <Col lg="6" className="mt-2">
                {/* <Elements stripe={stripePromise}> */}
                <CardElement />
                <p className="d-flex invalid-feedback">{errorMessage}</p>
                {/* </Elements> */}

                <Button
                  disabled={
                    !selectedPlanObject ||
                    !stripe ||
                    !selectedPriceObject ||
                    subscribeLoader
                  }
                  className="mt-2"
                  //   prettier-ignore
                  style={{cursor: (!selectedPlanObject || !stripe || !selectedPriceObject) ? "not-allowed" : "pointer" }}
                  onClick={handleSubmit}
                  //   disabled={!stripe}
                  color="primary"
                >
                  Subscribe
                  {subscribeLoader && (
                    <Spinner
                      style={{ marginLeft: "5px" }}
                      size={"sm"}
                      color="white"
                    />
                  )}
                </Button>
                <div className="mt-2">
                  {selectedPlanObject && selectedPriceObject ? (
                    <p>
                      You have selected{" "}
                      <span className="h6">{selectedPlanObject.title}</span>{" "}
                      plan with{" "}
                      <span className="h6">{selectedPriceObject.cycle}</span>{" "}
                      billing cycle ({" "}
                      <span className="h6">
                        ${selectedPriceObject.amount} /{" "}
                        {
                          // prettier-ignore
                          selectedPriceObject.cycle === "yearly" ? "Year" : "Month"
                        }
                      </span>{" "}
                      )
                    </p>
                  ) : (
                    <p>Please select plan!</p>
                  )}
                </div>
              </Col>
            </div>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default PaymentSetup;
