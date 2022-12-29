/* eslint-disable */
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import CallFollowUpList from "./components/CallFollowUpList";


const Followups = () =>
{
  const store = useSelector((state) =>
  {
    return state.auth;
  });

  if (!store.user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <CallFollowUpList />
    </div>
  );
};

export default Followups;
