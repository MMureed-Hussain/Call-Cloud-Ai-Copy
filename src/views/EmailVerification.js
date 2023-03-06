import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { emailverification } from "../redux/auth";
import { debounce } from "lodash";

export default function EmailVerification() {
  const dispatch = useDispatch();

  const verifyEmail = useCallback(
    debounce((params) => {
      dispatch(emailverification({ params: params }));
    }, 500),
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    verifyEmail(params.toString());
  }, [verifyEmail]);

  return null;
}
