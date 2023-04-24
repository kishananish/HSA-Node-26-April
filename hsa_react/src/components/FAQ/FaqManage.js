// React Components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert2'
import Moment from 'react-moment';
import 'moment-timezone';
import Pagination from "react-js-pagination";
import padStart from "pad-start";
import moment from "moment";

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from "../Comman/Loader";
import actionImage from '../../assets/img/actions.png';

// Const Files
import * as faqData from '../../data/_faq';
import * as webConstants from "../../constants/WebConstants";
import * as msgConstants from "../../constants/MsgConstants";

let activeManageMenuPermissions;

class FaqManage extends Component {

    constructor(props, context) {
        super(props, context);
        console.log('faq props', props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

        this.state = {
            show: false,
            viewShow: false,
            filter: '-1',
            faqList: this.props.FaqReducer.faqData,
            faqListCopy: this.props.FaqReducer.faqData,
            fields: { title: '', description: '', ar_title: '', ar_description: '', id: '', category: '' },
            errors: {},
            isButton: true,
            loading: false,
            manageLoading: false,
            selectedRow: {},
            currentOperationStatus: '',
            checkedId: [],
            wrapHeight: '500px',
            activePage: 1,
            perPageSize: webConstants.PER_PAGE_SIZE,
        };
    }

    componentWillMount() {
        this.getFaqList(this.state.activePage, this.state.perPageSize, this.state.filter);
        this.setWrapHeight();
        this.setUserPermissions();
    }


    componentDidMount() {
        this.setWrapHeight();
    }

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
            this.setState({ wrapHeight: wrapDivHeight });
        }
    }

    setUserPermissions() {
        let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0].access_level;
        let activeManageMenu = loginUserAllPermissions.find(menuRow => menuRow.name === 'Manage FAQ');
        activeManageMenuPermissions = activeManageMenu.actions;
        //console.log('FAQ Permissions' , activeManageMenuPermissions);
    }

    getFaqList(activePage, PerPageSize, filter) {
        this.setState({ manageLoading: true, currentRowIndex: '' });
        this.props.FaqList(activePage, PerPageSize, filter)
            .then(response => {
                console.log('wow :', response);
                const responseData = response.payload;
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
                        webConstants.MANAGE_FAQ,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    handlePageChange(pageNumber) {
        //console.log(pageNumber);
        this.setState({
            activePage: pageNumber,
        });
        this.getFaqList(pageNumber, this.state.perPageSize, this.state.filter);
    }

    /* Show Add /Edit modal and set data  */
    handleShow(currentOperation, editData) {
        let setEditData;
        let setStateData = {
            show: true,
            currentRowIndex: '',
            currentOperationStatus: currentOperation
        }
        if (editData) {
            setEditData = { title: editData.title, description: editData.description, ar_title: editData.ar_title, ar_description: editData.ar_description, id: editData._id, category: editData.category };
        } else {
            setEditData = { title: '', description: '', ar_title: '', ar_description: '', id: '' };
        }
        setStateData.fields = setEditData;
        // console.log('setStateData :', setStateData)
        this.setState(setStateData);
    }

    /* View detail Modal*/
    viewModalShow() {
        this.setState({ viewShow: true, currentRowIndex: '' });
    }

    /* close all modal */
    handleClose() {
        this.setState({ show: false, viewShow: false, manageLoading: false });
    }

    /* on change set data for validation */
    handleChange(field, e) {
        console.log(field, '<>', e)
        let fields = this.state.fields;
        // console.log('e.target.value :', e.target.value)
        fields[field] = e.target.value;
        this.setState({ fields }, () => console.log(this.state.fields));
        this.handleValidation();
    }

    /* Set Validations for Form fields */
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["title"]) {
            formIsValid = false;
            errors["title"] = "Title is required";
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Description is required";
        }

        if (!fields["ar_title"]) {
            formIsValid = false;
            errors["ar_title"] = 'Arabic title is required'
        }

        if (!fields["ar_description"]) {
            formIsValid = false;
            errors["ar_description"] = 'Arabic description is required'
        }

        if (!fields["category"]) {
            formIsValid = false;
            errors["category"] = 'Arabic description is required'
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    /* Save and Edit Functions */
    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.setState({ loading: true, isButton: 'none' });
            const { title, description, ar_description, ar_title, category } = this.state.fields
            let faqParams = {
                title, description, ar_description, ar_title, category
            }
            if (this.state.currentOperationStatus === 'New') {
                // console.log(faqParams)
                this.props.FaqSave(faqParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                    fields: { title: '', description: '', ar_description: '', ar_title: '' }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    msgConstants.ON_SAVE,
                                    'success'
                                );
                                this.getFaqList(this.state.activePage, this.state.perPageSize,this.state.filter);
                            } else if (responseData.data.statusCode === 400) {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                });
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    `Title already exits`,
                                    'error'
                                );
                            } else {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                });
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    msgConstants.ERROR,
                                    'error'
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
                                webConstants.MANAGE_FAQ,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            } else {
                // Edit FAQ
                this.props.FaqUpdate(this.state.fields.id, faqParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                    fields: { title: '', description: '', ar_description: '', ar_title: '', id: '' }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    msgConstants.ON_UPDATE,
                                    'success'
                                );
                                this.getFaqList(this.state.activePage, this.state.perPageSize,this.state.filter);
                            } else if (responseData.data.statusCode === 400) {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                });
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    `Title already exits`,
                                    'error'
                                );
                            } else {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                });
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    msgConstants.ERROR,
                                    'error'
                                );
                            }
                        }
                    })
                    .catch((error) => {
                        //console.log(error);
                        //console.log(JSON.stringify(error));
                        if (error.response !== undefined) {
                            this.setState({
                                loading: false,
                                isButton: 'block',
                            });
                            swal(
                                webConstants.MANAGE_FAQ,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            }
        } else {
            //console.log("Form has errors.");
            this.setState({ isLogin: false });
        }
    }

    /* Delete Function */
    onDelete(selectedRow) {
        this.setState({
            currentRowIndex: ''
        });
        //console.log('Delete Row', selectedRow._id);
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
                this.props.FaqRemove(selectedRow._id)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    manageLoading: false,
                                });
                                swal(
                                    webConstants.MANAGE_FAQ,
                                    msgConstants.ON_DELETED,
                                    'success'
                                )
                                this.getFaqList(this.state.activePage, this.state.perPageSize,this.state.filter);
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
                                webConstants.MANAGE_FAQ,
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
    onView(row) {
        this.setState({ selectedRow: row, manageLoading: true });
        /* To do history API */
        this.props.FaqHistory(row._id)
            .then(response => {
                const responseData = response.payload;
                console.log(responseData);
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.viewModalShow();
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
                        webConstants.MANAGE_FAQ,
                        error.response.data.message,
                        'error'
                    )
                }
            });
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
    handleDropBtnClick() {
        if (this.refs.table.state !== undefined) {
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
                        this.props.FaqDeleteAll(selectIds)
                            .then(response => {
                                const responseData = response.payload;
                                if (responseData.status === 200) {
                                    if (responseData.data.status === "success") {
                                        this.setState({
                                            manageLoading: false,
                                        });
                                        swal(
                                            webConstants.MANAGE_FAQ,
                                            msgConstants.ON_DELETED,
                                            'success'
                                        )
                                        this.getFaqList(this.state.activePage, this.state.perPageSize,this.state.filter);
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
                                        webConstants.MANAGE_FAQ,
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
                    webConstants.MANAGE_FAQ,
                    msgConstants.NO_RECORDS,
                    'warning'
                )
            }
        } else {
            swal(
                webConstants.MANAGE_FAQ,
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
                    <img src={actionImage} />
                </a>
                <ul className="action_dropdown dropdown-menu">
                    <li className="without_link close-actions">
                        <i className="fa fa-times-circle" aria-hidden="true" />
                    </li>
                    {
                        (activeManageMenuPermissions.view === true) ?
                            <li onClick={() => this.onView(row)} className="with_link">
                                <a href="" data-toggle="control-sidebar">
                                    <i className="fa fa-eye" aria-hidden="true" /> View </a>
                            </li> : ''
                    }

                    {
                        (activeManageMenuPermissions.edit === true) ?
                            <li className="without_link" onClick={() => {
                                this.handleShow('Edit', row)
                            }}>
                                <i className="fa fa-pencil" aria-hidden="true" /> Edit
                        </li> : ''
                    }

                    {
                        (activeManageMenuPermissions.delete === true) ?
                            <li onClick={() => this.onDelete(row)} className="without_link">
                                <i className="fa fa-trash-o" aria-hidden="true" /> Delete
                        </li> : ''
                    }
                </ul>
            </div>
        )
    }


    onClickProductSelected(cell, row, rowIndex, enumObject) {
        this.setState({
            currentRowIndex: rowIndex
        });
    }

    /* Set index/ id for column */
    indexN(cell, row, enumObject, index) {
        return (<div>{webConstants.INDEX_ID}{padStart(index + 1, 4, '0')}</div>)
    }

    filterType(cell, row) {
        // just return type for filtering or searching.
        //console.log('type', cell.type);
        return cell.type;
    }

    /* Set Date format - for date column */
    dateFormatter(cell) {
        if (!cell) {
            return "";
        }
        return `${moment(cell).format("DD-MMM-YYYY") ? moment(cell).format("DD-MMM-YYYY") : moment(cell).format("DD-MMM-YYYY")}`;
    }

    historyTimeFormatter(cell) {
        if (!cell) {
            return "";
        }
        return (<Moment format="HH:MM A">
            {cell}
        </Moment>);
    }

    historyUsernameFormat(cell, row) {
        return (row.operator) ? <span> {row.operator.first_name} {row.operator.last_name} </span> : ''
    }

    historyChangesDone(cell, row) {
        return ((row.prevObj) ? <div className="item-view">
            <p className="item-label"> FAQ Title </p>
            <p className="item-value">{row.prevObj.title}</p>
            <hr className="view-divider" />
            <p className="item-label"> FAQ Description </p>
            <p className="item-value">{row.prevObj.description}</p>
        </div> : <span className="item-label"> No Changes </span>);
    }

    /* Set Search bar */
    customSearchbar = props => {
        return (
            <div className="search-wrapper">
                {props.components.btnGroup}
                {props.components.searchPanel}
            </div>
        );
    }

    onFilterSelect = (event) => {

        if (event.target.value != '-1') {
            console.log(this.props.CategoryReducer.categoryData)
            const filter = this.props.CategoryReducer.categoryData.filter(ele => ele._id == event.target.value)[0]._id
            this.setState({
                filter
            }, ()=>{
                this.getFaqList(this.state.activePage, this.state.perPageSize, this.state.filter)
            })
        }
        // this.setState({ filter: event.target.value })
    }

    /* Set Add New button */
    customToolbarButtons = props => {
        return (
            <ButtonGroup className='my-custom-class pull-right' sizeClass='btn-group-md' >
                <div className="form-group">
                    <select className="form-control"
                        id="category"
                        ref="category"
                        onChange={(e) => this.onFilterSelect(e)}
                        value={this.state.filter}>
                        <option value="-1">Select Category</option>
                        {
                            (this.props.CategoryReducer.categoryData).map((categoryRow, index) => {
                                return (
                                    <option key={index}
                                        value={categoryRow._id}>{categoryRow.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                {
                    (activeManageMenuPermissions.add === true) ?
                        <button onClick={() => {
                            this.handleShow('New')
                        }} className="btn btn-success link-add-new green-button" title="Add New"> NEW
                        </button> : ''
                }

                {
                    (activeManageMenuPermissions.delete === true) ?
                        <i className="fa fa-trash link-remove-all" aria-hidden="true" title="Delete All"
                            onClick={this.handleDropBtnClick.bind(this)} /> : ''
                }
            </ButtonGroup >
        );
    }


    render() {
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


        const historyOptions = {
            prePage: 'Previous',
            nextPage: 'Next',
            paginationPosition: 'bottom',
            hideSizePerPage: true,
            sizePerPage: 2,
            width: '100%'
        };
        console.log('propssss', this.props.FaqReducer.faqSelectedHistoryData);

        return (
            <div>
                <HeaderContainer />
                <SidebarContainer />
                <div className="content-wrapper" ref="bodyContent" style={{ minHeight: this.state.wrapHeight }}>
                    <section className="content-header">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="customer-box">

                                    <div className="">
                                        {(this.state.manageLoading) ? <Loader /> : ''}

                                    </div>

                                    <div className="box-header with-border">
                                        {(this.state.manageLoading) ? '' :
                                            <div className="col-lg-12 no-padding">
                                                <h3 className="manage-page-title">Manage {webConstants.MANAGE_FAQ} </h3>
                                            </div>}
                                    </div>


                                    <div className="box-body faq-tbl custom-pagination no-data-found">
                                        {(!this.state.manageLoading) ?
                                            <div>
                                                <BootstrapTable ref='table'
                                                    data={(this.props.FaqReducerCopy.faqData.result) ? this.props.FaqReducerCopy.faqData.result : []}
                                                    selectRow={selectRowProp}
                                                    pagination={false}
                                                    // search={true}
                                                    // searchPlaceholder={'Search here FAQ Cat'}
                                                    options={options}
                                                    tableHeaderClass='my-header-class'
                                                    tableBodyClass='my-body-class'
                                                    containerClass='my-container-class'
                                                    tableContainerClass='my-table-container-class'
                                                    headerContainerClass='my-header-container-class'
                                                    bodyContainerClass='my-body-container-class'>
                                                    <TableHeaderColumn autoValue={true}
                                                        dataField='_id' isKey={true}
                                                        hidden={true}>FAQ Id</TableHeaderColumn>

                                                    <TableHeaderColumn dataField="any"
                                                        dataFormat={this.indexN.bind(this)}>FAQ
                                                        ID</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='created_at'
                                                        dataFormat={this.dateFormatter.bind(this)}
                                                        ilterValue={this.filterType.bind(this)}
                                                        filterFormatted>CREATED DATE</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='title'>FAQ TITLE</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='description'> FAQ
                                                        DESCRIPTION </TableHeaderColumn>

                                                    <TableHeaderColumn
                                                        dataField='button'
                                                        dataFormat={this.cellButton.bind(this)}
                                                    >ACTION</TableHeaderColumn>
                                                </BootstrapTable>
                                                <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                                                    totalItemsCount={(this.props.FaqReducer.faqData.total) ? this.props.FaqReducer.faqData.total : 0}
                                                    pageRangeDisplayed={(this.props.FaqReducer.faqData.pages) ? this.props.FaqReducer.faqData.pages : 0}
                                                    onChange={this.handlePageChange}
                                                    prevPageText="Previous"
                                                    nextPageText="Next"
                                                />
                                            </div> : ''}
                                    </div>
                                    {/* -- Box body --*/}

                                    {/* Add /Edit FAQ Modal */}
                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{this.state.currentOperationStatus} {webConstants.MANAGE_FAQ}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form name="faqForm" className="faqForm"
                                                onSubmit={this.onSubmit.bind(this)}>
                                                <div className="col-md-12 col-sm-12 col-xs-12 no-padding-left">
                                                    <div className="form-group">
                                                        <label> Category</label>
                                                        <select className="form-control"
                                                            id="category"
                                                            ref="category"
                                                            onChange={this.handleChange.bind(this, 'category')}
                                                            value={this.state.fields['category']}>
                                                            <option value="">Select Category</option>
                                                            {
                                                                (this.props.CategoryReducer.categoryData).map((categoryRow, index) => {
                                                                    return (
                                                                        <option key={index}
                                                                            value={categoryRow._id}>{categoryRow.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        <span
                                                            className="error-message">{this.state.errors['category']}</span>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-12 col-sm-12 col-xs-12 no-padding"> */}
                                                <div className="col-md-6 col-sm-6 col-xs-6 no-padding">
                                                    <div className="form-group">
                                                        <label>Title</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="title"
                                                            placeholder="Title"
                                                            ref="title"
                                                            onChange={this.handleChange.bind(this, 'title')}
                                                            value={this.state.fields['title']} />
                                                        <span
                                                            className="error-message">{this.state.errors['title']}</span>
                                                    </div>
                                                </div>

                                                {/* <div className="col-md-12 col-sm-12 col-xs-12 no-padding"> */}
                                                <div className="col-md-6 col-sm-6 col-xs-6">
                                                    <div className="form-group">
                                                        <label>Arabic Title</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="ar_title"
                                                            placeholder="Arabic Title"
                                                            ref="ar_title"
                                                            onChange={this.handleChange.bind(this, 'ar_title')}
                                                            value={this.state.fields['ar_title']} />
                                                        <span
                                                            className="error-message">{this.state.errors['ar_title']}</span>
                                                    </div>
                                                </div>

                                                {/* <div className="col-md-12 col-sm-12 col-xs-12 no-padding"> */}
                                                <div className="col-md-6 col-sm-6 col-xs-6 no-padding">
                                                    <div className="form-group">
                                                        <label>Description</label>
                                                        <textarea id="description"
                                                            className="form-control"
                                                            placeholder="Description"
                                                            ref="description"
                                                            onChange={this.handleChange.bind(this, "description")}
                                                            value={this.state.fields["description"]}
                                                        />
                                                        <span
                                                            className="error-message">{this.state.errors["description"]}</span>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-12 col-sm-12 col-xs-12 no-padding"> */}
                                                <div className="col-md-6 col-sm-6 col-xs-6">
                                                    <div className="form-group">
                                                        <label>Arabic Description</label>
                                                        <textarea id="ar_description"
                                                            className="form-control"
                                                            placeholder="Arabic Description"
                                                            ref="ar_description"
                                                            onChange={this.handleChange.bind(this, "ar_description")}
                                                            value={this.state.fields["ar_description"]}
                                                        />
                                                        <span
                                                            className="error-message">{this.state.errors["ar_description"]}</span>
                                                    </div>
                                                </div>
                                                <Modal.Footer>
                                                    <div className="button-block">
                                                        {(this.state.loading) ? <Loader /> : ''}
                                                        <button type="button" onClick={this.handleClose}
                                                            className="grey-button">Close
                                                        </button>
                                                        <button type="submit"
                                                            id="add-button"
                                                            className="green-button"
                                                            style={{ display: this.state.isButton }}> {webConstants.SUBMIT_BUTTON_TEXT}
                                                        </button>
                                                    </div>
                                                </Modal.Footer>
                                            </form>
                                        </Modal.Body>
                                    </Modal>


                                    {/* Add /Edit FAQ Modal */}
                                    <Modal show={this.state.viewShow} onHide={this.handleClose} bsSize="large">
                                        <Modal.Header closeButton>
                                            <Modal.Title>View {webConstants.MANAGE_FAQ}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="view-block">
                                                <div className="item-view">
                                                    <p className="item-label">Title</p>
                                                    <p className="item-value">{this.state.selectedRow.title}</p>
                                                </div>
                                                <div className="item-view">
                                                    <p className="item-label">ArabicTitle</p>
                                                    <p className="item-value">{this.state.selectedRow.ar_title}</p>
                                                </div>

                                                <div className="item-view">
                                                    <p className="item-label">Description</p>
                                                    <p className="item-value">{this.state.selectedRow.description}</p>
                                                </div>
                                                <div className="item-view">
                                                    <p className="item-label">Arabic Description</p>
                                                    <p className="item-value">{this.state.selectedRow.ar_description}</p>
                                                </div>
                                            </div>

                                            <div className="history-block">
                                                <h4 className="history-title">History</h4>

                                                <div className="history-table">
                                                    <BootstrapTable ref='table'
                                                        data={(this.props.FaqReducer.faqSelectedHistoryData) ? this.props.FaqReducer.faqSelectedHistoryData : []}
                                                        pagination={true}
                                                        options={historyOptions}
                                                        tableHeaderClass='my-header-class'
                                                        tableBodyClass='my-body-class'
                                                        containerClass='my-container-class'
                                                        tableContainerClass='my-table-container-class'
                                                        headerContainerClass='my-header-container-class'
                                                        bodyContainerClass='my-body-container-class'>
                                                        <TableHeaderColumn autoValue={true} dataField='_id' isKey={true}
                                                            hidden={true}>FAQ Id</TableHeaderColumn>

                                                        <TableHeaderColumn dataField='operation_date'
                                                            dataFormat={this.dateFormatter.bind(this)}>DATE</TableHeaderColumn>

                                                        <TableHeaderColumn dataField='operation_date'
                                                            dataFormat={this.historyTimeFormatter.bind(this)}>TIME</TableHeaderColumn>

                                                        <TableHeaderColumn dataField="link"
                                                            dataFormat={this.historyUsernameFormat}>CHANGES DONE BY </TableHeaderColumn>

                                                        <TableHeaderColumn dataField='link'
                                                            dataFormat={this.historyChangesDone}> CHANGES
                                                            DONE </TableHeaderColumn>
                                                    </BootstrapTable>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
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

export default FaqManage;