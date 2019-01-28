import React from 'react';
import {Link, Route} from 'react-router-dom';
import List from "./List";
import Add from "./Add";
import Edit from "./Edit";

const routes = [
    {
        path: '/users(/list)?',
        link: '/users/list',
        icon: 'fa fa-users',
        exact: true,
        title: () => 'User List',
        name: 'List',
        main: List
    },
    {
        path: '/users/add',
        link: '/users/add',
        icon: 'fa fa-plus',
        exact: true,
        title: () => 'Add New User',
        name: 'Add',
        main: Add
    },
    {
        path: '/users/edit/:id?',
        link: null,
        icon: 'fa fa-image',
        exact: true,
        title: () => 'Edit User',
        name: 'Edit',
        main: Edit
    },
];

class Users extends React.PureComponent {

    render() {
        return <section className="container">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block border-right sidebar">
                    <div className="sidebar-sticky">
                        <h5 className="sidebar-heading text-muted"><i className="fa fa-users"/> User Management</h5>
                        <ul className="nav flex-column small">
                            {routes.map((route, index) => (
                                route.link && <li key={index} className="nav-item">
                                    <Link className="nav-link active" to={route.link}>
                                        <i className={route.icon}/> {route.name}
                                    </Link>
                                </li>))}
                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    <h1 className="main-heading text-primary lined lined-align-left lined-primary">
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                component={route.title}
                            />
                        ))}
                    </h1>
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

export default Users;