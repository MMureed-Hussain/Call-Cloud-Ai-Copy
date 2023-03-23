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
import toast from "react-hot-toast";
axios.defaults.withCredentials = true;

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentSetup = ({ selectedPrice, data, cardSectionRef }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [subscribeLoader, setSubscribeLoader] = useState(false);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [redirectAfter, setRedirectAfter] = useState(10);

  useEffect(() => {
    if (redirectAfter === 0) {
      window.location.href = "/dashboard";
    }
  }, [redirectAfter]);
  const elements = useElements();
  const stripe = useStripe();

  const authStore = useSelector((store) => store.auth);

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
      if (result.setupIntent.status === "succeeded") {
        toast.success("Subscription created successfully!");
        setSubscriptionCreated(true);
        setRedirectAfter(10);
        setInterval(() => {
          setRedirectAfter((seconds) => {
            return seconds > 0 ? seconds - 1 : 0;
          });
        }, 800);
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/get-client-secret`
      );
      if (res.data) {
        setClientSecret(res.data.client_secret);
      }
    })();
  }, []);
  //   console.log(data);

  let selectedPlanObject, selectedPriceObject;
  if (selectedPrice && selectedPrice.includes("free_plan")) {
    const planId = selectedPrice.split("-")[1];
    selectedPlanObject = data.filter((plan) => plan.id === planId)[0];
    selectedPriceObject = null;
  } else {
    // prettier-ignore
    selectedPlanObject = data.filter((plan) => plan.active_prices.filter((price) => price.id === selectedPrice).length)[0];

    // prettier-ignore
    selectedPriceObject = selectedPlanObject && selectedPlanObject.active_prices.filter((price) => price.id === selectedPrice)[0];
  }

  const handleFreePlanSubmit = async (event) => {
    event.preventDefault();
    setSubscribeLoader(true);

    const res = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/api/create-free-plan-subscription`,
      { plan_id: selectedPlanObject.id }
    );

    if (res.data) {
      if (res.data.message == "This Plan Is Already Subscribed!") {
        toast.error(res.data.message);
        setSubscribeLoader(false);
      } else {
        toast.success(res.data.message);
        setSubscribeLoader(false);
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Payment Details</CardTitle>
        </CardHeader>
        <div ref={cardSectionRef} style={{ display: "content" }}>
          {(!selectedPlanObject ||
            (selectedPlanObject && !selectedPlanObject.is_free_plan)) && (
              <CardBody className="py-2 my-25">
                {clientSecret && (
                  <Col lg="12" className="mt-2">
                    {/* <Elements stripe={stripePromise}> */}
                    <Col lg="6">
                      <CardElement />
                    </Col>
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
                      style={{ cursor: (!selectedPlanObject || !stripe || !selectedPriceObject) ? "not-allowed" : "pointer" }}
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
                    {subscriptionCreated && (
                      <>
                        <div className="mt-2 p-1 text-primary shadow rounded">
                          <p>
                            Your subscription created successfully. We will send
                            you mail on activation of your subscription soon. No
                            further action required from your side.
                          </p>
                          <p>Thank you!</p>
                        </div>

                        <Button
                          className="mt-2"
                          //   prettier-ignore

                          onClick={() => {
                            window.location.href = "/dashboard"
                          }}
                          //   disabled={!stripe}
                          color="primary"
                        >
                          Go To Dashboard
                          <Spinner
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            size={"sm"}
                            color="white"
                            type="grow"
                          />
                          {redirectAfter}
                        </Button>
                      </>
                    )}
                  </Col>
                )}
              </CardBody>
            )}

          {selectedPlanObject && selectedPlanObject.is_free_plan && (
            <CardBody className="py-2 my-25">
              <p>
                You have selected{" "}
                <span className="h6">{selectedPlanObject.title}</span> plan
                which will expire after{" "}
                <span className="h6">{selectedPlanObject.trial_days}</span> days
              </p>

              <Button
                className="mt-2"
                //   prettier-ignore

                onClick={handleFreePlanSubmit}
                //   disabled={!stripe}
                color="primary"
              >
                Start free plan
                {subscribeLoader && (
                  <Spinner
                    style={{ marginLeft: "5px" }}
                    size={"sm"}
                    color="white"
                  />
                )}
              </Button>
            </CardBody>
          )}
        </div>
      </Card>
    </Fragment>
  );
};

export default PaymentSetup;
