import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUser} from "../../actions";
import "./User.css";
import History from "../../history";


class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  getUserData(props) {
    let id = props.match.params.id
    if (!this.state.user || id !== this.state.user.id)
      getUser(id)
        .then(user => {
          this.setState({user: user})
        })
        .catch(error => {
          this.setState({'error': error})
        })
    //this.setState({ folder: params.folder || 'sketches' }, (folder) => this.loadProjects(this.state.folder));
  }

  componentWillReceiveProps(newProps) {
    this.getUserData(newProps)
  }

  componentDidMount() {
    if (!this.props.me || (!this.props.me.isEditor && !this.props.me.isAdmin))
      return History.push('/users');
    this.getUserData(this.props)
  }

  render() {
    const user = this.state.user;
    if (!user) return <div className="profile">User not found!</div>;
    const fullName = user.name + ' ' + user.surname;
    return <div className="profile">
      <div className="fb-profile">
        <img align="left" className="fb-image-lg img-fluid" src="http://holder.ninja/1200x360.svg"
             alt="{fullName}"/>
        <img align="left" className="fb-image-profile img-thumbnail" src="http://holder.ninja/180x180,profile.svg"
             alt="{fullName}"/>
        <div className="fb-profile-text">
          <h1>{fullName}</h1>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.bio && user.bio}</p>
          {this.props.me.isAdmin &&
          <Link to={'/users/' + user.id + '/edit'} className="btn btn-sm btn-primary">Edit</Link>
          }
        </div>
      </div>
    </div>

  }
}

const mapStateToProps = (state) => {
  return {me: state.auth.me}
}

export default connect(mapStateToProps)(User);
