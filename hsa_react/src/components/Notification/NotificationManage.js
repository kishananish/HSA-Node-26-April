// React components
import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { Modal} from 'react-bootstrap';
import Moment from 'react-moment';
import swal from 'sweetalert2';
import 'moment-timezone';
import ReactDOM from "react-dom";
import padStart from "pad-start";
import Select from 'react-select';
import Pagination from "react-js-pagination";

// CSS/Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from "../Comman/Loader";
import actionImage from '../../assets/img/actions.png';
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";


// Const Files
import * as notificationData from '../../data/_notification';
import * as webConstants from "../../constants/WebConstants";
import * as msgConstants from "../../constants/MsgConstants";
import * as languageData from "../../data/_languages";
import * as cityData from "../../data/_city";

let roleValue = '';
let activeManageMenuPermissions;
let userTypeArray = [];
let userDataArray = [];
let userAllId = [];

class NotificationManage extends Component {

    constructor(props, context) {
        super(props, context);
        //console.log('Notification props', props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUsersChange = this.handleUsersChange.bind(this);
        this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            show: false,
            viewShow: false,
            fields: {userType: '', notification: '', id : '', users:''},
            errors: {},
            isButton: true,
            loading: false,
            manageLoading: false,
            selectedRow : {},
            currentOperationStatus : '',
            checkedId : [],
            selectedRowData : {},
            activePage: 1,
            wrapHeight : '500px',
            selectedUsers : [],
            viewSelectedUserList : [],
            userTypeData : [],
            selectedUserType : '',
            isUserList : false,
            userDataList : []
        };
    }

    componentWillMount(){
        this.getNotificationList();
        this.setWrapHeight();
        this.setUserPermissions();
    }

    componentDidMount(){
        this.setWrapHeight();
    }

    setWrapHeight(){
        let wrapDivHeight;
        let windowHeight = window.innerHeight;
        let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
        if (domElement){
            let contentHeight = domElement.clientHeight;
            //console.log(windowHeight, contentHeight);
            if(windowHeight >= contentHeight)
            {
                wrapDivHeight = '100vh';
            } else {
                wrapDivHeight = '100%';
            }
            this.setState({ wrapHeight : wrapDivHeight});
        }
    }

    handlePageChange(pageNumber) {
        //console.log(pageNumber);
        this.setState({
            activePage: pageNumber,
        });
        this.getRolesList(pageNumber, this.state.perPageSize);
    }

    setUserPermissions(){
        let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0].access_level;
        let activeManageMenu = loginUserAllPermissions.find(menuRow => menuRow.name === 'Notifications');
        activeManageMenuPermissions = activeManageMenu.actions;
        //console.log('Notification Permissions' , activeManageMenuPermissions);
    }

    getUserTypeList() {
        userTypeArray = [];
        this.props.RolesList(0, 0)
            .then(response => {
                const roleResponseData = response.payload;
                if (roleResponseData.status === 200) {
                    if (roleResponseData.data.status === "success") {
                        let roleData = roleResponseData.data.data.result;
                        if (roleData.length > 0) {
                            let i;
                            for (i = 0; i < roleData.length; i++) {
                                if(roleData[i].name == 'user' || roleData[i].name == 'service_provider') {
                                    let roleValue = roleData[i].name;
                                    roleData[i].name = (roleData[i].name.split("_").join(" ")).toLowerCase()
                                        .split(' ')
                                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(' ');
                                    userTypeArray.push({value: roleValue, label: roleData[i].name});
                                  }
                               }
                            this.setState({
                                userTypeData : userTypeArray
                            });
                        }
                    }
                }
            })
            .catch((error) => {
                //console.log(error);
                if (error.response !== undefined) {
                    swal(
                        webConstants.MANAGE_ROLES,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }


    getUserList(roleName){
        userDataArray = [];
        userAllId = [];

        if (roleName) {
            this.setState({
                isUserList: false,
            });
            this.props.SearchUserWithRole(roleName)
                .then(response => {
                    const responseData = response.payload;
                    if (responseData.status === 200) {
                        if (responseData.data.status == 'success') {
                            let userData = responseData.data.data;
                            //console.log(userData);
                            userDataArray.push({value: 'all', label: 'All'});
                            if(userData.length > 0) {
                                let i;
                                for (i = 0; i < userData.length; i++) {
                                    userDataArray.push({value: userData[i]._id, label: userData[i].first_name+' '+userData[i].last_name});
                                    userAllId.push(userData[i]._id);
                                }
                                this.setState({
                                    isUserList: true,
                                    userDataList : userDataArray
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    if (error.response !== undefined) {
                        this.setState({
                            isUserList: false,
                        });
                        swal(
                            webConstants.MANAGE_NOTIFICATION,
                            error.response.data.message,
                            'error'
                        )
                    }
                });
           }

            /*let userData = this.props.CustomerReducer.customerData.result;
            userDataArray.push({value: 'all', label: 'All'});
            if(userData.length > 0) {
                let i;
                for (i = 0; i < userData.length; i++) {
                    userDataArray.push({value: userData[i].userId, label: userData[i].first_name+' '+userData[i].last_name});
                    userAllId.push(userData[i].userId);
                }
            }*/
    }

    getNotificationList(){
        this.setState({manageLoading: true, currentRowIndex: ''});
        this.props.NotificationList()
            .then(response  => {
                //console.log(response);
                const responseData = response.payload;
                if(responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.setState({
                            manageLoading: false,
                        });
                    }
                }
            })
            .catch((error) => {
                //console.log(error);
                if(error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.MANAGE_NOTIFICATION,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    handleUsersChange(selectedUsersOption){
       this.setState({
            selectedUsers : selectedUsersOption
        });
        this.handleChange('users', '', selectedUsersOption);
    }

    handleUserTypeChange(selectedUserTypeOption){
        this.setState({
            selectedUserType : selectedUserTypeOption
        });
        this.handleChange('userType', '', selectedUserTypeOption);
        this.getUserList(selectedUserTypeOption.value);
    }

    /* Show Add /Edit modal and set data  */
    handleShow(currentOperation, editData) {
        if(currentOperation === "New") {
            //console.log(this.state);
            this.getUserTypeList();
            this.setState({
                selectedUserType : [],
                selectedUsers : []
            });
        }
        let setEditData;
        let setStateData = {
            show: true ,
            currentRowIndex: '' ,
            currentOperationStatus : currentOperation
        }
        if(editData){
            setEditData = {userType: '', notification: '', id : ''}
        } else {
            setEditData = {userType: '', notification: '', id : ''}
        }
        setStateData.fields = setEditData;
        this.setState(setStateData);
    }

    /* View detail Modal*/
    viewModalShow() {
        this.setState({ viewShow: true , currentRowIndex: '' });
    }


    /* close all modal */
    handleClose() {
        this.setState({ show: false , viewShow: false, manageLoading: false,errors:{} });
    }

    /* on change set data for validation */
    handleChange(field, e, dateValue){
        let fields = this.state.fields;
        let value;
        if(field === 'users' || field === 'userType'){
            value = dateValue;
        } else {
            value = e.target.value;
        }
        fields[field] = value;
        this.setState({fields});
        this.handleValidation();
    }

    /* Set Validations for Form fields */
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["userType"]){
            formIsValid = false;
            errors["userType"] = "User Type required";
        }

        if(!fields["notification"]){
            formIsValid = false;
            errors["notification"] = "Notification is required";
        }
        
        this.setState({errors: errors});
        return formIsValid;
    }



    /* Save and Edit Functions */
    onSubmit(e) {
        e.preventDefault();
        if(this.handleValidation()){
            //this.setState({loading: true, isButton: 'none'});
            let userList = [];
            if(this.state.selectedUsers.length === 0)
            {
               userList = userAllId;
            } else {
                if(this.state.selectedUsers[0].value === 'all'){
                    userList = userAllId;
                } else {
                    if(this.state.selectedUsers.length > 0){
                        let i;
                        for(i = 0; i < this.state.selectedUsers.length; i++)
                        {
                            userList.push(this.state.selectedUsers[i].value);
                        }
                    }
                }
            }

            let notificationParams = {
                user_type : this.state.fields.userType.value,
                content : this.state.fields.notification,
                user_id : userList
            }
            console.log(notificationParams);
            if(this.state.currentOperationStatus === 'New') {
                this.props.NotificationSave(notificationParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    manageLoading : false,
                                    isButton: 'block',
                                    fields: {
                                        userType: '',
                                        notification: '',
                                        id : '',
                                        selectedUserType : [],
                                        selectedUsers : []
                                    }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_NOTIFICATION,
                                    msgConstants.ON_SAVE,
                                    'success'
                                );
                                this.getNotificationList();
                            }
                        }
                    })
                    .catch((error) => {
                        if (error.response !== undefined) {
                            this.setState({
                                manageLoading: false,
                                isButton: 'block',
                            });
                            swal(
                                webConstants.MANAGE_NOTIFICATION,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            }
        } else{
            //console.log("Form has errors.");
            this.setState({isLogin :false});
        }
    }

    /* Delete Function */
    onDelete = (selectedRow) => {
        this.setState({
            currentRowIndex: ''
        });
        swal({
            title: msgConstants.DELETE_TITLE,
            text: msgConstants.CONFIRM_DELETE,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27ae60',
            cancelButtonColor: '#b5bfc4',
            confirmButtonText: msgConstants.DELETE_BUTTON_LABEL
        }).then((result) => {
            if (result.value) {
                this.setState({
                    manageLoading: true,
                });
                this.props.NotificationRemove(selectedRow._id)
                    .then(response  => {
                        const responseData = response.payload;
                        if(responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    manageLoading: false,
                                });
                                swal(
                                    webConstants.MANAGE_NOTIFICATION,
                                    msgConstants.ON_DELETED,
                                    'success'
                                )
                                this.getNotificationList();
                            }
                        }
                    })
                    .catch((error) => {
                        //console.log(error);
                        //console.log(JSON.stringify(error));
                        if(error.response !== undefined) {
                            this.setState({
                                manageLoading: false,
                            });
                            swal(
                                webConstants.MANAGE_NOTIFICATION,
                                error.response.data.message,
                                'error'
                            )
                        }
                    });
            } else {
                //console.log('cancel');
            }
        })
    }

    /* View Function */
    onView(row){
       // let userData;
       /* if(row.user_type == 'user'){
            userData = row.user_id;
        } else {
            userData = row.service_provider_id;
        }*/
        this.setState({
            selectedRow : row,
            manageLoading: true,
            viewSelectedUserList : row.user_id
        });
        this.viewModalShow();
    }


    /* On Row selected - Manage list */
    onRowSelect(row, isSelected, e) {
        /* let rowStr = '';
         for (const prop in row) {
             rowStr += prop + ': "' + row[prop] + '"';
         }
         //console.log('row',e);
         //console.log(`is selected: ${isSelected}, ${rowStr}`); */
    }

    /* On all row selected */
    onSelectAll(isSelected, rows) {
        if (isSelected) {
            //console.log('rows selected');
        } else {
            //console.log('No Selection');
        }
    }

    /* Delete selected all records */
    handleDropBtnClick(){
        if(this.refs.table !== undefined) {
            if (this.refs.table.state.selectedRowKeys.length > 0) {
                let selectIds = this.refs.table.state.selectedRowKeys;
                //console.log(selectIds);
                /* To Do delete all API */
                this.setState({
                    currentRowIndex: ''
                });
                swal({
                    title: msgConstants.DELETE_TITLE,
                    text: msgConstants.CONFIRM_DELETE,
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#27ae60',
                    cancelButtonColor: '#b5bfc4',
                    confirmButtonText: msgConstants.DELETE_BUTTON_LABEL
                }).then((result) => {
                    if (result.value) {
                        this.setState({
                            manageLoading: true,
                        });
                        this.props.NotificationDeleteAll(selectIds)
                            .then(response => {
                                const responseData = response.payload;
                                if (responseData.status === 200) {
                                    if (responseData.data.status === "success") {
                                        this.setState({
                                            manageLoading: false,
                                        });
                                        swal(
                                            webConstants.MANAGE_NOTIFICATION,
                                            msgConstants.ON_DELETED,
                                            'success'
                                        )
                                        this.getNotificationList();
                                    }
                                }
                            })
                            .catch((error) => {
                                //console.log(error);
                                //console.log(JSON.stringify(error));
                                if (error.response !== undefined) {
                                    this.setState({
                                        manageLoading: false,
                                    });
                                    swal(
                                        webConstants.MANAGE_NOTIFICATION,
                                        error.response.data.message,
                                        'error'
                                    )
                                }
                            });
                    } else {
                        //console.log('cancel');
                    }
                })
            } else {
                swal(
                    webConstants.MANAGE_NOTIFICATION,
                    msgConstants.NO_RECORDS,
                    'warning'
                )
            }
        } else {
            swal(
                webConstants.MANAGE_NOTIFICATION,
                msgConstants.ERROR,
                'error'
            )
            this.forceUpdate();
        }
    }

    /* Manage table - set Action List */
    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <div className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <img src={actionImage}/>
                </a>
                <ul className="action_dropdown dropdown-menu">
                        <li className="without_link close-actions">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </li>
                    {
                        (activeManageMenuPermissions.view === true) ?
                            <li onClick={() => this.onView(row)} className="with_link">
                            <a href="" data-toggle="control-sidebar">
                                <i className="fa fa-eye" aria-hidden="true"/> View </a>
                        </li> : ''
                    }

                    {
                        (activeManageMenuPermissions.delete === true) ?
                            <li onClick={() => this.onDelete(row)} className="without_link">
                            <i className="fa fa-trash-o" aria-hidden="true"/> Delete
                        </li> : ''
                    }
                    </ul>
            </div>
        )
    }


    onClickProductSelected(cell, row, rowIndex, enumObject){
        this.setState({
            currentRowIndex: rowIndex
        });
    }

    /* Set index/ id for column */
    indexN(cell, row, enumObject, index) {
        return (<div>{webConstants.INDEX_ID}{padStart(index+1,4, '0')}</div>)
    }

    /* Set Date format - for date column */
    dateFormatter(cell) {
        if (!cell) {
            return "";
        }
        return ( <Moment format="DD-MMM-YYYY">
            {cell}
        </Moment>);
    }

    userTypeName(cell){
        if (!cell) {
            return "";
        } else {
            let userType = '';
            userType = (cell.split("_").join("  ")).toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
            return userType;
        }
    }

    historyTimeFormatter(cell) {
        if (!cell) {
            return "";
        }
        return ( <Moment format="HH:MM A">
            {cell}
        </Moment>);
    }

    /* Set Search bar */
    customSearchbar = props => {
        return (
            <div className="search-wrapper">
                { props.components.btnGroup }
                { props.components.searchPanel }
            </div>
        );
    }



    /* Set Add New button */
    customToolbarButtons = props => {
        return (
            <ButtonGroup className='my-custom-class pull-right' sizeClass='btn-group-md'>
                {
                    (activeManageMenuPermissions.add === true) ?
                        <button onClick={() => {
                        this.handleShow('New')
                    }} className="btn btn-success link-add-new green-button" title="Add New"> NEW </button> : ''
                }
                {
                    (activeManageMenuPermissions.delete === true) ?
                    <i className="fa fa-trash link-remove-all" aria-hidden="true" title="Delete All"
                       onClick={this.handleDropBtnClick.bind(this)}/> : ''
                }
            </ButtonGroup>
        );
    }


    render(){
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll
        };
        const options = {
            toolBar: this.customSearchbar,
            btnGroup: this.customToolbarButtons,
            prePage: 'Previous',
            nextPage: 'Next',
            paginationPosition: 'bottom',
            hideSizePerPage: true,
        };

        return (
            <div>
                <HeaderContainer/>
                <SidebarContainer/>
                <div className="content-wrapper" ref="bodyContent"  style={{ minHeight : this.state.wrapHeight }}>
                    <section className="content-header">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="customer-box">

                                    <div className="button-block">
                                        { (this.state.manageLoading) ? <Loader/> : '' }
                                    </div>

                                    <div className="box-header with-border">
                                        { (this.state.manageLoading) ?  '' :
                                            <div className="col-lg-12 no-padding">
                                                <h3 className="manage-page-title"> { webConstants.MANAGE_NOTIFICATION} </h3>
                                            </div> }
                                    </div>


                                    <div className="box-body faq-tbl no-data-found custom-pagination">
                                        { (!this.state.manageLoading) ?
                                            <div>
                                            <BootstrapTable ref='table'
                                                            data= { (this.props.NotificationReducer.notificationData.result) ? this.props.NotificationReducer.notificationData.result : [] }
                                                            selectRow={ selectRowProp }
                                                            pagination={ false }
                                                            search={ true }
                                                            searchPlaceholder={ 'Search here'}
                                                            options={options}
                                                            tableHeaderClass='my-header-class'
                                                            tableBodyClass='my-body-class'
                                                            containerClass='my-container-class'
                                                            tableContainerClass='my-table-container-class'
                                                            headerContainerClass='my-header-container-class'
                                                            bodyContainerClass='my-body-container-class'>
                                                <TableHeaderColumn autoValue={true} dataField='_id' isKey={true} hidden={true}> NOTIFICATION  ID</TableHeaderColumn>
                                                <TableHeaderColumn dataField="any" dataFormat={this.indexN.bind(this)}>NOTIFICATION ID</TableHeaderColumn>
                                                <TableHeaderColumn dataField='created_at' dataFormat={this.dateFormatter.bind(this)}>SEND ON</TableHeaderColumn>
                                                <TableHeaderColumn dataField='user_type' dataFormat={this.userTypeName.bind(this)}>USER TYPE</TableHeaderColumn>
                                                <TableHeaderColumn dataField='content'> NOTIFICATION CONTENT</TableHeaderColumn>
                                                <TableHeaderColumn
                                                    dataField='button'
                                                    dataFormat={this.cellButton.bind(this)}
                                                >ACTION</TableHeaderColumn>
                                            </BootstrapTable>

                                            <Pagination
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                                            totalItemsCount={(this.props.NotificationReducer.notificationData.total) ? this.props.NotificationReducer.notificationData.total : 0}
                                            pageRangeDisplayed={(this.props.NotificationReducer.notificationData.pages) ? this.props.NotificationReducer.notificationData.pages : 0}
                                            onChange={this.handlePageChange}
                                            prevPageText="Previous"
                                            nextPageText="Next"
                                            />
                                            </div>: '' }
                                    </div> {/* -- Box body --*/ }

                                    {/* Add /Edit Modal */}
                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{this.state.currentOperationStatus} { webConstants.MANAGE_NOTIFICATION }</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form name="faqForm" className="faqForm" onSubmit= {this.onSubmit.bind(this)}>
                                                <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                                    <div className="col-md-4 col-sm-4 col-xs-4 no-padding-left">
                                                        <div className="form-group report-autocomplete-select">
                                                            <label> User Type</label>
                                                            <Select
                                                                placeholder="Select User Type"
                                                                value={ this.state.selectedUserType }
                                                                options={ this.state.userTypeData }
                                                                ref="userType"
                                                                id="userType"
                                                                isSearchable="true"
                                                                onChange={this.handleUserTypeChange}
                                                            />
                                                            <span className="error-message">{this.state.errors['userType']}</span>
                                                        </div>
                                                    </div>
 
                                                    <div className="col-md-8 col-sm-8 col-xs-8 no-padding-right">
                                                        <div className="form-group report-autocomplete-select">
                                                                <label> Users</label>
                                                                <Select
                                                                    placeholder="Select Users"
                                                                    value={this.state.selectedUsers}
                                                                    options={this.state.userDataList}
                                                                    ref='users'
                                                                    id="users"
                                                                    isSearchable="true"
                                                                    isMulti="true"
                                                                    onChange={this.handleUsersChange}
                                                                />
                                                                <span
                                                                    className="error-message">{this.state.errors['users']}</span>
                                                            </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                                        <div className="form-group">
                                                            <label>Notification Content</label>
                                                            <textarea className="form-control"
                                                                    id="notification"
                                                                    ref="notification"
                                                                    onChange={this.handleChange.bind(this, 'notification')}
                                                                    value={this.state.fields['notification']}>
                                                            </textarea>
                                                            <span className="error-message">{this.state.errors['notification']}</span>
                                                        </div>
                                                </div>

                                                <Modal.Footer>
                                                    <div className="button-block">
                                                        { (this.state.loading) ? <Loader/> : '' }
                                                        <button type="button" onClick={this.handleClose} className="grey-button">Close</button>
                                                        <button type="submit"
                                                                id="add-button"
                                                                className="green-button"
                                                                style={{display: this.state.isButton}}
                                                                > {webConstants.SUBMIT_BUTTON_TEXT}
                                                        </button>
                                                    </div>
                                                </Modal.Footer>
                                            </form>
                                        </Modal.Body>
                                    </Modal>


                                    {/* Add /Edit  Modal */}
                                    <Modal show={this.state.viewShow} onHide={this.handleClose} bsSize="large">
                                        <Modal.Header closeButton>
                                            <Modal.Title>View { webConstants.MANAGE_NOTIFICATION }</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="view-block col-md-12 col-lg-12">
                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">User Type</p>
                                                    <p className="item-value">{this.state.selectedRow.user_type}</p>
                                                </div>

                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Send on</p>
                                                    <p className="item-value"><Moment format="DD-MMM-YYYY HH:MM A">
                                                        {this.state.selectedRowData.created_at}
                                                    </Moment></p>
                                                </div>
                                            </div>

                                            <div className="view-block col-md-12 col-lg-12">
                                                <div className="item-view col-md-12 col-lg-12">
                                                    <p className="item-label">Users</p>
                                                    {
                                                        (this.state.viewSelectedUserList).map((userRow, index) => {
                                                            return (
                                                                <span className="item-value" key={index}>{userRow.first_name+' '+userRow.last_name + ', '}</span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className="view-block col-md-12 col-lg-12">
                                                <div className="item-view col-md-12 col-lg-12">
                                                    <p className="item-label">Notification Content</p>
                                                    <p className="item-value">{this.state.selectedRow.content}</p>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </div> {/* <!-- Box --> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default NotificationManage;