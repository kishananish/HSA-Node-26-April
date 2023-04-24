// React Components
import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {Link} from "react-router-dom";
import swal from 'sweetalert2'
import 'moment-timezone';

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import Loader from "../Comman/Loader";
import '../../assets/css/manage.css';
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

// Const Files
import * as webConstants from "../../constants/WebConstants";
import * as msgConstants from "../../constants/MsgConstants";
import * as menuLinkConstants from "../../constants/MenuLinkConstants";

//Constants
let testObjArray = [];
let testObj = {};
let selectedRoleAccessLevelData = [];

class RolesAdd extends Component {

    constructor(props, context) {
        super(props, context);
        //console.log('Roles props', props);
        //console.log('edit id', this.props.location.id);
        this.state = {
            show: false,
            viewShow: false,
            fields: {id: '', roleName: '', roleStatus: true},
            roleAccessLevelValues: [],
            errors: {},
            isButton: true,
            loading: false,
            manageLoading: false,
            selectedRow: {},
            currentOperationStatus: '',
            checkedId: [],
            selectedRowData: {},
            wrapHeight: '500px',
            roleStatusValue: true,
            checked: '',
            getRole: false
        };
    }

    componentWillMount() {
        if (this.props.location.id) {
            this.getSelectedRoleDetails(this.props.location.id);
        }
        this.getRolesAccessLevelList();
        this.setWrapHeight();
    }


    componentDidMount() {
        this.setWrapHeight();
        this.setState({mounted: true});
    }

    /* To set Dyanamic height to wrapper */
    setWrapHeight() {
        let wrapDivHeight;
        let windowHeight = window.innerHeight;
        let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
        if (domElement) {
            let contentHeight = domElement.clientHeight;
            //console.log(windowHeight, contentHeight);
            if (windowHeight >= contentHeight) {
                wrapDivHeight = '100vh';
            } else {
                wrapDivHeight = '100%';
            }
            this.setState({wrapHeight: wrapDivHeight});
        }
    }

