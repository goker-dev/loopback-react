import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import History from "../../history";

const FILE_URL = process.env.REACT_APP_FILE_URL;

class Users extends Component {

    constructor(props) {
        super(props)
        this.state = {
            me: props.me
        }
    }

    componentDidMount() {
        if (!this.state.me)
            return History.push('/signin');
        this.props.getUsers();
    }

    renderUsers() {
        return this.props.users.map(user => {
            return <div className="col-sm-4" key={user.id}>
                <div className="card mb-2">
                    <div className="card-body p-2">
                        <img className="img-thumbnail rounded-circle float-left mr-2"
                             onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "http://holder.ninja/100x100,P.svg"
                             }}
                             src={FILE_URL + (user.image && user.image.thumb)} alt={user.name}/>
                        <div className="">
                            <h3 className="h5 card-title">
                                <i className={user.icon}/> {user.username}</h3>
                            <p>
                                <small>{user.name} {user.surname}</small>
                            </p>
                            <Link to={user.username} className="btn btn-sm btn-primary">PROFILE</Link>
                            {(this.props.me.isAdmin || this.props.me.isEditor) &&
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
                <section>
                    <div className="container">
                        <h1 className="h4 text-primary lined lined-align-left lined-primary">Users</h1>
                        <div className="row">
                            {this.renderUsers()}
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, users: state.users.data}
}

export default connect(mapStateToProps, actions)(Users);
