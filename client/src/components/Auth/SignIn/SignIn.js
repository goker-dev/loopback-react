import React from 'react';
import {Link} from 'react-router-dom';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {signIn} from '../../../actions'
import {connect} from 'react-redux'

import "./SignIn.css";

const FormikForm = ({
                        values,
                        touched,
                        errors,
                        status,
                        isSubmitting
                    }) => (
    <section className="container">
        <div className="row justify-content-md-center">
            <Form className="col-sm-4">
                <h1 className="section-heading lined"><span>SIGN IN</span></h1>
                <fieldset className="form-group">
                    <label>Username or Email</label>
                    <Field className="form-control" type="text" name="username" placeholder="Username"/>
                    {touched.email && errors.email && <small className="form-text text-danger">{errors.email}</small>}
                </fieldset>
                <fieldset className="form-group">
                    <label>Password</label>
                    <Field className="form-control" type="password" name="password" placeholder="Password"/>
                    {touched.password && errors.password &&
                    <small className="form-text text-danger">{errors.password}</small>}
                </fieldset>
                {status && status.error && <div className="alert alert-danger">
                    <small>{status.error}</small>
                </div>}
                {status && status.success && <div className="alert alert-success">
                    <small>{status.success}</small>
                </div>}
                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                    {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"></i>&nbsp;</span>}
                    Login
                </button>
                <p className="pt-2 text-center">You can <Link to="/signup">sign up</Link> easly
                    if you don't have an account yet. Or you have an issue about sign in you can
                    reset your password <Link to="/reset">here</Link></p>
            </Form>
        </div>
    </section>
);

const EnhancedForm = withFormik({
    mapPropsToValues({username}) {
        return {
            username: username || '',
            password: ''
        }
    },
    validationSchema: Yup.object().shape({
        username: Yup.string().required('Email/username is required'),
        // password: Yup.string().min(8, 'Password must be 8 characters or longer')
        //   .matches(/[a-z]/, 'Password must contain at least one lowercase char')
        //   .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
        //   .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
    }),
    async handleSubmit(values, {props, resetForm, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        if (values.username.match(/^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z0-9.]{2,}$/))
            values = {email: values.username, password: values.password};
        try {
            await props.signIn(values);
            setSubmitting(false);
            setStatus({'success': 'You logged in successfully!'});
        } catch (errors) {
            setStatus({'error': errors})
            setSubmitting(false);
        }
    }
})(FormikForm)

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: async (values) => {
            await dispatch(signIn(values));
        },
    }
}

export default connect(null, mapDispatchToProps)(EnhancedForm);
