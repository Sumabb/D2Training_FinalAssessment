import React, {useEffect,useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import RestrictedRoute from "./Auth/RestrictedRoute";
import PrivateRoute from "./Auth/PrivateRoute";
import Home from "./Components/Home";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Details from "./Components/Details";


function App() {

  return (
      <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <RestrictedRoute exact path="/login" component={Login} />
        <Route exact path="/details" component={Details} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
