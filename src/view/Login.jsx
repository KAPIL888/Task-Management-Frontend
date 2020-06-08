import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Card,
  Button,
  CircularProgress,
} from "@material-ui/core";
import axios from "../shared/Axios";
import Urls from "../shared/Urls";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveToken } from "../shared/helpers";
import { Link } from "react-router-dom";

const initialState = {
  email: {
    value: "",
    errors: [],
    required: true,
  },
  password: {
    value: "",
    errors: [],
    required: true,
  },
};

function Login(props) {
  const [formFields, setFormFields] = useState(initialState);
  const [loading, setLoading] = useState(false);

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

  const login = async () => {
    if (hasErrors()) return;
    setLoading(true);
    const user = {
      email: formFields.email.value,
      password: formFields.password.value,
    };
    try {
      const data = await axios.post(Urls.login, user);
      if (data.status === 200) {
        saveToken(data.data.token);
        setLoading(false);
        props.history.push("/task/");
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <Grid container className="login-container">
      <Grid container direction="column" alignItems="center" justify="center">
        <Card className="card">
          <Grid
            item
            md={12}
            className="margin-y-15"
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Typography variant="h5" display="block">
              Login Form
            </Typography>
            <Typography variant="body1" display="block" color="textSecondary">
              Login to Manage your task
            </Typography>
          </Grid>
          <ToastContainer />

          <Grid item md={12} className="margin-y-15">
            <TextField
              variant="outlined"
              autoComplete="off"
              fullWidth
              value={formFields.email.value}
              name="email"
              onChange={(e) => setValue(e.target.name, e.target.value)}
              label="Email"
              error={formFields.email.errors.length > 0}
              helperText={formFields.email.errors}
            ></TextField>
          </Grid>

          <Grid item md={12} className="margin-y-15">
            <TextField
              variant="outlined"
              autoComplete="off"
              fullWidth
              value={formFields.password.value}
              name="password"
              type="password"
              onChange={(e) => setValue(e.target.name, e.target.value)}
              label="Password"
              error={formFields.password.errors.length > 0}
              helperText={formFields.password.errors}
            ></TextField>
          </Grid>

          <Grid item md={12} className="margin-y-15">
            <Button
              fullWidth
              size="large"
              disabled={loading}
              onClick={login}
              variant="outlined"
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Login"
              )}
            </Button>
          </Grid>

          <Grid item md={12} className="margin-y-15" container justify="center">
            <Typography variant="body1" color="textSecondary">
              Don't have an account
              <Button component={Link} color="primary" to="/signup">
                Signup
              </Button>
            </Typography>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Login;
