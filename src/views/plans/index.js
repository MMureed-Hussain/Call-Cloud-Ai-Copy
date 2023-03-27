// ** React Imports
import { useState, useEffect, Fragment, useRef } from "react";

// ** Third Party Components

import { useSelector, useDispatch } from "react-redux";
import { getActivePlans } from "@store/plans";

// ** Demo Components
// import PricingFaqs from './PricingFaqs'
import PricingCards from "./PricingCards";
// import PricingTrial from './PricingTrial'
import PricingHeader from "./PricingHeader";
import PaymentSetup from "./PaymentSetup";

// ** Styles
import "@styles/base/pages/page-pricing.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { recentlyAccessedWorkspaces } from "../../redux/workspaces";
import { Navigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Plans = () => {
  const store = useSelector((state) => {
    return state.auth;
  });
  const workspaceUsers = useSelector((state) => state.workspaces?.users);

  const transformedUsers = workspaceUsers.map((user) => ({
    value: user.id,
    label: user.name,
    email: user.email,
    userRole: user.userRole,
  }));
  const isAdmin = transformedUsers.find((user) => user.email === store.user.email && user.userRole === 'admin');

  // ** States
  const [data, setData] = useState(null),
    [duration, setDuration] = useState("monthly");

  const planStore = useSelector((store) => store.plans);

  const [selectedPrice, setSelectedPrice] = useState(false);
  const cardSection = useRef(null);

  useEffect(() => {
    setSelectedPrice(false);
  }, [duration]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActivePlans());
    dispatch(recentlyAccessedWorkspaces());
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
        yearlyPriceId: plan.active_prices.filter((price) => price.cycle === "yearly").length ? plan.active_prices.filter((price) => price.cycle === "yearly")[0].id : plan.is_free_plan ? `free_plan-${plan.id}` : false,

        yearlyPlan: {
          // prettier-ignore
          perMonth: plan.active_prices.filter((price) => price.cycle === "yearly").length ? Math.round(plan.active_prices.filter((price) => price.cycle === "yearly")[0].amount / 12 * 10) / 10 : 0,
          // prettier-ignore
          totalAnnual: plan.active_prices.filter((price) => price.cycle === "yearly").length ? plan.active_prices.filter((price) => price.cycle === "yearly")[0].amount : 0,
        },
        // prettier-ignore
        planBenefits: plan.features.map((feature) => feature.title),
      };
    });
    setData(tempData);
  }, [planStore]);

  return (
    isAdmin ? (
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
            cardSection={cardSection}
          />
          <Elements stripe={stripePromise}>
            <PaymentSetup
              cardSectionRef={cardSection}
              selectedPrice={selectedPrice}
              data={data}
            ></PaymentSetup>
          </Elements>
        </Fragment>
      ) : null}
    </div>
  ) : "You don't have rights for this route"
  );
};

export default Plans;
