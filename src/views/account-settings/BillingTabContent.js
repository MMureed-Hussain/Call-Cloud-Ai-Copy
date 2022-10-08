// ** React Imports
import { Fragment, useState, useRef } from "react";

// ** Demo Components
import PaymentMethods from "./PaymentMethods";
// import BillingAddress from './BillingAddress'
import BillingHistory from "./BillingHistory";
import BillingCurrentPlan from "./BillingCurrentPlan";

const BillingTabContent = () => {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const paymentMethodRef = useRef();

  return (
    <Fragment>
      <BillingCurrentPlan
        hasPaymentMethod={hasPaymentMethod}
        paymentMethodRef={paymentMethodRef}
      />
      <div ref={paymentMethodRef}>
        <PaymentMethods setHasPaymentMethod={setHasPaymentMethod} />
      </div>
      {/* <BillingAddress /> */}
      <BillingHistory />
    </Fragment>
  );
};

export default BillingTabContent;
