import React from 'react';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {resetPassword} from '../../../actions'
import {connect} from 'react-redux'
import History from '../../../history'

let setSubmittingHigher;

const FormikForm = ({
                        values,
                        touched,
                        errors,
                        isSubmitting
                    }) => (
    <section className="cover  bg-light">
        <div className="container">
            <div className="row h-100 justify-content-md-center">
                <div className="col-sm-4 my-auto">
                    <Form className="card border-0 p-4 shadow">
                        <h1 className="h4 lined"><span>NEW PASSWORD</span></h1>
                        <fieldset className="form-group">
                            <label className="small">Token</label>
                            <Field className="form-control" type="text" name="token" placeholder="token"/>
                            {touched.token && errors.token &&
                            <small className="form-text text-danger">{errors.token}</small>}
                        </fieldset>
                        <fieldset className="form-group">
                            <label className="small">Password</label>
                            <Field className="form-control" type="password" name="password" placeholder="password"/>
                            {touched.password && errors.password &&
                            <small className="form-text text-danger">{errors.password}</small>}
                        </fieldset>
                        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
                            Set my new password
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    </section>
);

const EnhancedForm = withFormik({
    mapPropsToValues({match}) {
        return {
            token: match.params.token,
            password: ''
        }
    },
    validationSchema: Yup.object().shape({
        token: Yup.string().required('Token is required'),
        password: Yup.string().required('Password is required').min(8, 'Password must be 8 characters or longer')
            .matches(/[a-z]/, 'Password must contain at least one lowercase char')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
            .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
    }),
    handleSubmit(values, {props, resetForm, setSubmitting}) {
        setSubmittingHigher = (success) => {
            setSubmitting();
            if (success) {
                resetForm();
                History.push('/login');
            }
        };
        props.resetPassword(values);
    }
})(FormikForm);

const mapStateToProps = (state) => {
    typeof setSubmittingHigher === 'function' && setSubmittingHigher(!!state.system.message);
    return {system: state.system}
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetPassword: (values) => {
            dispatch(resetPassword(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
