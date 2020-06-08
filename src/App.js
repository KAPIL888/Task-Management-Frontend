import React from "react";
import "./App.css";
import Login from "./view/Login";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Signup from "./view/Signup";
import CreateTask from "./view/CreateTask";
import { getToken } from "./shared/helpers";

function App() {
  return (
    <Router>
      <Route
        path="/"
        exact
        render={(props) => {
          if (getToken()) {
            return <Redirect to="/task/"></Redirect>;
          } else {
            return <Login {...props} />;
          }
        }}
      />

      <Route
        path="/signup"
        render={(props) => {
          if (getToken()) {
            return <Redirect to="/task/"></Redirect>;
          } else {
            return <Signup {...props} />;
          }
        }}
      />

      <Route
        path="/task"
        render={(props) => {
          if (getToken()) {
            return <CreateTask {...props} />;
          } else {
            return <Redirect to="/"></Redirect>;
          }
        }}
      />
    </Router>
  );
}

export default App;
