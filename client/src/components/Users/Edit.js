import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import {
    fetchUser,
    getUser,
    toggleAdmin,
    toggleEditor,
    toggleManager,
    toggleStatus,
    toggleWorker,
    updateUser
} from '../../actions'
import {connect} from 'react-redux'
import ToggleButton from "../Common/ToggleButton";

const FormikForm = ({
                        values,
                        touched,
                        errors,
                        status,
                        isSubmitting
                    }) => (
    <Form>
        <fieldset className="form-group">
            <Field className="form-control" type="text" name="username" placeholder="Username"/>
            {touched.username && errors.username && <small className="form-text text-danger">{errors.username}</small>}
        </fieldset>
        <fieldset className="form-group">
            <Field className="form-control" type="text" name="email" placeholder="email@email.com"/>
            {touched.email && errors.email && <small className="form-text text-danger">{errors.email}</small>}
        </fieldset>
        <div className="row">
            <fieldset className="col-md-6 form-group">
                <label>Name</label>
                <Field className="form-control" type="text" name="name" placeholder="Name"/>
                {touched.name && errors.name && <small className="form-text text-danger">{errors.name}</small>}
            </fieldset>
            <fieldset className="col-md-6 form-group">
                <label>Surname</label>
                <Field className="form-control" type="text" name="surname" placeholder="Surname"/>
                {touched.surname && errors.surname && <small className="form-text text-danger">{errors.surname}</small>}
            </fieldset>
        </div>
        <fieldset className="form-group">
            <Field className="form-control" component="textarea" name="bio"
                   placeholder="Write something short about you"/>
            {touched.bio && errors.bio && <small className="form-text text-danger">{errors.bio}</small>}
        </fieldset>
        {status && status.error && <div className="alert alert-danger">
            <small>{status.error}</small>
        </div>}
        {status && status.success && <div className="alert alert-success">
            <small>{status.success}</small>
        </div>}
        <input type="hidden" name="id" value={values.id}/>
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
            Update the Account
        </button>
    </Form>);

class EnhancedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user || {},
            // user: {
            //     id: '',
            //     username: '',
            //     email: '',
            //     name: '',
            //     surname: '',
            //     bio: '',
            //     roles: []
            // },
            error: null
        }
    }

    getUserData(id) {
        if (!this.state.user || id !== this.state.user.id)
            getUser(id)
                .then(user => {
                    this.setState({user: user})
                })
                .catch(error => {
                    this.setState({'error': error})
                })
    }

    componentDidMount() {
        this.props.getUser(this.props.match.params.id);
        // if (!this.props.me || (!this.props.me.isAdmin && !this.props.me.isEditor))
        //     return History.goBack();
        // this.getUserData(this.props.match.params.id)
    }

    componentWillReceiveProps = (props) => {
        if (props.user && this.props.user !== props.user)
            this.setState({
                user: props.user,
                loading: false
            });
    };

    async handleSubmit(values, {props, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        try {
            await updateUser(values);
            setStatus({'success': 'Your account has been updated successfully!'});
            setSubmitting(false);
        } catch (errors) {
            setStatus({'error': errors})
            setSubmitting(false);
        }
    }

    toggleAdmin(id) {
        this.setState({
            error: null,
        });
        this.props.toggleAdmin(id)
    }

    toggleEditor(id) {
        this.setState({
            error: null,
        });
        this.props.toggleEditor(id)
    }

    toggleManager(id) {
        this.setState({
            error: null,
        });
        this.props.toggleManager(id)
    }

    toggleWorker(id) {
        this.setState({
            error: null,
        });
        this.props.toggleWorker(id)
    }

    toggleStatus(id) {
        this.setState({
            error: null,
        });
        this.props.toggleStatus(id)
    }


    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-6">
                    <Formik component={FormikForm}
                            enableReinitialize="true"
                            initialValues={{
                                id: this.state.user.id || '',
                                username: this.state.user.username || '',
                                email: this.state.user.email || '',
                                name: this.state.user.name || '',
                                surname: this.state.user.surname || '',
                                bio: this.state.user.bio || '',
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().required('Username is required'),
                                email: Yup.string().email('Please write a correct email address').required('Email is required'),
                                name: Yup.string().required('Name is required'),
                                surname: Yup.string().required('Surname is required'),
                                bio: Yup.string().max(200, 'Short bio must be under 200 characters or shorter')
                            })}
                            onSubmit={this.handleSubmit}/>
                    <hr/>
                    <div>
                        {this.state.error && <div className="alert alert-danger" role="alert">{this.state.error}</div>}
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th>Admin</th>
                                    <th>Editor</th>
                                    <th>Manager</th>
                                    <th>Worker</th>
                                    <th>Status</th>
                                </tr>
                                <tr>
                                    <td>
                                        <ToggleButton status={this.state.user.isAdmin}
                                                      toggleFunction={() => this.toggleAdmin(this.state.user.id)}/>
                                    </td>
                                    <td>
                                        <ToggleButton status={this.state.user.isEditor}
                                                      toggleFunction={() => this.toggleEditor(this.state.user.id)}/>
                                    </td>
                                    <td>
                                        <ToggleButton status={this.state.user.isManager}
                                                      toggleFunction={() => this.toggleManager(this.state.user.id)}/>
                                    </td>
                                    <td>
                                        <ToggleButton status={this.state.user.isWorker}
                                                      toggleFunction={() => this.toggleWorker(this.state.user.id)}/>
                                    </td>
                                    <td>
                                        <ToggleButton status={this.state.user.status}
                                                      toggleFunction={() => this.toggleStatus(this.state.user.id)}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>)
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, user: state.system.data}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (values) => {
            dispatch(fetchUser(values));
        },
        toggleAdmin: (values) => {
            dispatch(toggleAdmin(values));
        },
        toggleEditor: (values) => {
            dispatch(toggleEditor(values));
        },
        toggleManager: (values) => {
            dispatch(toggleManager(values));
        },
        toggleWorker: (values) => {
            dispatch(toggleWorker(values));
        },
        toggleStatus: (values) => {
            dispatch(toggleStatus(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
