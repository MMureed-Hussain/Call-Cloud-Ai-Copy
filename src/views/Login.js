import { useState } from "react";
import { useSkin } from "@hooks/useSkin";
import { Link, Navigate } from "react-router-dom";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";

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
import "@styles/react/pages/page-authentication.scss";

import { useDispatch, useSelector } from "react-redux";

import { login, csrf } from "@store/auth";

// ** Config
import themeConfig from "@configs/themeConfig";

const Login = () => {
  const { skin } = useSkin();

  const dispatch = useDispatch();
  const store = useSelector((state) => {
    return state.auth;
  });

  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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
    }

    if (valid) {
      setFormSubmissionLoader(true);
      dispatch(csrf()).then(() => {
        const payload = { email, password };

        if (rememberMe) {
          payload.remember_me = true;
        }

        dispatch(login(payload)).then(() => setFormSubmissionLoader(false));
      });
    }

    e.preventDefault();
  };

  const [, setGoogleLoginUrl] = useState(null);

  const handleGoogleLogin = () => {
    fetch("http://localhost:8000/api/auth/google", {
      headers: new Headers({ accept: "application/json" }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        
      })
      .then((data) => { 
        setGoogleLoginUrl(data.url); window.location.href = data.url;
      })
      .catch((error) => console.error(error));
  };

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`);

  if (store.user && store.user.emailVerified && !store.user.profileCompleted) {
    return <Navigate to="/complete-profile" />;
  } else if (store.user && store.user.emailVerified && store.user.profileCompleted) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="auth-wrapper auth-cover">
      {/* {!store.user && toast.success("test")} */}
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
              Welcome to CallCloud! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText>
            <Form className="auth-login-form mt-2">
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
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="login-password"
                  // ref={passwordInputRef}
                  invalid={passwordEmpty}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FormFeedback>Please insert password!</FormFeedback>
              </div>
              <div className="form-check mb-1">
                <Input
                  type="checkbox"
                  id="remember-me"
                  onChange={(e) => {
                    console.log("reme", e);
                    setRememberMe(e.target.checked);
                  }}
                />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
              <Button
                tag={Link}
                to="/"
                onClick={(e) => handleSubmit(e)}
                color="primary"
                block
              >
                Sign in!
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
              <span className="me-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p>
            {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
             
              <Button color="google" onClick={handleGoogleLogin}>
                <a target="_blank" href={googleLoginUrl} >
                <Mail size={14} />  
                </a>
              </Button>

              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
