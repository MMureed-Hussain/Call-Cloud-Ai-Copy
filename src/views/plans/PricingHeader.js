// ** Reactstrap Imports
import { Input } from "reactstrap";

const PricingHeader = ({ duration, setDuration }) => {
  const onChange = (e) => {
    if (e.target.checked) {
      setDuration("yearly");
    } else {
      setDuration("monthly");
    }
  };

  return (
    <div className="text-center">
      <h1>Pricing Plans</h1>
      <p className="mb-2 pb-75">Select plan which is best for your business!</p>
      <div className="d-flex align-items-center justify-content-center mb-2 pb-50">
        <h6 className="me-50 mb-0">Monthly</h6>
        <div className="form-switch">
          <Input
            style={{ cursor: "pointer" }}
            id="plan-switch"
            type="switch"
            checked={duration === "yearly"}
            onChange={onChange}
          />
        </div>
        <h6 className="ms-50 mb-0">Annually</h6>
      </div>
    </div>
  );
};

export default PricingHeader;
