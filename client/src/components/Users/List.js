import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUsers} from '../../actions';

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            me: props.me,
            users: null,
        }
    }

    componentWillReceiveProps(props) {
        if (this.state.users !== props.users) {
            this.setState({
                users: props.users
            })
        }
    }

    componentDidMount() {
        //if (!this.state.me)
        //    return History.push('/signin');
        this.props.getUsers();
    }

    renderUsers() {
        // if(typeof this.props.users.map === 'function')
        return this.state.users.map(user => {
            return <div className="col-sm-4" key={user.id}>
                <div className="card mb-2">
                    <div className="card-body p-2">
                        <img className="img-thumbnail rounded-circle float-left mr-2"
                             src={user.image.thumb} alt={user.name}
                             width="100"
                        />
                        <div className="">
                            <h3 className="h5 card-title">
                                <i className={user.icon}/>&nbsp;&nbsp;{user.username}</h3>
                            <p>
                                <small>{user.name} {user.surname}</small>
                            </p>
                            <div className="text-right">
                                <Link to={user.username} className="btn btn-sm btn-primary">PROFILE</Link>
                                {(this.props.me.isAdmin || this.props.me.isEditor) &&
                                <Link to={'/users/edit/' + user.id} className="btn btn-sm btn-success ml-1">EDIT</Link>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        })
    }

    render() {
        if (!this.state.users) {
            return <div>Loading...</div>;
        }

        return (<React.Fragment>
                <div className="row">
                    {this.renderUsers()}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, users: state.system.data}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUsers: () => {
            dispatch(getUsers());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(List);