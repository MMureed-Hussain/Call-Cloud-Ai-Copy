import {
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses,
} from "../../redux/callStatuses";
import Statuses from "../statuses/Index"

const props = {
  moduleName: "callStatuses",
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses
}

export default () => {
  return (
    <Statuses {
      ...props
    }/>
  );
};
