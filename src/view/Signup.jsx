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
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  email: {
    value: "",
    errors: [],
    required: true,
  },
  name: {
    value: "",
    errors: [],
    required: true,
  },
  username: {
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

function Signup(props) {
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

  const signUp = async () => {
    if (hasErrors()) {
      return 0;
    }
    setLoading(true);

    const user = {
      name: formFields.name.value,
      email: formFields.email.value,
      username: formFields.username.value,
      password: formFields.password.value,
    };
    try {
      const data = await axios.post(Urls.signup, user);
      if (data.status === 201) {
        setLoading(false);

        toast.success("Successfully Register. Please login");
        props.history.push("/");
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
          <Grid item md={12} className="margin-y-15" container justify="center">
            <Typography variant="h5" color="textSecondary">
              Register
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
              value={formFields.name.value}
              name="name"
              onChange={(e) => setValue(e.target.name, e.target.value)}
              label="Name"
              error={formFields.name.errors.length > 0}
              helperText={formFields.name.errors}
            ></TextField>
          </Grid>

          <Grid item md={12} className="margin-y-15">
            <TextField
              variant="outlined"
              autoComplete="off"
              fullWidth
              value={formFields.username.value}
              name="username"
              onChange={(e) => setValue(e.target.name, e.target.value)}
              label="Username"
              error={formFields.username.errors.length > 0}
              helperText={formFields.username.errors}
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
              onClick={signUp}
              disabled={loading}
              variant="outlined"
              size="large"
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign up"
              )}
            </Button>
          </Grid>

          <Grid item md={12} className="margin-y-15" container justify="center">
            <Typography variant="body1" color="textSecondary">
              Already have account ?
              <Button component={Link} color="primary" to="/">
                Login
              </Button>
            </Typography>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Signup;
