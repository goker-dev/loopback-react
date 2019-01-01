import React, {PureComponent} from 'react';
import {Link, Route} from 'react-router-dom';
import Account from './Account'
import ChangePassword from './ChangePassword'
import Images from './Images'

import './Settings.css';

const routes = [
    {
        path: '/settings(/account)?',
        link: '/settings/account',
        icon: 'fa fa-user',
        exact: true,
        title: () => <h1 className="h5">Account</h1>,
        name: 'Account',
        main: Account
    },
    {
        path: '/settings/change-password',
        link: '/settings/change-password',
        icon: 'fa fa-key',
        exact: true,
        title: () => <h1 className="h5">Change Password</h1>,
        name: 'Change Password',
        main: ChangePassword
    },
    {
        path: '/settings/images',
        link: '/settings/images',
        icon: 'fa fa-image',
        exact: true,
        title: () => <h1 className="h5">Change Images</h1>,
        name: 'Change Images',
        main: Images
    },
];

class Settings extends PureComponent {

    render() {
        return <section className="container">
            <div className="row">
                <nav className="d-none d-md-block border-right sidebar">
                    <div className="sidebar-sticky">
                        <h4><i className="fa fa-cogs"/> Settings</h4>
                        <ul className="nav flex-column">
                            {routes.map((route, index) => (
                                <li key={index} className="nav-item">
                                    <Link className="nav-link active" to={route.link}>
                                        <i className={route.icon}/> {route.name}
                                    </Link>
                                </li>))}
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
        </section>;
    }
}

export default Settings;
