import React from 'react';
import {Link} from 'react-router-dom';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {signIn} from '../../../actions'
import {connect} from 'react-redux'

let setSubmittingHigher;
const FormikForm = ({
                        values,
                        touched,
                        errors,
                        isSubmitting
                    }) => (
    <section className="cover bg-light">
        <div className="container">
            <div className="row h-100 justify-content-md-center">
                <div className="col-sm-4 my-auto">
                    <Form className="card border-0 p-4 shadow">
                        <h1 className="h4 lined"><span>SIGN IN</span></h1>
                        <fieldset className="form-group">
                            <label className="small">Username or Email</label>
                            <Field className="form-control" type="text" name="username" placeholder="Username"/>
                            {touched.email && errors.email &&
                            <small className="form-text text-danger">{errors.email}</small>}
                        </fieldset>
                        <fieldset className="form-group">
                            <label className="small">Password</label>
                            <Field className="form-control" type="password" name="password" placeholder="Password"/>
                            {touched.password && errors.password &&
                            <small className="form-text text-danger">{errors.password}</small>}
                        </fieldset>
                        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
                            Login
                        </button>
                        <p className="pt-4 text-center small">You can <Link to="/signup">sign up</Link> easly
                            if you don't have an account yet. Or you have an issue about sign in you can
                            reset your password <Link to="/reset">here</Link></p>
                    </Form>
                </div>
            </div>
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
    handleSubmit(values, {props, resetForm, setFieldError, setSubmitting}) {
        if (values.username.match(/^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z0-9.]{2,}$/))
            values = {email: values.username, password: values.password};
        setSubmittingHigher = setSubmitting;
        props.signIn(values);
    },
})(FormikForm);

const mapStateToProps = (state) => {
    typeof setSubmittingHigher === 'function' && setSubmittingHigher(false);
    return {system: state.system}
};

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (values) => {
            dispatch(signIn(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
