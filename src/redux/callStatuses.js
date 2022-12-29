/* eslint-disable */
import getStatusesScaffolding from "./statusesScaffolding"

const {
  reducer,
  getStatuses,
  createStatus,
  updateStatus,
  deleteStatus,
  cloneStatuses,
  updateStatusesOrder,
  setErrors,
  setStatuses,
  setNewStatuses,
  setUpdatedStatus,
  deleteResource
} = getStatusesScaffolding("callStatuses", "call-statuses");

export {
  getStatuses,
  createStatus,
  updateStatus,
  deleteStatus,
  cloneStatuses,
  updateStatusesOrder,
  setErrors,
  setStatuses,
  setNewStatuses,
  setUpdatedStatus,
  deleteResource
}

export default reducer;
