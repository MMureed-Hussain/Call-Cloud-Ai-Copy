// ** React Imports
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

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

import { useDispatch, useSelector } from "react-redux";

import { register } from "@store/auth";

const Register = () => {
  // ** Hooks
  const { skin } = useSkin();

  const dispatch = useDispatch();
  const store = useSelector((state) => {
    return state.auth;
  });

  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  // const [name, setName] = useState("");
  // const [nameEmpty, setNameEmpty] = useState(false);
  const [termAccepted, setTermAccepted] = useState(false);
  const [termAcceptedError, setTermAcceptedError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const handleSubmit = (e) => {
    let valid = true;

    // if (!name) {
    //   valid = false;
    //   setNameEmpty(true);
    // }
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

    if (!termAccepted) {
      setTermAcceptedError(true);
      valid = false;
    } else {
      setTermAcceptedError(false);
    }
    // valid = false;
    if (valid) {
      setFormSubmissionLoader(true);
      dispatch(
        register({
          email,
          password,
          // name,
          password_confirmation: passwordConfirmation,
        })
      ).then(() => setFormSubmissionLoader(false));
    }

    e.preventDefault();
  };

  const illustration =
      skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  if (store.user) {
    return <Navigate to="/home" />;
  }
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
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Adventure starts here 🚀
            </CardTitle>
            <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText>
            <Form
              className="auth-register-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* <div className="mb-1">
                <Label className="form-label" for="register-username">
                  Name
                </Label>
                <Input
                  invalid={nameEmpty}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  id="register-username"
                  placeholder="johndoe"
                  autoFocus
                />

                <FormFeedback>Please insert name!</FormFeedback>
              </div> */}
              <div className="mb-1">
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Input
                  invalid={emailInvalid}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="register-email"
                  placeholder="john@example.com"
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
              <div className="form-check mb-1">
                <Input
                  invalid={termAcceptedError}
                  type="checkbox"
                  onChange={(e) => {
                    console.log(e);
                    setTermAccepted(e.target.checked);
                  }}
                  id="terms"
                />
                <Label className="form-check-label" for="terms">
                  I agree to
                  <a
                    className="ms-25"
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    privacy policy & terms
                  </a>
                </Label>

                <FormFeedback>Please accept terms!</FormFeedback>
              </div>
              <Button onClick={(e) => handleSubmit(e)} color="primary" block>
                Sign up
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
              <span className="me-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
