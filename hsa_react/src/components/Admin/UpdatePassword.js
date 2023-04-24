// React Components
import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../Comman/Loader";
import swal from "sweetalert2";
import Dialog from 'react-bootstrap-dialog';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';

// CSS/Components
import '../../assets/css/login.css';
import '../../assets/css/styles.css';

// Const Files
import * as apiConstants from '../../constants/APIConstants';
import * as webConstants from '../../constants/WebConstants';
import * as msgConstants from "../../constants/MsgConstants";
import * as menuLinkConstants from "../../constants/MenuLinkConstants";

let adminToken = localStorage.getItem('LOGIN_USER_TOKEN')

class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
            isLogin: false,
            isButton: true,
            loading: false,
            message: '',
            messageType: '',
            resetToken: ''
        }
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({
            fields,
            message: '',
            messageType: ''
        });
        this.handleValidation();
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Password Validation
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Password is required";
        }
        if (!this.checkPassword(fields["password"])) {
            formIsValid = false;
            errors["password"] = msgConstants.PASSWORD_VALIDATION_MESSAGE;
        }
        this.setState({errors: errors});
        return formIsValid;
    }

    checkPassword(passwordInput) {
        let passwordRegularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
        return passwordRegularExpression.test(passwordInput);
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.setState({loading: true, isButton: 'none'});
            console.log("Form submitted");
            let passwordParams = {
                "password": this.state.fields.password
            }
            let url = apiConstants.BASE_API_URL + 'user/update/' + adminToken;
            axios.post(url, passwordParams)
                .then(response => {
                    const responseData = response;
                    if (responseData.status === 200) {
                        if (responseData.data.status === "success") {
                            this.setState({
                                loading: false,
                                isButton: 'none',
                                message: responseData.data.message,
                                messageType: 'success',
                                resetToken: responseData.data.data.resetToken
                            });
                            swal(
                                webConstants.UPDATE_PASSWORD_PAGE,
                                responseData.data.message,
                                'success'
                            );
                            setTimeout(
                                function () {
                                    this.props.history.push(menuLinkConstants.LOGIN_LINK);
                                }.bind(this), 1000
                            );
                        }
                    }
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                        isButton: 'block',
                        message: error.response.data.message,
                        messageType: 'danger'
                    });
                    swal(
                        webConstants.UPDATE_PASSWORD_PAGE,
                        error.response.data.message,
                        'error'
                    );
                });
        } else {
            console.log("Form has errors.");
        }
    }

    render() {
        return (
            <div className="orange-bg">
                <div className="login-box">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="col-lg-6 col-md-6 col-sm-6 login-sub-block">
                                <div className="row">
                                    <h1 className="login-intro-header">Welcome<br/> to our Website!</h1>
                                    <p className="login-intro-content">It is a long established fact that a render will
                                        be distracted by the readable content of a page when looking at its layout. </p>
                                </div>
                            </div>

                            {
                                (this.state.message) ?
                                    <Alert bsStyle={this.state.messageType} className="col-lg-5 col-md-5 col-sm-5">
                                        {this.state.message}
                                    </Alert>
                                    : ''
                            }

                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="login-form-content">
                                    <h3 className="login-content forgot-password-text"> {webConstants.UPDATE_PASSWORD_PAGE} </h3>
                                    <div id="login-form">
                                        <form name="loginForm" className="loginForm"
                                              onSubmit={this.onSubmit.bind(this)}>
                                            <div className="form-group">
                                                <input type="password"
                                                       id="password"
                                                       placeholder="Password"
                                                       ref="password"
                                                       onChange={this.handleChange.bind(this, "password")}
                                                       value={this.state.fields["password"]}/>
                                                <span className="error-message">{this.state.errors["password"]}</span>
                                            </div>
                                            <div className="login-button-block button-block">
                                                {(this.state.loading) ? <Loader/> : ''}
                                                <button type="submit" id="login-button" className="login-button"
                                                        style={{display: this.state.isButton}}> {webConstants.SUBMIT_BUTTON_TEXT} </button>
                                            </div>
                                        </form>
                                        <Dialog ref={(el) => {
                                            this.dialog = el
                                        }}/>
                                    </div>
                                    {/* update-password-form */}
                                    <p className="forgot-password-text">
                                        <Link to={menuLinkConstants.FORGOT_PASSWORD_LINK}>{webConstants.FORGOT_PASSWORD_PAGE} ? </Link>
                                    </p>
                                </div>
                            </div>
                            {/* login sub block */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default UpdatePassword;