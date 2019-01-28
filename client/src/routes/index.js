import React from 'react';
import {Route, Switch} from 'react-router-dom';
import App from '../components/App';
import SignUp from '../components/Auth/SignUp';
import SignIn from '../components/Auth/SignIn';
import SignOut from '../components/Auth/SignOut';
import Welcome from '../components/Welcome';
import Features from '../components/Features';
import Home from '../components/Home';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import Users from '../components/Users';
import User from '../components/User';
import UserEdit from '../components/User/Edit';
import NoMatch from '../components/NoMatch';
import TermsOfService from "../components/StaticPages/TermsOfService";
import PrivacyPolicy from "../components/StaticPages/PrivacyPolicy";

const Routes = () => {
  return (
    <App>
      <Switch>
        <Route exact path="/" component={Welcome}/>
        <Route exact path="/features" component={Features}/>
        <Route exact path="/tos" component={TermsOfService}/>
        <Route exact path="/privacy" component={PrivacyPolicy}/>
        <Route exact path="/signin" component={SignIn}/>
        <Route exact path="/signout" component={SignOut}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/home" component={Home}/>

        <Route exact path="/profile" component={Profile} username="me"/>
        <Route exact path="/settings/:page?" component={Settings}/>
        <Route exact path="/users/:page?/:id?" component={Users}/>
        <Route exact path="/users/:id" component={User}/>
        <Route exact path="/users/:id/edit" component={UserEdit}/>

        <Route exact path="/:username" component={Profile}/>
        <Route component={NoMatch}/>
      </Switch>
    </App>
  );
};

export default Routes;
