/* eslint-disable */
import { useParams } from "react-router-dom";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import
{
  Button,
  Label,
  Form,
  Input,
  FormFeedback,
  Spinner,
  FormGroup,
} from "reactstrap";
import Select from "react-select";
import toast from "react-hot-toast";
import Sidebar from "@components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { storeOrUpdate } from "../../../redux/campaigns";
import moment from "moment/moment";

const CampaignSidebar = forwardRef((props, ref) =>
{
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const errors = useSelector((state) => state.campaigns.errors);
  const [campaign, setCampaign] = useState(null);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({});
  const handleChange = (e) =>
  {

    const key = e.target.name;
    let value = e.target.value;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else if (e.target.type === "input") {
      value = e.target.value
    } else value = e.target.value.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase()
    );

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
    if (!data.team_id) {
      toast.error("Please select a team.");
      return;
    }
    setLoader(true);
    console.log(data, "eata");
    dispatch(storeOrUpdate(data)).then((res) =>
    {
      console.log(res, "res");
      setLoader(false);
    });
    setOpen(false);
  };

  const handleSelected = (op, sel) =>
  {
    return op.filter((option) => option.value === sel);
  };

  //current dates
  const disableDates = () =>
  {
    const today = new Date();
    const dd = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    const mm =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1;
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  useImperativeHandle(ref, () => ({
    handleShow: (obj = null) =>
    {
      if (currentWorkspace) {
        let arg = obj
          ? {
            ...obj,
            is_created: 0,
            start_date: moment(obj.start_date).format("YYYY-MM-DD"),
          }
          : {
            title: "",
            start_date: "",
            description: "",
            is_created: 1,
            team_id: "",
            status: 1,
            workspace_id: currentWorkspace.id,
          };

        setCampaign(obj);
        setData(arg);
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
      title={`${campaign ? "Update" : "Create"} Campaign`}
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
            name="title"
            value={data.title ?? ""}
            className={`${errors.has("title") && "is-invalid"}`}
            onChange={(e) => handleChange(e)}
          />

          {errors.has("title") && (
            <FormFeedback>{errors.get("title")}</FormFeedback>
          )}
        </div>

        <div className="mb-1">
          <Label className="form-label" for="title">
            Description
          </Label>
          <Input
            style={{ textTransform: 'lowercase' }}
            name="description"
            type="textarea"
            placeholder="Enter description here"
            value={data.description}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="title">
            Start Date <span className="text-danger">*</span>
          </Label>
          <Input
            required
            name="start_date"
            type="date"
            min={disableDates()}
            value={data.start_date}
            onChange={(e) => handleChange(e)}
            className={`${errors.has("start_date") && "is-invalid"}`}
          />
          {errors.has("start_date") && (
            <FormFeedback>{errors.get("start_date")}</FormFeedback>
          )}
        </div>

        <div className="mb-1">
          <Label className="form-label">
            Select a team <span className="text-danger">*</span>
          </Label>
          <Select
            classNamePrefix="select"
            className={`react-select ${errors.has("team_id") && "is-invalid"}`}
            placeholder="Select a team"
            onChange={(e) => handleSelectChange(e, "team_id")}
            options={props.teams}
            value={handleSelected(props.teams, data.team_id)}
            required
          />

          {errors.has("team_id") && (
            <FormFeedback>{errors.get("team_id")}</FormFeedback>
          )}
        </div>

        <div className="mb-1">
          <Label className="form-label">
            Status <span className="text-danger">*</span>
          </Label>
          <FormGroup switch>
            <Input
              type="switch"
              id="switch-success"
              name="status"
              checked={data.status}
              onChange={(e) => handleChange(e)}
            />
          </FormGroup>
        </div>
        <Button className="me-1" color="primary" type="submit">
          {loader && (
            <Spinner style={{ marginRight: "5px" }} size={"sm"} color="white" />
          )}
          Submit
        </Button>

        <Button
          type="reset"
          color="secondary"
          outline
          onClick={() => setOpen(false)}
        >
          {" "}
          Cancel{" "}
        </Button>
      </Form>
    </Sidebar>
  );
});

export default CampaignSidebar;
