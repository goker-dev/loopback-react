import React from 'react';
import {Link} from 'react-router-dom';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {resetPasswordRequest} from '../../../actions'
import {connect} from 'react-redux'

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
                        <h1 className="h4 lined"><span>RESET</span></h1>
                        <fieldset className="form-group">
                            <label className="small">Email</label>
                            <Field className="form-control" type="text" name="email" placeholder="email"/>
                            {touched.email && errors.email &&
                            <small className="form-text text-danger">{errors.email}</small>}
                        </fieldset>
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
    handleSubmit(values, {props, setSubmitting, resetForm}) {
        setSubmittingHigher = () => {
            setSubmitting();
            resetForm();
        };
        props.resetPasswordRequest(values.email)
    }
})(FormikForm);

const mapStateToProps = (state) => {
    typeof setSubmittingHigher === 'function' && setSubmittingHigher(false);
    return {system: state.system}
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetPasswordRequest: (values) => {
            dispatch(resetPasswordRequest(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
