import { Fragment } from "react";
import { Card, CardBody, Button } from "reactstrap";

const calendars = [
  {
    email: "emal_2@yopmail.com",
    text: "text about calendar",
    logo: require("@src/assets/images/logo/Google-logo.png"),
  },

  {
    email: "emal_2@yopmail.com",
    text: "text about calendar 2",
    logo: require("@src/assets/images/logo/Google-logo.png"),
  },
];
const CalendarSettings = () => {
  return (
    <Fragment>
      <Card>
        <CardBody>
          <h4>Linked Calendars</h4>
          <p>Display content from your connected accounts on your site</p>

          <div className="mt-2 d-flex flex-column">
            {calendars.map((calendar, key) => {
              return (
                <div key={key} className="d-flex my-1 align-items-center">
                  <div>
                    <img
                      className="me-2"
                      src={calendar.logo}
                      alt="Generic placeholder image"
                    />
                  </div>
                  <div className="d-flex justify-content-start flex-column">
                    <h5 className="mb-0">{calendar.email}</h5>
                    <p>{calendar.text}</p>
                  </div>

                  <div className="ms-auto">
                    <Button
                      //   tag={Label}
                      className="mb-75 me-75"
                      size="sm"
                      color="primary"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 d-flex">
            <span>Looking for different calendar?</span>

            <span role={"button"} className="text-primary ms-1 fw-bolderer">
              Connect another calendar account
            </span>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default CalendarSettings;
