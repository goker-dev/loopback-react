import React from 'react';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {addUser} from '../../actions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

const FormikForm = ({
                        values,
                        touched,
                        errors,
                        status,
                        isSubmitting
                    }) => (
    <div className="row justify-content-md-center">
        <Form className="col-md-6">
            <fieldset className="form-group">
                <Field className="form-control" type="text" name="username" placeholder="Username"/>
                {touched.username && errors.username &&
                <small className="form-text text-danger">{errors.username}</small>}
            </fieldset>
            <fieldset className="form-group">
                <Field className="form-control" type="text" name="email" placeholder="email@email.com"/>
                {touched.email && errors.email && <small className="form-text text-danger">{errors.email}</small>}
            </fieldset>
            <fieldset className="form-group">
                <Field className="form-control" type="password" name="password" placeholder="password"/>
                {touched.password && errors.password &&
                <small className="form-text text-danger">{errors.password}</small>}
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
                    {touched.surname && errors.surname &&
                    <small className="form-text text-danger">{errors.surname}</small>}
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
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
                Create the Account
            </button>
        </Form>
    </div>
);

const EnhancedForm = withFormik({
    mapPropsToValues() {
        return {
            username: '',
            email: '',
            password: '',
            name: '',
            surname: '',
            bio: '',
        }
    },
    validationSchema: Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Please write a correct email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        name: Yup.string().required('Name is required'),
        surname: Yup.string().required('Surname is required'),
        bio: Yup.string().max(200, 'Short bio must be under 200 characters or shorter')
    }),
    async handleSubmit(values, {props, resetForm, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        try {
            await props.addUser(values);
            setStatus({'success': 'The account has been created successfully!'});
            setSubmitting(false);
            //resetForm();
        } catch (errors) {
            setStatus({'error': errors})
            setSubmitting(false);
        }
    }
})(FormikForm);

const mapStateToProps = (state) => {
    return {authenticated: state.auth.authenticated, me: state.auth.me}
};

const mapDispatchToProps = dispatch => (bindActionCreators({
    addUser
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
