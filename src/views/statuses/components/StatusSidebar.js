/* eslint-disable */
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Label, Form, Input, FormFeedback, Spinner, FormGroup, } from "reactstrap";
import toast from "react-hot-toast";
import Sidebar from "@components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { storeOrUpdateStatus } from "../../../redux/statuses";
import { statusOptions } from "@utils";
import ColorPicker from "./ColorPicker";

const StatusSidebar = forwardRef((props, ref) =>
{
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const errors = useSelector((state) => state.statuses.errors);
  const [status, setStatus] = useState(null);
  const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({});

  const handleChange = (e) =>
  {
    const key = e.target.name;
    let value = e.target.value;
    setData((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleSelectChange = (e, name) =>
  {
    let target = {
      name,
      type: "input",
      value: e.value,
    };

    handleChange({ target });
  };

  const handleSubmit = (event) =>
  {
    event.preventDefault();
    setLoader(true);
    dispatch(storeOrUpdateStatus(data)).then((res) =>
    {
      setLoader(false);
      // setOpen(false);
    });


  };

  const handleSelected = (op, sel) =>
  {
    return op.filter((option) => option.value === sel);
  };


  useImperativeHandle(ref, () => ({
    handleShow: (obj = null) =>
    {
      if (currentWorkspace) {
        let arg = obj
          ? {
            ...obj,
            is_created: 0,
          }
          : {
            name: "",
            type: "CALL",
            color: '',
            is_created: 1,
            active: true,
            is_default: false,
            workspace_id: currentWorkspace.id,
            created_by: user.id
          };

        setData(arg);
        setStatus(obj);
        setOpen(true);
      } else {
        toast.error("Please select a workspace first!");
      }
    },
  }));

  return (
    <Sidebar
      size="lg"
      open={open}
      title={`${status ? "Update" : "Create"} Status`}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => setOpen(!open)}
      onClosed={() => setOpen(false)}
    >
      <Form onSubmit={handleSubmit}>
        <div className="mb-1">
          <Label className="form-label">
            Title <span className="text-danger">*</span>
          </Label>
          <Input
            required
            type="text"
            name="name"
            value={data?.name ?? ""}
            className={`${errors.has('name') && "is-invalid"}`}
            onChange={(e) => handleChange(e)}
          />

          {errors.has("title") && (
            <FormFeedback>{errors.get("title")}</FormFeedback>
          )}
        </div>

        {/* <ColorPicker label="Color" value={data?.color ?? ''} handleChange={handleChange} /> */}

        <div>
          <Label className="form-label">
            Type <span className="text-danger">*</span>
          </Label>

          {(statusOptions && Boolean(data.is_created)) && statusOptions.map((op, ind) =>
            <FormGroup className="mb-2" check key={ind}>
              <Label check>{op.value.replace('_', ' ')} {' '}</Label>
              <Input name="type" value={op.value} type="radio" defaultChecked={data?.type == op.value} onChange={(e) => handleChange(e)} />
            </FormGroup>
          )}

        </div>

        <Button className="me-1" color="primary" type="submit">
          {loader && <Spinner style={{ marginRight: "5px" }} size={"sm"} color="white" />}
          Submit
        </Button>

        <Button type="reset" color="secondary" outline onClick={() => setOpen(false)}> Cancel </Button>
      </Form>
    </Sidebar>
  );
});

export default StatusSidebar;
