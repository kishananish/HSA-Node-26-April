// React Components
import React, {Component} from 'react';
import {withRouter} from "react-router";
import swal from "sweetalert2";
import {Modal} from "react-bootstrap";
import Loader from "./Loader";
import axios from "axios";

// CSS/ Components / Images
import logo from '../../assets/img/logo-darkbg-web.png';
import slideLogo from '../../assets/img/logo-small.png';
import '../../assets/css/styles.css';
import '../../assets/css/manage.css';

// Const Files
import * as webConstants from "../../constants/WebConstants";
import * as msgConstants from "../../constants/MsgConstants";
import * as apiConstants from "../../constants/APIConstants";
import * as menuLinkConstants from "../../constants/MenuLinkConstants";

class Header extends Component {
    constructor(props) {
        super(props)
        this.onDialogClick = this.onDialogClick.bind(this);
        this.state = {
            show: false,
            loading: false,
            fields: {currentPassword: '', newPassword: '', confirmPassword: ''},
            errors: {},
            isButton: true
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        axios.defaults.headers.common['access_token'] = (this.props.LoginReducer.loginUser.token) ? this.props.LoginReducer.loginUser.token : '';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.get['Content-Type'] = 'application/json';
        axios.defaults.headers.delete['Content-Type'] = 'application/json';
        axios.defaults.headers.put['Content-Type'] = 'application/json';
        axios.defaults.headers.patch['Content-Type'] = 'application/json';
    }

    componentDidMount() {
        if (this.props.LoginReducer.isAuthenticated === false) {
            this.props.history.push(menuLinkConstants.LOGIN_LINK);
        }
    }

    /* Modal Open / close */
    handleShow() {
        this.setState({show: true});
    }

    handleClose() {
        this.setState({show: false});
    }

    onDialogClick = () => {
        swal({
            title: 'Logout',
            text: "Are you sure want to logout ?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27ae60',
            cancelButtonColor: '#b5bfc4',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.props.logout();
                swal(
                    'Logout',
                    'You logout successfully',
                    'success'
                )
                this.props.history.push(menuLinkConstants.LOGIN_LINK);
                localStorage.clear();
            }
        });
    }

