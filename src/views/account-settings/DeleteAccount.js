import { useState } from "react";

// ** Reactstrap Imports
import {
  Card,
  Button,
  CardHeader,
  CardTitle,
  CardBody,
  Alert,
  Form,
  Input,
  Label,
  FormFeedback,
} from "reactstrap";

// ** Third Party Components
import Swal from "sweetalert2";
import classnames from "classnames";
// import { useForm, Controller } from 'react-hook-form'
import withReactContent from "sweetalert2-react-content";

// ** Styles
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";

import { useDispatch } from "react-redux";
import { deleteAccount } from "@store/auth";

const MySwal = withReactContent(Swal);

const DeleteAccount = () => {
  // ** Hooks

  const dispatch = useDispatch();

  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [confirmCheckboxError, setConfirmCheckboxError] = useState(false);

  const handleConfirmDelete = () => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "Are you sure you would like to deactivate your account? You will be redirected to login page once deactivated!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        // redirect to login page
        console.log("redirect to login");
        dispatch(deleteAccount());
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          text: "Deactivation Cancelled!!",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };

  const onSubmit = (e) => {
    if (confirmCheckbox === true) {
      handleConfirmDelete();
      setConfirmCheckboxError(false);
    } else {
      setConfirmCheckboxError(true);
    }

    e.preventDefault();
  };

  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">Delete Account</CardTitle>
      </CardHeader>
      <CardBody className="py-2 my-25">
        <Alert color="warning">
          <h4 className="alert-heading">
            Are you sure you want to delete your account?
          </h4>
          <div className="alert-body fw-normal">
            Once you delete your account, there is no going back. Please be
            certain.
          </div>
        </Alert>
        <Form>
          <div className="form-check">
            <Input
              type="checkbox"
              id="confirmCheckbox"
              checked={confirmCheckbox}
              invalid={confirmCheckboxError}
              onChange={(e) => setConfirmCheckbox(e.target.checked)}
            />
            <Label
              for="confirmCheckbox"
              className={classnames("form-check-label", {
                "text-danger": confirmCheckboxError,
              })}
            >
              I confirm my account deactivation
            </Label>

            <FormFeedback>
              Please confirm that you want to delete account
            </FormFeedback>
          </div>
          <div className="mt-1">
            <Button onClick={(e) => onSubmit(e)} color="danger">
              Deactivate Account
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default DeleteAccount;
