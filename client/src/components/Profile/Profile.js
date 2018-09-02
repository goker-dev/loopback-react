import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getProfile} from "../../actions";
import "./Profile.css";

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  getProfileData(props) {
    let username = props.match.params.username || this.props.me.username;
    if (username !== this.state.username)
      getProfile(username)
        .then(user => {
          this.setState({user})
        })
        .catch(error => {
          this.setState({'error': error})
        })
  }

  componentWillReceiveProps(newProps) {
    this.getProfileData(newProps)
  }

  componentDidMount() {
    this.getProfileData(this.props)
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
          <p>{user.bio && user.bio}</p>
        </div>
      </div>
    </div>

  }
}

const mapStateToProps = (state) => {
  return {authenticated: state.auth.authenticated, me: state.auth.me}
}

export default connect(mapStateToProps)(Profile);
