import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import History from "../../history";

class Users extends Component {
  componentDidMount() {
    if (!this.props.me)
      return History.push('/signin');
    this.props.getUsers();
  }

  renderUsers() {
    return this.props.users.map(user => {

      user.isAdmin = user.roles.find(x => x.name === 'admin') ? true : false;
      user.isEditor = user.roles.find(x => x.name === 'editor') ? true : false;

      let userIcon = user.isAdmin ? 'fa fa-user-secret'
        : user.isEditor ? 'fa fa-user-tie' : 'fa fa-user';

      return <div className="col-sm-4" key={user.id}>
        <div className="card mb-2">
          <div className="card-body p-2">
            <img className="img-thumbnail rounded-circle float-left mr-2" src="http://holder.ninja/100x100.svg"
                 alt={user.name}/>
            <div className="">
              <h3 className="h5 card-title">
                <i className={userIcon}/> {user.username}</h3>
              <p>
                <small>{user.name} {user.surname}</small>
              </p>
              <Link to={user.username} className="btn btn-sm btn-primary">PROFILE</Link>
              {this.props.me.isEditor &&
              <Link to={'/users/' + user.id} className="btn btn-sm btn-success ml-1">ACCOUNT</Link>}
            </div>
          </div>
        </div>
      </div>;
    })
  }

  render() {
    if (!this.props.users) {
      return <div>Loading...</div>;
    }

    return (<React.Fragment>
        <h1 className="h5">Users</h1>
        <div className="row">
          {this.renderUsers()}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {me: state.auth.me, users: state.users.data}
}

export default connect(mapStateToProps, actions)(Users);
