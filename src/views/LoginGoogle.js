import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { googlelogin } from "../redux/auth";

export default function LoginGoogle() {

  const dispatch = useDispatch();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch(googlelogin({params: params.toString()}))

  }, [])

  // return (
  //   <h3>Please verify your email.</h3>
  // )

}
