import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getProfile} from "../../actions";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            user: null
        }
    }

    getProfile(props) {
        let username = props.match.params.username || this.props.me.username;
        if (username !== this.state.username)
            this.props.getProfile(username);
    }

    componentDidUpdate(props) {
        if (this.props.match.params.username !== props.match.params.username) {
            this.setState({
                isLoading: true
            });
            this.getProfile(props);
        }
        if (this.state.user !== props.user) {
            this.setState({
                isLoading: false,
                user: props.user
            })
        }
    }

    componentDidMount() {
        this.getProfile(this.props)
    }

    render() {
        const user = this.state.user;
        if (this.state.isLoading) return <section className="container">
            <div className="profile">Loading...</div>
        </section>;
        if (!user.name) return <section className="container">
            <div className="profile"><h3>User not found!</h3>
                <p>{JSON.stringify(process.env)}</p></div>
        </section>;
        const fullName = user.name + ' ' + user.surname;
        return <section className="container">
            <div className="profile">
                <div className="fb-profile">
                    <img align="left" className="fb-image-lg img-fluid"
                         src={user.cover.normal}
                         alt="{fullName}"/>
                    <img align="left" className="fb-image-profile img-thumbnail"
                         src={user.image.normal}
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
    return {me: state.auth.me, user: state.system.data}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: (values) => {
            dispatch(getProfile(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
