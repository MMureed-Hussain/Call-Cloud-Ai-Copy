// ** React Import
import { useState, useEffect } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Input,
  FormFeedback,
  Spinner,
  FormGroup,
  ListGroupItem,
} from "reactstrap";
import Select from "react-select";
import { ReactSortable } from "react-sortablejs";
import { AlignJustify } from "react-feather";

// ** Store & Actions
import {
  updateQueueInWorkspace,
  saveQueue,
  getLeadlist,
  getUsers,
} from "@store/workspaces";
import { useDispatch } from "react-redux";

const QueueSidebar = ({
  open,
  toggleSidebar,
  refreshTable,
  queue,
  workspaceId,
}) => {
  const [queueName, setQueueName] = useState(queue ? queue.queue_name : "");

  const [leadlist, setLeadlist] = useState([]);

  const [queueUsers, setQueueUsers] = useState([]);

  const [selectedLeadLists, setSelectedLeadLists] = useState(() => {
    return queue ? queue.leadlist_records.map((item) => ({
      value: item.id,
      label: item.leadlist_name,
      order_by: item.order_by,
    })) : [];
  });
  const [selectedQueueUsers, setSelectedQueueUsers] = useState(() => {
    return queue ? queue.users.map((item) => ({
          value: item.enc_id,
          label: ((item) => {
            let final = 'dummy user name';
            if (item.name) {
              final = item.name;
            } else if (item.first_name && item.last_name) {
              final = `${item.first_name} ${item.last_name}`;
            }
            return final;
          })(item),
        })) : [];
  });
  const [queueError, setQueueError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const dispatch = useDispatch();
  const selectStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#433cd8'
    })
  };

  useEffect(() => {
    if (workspaceId && leadlist.length === 0) {
      dispatch(
        getLeadlist({
          id: workspaceId,
        })
      ).then((res) => {
        setLeadlist(res.payload.data.leadlist);
      });
    }
  }, [leadlist, workspaceId]);

  useEffect(() => {
    if (workspaceId && queueUsers.length === 0) {
      dispatch(
        getUsers({
          id: workspaceId,
          perPage: 50,
          page: 1
        })
      ).then((res) => setQueueUsers(res.payload.data.users));
    }
  }, [queueUsers, workspaceId]);

  // ** Function to handle form submit
  const onSubmit = (e) => {
    e.preventDefault();
      setFormSubmissionLoader(true);

      if (queue) {
        dispatch(
          updateQueueInWorkspace({
            queue_name: queueName,
            leadlist: selectedLeadLists.map(item => ({
              leadlist_id: item.value,
              order_by: item.order_by
            })),
            queueUser: selectedQueueUsers.map(user => user.value),
            queue_id: queue.id,
            workspace_id: queue.workspace_id,
          })
        ).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.queue) {
            setQueueName("");
            setLeadlist([]);
            setQueueUsers([]);
            refreshTable();
            toggleSidebar();
          }
        });
      } else {
        dispatch(
          saveQueue({
            id: workspaceId,
            queue_name: queueName,
            leadlists: selectedLeadLists.map((item) => ({
              leadlist_id: item.value,
              order_by: item.order_by,
            })),
            users: selectedQueueUsers.map((item) => item.value),
          })
        ).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.data) {
            setQueueName("");
            setLeadlist([]);
            setQueueUsers([]);
            refreshTable();
            toggleSidebar();
          }
        });
      }
  };

  const handleSidebarClosed = () => {
    setQueueName("");
    setLeadlist([]);
    setQueueUsers([]);
    setQueueError(false);
  };

  const SortableSelectedLeadLists = (
    <ReactSortable
      tag="ul"
      animation={300}
      className="list-group"
      list={selectedLeadLists}
      setList={(data) => {
        const ordered_data = data.map((item, index) => ({
          ...item,
          order_by: index + 1,
        }));
        setSelectedLeadLists(ordered_data);
      }}
      delayOnTouchStart={true}
      delay={2}
    >
      {selectedLeadLists.map((item, index) => (
        <ListGroupItem className="draggable" key={index}>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <AlignJustify size={20} style={{ cursor: "grab" }}/>
              <h5 className="m-0 ms-1">{item.label}</h5>
            </div>
          </div>
        </ListGroupItem>
      ))}
    </ReactSortable>
  );

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Queue"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form>
        <div className="mb-1">
          <Label className="form-label" for="quene-name">
            Queue Name <span className="text-danger">*</span>
          </Label>

          <Input
            id="text"
            placeholder="Enter Queue Name"
            invalid={queueError}
            value={queueName}
            disabled={queue}
            onChange={(e) => setQueueName(e.target.value)}
          />

          <FormFeedback>Please enter a valid Queue</FormFeedback>
        </div>

        <div className="mb-1">
          <FormGroup>
            <Label className="form-label" for="lead-list">
              Select Lead List<span className="text-danger">*</span>
            </Label>
            <Select
              value={selectedLeadLists}
              isMulti
              classNamePrefix="select"
              placeholder="Select Lead List"
              options={leadlist.map((item) => ({
                value: item.id,
                label: item.leadlist_name,
              }))}
              onChange={(data) => {
                setSelectedLeadLists(data.map((item, index) => ({
                  value: item.value,
                  label: item.label,
                  order_by: index + 1,
                })));
              }}
              styles={selectStyles}
            />
          </FormGroup>
        </div>

        {(() => {
          if (selectedLeadLists.length > 0) {
            return (
              <div className="mb-1">
                <FormGroup>
                  <Label className="form-label" for="lead-list">
                    Selected Lead List
                  </Label>
                  {SortableSelectedLeadLists}
                </FormGroup>
              </div>
            );
          }
        })()}

        <div className="mb-1">
          <FormGroup>
            <Label className="form-label" for="select-user">
              Select user to assigned Queue
            </Label>

            <Select
              value={selectedQueueUsers}
              isMulti
              classNamePrefix="select"
              placeholder="Select User"
              options={queueUsers.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              onChange={(data) => {
                setSelectedQueueUsers(data);
              }}
              styles={selectStyles}
            />
          </FormGroup>
        </div>

        <Button onClick={(e) => onSubmit(e)} className="me-1" color="primary">
          Submit
          {formSubmissionLoader && (
            <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />
          )}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default QueueSidebar;