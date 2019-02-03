import React from 'react';
import {Link} from 'react-router-dom';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {signUp} from '../../../actions'
import {connect} from 'react-redux'

const FormikForm = ({
                        values,
                        touched,
                        errors,
                        status,
                        isSubmitting
                    }) => (<section className="cover  bg-light">
        <div className="container">
            <div className="row h-100 justify-content-md-center">
                <div className="col-sm-4 my-auto">
                    <Form className="card border-0 p-4 shadow">
                        <h1 className="h4 lined"><span>SIGN UP</span></h1>
                        <fieldset className="form-group">
                            <label className="small">Username</label>
                            <Field className="form-control" type="text" name="username" placeholder="Username"/>
                            {touched.username && errors.username &&
                            <small className="form-text text-danger">{errors.username}</small>}
                        </fieldset>
                        <fieldset className="form-group">
                            <label className="small">Email</label>
                            <Field className="form-control" type="text" name="email" placeholder="email@email.com"/>
                            {touched.email && errors.email &&
                            <small className="form-text text-danger">{errors.email}</small>}
                        </fieldset>
                        <div className="row">
                            <fieldset className="col-md-6 form-group">
                                <label className="small">Name</label>
                                <Field className="form-control" type="text" name="name" placeholder="Name"/>
                                {touched.name && errors.name &&
                                <small className="form-text text-danger">{errors.name}</small>}
                            </fieldset>
                            <fieldset className="col-md-6 form-group">
                                <label className="small">Surname</label>
                                <Field className="form-control" type="text" name="surname" placeholder="Surname"/>
                                {touched.surname && errors.surname &&
                                <small className="form-text text-danger">{errors.surname}</small>}
                            </fieldset>
                        </div>
                        <fieldset className="form-group">
                            <label className="small">Password</label>
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
                        <p className="text-muted text-center small">By creating an account, you agree to our <Link
                            to="/tos">Terms of Service</Link>&nbsp;
                            and <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"></i>&nbsp;</span>}
                            Create my account
                        </button>
                        <p className="pt-4 text-center small">You can <Link to="/signin">sign in</Link> if you have an
                            account
                            already.</p>
                    </Form>
                </div>
            </div>
        </div>
    </section>
);

const EnhancedForm = withFormik({
    mapPropsToValues() {
        return {
            username: '',
            email: '',
            name: '',
            surname: '',
            password: '',
        }
    },
    validationSchema: Yup.object().shape({
        username: Yup.string().matches(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, 'Username only contain english characters and (_,-,.). Also usernames must start and end with a letter or number.')
            .required('Username is required'),
        email: Yup.string().email('Please write a correct email address').required('Email is required'),
        name: Yup.string().required('Name is required'),
        surname: Yup.string().required('Surname is required'),
        password: Yup.string().min(8, 'Password must be 8 characters or longer')
            .matches(/[a-z]/, 'Password must contain at least one lowercase char')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
            .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
    }),
    async handleSubmit(values, {props, resetForm, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        try {
            await props.signUp(values);
            //setStatus({'success': 'Your account has been created successfully!'})
            setSubmitting(false);
            //resetForm();
        } catch (errors) {
            //setStatus({'error': errors})
            //setSubmitting(false);
        }
    }
})(FormikForm);

const mapStateToProps = (state) => {
    return {me: state.auth.me}
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (values) => {
            dispatch(signUp(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
