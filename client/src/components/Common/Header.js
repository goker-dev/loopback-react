import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Header extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderLogo() {
    if (this.props.authenticated) {
      return [
        <Link to="/home" className="navbar-brand" key="logo">LOGO</Link>
      ];
    } else {
      return [
        <Link to="/" className="navbar-brand" key="logo">LOGO</Link>];
    }
  }

  renderLinks() {
    if (this.props.authenticated) {
      return [
        <li className="nav-item" key="users">
          <Link className="nav-link" to="/users">Users</Link>
        </li>
      ];
    } else {
      return [];
    }
  }

  renderUserMenu() {
    if (this.props.authenticated && this.props.me) {
      let userClass = this.props.me.isAdmin ? 'fa fa-user-secret'
        : this.props.me.isEditor ? 'fa fa-user-tie' : 'fa fa-user';
      return [
        <li className="nav-item dropdown" key="userMenu">
          <a className="nav-link dropdown-toggle" data-toggle="dropdown">
            <i className={userClass}></i> <strong>{this.props.me.name}</strong>
          </a>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/profile">Profile</Link>
            <Link className="dropdown-item" to="/settings">Settings</Link>
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/signout">Log out</Link>
          </div>
        </li>
      ];
    } else {
      return [
        <li className="nav-item" key="signin">
          <Link className="nav-link" to="/signin">Sign In</Link>
        </li>,
        <li className="nav-item" key="signup">
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </li>
      ];
    }
  }

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-faded">

        <div className="container">
          {this.renderLogo()}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain"
                  aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item" key="about">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              {this.renderLinks()}
            </ul>

            <ul className="nav navbar-nav navbar-right">
              {this.renderUserMenu()}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {authenticated: state.auth.authenticated, me: state.auth.me}
}

export default connect(mapStateToProps)(Header);
