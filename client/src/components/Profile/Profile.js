import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getProfile} from "../../actions";
import "./Profile.css";

const FILE_URL = process.env.REACT_APP_FILE_URL;

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
        if (!user) return <section className="container"><div className="profile">User not found!
            <p>{JSON.stringify(process.env)}</p></div></section>;
        const fullName = user.name + ' ' + user.surname;
        return <section className="container">
            <div className="profile">
                <div className="fb-profile">
                    <img align="left" className="fb-image-lg img-fluid"
                         onError={(e)=>{e.target.onerror = null; e.target.src="http://holder.ninja/1200x360,cover-1200x360.svg"}}
                         src={FILE_URL + user.cover.normal}
                         alt="{fullName}"/>
                    <img align="left" className="fb-image-profile img-thumbnail"
                         onError={(e)=>{e.target.onerror = null; e.target.src="http://holder.ninja/180x180,profile.svg"}}
                         src={FILE_URL + user.image.normal}
                         alt="{fullName}"/>
                    <div className="fb-profile-text">
                        <h1>{fullName}</h1>
                        <p>{user.username}</p>
                        <p>{user.bio && user.bio}</p>
                    </div>
                </div>
            </div>
        </section>

    }
}

const mapStateToProps = (state) => {
    return {authenticated: state.auth.authenticated, me: state.auth.me}
}

export default connect(mapStateToProps)(Profile);
