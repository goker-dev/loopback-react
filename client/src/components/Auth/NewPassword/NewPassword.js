import React from 'react';
import {Link} from 'react-router-dom';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {resetPassword} from '../../../actions'
import {connect} from 'react-redux'

const FormikForm = ({
                        values,
                        touched,
                        errors,
                        status,
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
                        {status && status.error && <div className="alert alert-danger">
                            <small>{status.error}</small>
                        </div>}
                        {status && status.success && <div className="alert alert-success">
                            <small>{status.success}</small>
                        </div>}
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
        //email: Yup.string().email('Please write a correct email address').required('Email is required'),
    }),
    async handleSubmit(values, {props, resetForm, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        try {
            await props.resetPassword(values);
            setSubmitting(false);
            setStatus({'success': 'Done.'});
        } catch (errors) {
            setStatus({'error': errors});
            setSubmitting(false);
        }
    }
})(FormikForm);

const mapDispatchToProps = (dispatch) => {
    return {
        resetPassword: async (values) => {
            await dispatch(resetPassword(values));
        },
    }
};


export default connect(null, mapDispatchToProps)(EnhancedForm);
