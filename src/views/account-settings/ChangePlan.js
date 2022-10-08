// ** React Imports
import { useState, useEffect, Fragment, useRef } from "react";

// ** Third Party Components
import axios from "axios";
axios.defaults.withCredentials = true;

import { useSelector, useDispatch } from "react-redux";
import { getActivePlans } from "@store/plans";

// ** Demo Components
// import PricingFaqs from './PricingFaqs'
import PricingCards from "../plans/PricingCards";
// import PricingTrial from './PricingTrial'
import PricingHeader from "../plans/PricingHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Spinner,
} from "reactstrap";
// ** Styles
import "@styles/base/pages/page-pricing.scss";
import toast from "react-hot-toast";

const ChangePlan = ({ currentPlan, handleChangePlanSuccess }) => {
  // ** States
  const [data, setData] = useState(null),
    [duration, setDuration] = useState("monthly");

  const planStore = useSelector((store) => store.plans);

  const [selectedPrice, setSelectedPrice] = useState(false);
  const [subscribeLoader, setSubscribeLoader] = useState(false);
  const cardSection = useRef();

  useEffect(() => {
    setSelectedPrice(false);
  }, [duration]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActivePlans());
  }, []);

  useEffect(() => {
    const tempData = planStore.activePlans.map((plan) => {
      return {
        id: plan.id,
        active_prices: plan.active_prices,
        is_free_plan: plan.is_free_plan,
        trial_days: plan.trial_days,
        title: plan.name,
        subtitle: plan.description,
        // prettier-ignore
        monthlyPrice: plan.active_prices.filter((price) => price.cycle === "monthly").length ? plan.active_prices.filter((price) => price.cycle === "monthly")[0].amount : 0,
        // prettier-ignore
        monthlyPriceId: plan.active_prices.filter((price) => price.cycle === "monthly").length ? plan.active_prices.filter((price) => price.cycle === "monthly")[0].id : plan.is_free_plan ? `free_plan-${plan.id}` : false,
        // prettier-ignore
        yearlyPriceId: plan.active_prices.filter((price) => price.cycle === "yearly").length ? plan.active_prices.filter((price) => price.cycle === "yearly")[0].id :  plan.is_free_plan ? `free_plan-${plan.id}` : false,

        yearlyPlan: {
          // prettier-ignore
          perMonth: plan.active_prices.filter((price) => price.cycle === "yearly").length ? Math.round(plan.active_prices.filter((price) => price.cycle === "yearly")[0].amount / 12 * 10) / 10 : 0,
          // prettier-ignore
          totalAnnual : plan.active_prices.filter((price) => price.cycle === "yearly").length ? plan.active_prices.filter((price) => price.cycle === "yearly")[0].amount : 0,
        },
        // prettier-ignore
        planBenefits: plan.features.map((feature) => feature.title),
      };
    });
    setData(tempData);
  }, [planStore]);

  let selectedPlanObject, selectedPriceObject;
  if (selectedPrice && selectedPrice.includes("free_plan")) {
    const planId = selectedPrice.split("-")[1];
    selectedPlanObject = data.filter((plan) => plan.id === planId)[0];
    selectedPriceObject = null;
  } else {
    // prettier-ignore
    selectedPlanObject = data && data.filter((plan) => plan.active_prices.filter((price) => price.id === selectedPrice).length)[0];

    // prettier-ignore
    selectedPriceObject = selectedPlanObject && selectedPlanObject.active_prices.filter((price) => price.id === selectedPrice)[0];
  }

  const handleChangePlan = () => {
    const payload = { plan_id: selectedPlanObject.id };
    if (!selectedPlanObject.is_free_plan) {
      // prettier-ignore
      payload.price_id = duration === "monthly" ? selectedPlanObject.monthlyPriceId : selectedPlanObject.yearlyPriceId;
    }

    setSubscribeLoader(true);
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/api/change-plan`, payload)
      .then((res) => {
        setSubscribeLoader(false);
        toast.success(res.data.message);
        handleChangePlanSuccess();
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  return (
    <div id="pricing-table">
      <PricingHeader duration={duration} setDuration={setDuration} />
      {data !== null ? (
        <Fragment>
          <PricingCards
            fullWidth={true}
            // setData={setData}
            data={data}
            duration={duration}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            currentPlan={currentPlan}
            cardSection={cardSection}
          />

          <Card>
            <CardHeader className="border-bottom">
              <CardTitle tag="h4">Selected Plan</CardTitle>
            </CardHeader>
            <div ref={cardSection} style={{ display: "content" }}>
              {(!selectedPlanObject ||
                (selectedPlanObject && !selectedPlanObject.is_free_plan)) && (
                <CardBody className="py-2 my-25">
                  <Col lg="6" className="mt-2">
                    <Button
                      disabled={
                        !selectedPlanObject ||
                        !selectedPriceObject ||
                        subscribeLoader
                      }
                      className="mt-2"
                      //   prettier-ignore
                      style={{cursor: (!selectedPlanObject || !selectedPriceObject) ? "not-allowed" : "pointer" }}
                      onClick={handleChangePlan}
                      //   disabled={!stripe}
                      color="primary"
                    >
                      Change Plan
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
                          <span className="h6">
                            {selectedPriceObject.cycle}
                          </span>{" "}
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
                </CardBody>
              )}

              {selectedPlanObject && selectedPlanObject.is_free_plan && (
                <CardBody className="py-2 my-25">
                  <p>
                    You have selected{" "}
                    <span className="h6">{selectedPlanObject.title}</span> plan
                    which will expire after{" "}
                    <span className="h6">{selectedPlanObject.trial_days}</span>{" "}
                    days
                  </p>

                  <Button
                    className="mt-2"
                    //   prettier-ignore

                    onClick={handleChangePlan}
                    //   disabled={!stripe}
                    color="primary"
                  >
                    Downgrade to free plan
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
      ) : null}
    </div>
  );
};

export default ChangePlan;