    /* on change set data for validation */
    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields});
        this.handleValidation();
    }

    /* Set Validations for Form fields */
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        let passwordValidMessage = msgConstants.PASSWORD_VALIDATION_MESSAGE;
        if (!fields["currentPassword"]) {
            formIsValid = false;
            errors["currentPassword"] = "Current Password is required";
        }
        else if (!this.checkPassword(fields["currentPassword"])) {
            formIsValid = false;
            errors["currentPassword"] = passwordValidMessage;
        }

        else if (!fields["newPassword"]) {
            formIsValid = false;
            errors["newPassword"] = "New Password is required";
        }
        else if (!this.checkPassword(fields["newPassword"])) {
            formIsValid = false;
            errors["newPassword"] = passwordValidMessage;
        }

        else if (!fields["confirmPassword"]) {
            formIsValid = false;
            errors["confirmPassword"] = "Confirm Password is required";
        }
        else if (!this.checkPassword(fields["confirmPassword"])) {
            formIsValid = false;
            errors["confirmPassword"] = passwordValidMessage;
        }
        else if (fields["newPassword"] !== fields["confirmPassword"]) {
            formIsValid = false;
            errors["confirmPassword"] = msgConstants.CONFIRM_PASSWORD;
        }
        this.setState({errors: errors});
        return formIsValid;
    }

    checkPassword(passwordInput) {
        let passwordRegularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
        return passwordRegularExpression.test(passwordInput);
    }

    /* Save and Edit Functions */
    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.setState({loading: true, isButton: 'none'});
            let profileParams = {
                old_password: this.state.fields.currentPassword,
                new_password: this.state.fields.newPassword,
                confirm_password: this.state.fields.confirmPassword
            }
            //let accessToken = this.props.LoginReducer.loginUser.token;
            let url = apiConstants.BASE_API_URL + 'admin/change-password';
            axios.defaults.headers.common['access_token'] = this.props.LoginReducer.loginUser.token;
            axios.post(url, profileParams)
                .then(response => {
                    const responseData = response;
                    if (responseData.status === 200) {
                        if (responseData.data.status === "success") {
                            this.setState({
                                loading: false,
                                isButton: 'block',
                                fields: {currentPassword: '', newPassword: '', confirmPassword: ''}
                            });
                            this.handleClose();
                            swal(
                                'My Profile',
                                'Password changed Successfully',
                                'success'
                            );
                        }
                    }
                })
                .catch((error) => {
                    if (error.response !== undefined) {
                        this.setState({
                            loading: false,
                            isButton: 'block',
                        });
                        swal(
                            'My Profile',
                            error.response.data.message,
                            'error'
                        );
                    }
                });
        }
    }

    render() {
        return (
            <header className="main-header">
                <a href="" className="logo">
                <span className="logo-mini">
                    <img src={slideLogo} alt="Logo"/>
                </span>
                    <span className="logo-lg">
                        <img src={logo} className="header-logo" alt='Logo'/>
                    </span>
                </a>
                <nav className="navbar navbar-static-top">
                    {
                        /* Menu toggle - Sidebar
                        <a href="" className="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>*/
                    }

                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            {
                                /* Dropdown Menu Example
                                <li className="dropdown messages-menu">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-language" aria-hidden="true"/   >
                                    {/* <span className="label label-success">4</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">You have 4 messages</li>
                                    {/* Menu List  <li>
                                        <ul className="menu">
                                            <li>
                                                <a href="#">
                                                    <div className="pull-left">
                                                        <img src="dist/img/user2-160x160.jpg" className="img-circle"/>
                                                    </div>
                                                    <h4>
                                                        Support Team
                                                        <small><i className="fa fa-clock-o"></i> 5 mins</small>
                                                    </h4>
                                                    <p>Why not buy a new awesome theme?</p>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li> */
                            }

                            {
                                /*  Settings Menu
                                <li className="messages-menu">
                                    <a className="dropdown-toggle">
                                        <i className="fa fa-cog"></i>
                                    </a>
                                </li>
                                */
                            }

                            <li className="messages-menu" onClick={() => {
                                this.handleShow()
                            }} style={{cursor: 'pointer'}} title="My Profile">
                                <a className="dropdown-toggle">
                                    <i className="fa fa-user-circle login-user-image"/>
                                    <span
                                        className="login-user-name" style={{'marginRight' : '3px'}}>{this.props.LoginReducer.loginUser.first_name} </span>
                                    <span
                                        className="login-user-lname">{this.props.LoginReducer.loginUser.last_name}</span>
                                </a>
                            </li>
                            <li className="messages-menu" onClick={this.onDialogClick} style={{cursor: 'pointer'}}
                                title="Logout">
                                <a className="dropdown-toggle">
                                    <i className="fa fa-sign-out"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Change Password Form Model */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>My Profile - Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form name="faqForm" className="faqForm" onSubmit={this.onSubmit.bind(this)}>
                            <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                <div className="form-group">
                                    <input type="password"
                                           className="form-control"
                                           id="currentPassword"
                                           placeholder="Current Password"
                                           ref="currentPassword"
                                           onChange={this.handleChange.bind(this, 'currentPassword')}
                                           value={this.state.fields['currentPassword']}/>
                                    <span className="error-message">{this.state.errors['currentPassword']}</span>
                                </div>
                            </div>

                            <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                <div className="form-group">
                                    <input type="password"
                                           className="form-control"
                                           id="newPassword"
                                           placeholder="New Password"
                                           ref="newPassword"
                                           onChange={this.handleChange.bind(this, 'newPassword')}
                                           value={this.state.fields['newPassword']}/>
                                    <span className="error-message">{this.state.errors["newPassword"]}</span>
                                </div>
                            </div>

                            <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                <div className="form-group">
                                    <input type="password"
                                           className="form-control"
                                           id="confirmPassword"
                                           placeholder="Confirm Password"
                                           ref="confirmPassword"
                                           onChange={this.handleChange.bind(this, 'confirmPassword')}
                                           value={this.state.fields['confirmPassword']}/>
                                    <span className="error-message">{this.state.errors["confirmPassword"]}</span>
                                </div>
                            </div>
                            <Modal.Footer>
                                <div className="button-block">
                                    {(this.state.loading) ? <Loader/> : ''}
                                    <button type="button" onClick={this.handleClose} className="grey-button">Close
                                    </button>
                                    <button type="submit"
                                            id="add-button"
                                            className="green-button"
                                            style={{display: this.state.isButton}}> {webConstants.SUBMIT_BUTTON_TEXT}
                                    </button>
                                </div>
                            </Modal.Footer>
                        </form>
                    </Modal.Body>
                </Modal>
            </header>
        )
    }
}

export default withRouter(Header);

