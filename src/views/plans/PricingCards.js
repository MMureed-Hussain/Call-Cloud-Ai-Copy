// import { useState } from "react";
// ** Third Party Components
import classnames from "classnames";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Badge,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";

// import { ReactSortable } from "react-sortablejs";
// import { orderProducts } from "@store/plans";
// import { useDispatch } from "react-redux";

const PricingCards = ({
  data,
  duration,
  bordered,
  fullWidth,
  cols,
  // setData,
  selectedPrice,
  setSelectedPrice,
  cardSection,
  currentPlan,
}) => {
  const colsProps = cols ? cols : { md: data.length > 3 ? 3 : 4, xs: 12 };
  // const [selectedPlan, setSelectedPlan] = useState(false);

  const renderPricingCards = () => {
    // const stateRef = useRef();
    // const dispatch = useDispatch();

    return (
      <>
        {data.map((item, index) => {
          // prettier-ignore
          const monthlyPrice = duration === "yearly" ? item.yearlyPlan.perMonth : item.monthlyPrice,
            // prettier-ignore
            yearlyPrice = duration === "yearly" ? item.yearlyPlan.totalAnnual : item.monthlyPrice;
          // imgClasses = item.title === 'Basic' ? 'mb-2 mt-5' : item.title === 'Standard' ? 'mb-1' : 'mb-2'

          return (
            <Col className="item px-1" key={index} {...colsProps}>
              <Card
                style={{
                  // prettier-ignore
                  cursor: currentPlan && currentPlan.is_free_pan && currentPlan.id === item.id ? "not-allowed" : currentPlan && !currentPlan.is_free_pan && currentPlan.id === item.id && currentPlan.currentPrice.cycle === duration ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (
                    (currentPlan &&
                      currentPlan.is_free_pan &&
                      currentPlan.id === item.id) ||
                    (currentPlan &&
                      !currentPlan.is_free_pan &&
                      currentPlan.id === item.id &&
                      currentPlan.currentPrice.cycle === duration)
                  ) {
                    return;
                  }
                  // prettier-ignore
                  duration === "yearly" ? setSelectedPrice(item.yearlyPriceId) : setSelectedPrice(item.monthlyPriceId);
                  if (cardSection) {
                    cardSection.current.scrollIntoView();
                  }
                }}
                className={classnames("text-center", {
                  border: bordered,
                  // prettier-ignore
                  "shadow-lg": selectedPrice && (selectedPrice === item.yearlyPriceId || selectedPrice === item.monthlyPriceId),
                  // "shadow-xl": "shadow-xl",
                  // prettier-ignore
                  popular: selectedPrice && (selectedPrice === item.yearlyPriceId || selectedPrice === item.monthlyPriceId),
                  "border-primary":
                    // prettier-ignore
                    bordered && selectedPrice && (selectedPrice === item.yearlyPriceId || selectedPrice === item.monthlyPriceId),
                  [`${item.title.toLowerCase()}-pricing`]: item.title,
                })}
              >
                <CardBody>
                  {item.popular === true ? (
                    <div className="pricing-badge text-end">
                      <Badge color="light-primary" pill>
                        Popular
                      </Badge>
                    </div>
                  ) : null}
                  {/* <img className={imgClasses} src={item.img} alt='pricing svg' /> */}
                  <h3>{item.title}</h3>
                  <CardText>{item.subtitle}</CardText>
                  <div className="annual-plan">
                    <div className="plan-price mt-2">
                      <sup className="font-medium-1 fw-bold text-primary me-25">
                        $
                      </sup>
                      <span
                        className={`pricing-${item.title.toLowerCase()}-value fw-bolder text-primary`}
                      >
                        {monthlyPrice}
                      </span>
                      <span className="pricing-duration text-body font-medium-1 fw-bold ms-25">
                        /month
                      </span>
                    </div>
                    {item.title !== "Basic_" && duration === "yearly" ? (
                      <small className="annual-pricing text-muted">
                        USD {yearlyPrice} / year
                      </small>
                    ) : null}
                  </div>
                  <ListGroup
                    tag="ul"
                    className="list-group-circle text-start mb-2"
                  >
                    {item.planBenefits.map((benefit, i) => (
                      <ListGroupItem key={i} tag="li">
                        {benefit}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                  {currentPlan && (
                    <Button
                      disabled={
                        (currentPlan &&
                          currentPlan.is_free_pan &&
                          currentPlan.id === item.id) ||
                        (currentPlan &&
                          !currentPlan.is_free_pan &&
                          currentPlan.id === item.id &&
                          currentPlan.currentPrice.cycle === duration)
                      }
                      block
                      // onClick={}
                      // outline={item.title !== "Standard"}
                      // color={item.title === "Basic" ? "success" : "primary"}
                      color="primary"
                    >
                      {/* {item.title === "Basic" ? "Your current plan" : "Upgrade"} */}
                      {
                        // prettier-ignore
                        currentPlan ? currentPlan.id === item.id && currentPlan.is_free_pan ? "Current Plan" : !currentPlan.is_free_pan && currentPlan.id === item.id && currentPlan.currentPrice.cycle === duration ? "Current Plan" : "Change Plan" : "Get Started"
                      }
                    </Button>
                  )}
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </>
    );
  };

  const defaultCols = {
    sm: { offset: 2, size: 10 },
    lg: { offset: 2, size: 10 },
  };

  return (
    <Row className="pricing-card">
      <Col
        {...(!fullWidth ? defaultCols : {})}
        className={classnames({ "mx-auto": !fullWidth })}
      >
        <Row>{renderPricingCards()}</Row>
      </Col>
    </Row>
  );
};

export default PricingCards;
