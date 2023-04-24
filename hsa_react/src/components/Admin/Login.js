// React Components
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import swal from 'sweetalert2';
import axios from "axios";

// CSS/Images/Components
import '../../assets/css/login.css';
import '../../assets/css/styles.css';
import Loader from '../../components/Comman/Loader';
import logo from '../../assets/img/login_logo.png';

// Const Files
import * as msgConstants from "../../constants/MsgConstants";
import * as webConstants from "../../constants/WebConstants";
import * as menuLinkConstants from "../../constants/MenuLinkConstants";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
            isLogin: false,
            isButton: true,
            loading: false,
            message: '',
            messageType: ''
        }
    }

    componentWillMount() {
        localStorage.clear();
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.get['Content-Type'] = 'application/json';
        axios.defaults.headers.delete['Content-Type'] = 'application/json';
        axios.defaults.headers.put['Content-Type'] = 'application/json';
        axios.defaults.headers.patch['Content-Type'] = 'application/json';
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
        //let emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        let emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //Username Validation
        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "Email Id is required";
        }
        let isValidemail = emailRegex.test(fields["username"]);
        if (!isValidemail) {
            formIsValid = false;
            errors["username"] = "Email Id should be valid.";
        }

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

    onLoginSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            console.log("Form submitted");
            this.setState({loading: true, isButton: 'none', isLogin: true});
            let adminParams = {
                "email": this.state.fields.username,
                "password": this.state.fields.password
            }
            this.props.login(adminParams)
                .then(response => {
                    const responseData = response.payload;
                    if (responseData.status === 200) {
                        if (responseData.data.status === "success") {
                            this.setState({
                                loading: false,
                                isButton: 'block',
                                message: 'You Login Successful',
                                messageType: 'success'
                            });
                            swal(
                                webConstants.LOGIN_PAGE,
                                msgConstants.LOGIN_MSG,
                                'success'
                            );
                            setTimeout(
                                function () {
                                    this.props.history.push(menuLinkConstants.DASHBOARD_LINK);
                                }.bind(this), 1000
                            );

                            localStorage.setItem('LOGIN_USER_TOKEN', responseData.data.data.token);
                            axios.defaults.headers.common['access_token'] = (this.props.LoginReducer.loginUser.token) ? this.props.LoginReducer.loginUser.token : '';

                            /* Required Actions Call - Start */

                            /* Role List */
                            this.props.RolesList(0, 0)
                                .then(response => {
                                    //console.log('in role');
                                    const roleResponseData = response.payload;
                                    if (roleResponseData.status === 200) {
                                        if (roleResponseData.data.status === "success") {
                                        }
                                    }
                                })
                                .catch((error) => {
                                    if (error.response !== undefined) {
                                        swal(
                                            webConstants.MANAGE_ROLES,
                                            error.response.data.message,
                                            'error'
                                        )
                                    }
                                });

                            /* Customer List */
                            this.props.CustomerList(0, 0)
                                .then(response => {
                                    //console.log('in customer');
                                    const customerResponseData = response.payload;
                                    if (customerResponseData.status === 200) {
                                        if (customerResponseData.data.status === "success") {
                                        }
                                    }
                                })
                                .catch((error) => {
                                    if (error.response !== undefined) {
                                        swal(
                                            webConstants.MANAGE_CUSTOMER,
                                            error.response.data.message,
                                            'error'
                                        )
                                    }
                                });

                            /*  Service Provider List */
                            this.props.ServiceProviderUserList(0, 0)
                                .then(response => {
                                    //console.log('in service Provider');
                                    let serviceProviderResponseData = response.payload;
                                    if (serviceProviderResponseData.status === 200) {
                                        if (serviceProviderResponseData.data.status === "success") {
                                        }
                                    }
                                })
                                .catch((error) => {
                                    if (error.response !== undefined) {
                                        swal(
                                            webConstants.MANAGE_SERVICE_PROVIDER,
                                            error.response.data.message,
                                            'error'
                                        )
                                    }
                                });

                            /*  Category List */
                            this.props.CategoryList(0, 0)
                                .then(response => {
                                    //console.log('in category');
                                    const categoryResponseData = response.payload;
                                    if (categoryResponseData.status === 200) {
                                        if (categoryResponseData.data.status === "success") {
                                        }
                                    }
                                })
                                .catch((error) => {
                                    if (error.response !== undefined) {
                                        swal(
                                            webConstants.MANAGE_CATEGORY,
                                            error.response.data.message,
                                            'error'
                                        )
                                    }
                                });
                        } else {
                            console.log('calleed err')
                            this.setState({
                                loading: false,
                                isButton: 'block',
                                message: responseData.data.message,
                                messageType: 'danger'
                            });
                            swal(
                                webConstants.LOGIN_PAGE,
                                msgConstants.INVALID_LOGIN_MSG,
                                'danger'
                            );
                        }
                    }
                })
                .catch((error) => {
                    if (error.response !== undefined) {
                        this.setState({
                            loading: false,
                            isButton: 'block',
                            message: error.response.data.message,
                            messageType: 'danger'
                        });
                        swal(
                            webConstants.LOGIN_PAGE,
                            error.response.data.message,
                            'error'
                        );
                    }
                });
        } else {
            console.log("Form has errors.");
            this.setState({isLogin: false});
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
                                    <img src={logo} className="login-logo" alt='logo'/>
                                    <h1 className="login-intro-header">Welcome<br/> to our Website!</h1>
                                    <p className="login-intro-content">It is a long established fact that a render will
                                        be distracted by the readable content of a page when looking at its layout. </p>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="login-form-content">
                                    <div className="lock-image"></div>
                                    <h3 className="login-content header-text">Log In</h3>
                                    <h3 className="login-content body-text">with your Email Id & Password</h3>
                                    
                                    <div id="login-form">
                                        <form name="loginForm" className="loginForm"
                                              onSubmit={this.onLoginSubmit.bind(this)}>
                                                  {console.log()}
                                            <div className="form-group">
                                                <input type="text"
                                                       id="username"
                                                       placeholder="Email Id"
                                                       ref="username"
                                                       onChange={this.handleChange.bind(this, "username")}
                                                       value={this.state.fields["username"] || ""}/>
                                                <span className="error-message">{this.state.errors["username"]}</span>
                                            </div>

                                            <div className="form-group">
                                                <input type="password"
                                                       id="password"
                                                       placeholder="Password"
                                                       ref="password"
                                                       onChange={this.handleChange.bind(this, "password")}
                                                       value={this.state.fields["password"] || ""}/>
                                                <span className="error-message">{this.state.errors["password"]}</span>
                                            </div>
                                            <div className="login-button-block button-block">
                                                {(this.state.loading) ? <Loader/> : ''}
                                                <button type="submit" id="login-button" className="login-button"
                                                        style={{display: this.state.isButton}}>
                                                    LOGIN
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    {/* login-form */}
                                    <p className="forgot-password-text">
                                        <Link to={menuLinkConstants.FORGOT_PASSWORD_LINK}> {webConstants.FORGOT_PASSWORD_PAGE} ?</Link>
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
export default Login;