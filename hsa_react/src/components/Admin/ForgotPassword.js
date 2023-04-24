// React components
import React, {Component} from 'react';
import Dialog from 'react-bootstrap-dialog';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from "sweetalert2";

// CSS/componets
import '../../assets/css/login.css';
import '../../assets/css/styles.css';
import Loader from "../Comman/Loader";

//Const Files
import * as apiConstants from '../../constants/APIConstants';
import * as webConstants from "../../constants/WebConstants";
import * as menuLinkConstants from "../../constants/MenuLinkConstants";



class ForgotPassword extends Component {
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

    componentWillMount(){
        axios.defaults.headers.post['Content-Type'] = 'application/json';
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

        //Username Validation
        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "Email Id is required";
        }
        //let emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        let emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValidemail = emailRegex.test(fields["username"]);
        if (!isValidemail) {
            formIsValid = false;
            errors["username"] = "Email Id should be valid.";
        }
        this.setState({errors: errors});
        return formIsValid;
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            console.log("Form submitted");
            this.setState({loading: true, isButton: 'none', isLogin: true});
            let forgotParams = {
                "email": this.state.fields.username
            }
            let url = apiConstants.BASE_API_URL + apiConstants.ADMIN_FORGOT_API_URL;
            axios.post(url, forgotParams)
                .then(response => {
                    //console.log(response);
                    const responseData = response;
                    if (responseData.status === 200) {
                        if (responseData.data.status === "success") {
                            this.setState({
                                loading: false,
                                isButton: 'block',
                                message: responseData.data.message,
                                messageType: 'success',
                                resetToken: responseData.data.data.resetToken,
                                fields: {username: ''}
                            });
                            swal(
                                webConstants.FORGOT_PASSWORD_PAGE,
                                responseData.data.message,
                                'success'
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
                        webConstants.FORGOT_PASSWORD_PAGE,
                        error.response.data.message,
                        'error'
                    );
                });
        } else {
            console.log("Form has errors.");
            this.setState({isLogin: false});
        }
    }

    resetPassword(resetToken) {
        let resetPasswordUrl = apiConstants.BASE_API_URL + 'user/reset/' + resetToken;
        axios.get(resetPasswordUrl)
            .then(response => {
                //console.log(response);
                const responseData = response;
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.props.history.push({
                            pathname: menuLinkConstants.UPDATE_PASSWORD_LINK,
                            token: resetToken
                        })
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
            });
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

                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="login-form-content">
                                    <h3 className="login-content forgot-password-text"> {webConstants.FORGOT_PASSWORD_PAGE} </h3>
                                    <div id="login-form">
                                        <form name="forgot-password-form" className="loginForm"
                                              onSubmit={this.onSubmit.bind(this)}>
                                            <div className="form-group">
                                                <input type="text"
                                                       id="username"
                                                       placeholder="Email Id"
                                                       ref="username"
                                                       onChange={this.handleChange.bind(this, "username")}
                                                       value={this.state.fields["username"]}/>
                                                <span className="error-message">{this.state.errors["username"]}</span>
                                            </div>
                                            <div className="login-button-block button-block">
                                                {(this.state.loading) ? <Loader/> : ''}
                                                <button type="submit" id="login-button" className="login-button"
                                                        style={{display: this.state.isButton}}>SUBMIT
                                                </button>
                                            </div>
                                        </form>
                                        <Dialog ref={(el) => {
                                            this.dialog = el
                                        }}/>
                                    </div>
                                    {/* forgot password-form */}
                                    <p className="forgot-password-text">
                                        <Link to={menuLinkConstants.LOGIN_LINK}> {webConstants.LOGIN_PAGE}</Link>
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

export default ForgotPassword;