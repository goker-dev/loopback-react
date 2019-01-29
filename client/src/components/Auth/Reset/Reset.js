import React from 'react';
import {Link} from 'react-router-dom';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {resetPasswordRequest} from '../../../actions'
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
                        <h1 className="h4 lined"><span>RESET</span></h1>
                        <fieldset className="form-group">
                            <label className="small">Email</label>
                            <Field className="form-control" type="text" name="email" placeholder="email"/>
                            {touched.email && errors.email &&
                            <small className="form-text text-danger">{errors.email}</small>}
                        </fieldset>
                        {status && status.error && <div className="alert alert-danger">
                            <small>{status.error}</small>
                        </div>}
                        {status && status.success && <div className="alert alert-success">
                            <small>{status.success}</small>
                        </div>}
                        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
                            Send a reset email
                        </button>
                        <p className="pt-4 text-center small"><Link to="/signin">return to login page</Link></p>
                    </Form>
                </div>
            </div>
        </div>
    </section>
);

const EnhancedForm = withFormik({
    mapPropsToValues() {
        return {
            email: ''
        }
    },
    validationSchema: Yup.object().shape({
        email: Yup.string().email('Please write a correct email address').required('Email is required'),
    }),
    async handleSubmit(values, {props, resetForm, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        try {
            await props.resetPasswordRequest(values.email);
            setSubmitting(false);
            setStatus({'success': 'We sent an email to you. Please check your email.'});
        } catch (errors) {
            setStatus({'error': errors});
            setSubmitting(false);
        }
    }
})(FormikForm);

const mapDispatchToProps = (dispatch) => {
    return {
        resetPasswordRequest: async (values) => {
            await dispatch(resetPasswordRequest(values));
        },
    }
};


export default connect(null, mapDispatchToProps)(EnhancedForm);
