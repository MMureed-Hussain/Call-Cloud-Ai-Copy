import {
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses,
  createStatus,
  updateStatus,
  setErrors
} from "../../redux/leadStatuses";
import Statuses from "../statuses/Index"

const props = {
  moduleName: "leadStatuses",
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
