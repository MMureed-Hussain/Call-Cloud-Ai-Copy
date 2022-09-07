// ** React Imports
import { Link, useParams, useLocation } from "react-router-dom";
import React, { useState } from "react";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

import { useDispatch } from "react-redux";
import { resetPasswordRequest } from "@store/auth";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const ResetPassword = () => {
  // ** Hooks
  const { skin } = useSkin();

  const query = useQuery();
  const params = useParams();

  const dispatch = useDispatch();
  //   const store = useSelector((state) => {
  //     return state.auth;
  //   });

  const [email, setEmail] = useState(query.get("email"));
  const [emailInvalid, setEmailInvalid] = useState(false);

  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const handleSubmit = (e) => {
    let valid = true;

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailInvalid(true);
      valid = false;
    } else {
      setEmailInvalid(false);
    }

    if (!password) {
      setPasswordEmpty(true);
      valid = false;
    } else {
      setPasswordEmpty(false);
      if (password !== passwordConfirmation) {
        setPasswordNotMatch(true);
        valid = false;
      } else {
        setPasswordNotMatch(false);
      }
    }

    if (valid) {
      setFormSubmissionLoader(true);
      dispatch(
        resetPasswordRequest({
          email,
          password,
          password_confirmation: passwordConfirmation,
          token: params.resetToken,
        })
      ).then(() => setFormSubmissionLoader(false));
    }

    e.preventDefault();
  };
  // prettier-ignore
  const illustration = skin === "dark" ? "forgot-password-v2-dark.svg" : "forgot-password-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  //   if (store.user) {
  //     return <Navigate to="/home" />;
  //   }
  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img height={28} src={themeConfig.app.appLogoImage} alt="logo" />
          <h2 className="brand-text text-primary ms-1">CallCloud</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Reset Password
            </CardTitle>
            <CardText className="mb-2">
              Enter new password with confirmation to reset password
              successfully.
            </CardText>
            <Form
              className="auth-forgot-password-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  invalid={emailInvalid}
                  type="email"
                  id="login-email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />

                <FormFeedback>Invalid email address!</FormFeedback>
              </div>

              <div className="mb-1">
                <Label className="form-label" for="register-password">
                  Password
                </Label>
                <InputPasswordToggle
                  invalid={passwordEmpty}
                  className="input-group-merge"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormFeedback>Please insert password!</FormFeedback>
              </div>
              <div className="mb-1">
                <Label className="form-label" for="register-password">
                  Password Confirmation
                </Label>
                <InputPasswordToggle
                  invalid={passwordNotMatch}
                  className="input-group-merge"
                  id="register-password-confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />

                <FormFeedback>Password not mached!</FormFeedback>
              </div>

              <Button onClick={(e) => handleSubmit(e)} color="primary" block>
                Reset password
                {formSubmissionLoader && (
                  <Spinner
                    style={{ marginLeft: "5px" }}
                    size={"sm"}
                    color="white"
                  />
                )}
              </Button>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
