// ** React Imports
import { useState } from "react"

// ** Third Party Components
import classnames from "classnames"
import { Meh, Star, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import Rating from 'react-rating'

// ** Reactstrap Imports
import { Button, Label, Form, Input, FormFeedback, Spinner } from "reactstrap";

// ** Store & Actions
import { createFeedback } from "@store/feedbacks";
import { useDispatch, useSelector } from "react-redux";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss"

const Customizer = () => {
  const authState = useSelector((state) => state.auth);

  const [rating, setRating]   = useState("");
  const [message, setMessage] = useState("");

  const [ratingError, setRatingError]                   = useState(false);
  const [messageError, setMessageError]                 = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [openCustomizer, setOpenCustomizer] = useState(false)

  // ** Toggles Customizer
  const handleToggle = (e) => {
    if (e) {
      e.preventDefault()
    }

    setOpenCustomizer(!openCustomizer)
  }

  // ** Function to handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (!rating) {
      valid = false;
      setRatingError(true);
    } else {
      setRatingError(false);
    }

    if (!message) {
      valid = false;
      setMessageError(true);
    } else {
      setMessageError(false);
    }

    if (valid) {
      setFormSubmissionLoader(true);

      dispatch(createFeedback({ user_id: authState.user.id, rating, message })).then((result) => {
        setFormSubmissionLoader(false);
        if (result.payload.data) {
          setRating("");
          setMessage("");

          handleToggle();
        }
      });
    }
  };

  return (
    <div
      className={classnames("customizer d-none d-md-block", {
        open: openCustomizer
      })}
    >
      <a
        href="/"
        className="customizer-toggle d-flex align-items-center justify-content-center"
        onClick={handleToggle}
      >
        <Meh size={20}  />
      </a>
      <PerfectScrollbar
        className="customizer-content"
        options={{ wheelPropagation: false }}
      >
        <div className="customizer-header px-2 pt-1 pb-0 position-relative">
          <h4 className="mb-0">What's on your mind?</h4>
          {/* <p className="m-0">Thanks for taking the time to provide us with your feedback.</p> */}
          <a href="/" className="customizer-close" onClick={handleToggle}>
            <X />
          </a>
        </div>

        <hr />

        <Form className="m-2">
          <div className="mb-1">
            <Label className="form-label" for="rating">
              Rating <span className="text-danger">*</span>
            </Label>

            <br />

            <Rating
              onChange={rate => setRating(rate)}
              emptySymbol={<Star size={32} fill='#babfc7' stroke='#babfc7' />}
              fullSymbol={<Star size={32} fill='#433cd8' stroke='#433cd8' />}
              initialRating={rating}
            />
            <br />
            { ratingError ? <p className="text-danger">Please select rating</p> : null }
          </div>

          <div className="mb-1">
            <Label className="form-label" for="message">
              Message <span className="text-danger">*</span>
            </Label>

             <Input type="textarea" name="message" id="floating-textarea" placeholder="Just Amazing" 
             style={{ minHeight: '100px' }} invalid={messageError} value={message} 
             onChange={(e) => setMessage(e.target.value)} />
            <FormFeedback>Please enter a valid message</FormFeedback>
          </div>

          <Button onClick={(e) => onSubmit(e)} className="me-1" color="primary">
            Send Feedback {formSubmissionLoader && (
              <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />
            )}
          </Button>
          <Button type="reset" color="secondary" outline onClick={handleToggle}>
            Cancel
          </Button>
        </Form>

{/*         <div className="px-2"> */}
{/*           <div className="mb-2"> */}
{/*             <p className="fw-bold">Rating</p> */}
{/*             <div className="d-flex">{renderSkinsRadio()}</div> */}
{/*           </div> */}
{/*  */}
{/*           <div className="mb-2"> */}
{/*             <p className="fw-bold">Message</p> */}
{/*             <div className="d-flex"> */}
{/*               <div className="form-check me-1"> */}
{/*                 <Input */}
{/*                   type="radio" */}
{/*                   id="full-width" */}
{/*                   checked={contentWidth === "full"} */}
{/*                   onChange={() => setContentWidth("full")} */}
{/*                 /> */}
{/*                 <Label className="form-check-label" for="full-width"> */}
{/*                   Full Width */}
{/*                 </Label> */}
{/*               </div> */}
{/*               <div className="form-check"> */}
{/*                 <Input */}
{/*                   id="boxed" */}
{/*                   type="radio" */}
{/*                   checked={contentWidth === "boxed"} */}
{/*                   onChange={() => setContentWidth("boxed")} */}
{/*                 /> */}
{/*                 <Label className="form-check-label" for="boxed"> */}
{/*                   Boxed */}
{/*                 </Label> */}
{/*               </div> */}
{/*             </div> */}
{/*           </div> */}
{/*         </div> */}

      </PerfectScrollbar>
    </div>
  )
}

export default Customizer
