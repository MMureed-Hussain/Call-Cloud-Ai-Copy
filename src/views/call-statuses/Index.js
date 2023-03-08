import {
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses,
  createStatus,
  updateStatus,
  setErrors,
} from "../../redux/callStatuses";
import Statuses from "../statuses/Index"

const props = {
  moduleName: "callStatuses",
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses,
  createStatus,
  updateStatus,
  setErrors
}

export default () => {
  return (
    <Statuses {
      ...props
    }/>
  );
};
