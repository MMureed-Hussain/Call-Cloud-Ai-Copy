// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Spinner,
} from "reactstrap";

// ** Third Party Components
// import * as yup from "yup";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

import { useDispatch } from "react-redux";
import { updatePassword } from "@store/auth";

// ** Demo Components
// import ApiKeysList from './ApiKeysList'
// import CreateApiKey from './CreateApikey'
// import TwoFactorAuth from './TwoFactorAuth'
// import RecentDevices from './RecentDevices'

// const showErrors = (field, valueLen, min) => {
//   if (valueLen === 0) {
//     return `${field} field is required`;
//   } else if (valueLen > 0 && valueLen < min) {
//     return `${field} must be at least ${min} characters`;
//   } else {
//     return "";
//   }
// };

// const defaultValues = {
//   newPassword: "",
//   currentPassword: "",
//   retypeNewPassword: "",
// };

const SecurityTabContent = () => {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [newPasswordConfirmationError, setNewPasswordConfirmationError] =
    useState(false);

  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const onSubmit = async (e) => {
    let valid = true;

    if (!currentPassword) {
      valid = false;
      setCurrentPasswordError(true);
    } else {
      setCurrentPasswordError(false);
    }

    if (!newPassword || newPassword.length < 4) {
      valid = false;
      setNewPasswordError(true);
    } else {
      setNewPasswordError(false);
    }

    if (newPassword && newPasswordConfirmation !== newPassword) {
      valid = false;
      setNewPasswordConfirmationError(true);
    } else {
      setNewPasswordConfirmationError(false);
    }

    if (valid) {
      setFormSubmissionLoader(true);
      const payload = {
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
        current_password: currentPassword,
      };
      const r = await dispatch(updatePassword(payload)).unwrap();
      setFormSubmissionLoader(false);
      console.log(r);
    }

    e.preventDefault();
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Change Password</CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Form>
            <Row>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  label="Current Password"
                  htmlFor="currentPassword"
                  className="input-group-merge"
                  invalid={currentPasswordError}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <FormFeedback>Please insert current password!</FormFeedback>
              </Col>
            </Row>
            <Row>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  label="New Password"
                  htmlFor="newPassword"
                  className="input-group-merge"
                  invalid={newPasswordError}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <FormFeedback>Please insert valid password</FormFeedback>
              </Col>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  label="New Password Confirmation"
                  htmlFor="retypeNewPassword"
                  className="input-group-merge"
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  invalid={newPasswordConfirmationError}
                />

                <FormFeedback>Password not mached!</FormFeedback>
              </Col>
              <Col xs={12}>
                <p className="fw-bolder">Password requirements:</p>
                <ul className="ps-1 ms-25">
                  <li className="mb-50">
                    Minimum 6 characters long - the more, the better
                  </li>
                </ul>
              </Col>
              <Col className="mt-1" sm="12">
                <Button
                  onClick={(e) => onSubmit(e)}
                  className="me-1"
                  color="primary"
                >
                  Save changes
                  {formSubmissionLoader && (
                    <Spinner
                      style={{ marginLeft: "5px" }}
                      size={"sm"}
                      color="white"
                    />
                  )}
                </Button>
                <Button color="secondary" outline>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {/* <TwoFactorAuth /> */}
      {/* <CreateApiKey /> */}
      {/* <ApiKeysList /> */}
      {/* <RecentDevices /> */}
    </Fragment>
  );
};

export default SecurityTabContent;
