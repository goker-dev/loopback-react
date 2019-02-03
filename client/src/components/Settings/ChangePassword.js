import React from 'react';
import {Field, Form, withFormik} from 'formik'
import * as Yup from 'yup'
import {settingsChangePassword} from '../../actions'
import {connect} from 'react-redux'

let setSubmittingHigher;
const FormikForm = ({
                        values,
                        touched,
                        errors,
                        isSubmitting
                    }) => (
    <div className="row justify-content-md-center">
        <Form className="col-md-6">
            <fieldset className="form-group">
                <label>Old Password</label>
                <Field className="form-control" type="password" name="oldPassword" placeholder="Old Password"/>
                {touched.oldPassword && errors.oldPassword &&
                <small className="form-text text-danger">{errors.oldPassword}</small>}
            </fieldset>
            <fieldset className="form-group">
                <label>New Password</label>
                <Field className="form-control" type="password" name="newPassword" placeholder="New Password"/>
                {touched.newPassword && errors.newPassword &&
                <small className="form-text text-danger">{errors.newPassword}</small>}
            </fieldset>
            <fieldset className="form-group">
                <label>Confirm New Password</label>
                <Field className="form-control" type="password" name="passwordConfirmation"
                       placeholder="New Password Confirmation"/>
                {touched.passwordConfirmation && errors.passwordConfirmation &&
                <small className="form-text text-danger">{errors.passwordConfirmation}</small>}
            </fieldset>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
                Change my password
            </button>
        </Form>
    </div>
);

const EnhancedForm = withFormik({
    mapPropsToValues() {
        return {
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
        }
    },
    validationSchema: Yup.object().shape({
        oldPassword: Yup.string().min(3, 'Password must be 3 characters or longer').required('Password is required'),
        newPassword: Yup.string().min(8, 'Password must be 8 characters or longer')
            .matches(/[a-z]/, 'Password must contain at least one lowercase char')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
            .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match').required('Password is required')
    }),
    handleSubmit(values, {props, setSubmitting}) {
        setSubmittingHigher = setSubmitting;
        props.settingsChangePassword(values);
    }
})(FormikForm);


const mapStateToProps = (state) => {
    typeof setSubmittingHigher === 'function' && setSubmittingHigher(false);
    return {system: state.system}
};

const mapDispatchToProps = (dispatch) => {
    return {
        settingsChangePassword: (values) => {
            dispatch(settingsChangePassword(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
