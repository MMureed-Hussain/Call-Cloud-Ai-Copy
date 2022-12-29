import {
  getStatuses,
  setStatuses,
  deleteStatus,
  updateStatusesOrder,
  cloneStatuses,
} from "../../redux/clientStatuses";
import Statuses from "../statuses/Index"

const props = {
  moduleName: "clientStatuses",
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
