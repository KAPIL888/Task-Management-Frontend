import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Card,
  Button,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import axios from "../shared/Axios";
import Urls from "../shared/Urls";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MomentUtils from "@date-io/moment";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useEffect } from "react";
import moment from "moment";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

const initialState = {
  name: {
    value: "",
    errors: [],
    required: true,
  },
  project: {
    value: 0,
    errors: [],
    required: true,
  },
  start_date: {
    value: moment(),
    errors: [],
    required: true,
  },
  end_date: {
    value: moment(),
    errors: [],
    required: true,
  },
};

function CreateTask(props) {
  const [formFields, setFormFields] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [allTask, setAllTask] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [project, setProject] = React.useState([]);

  const setValue = (name, value) => {
    formFields[name] = {
      ...formFields[name],
      errors: [],
      value,
    };
    setFormFields({ ...formFields });
  };

  const hasErrors = () => {
    let hasError = false;

    for (const key in formFields) {
      if (formFields[key].required && !formFields[key].value) {
        formFields[key] = {
          ...formFields[key],
          errors: ["This field is required"],
        };
        setFormFields({ ...formFields });
        hasError = true;
      }
    }
    return hasError;
  };

  const addTask = async () => {
    if (hasErrors()) return;
    setLoading(true);
    const taskObj = {
      name: formFields.name.value,
      project: formFields.project.value,
      start_date: formFields.start_date.value,
      end_date: formFields.end_date.value,
    };
    try {
      const data = await axios.post(Urls.task, taskObj);
      if (data.status === 201) {
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400) {
        toast.error(error.response.data.error);
      }
    }
  };

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const getTask = async () => {
      try {
        const tasks = await axios.get(Urls.getTask);
        if (tasks.status === 200) {
          setAllTask(tasks.data);
        }
      } catch (error) {
        setAllTask([]);
        console.log(error);
      }
    };
    if (!loading) {
      getTask();
    }
  }, [loading]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const project = await axios.get(Urls.allProjects);
        if (project.status === 200) {
          setProject(project.data);
        }
      } catch (error) {
        setProject([]);
        console.log(error);
      }
    };

    getProjects();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  const startTimer = (duration, index) => {
    var timer = duration;

    setInterval(function () {
      // minutes + ":" + seconds; need to set
      let data = [...allTask];
      data[index]["duration"] = toHHMMSS(timer);
      setAllTask([...data]);

      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  };

  if (allTask !== null) {
    return (
      <Grid container className="task-container" alignItems="flex-start">
        <ToastContainer />

        <Grid container item justify="space-between" className="margin-y-15">
          <Grid item md={6}>
            <Typography variant="h5" className="white">
              Task
            </Typography>
          </Grid>
          <Grid item container spacing={2} md={6} justify="flex-end">
            <Grid item>
              <Button onClick={handleClickOpen} variant="contained">
                Add task
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={logOut} variant="contained">
                Logout
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12}>
          <Divider className="bg-white margin-y-15"></Divider>
        </Grid>

        <Grid item md={12} container spacing={2}>
          {allTask.map((task, index) => {
            return (
              <Grid item key={task._id} md={3} xs={12} sm={12}>
                <Card className="task-card">
                  <Typography variant="body1">Name: {task.name}</Typography>
                  <Typography
                    display="block"
                    color="textSecondary"
                    variant="body1"
                  >
                    Project: {task.project}
                  </Typography>
                  <Typography
                    display="block"
                    color="textSecondary"
                    variant="caption"
                  >
                    Start:
                    {moment(task.start_date).format("YYYY-MM-DD hh:mm a")}
                  </Typography>
                  <Typography
                    display="block"
                    color="textSecondary"
                    variant="caption"
                  >
                    End: {moment(task.end_date).format("YYYY-MM-DD hh:mm a")}
                  </Typography>

                  {task.hasOwnProperty("duration") ? (
                    <Typography
                      display="block"
                      color="textSecondary"
                      className="bold"
                      variant="caption"
                    >
                      Duration:
                      {task.duration}
                    </Typography>
                  ) : (
                    <Typography
                      display="block"
                      color="textSecondary"
                      className="bold"
                      variant="caption"
                    >
                      Duration: 00:00
                    </Typography>
                  )}

                  <Button
                    disabled={task.hasOwnProperty("duration")}
                    onClick={() =>
                      startTimer(
                        moment(task.end_date).diff(
                          moment(task.start_date),
                          "seconds"
                        ),
                        index
                      )
                    }
                  >
                    Start
                  </Button>
                </Card>
              </Grid>
            );
          })}

          {allTask.length === 0 && (
            <Grid item md={12}>
              <Card className="task-card">
                <Typography>No Task is Added</Typography>
              </Card>
            </Grid>
          )}
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <Grid
              container
              item
              md={12}
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item md={12} sm={12} xs={12} className="margin-y-15">
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  fullWidth
                  value={formFields.name.value}
                  name="name"
                  onChange={(e) => setValue(e.target.name, e.target.value)}
                  label="Task Name"
                  error={formFields.name.errors.length > 0}
                  helperText={formFields.name.errors}
                ></TextField>
              </Grid>

              <Grid item md={12} sm={12} xs={12} className="margin-y-15">
                <FormControl variant="filled" className="form-control">
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    fullWidth
                    variant="outlined"
                    name="project"
                    value={formFields.project.value}
                    error={formFields.project.errors.length > 0}
                    onChange={(e) => setValue(e.target.name, e.target.value)}
                  >
                    <MenuItem value={0}>
                      <em>select Project</em>
                    </MenuItem>
                    {project.map((project) => {
                      return (
                        <MenuItem key={project._id} value={project._id}>
                          {project.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={12} sm={12} xs={12} className="margin-y-15">
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Grid container>
                    <Typography>Start Date:</Typography>
                    <DateTimePicker
                      fullWidth
                      value={formFields.start_date.value}
                      onChange={(date) => setValue("start_date", date)}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item md={12} sm={12} xs={12} className="margin-y-15">
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Grid container>
                    <Typography>End Date:</Typography>
                    <DateTimePicker
                      fullWidth
                      value={formFields.end_date.value}
                      onChange={(date) => setValue("end_date", date)}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={addTask} color="primary">
              {loading ? <CircularProgress color="inherit" size={20} /> : "Add"}
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  } else {
    return (
      <Grid container className="height-100">
        <Grid container alignItems="center" justify="center">
          <CircularProgress size={40} />
        </Grid>
      </Grid>
    );
  }
}

export default CreateTask;
