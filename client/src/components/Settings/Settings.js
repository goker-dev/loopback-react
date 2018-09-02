import React, {PureComponent} from 'react';
import {Link, Route} from 'react-router-dom';
import Account from './Account'
import ChangePassword from './ChangePassword'

const routes = [
  {
    path: '/settings(/account)?',
    exact: true,
    title: () => <h1 className="h5">Account</h1>,
    main: Account
  },
  {
    path: "/settings/change-password",
    exact: true,
    title: () => <h1 className="h5">Change Password</h1>,
    main: ChangePassword
  },
];

class Settings extends PureComponent {
  render() {
    return <div>
      <div className="row">
        <nav className="d-none d-md-block border-right sidebar">
          <div className="sidebar-sticky">
            <h4><i className="fa fa-cogs"/> Settings</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link active" to="/settings/account">
                  <i className="fa fa-user"/> Account
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settings/change-password">
                  <i className="fa fa-key"/> Change Password
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div
            className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.title}
              />
            ))}
          </div>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </main>
      </div>
    </div>;
  }
}

export default Settings;
