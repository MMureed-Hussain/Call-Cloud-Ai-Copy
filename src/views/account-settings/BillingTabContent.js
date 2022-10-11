// ** React Imports
import { Fragment, useState, useRef } from "react";

// ** Demo Components
import PaymentMethods from "./PaymentMethods";
// import BillingAddress from './BillingAddress'
import BillingHistory from "./BillingHistory";
import BillingCurrentPlan from "./BillingCurrentPlan";
import UpcomingInvoice from "./UpcomingInvoice";

const BillingTabContent = () => {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [data, setData] = useState([]);

  const paymentMethodRef = useRef();

  return (
    <Fragment>
      <BillingCurrentPlan
        hasPaymentMethod={hasPaymentMethod}
        paymentMethodRef={paymentMethodRef}
      />
      <div ref={paymentMethodRef}>
        <PaymentMethods
          data={data}
          setData={setData}
          setHasPaymentMethod={setHasPaymentMethod}
        />
      </div>
      {/* <BillingAddress /> */}
      <UpcomingInvoice />
      <BillingHistory paymentMethods={data} />
    </Fragment>
  );
};

export default BillingTabContent;