    /* To Get Access Level List */
    getRolesAccessLevelList() {
        this.setState({manageLoading: true, currentRowIndex: ''});
        this.props.RolesAccessLevel()
            .then(response => {
                let responseData = response.payload;
                //console.log('RoleAccess level', responseData);
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.setState({
                            manageLoading: false,
                        });
                    }
                }
            })
            .catch((error) => {
                //console.log(error);
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.MANAGE_ROLES,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    /* To Get Selected Id - Role List */
    getSelectedRoleDetails(selectedId) {
        this.setState({manageLoading: true, currentRowIndex: ''});
        this.props.RoleView(selectedId)
            .then(response => {
                const responseData = response.payload;
                if (responseData.status === 200) {
                    let selectedUserData = this.props.RoleReducer.selectedRoleDetails.data;
                    this.setState({
                        manageLoading: false,
                        getRole: true,
                        fields: {
                            id: selectedUserData._id,
                            roleName: selectedUserData.name,
                            roleStatus: selectedUserData.active
                        },
                        roleAccessLevelValues: selectedUserData.access_level,
                        selectedCompleteData: responseData.data.data.access_level
                    });
                }
            })
            .catch((error) => {
                //console.log(error);
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.MANAGE_ROLES,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    /* To Set Data to Grid */
    setData(menuName, selectedColumnHeaderName, accessLevelActionDetails) {
        if (this.props.location.id) {
            //Edit Set Data
            let selectedTest = this.state.selectedCompleteData;
            selectedRoleAccessLevelData = selectedTest
            let isChecked;
            if (selectedColumnHeaderName != undefined) {
                if (accessLevelActionDetails[selectedColumnHeaderName] === false) {
                    isChecked = "";
                    for (let selectedRoleAccessLevelIndex = 0; selectedRoleAccessLevelIndex < selectedRoleAccessLevelData.length; selectedRoleAccessLevelIndex++) {
                        if (selectedRoleAccessLevelData[selectedRoleAccessLevelIndex]['name'] == menuName) {
                            let actionObject = selectedRoleAccessLevelData[selectedRoleAccessLevelIndex]['actions'];
                            if (actionObject[selectedColumnHeaderName] === true) {
                                isChecked = "checked";
                            } else {
                                isChecked = "";
                            }
                        }
                    }
                }
            }
            return <input type="checkbox" defaultChecked={isChecked}
                          onChange={event => this.getRoleAccessValue(event, menuName, selectedColumnHeaderName)}/>
        } else {
            // Add Set Data
            if (selectedColumnHeaderName != undefined) {
                if (accessLevelActionDetails[selectedColumnHeaderName] === false) {
                    return <input type="checkbox"
                                  onChange={event => this.getRoleAccessValue(event, menuName, selectedColumnHeaderName)}/>
                }
            }
        }
    }

    /* To get Role Access Value - On Change Function to manage access levels */
    getRoleAccessValue(event, menuName, columnName) {
        let roleStatus = event.target.checked;
        let roleActions = {};
        let i;
        if (this.props.location.id) {
            //edit
            testObjArray = this.props.RoleReducer.selectedRoleDetails.data.access_level;
            let editIndex;
            for (editIndex = 0; editIndex < testObjArray.length; editIndex++) {
                testObj[testObjArray[editIndex].name] = {
                    'name': testObjArray[editIndex].name,
                    'actions': testObjArray[editIndex].actions
                }
            }
            //console.log(testObj);
        }
        if (!testObj[menuName]) {
            for (i = 0; i < webConstants.ROLES_OPERATIONS.length; i++) {
                let roleOperation = webConstants.ROLES_OPERATIONS[i].toLowerCase();
                if (roleOperation == columnName) {
                    roleActions[roleOperation] = roleStatus;
                } else {
                    roleActions[roleOperation] = false;
                }
            }
            testObj[menuName] = {'name': menuName, 'actions': roleActions}
        } else {
            let obj = testObj[menuName]['actions'];
            obj[columnName] = roleStatus;
        }
        //console.log('Final Add', Object.values(testObj));
        this.setState({roleAccessLevelValues: Object.values(testObj)});
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

        if (!fields["roleName"]) {
            formIsValid = false;
            errors["roleName"] = "Role is required";
        }

        else if (!fields["roleStatus"]) {
            formIsValid = false;
            errors["roleStatus"] = "Status is required";
        }

        else {
            formIsValid = true;
        }
        this.setState({errors: errors});
        return formIsValid;
    }

    /* Save and Edit Functions */
    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.setState({loading: true, isButton: 'none', manageLoading: true});
            let roleParams = {
                name: this.state.fields.roleName,
                active: this.state.fields.roleStatus,
                isDeleted: false,
                access_level: this.state.roleAccessLevelValues
            }
            //console.log(roleParams);
            testObj = {};
            if (this.props.location.id == undefined) {
                this.props.RolesSave(roleParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            this.setState({
                                loading: false,
                                manageLoading: false,
                                isButton: 'block',
                                fields: {roleName: '', roleStatus: ''},
                                roleAccessLevelValues: ''
                            });
                            swal(
                                webConstants.MANAGE_ROLES,
                                msgConstants.ON_SAVE,
                                'success'
                            );
                            this.props.history.push(menuLinkConstants.ROLE_MANAGE_LINK);
                        }
                    })
                    .catch((error) => {
                        if (error.response !== undefined) {
                            this.setState({
                                loading: false,
                                manageLoading: false,
                                isButton: 'block',
                            });
                            swal(
                                webConstants.MANAGE_ROLES,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            } else {
                // Edit
                this.props.RolesUpdate(this.state.fields.id, roleParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            this.setState({
                                loading: false,
                                manageLoading: false,
                                isButton: 'block',
                                fields: {roleName: '', roleStatus: ''},
                                roleAccessLevelValues: ''
                            });
                            swal(
                                webConstants.MANAGE_ROLES,
                                msgConstants.ON_UPDATE,
                                'success'
                            );
                            this.props.history.push(menuLinkConstants.ROLE_MANAGE_LINK);
                        }
                    })
                    .catch((error) => {
                        //console.log(error);
                        //console.log(JSON.stringify(error));
                        if (error.response !== undefined) {
                            this.setState({
                                loading: false,
                                manageLoading: false,
                                isButton: 'block',
                            });
                            swal(
                                webConstants.MANAGE_ROLES,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            }
        } else {
            //console.log("Form has errors.");
        }
    }


    render() {
        return (
            <div>
                <HeaderContainer/>
                <SidebarContainer/>
                <div className="content-wrapper" ref="bodyContent" style={{minHeight: this.state.wrapHeight}}>
                    <section className="content-header">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="customer-box">


                                    <form name="faqForm" className="faqForm" onSubmit={this.onSubmit.bind(this)}>
                                        <div className="box-header with-border">

                                            <div className="col-lg-12 no-padding">
                                                <h3 className="manage-page-title"> {(this.props.location.id) ? 'Edit' : 'Add'} {webConstants.MANAGE_ROLES} </h3>
                                                {(this.state.manageLoading) ? '' :
                                                    <div className="role-details">
                                                    <span className="role-view-value">
                                                        <label>Role Name</label>
                                                        <input type="text"
                                                               className="form-control"
                                                               id="roleName"
                                                               placeholder="Role Name"
                                                               ref="roleName"
                                                               onChange={this.handleChange.bind(this, 'roleName')}
                                                               value={this.state.fields['roleName']}/>
                                                         <span
                                                             className="error-message">{this.state.errors['roleName']}</span>
                                                    </span>

                                                        <span className="role-view-value">
                                                        <label>Status</label>
                                                         <select className="form-control"
                                                                 id="roleStatus"
                                                                 ref="roleStatus"
                                                                 onChange={this.handleChange.bind(this, 'roleStatus')}
                                                                 value={this.state.fields['roleStatus']}>
                                                            <option value="">Select Status</option>
                                                            <option value="true">Active</option>
                                                            <option value="false">Inactive</option>                                                            
                                                        </select>
                                                        <span className="error-message">{this.state.errors['roleStatus']}</span>
                                                    </span>
                                                    </div>
                                                }
                                            </div>
                                        </div>


                                        {
                                            (this.state.manageLoading) ?
                                                <div style={{'height': '100vh'}}><Loader/></div> :
                                                <div
                                                    className="box-body roles-tbl">
                                                    {
                                                        (!this.state.manageLoading) ?
                                                            <div>
                                                                <table border="1" className="table">
                                                                    <thead className="my-header-class">
                                                                    <tr>
                                                                        <td> Access Module </td>
                                                                        {
                                                                            (webConstants.ROLES_OPERATIONS).map((columnHeader,id) => {
                                                                                return (
                                                                                    <td key={id}>{columnHeader}</td>
                                                                                );
                                                                            })
                                                                        }
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody className="my-body-class">
                                                                    {
                                                                        (this.state.getRole || this.props.location.id == undefined) ?
                                                                            (this.props.RoleReducer.rolesAccessLevelData[0].access_level).map((columnRows,roleid) => {
                                                                                return (
                                                                                    <tr key={roleid}>
                                                                                        <td>{columnRows.name} </td>
                                                                                        {
                                                                                            (webConstants.ROLES_OPERATIONS).map((columnHeader,id) => {
                                                                                                return (
                                                                                                    <td key={id}>{this.setData(columnRows.name, columnHeader, columnRows.actions)}</td>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </tr>
                                                                                )
                                                                            }) : ''
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div> : ''
                                                    }

                                                    <div className="">
                                                        <div className="button-block">
                                                            <Link to="/role-manage"
                                                                  className="grey-button">{webConstants.CANCEL_BUTTON_TEXT}</Link>
                                                            <button type="submit" id="add-button"
                                                                    className="green-button">{(this.props.location.id) ? 'Edit' : 'Add'} {webConstants.MANAGE_ROLES}</button>
                                                        </div>
                                                    </div>

                                                </div>
                                        }{/* -- Box body --*/}
                                    </form>


                                </div>
                                {/* <!-- Box --> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default RolesAdd;