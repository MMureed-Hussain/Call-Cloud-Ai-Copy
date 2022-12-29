import {
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses,
} from "../../redux/leadStatuses";
import Statuses from "../statuses/Index"

const props = {
  moduleName: "leadStatuses",
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
