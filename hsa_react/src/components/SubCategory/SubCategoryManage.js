// React Components
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert2'
import Moment from 'react-moment';
import 'moment-timezone';
import actionImage from '../../assets/img/actions.png';
import ReactDOM from "react-dom";
import padStart from "pad-start";
import moment from "moment";

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from "../Comman/Loader";
import "../../assets/css/react-bootstrap-table.min.css";

// Const Files
//import * as subcategoryData from '../../data/_subcategory';
import * as webConstants from "../../constants/WebConstants";
import * as msgConstants from "../../constants/MsgConstants";

let activeManageMenuPermissions;

class SubCategoryManage extends Component {

    constructor(props, context) {
        super(props, context);
        //console.log('subcategory props', props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
            viewShow: false,
            fields: { category: '', subcategoryName: '', id: '', arabicSubcategoryName: '' },
            errors: {},
            isButton: true,
            loading: false,
            manageLoading: false,
            selectedRow: {},
            selectedRowData: {},
            currentOperationStatus: '',
            checkedId: [],
            wrapHeight: '500px'
        };
    }

    componentWillMount() {
        this.getSubcategoryList();
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
        let activeManageMenu = loginUserAllPermissions.find(menuRow => menuRow.name === 'Manage Sub-Category');
        activeManageMenuPermissions = activeManageMenu.actions;
        //console.log('subcategory Permissions' , activeManageMenuPermissions);
    }

    getSubcategoryList() {
        this.setState({ manageLoading: true, currentRowIndex: '' });
        this.props.SubCategoryList()
            .then(response => {
                //console.log(response);
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
                        webConstants.MANAGE_SUBCATEGORY,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    /* Show Add /Edit modal and set data  */
    handleShow(currentOperation, editData) {
        //console.log(editData);
        let setEditData;
        let setStateData = {
            show: true,
            currentRowIndex: '',
            currentOperationStatus: currentOperation
        }
        if (editData) {
            setEditData = { category: editData.category_id._id, subcategoryName: editData.name, id: editData._id, arabicSubcategoryName: editData.ar_name };
        } else {
            setEditData = { category: '', subcategoryName: '', id: '', arabicSubcategoryName: '' };
        }
        setStateData.fields = setEditData;
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
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
        this.handleValidation();
    }

    /* Set Validations for Form fields */
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["category"]) {
            formIsValid = false;
            errors["category"] = "Category is required";
        }

        if (!fields["subcategoryName"]) {
            formIsValid = false;
            errors["subcategoryName"] = "Sub-Category is required";
        }
        if (!fields["arabicSubcategoryName"]) {
            formIsValid = false;
            errors["arabicSubcategoryName"] = "Arabic sub-Category is required";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    /* Save and Edit Functions */
    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.setState({ loading: true, isButton: 'none' });
            let subcategoryParams = {
                category_id: this.state.fields.category,
                name: this.state.fields.subcategoryName,
                ar_name: this.state.fields.arabicSubcategoryName,
            }
            if (this.state.currentOperationStatus === 'New') {
                this.props.SubCategorySave(subcategoryParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                    fields: { category: '', subcategoryName: '', arabicSubcategoryName: '' }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_SUBCATEGORY,
                                    msgConstants.ON_SAVE,
                                    'success'
                                );
                                this.getSubcategoryList();
                            } else if (responseData.data.statusCode === 400) {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                });
                                swal(
                                    webConstants.MANAGE_SUBCATEGORY,
                                    'Sub category is already exits',
                                    'error'
                                );
                            } else {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                });
                                swal(
                                    webConstants.MANAGE_SUBCATEGORY,
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
                                webConstants.MANAGE_SUBCATEGORY,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            } else {
                // Edit
                this.props.SubCategoryUpdate(this.state.fields.id, subcategoryParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    loading: false,
                                    isButton: 'block',
                                    fields: { category: '', subcategoryName: '', id: '', arabicSubcategoryName: '' }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_SUBCATEGORY,
                                    msgConstants.ON_UPDATE,
                                    'success'
                                );
                                this.getSubcategoryList();
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
                                webConstants.MANAGE_SUBCATEGORY,
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
    onDelete = (selectedRow) => {
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
                this.props.SubCategoryRemove(selectedRow._id)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    manageLoading: false,
                                });
                                swal(
                                    webConstants.MANAGE_SUBCATEGORY,
                                    msgConstants.ON_DELETED,
                                    'success'
                                )
                                this.getSubcategoryList();
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
                                webConstants.MANAGE_SUBCATEGORY,
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
        // console.log('rowww=>',row);
        
        this.setState({
            manageLoading: true,
            selectedRowData: { category: row.category_id.name, subcategory: row.name, ar_name: row.ar_name },
        });
        /* To do history API */
        this.props.SubCategoryHistory(row._id)
            .then(response => {
                const responseData = response.payload;
                //console.log(responseData);
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        //History Response
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
                        webConstants.MANAGE_SUBCATEGORY,
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
        if (this.refs.table !== undefined) {
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
                        this.props.SubCategoryDeleteAll(selectIds)
                            .then(response => {
                                const responseData = response.payload;
                                if (responseData.status === 200) {
                                    if (responseData.data.status === "success") {
                                        this.setState({
                                            manageLoading: false,
                                        });
                                        swal(
                                            webConstants.MANAGE_SUBCATEGORY,
                                            msgConstants.ON_DELETED,
                                            'success'
                                        )
                                        this.getSubcategoryList();
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
                                        webConstants.MANAGE_SUBCATEGORY,
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
                    webConstants.MANAGE_SUBCATEGORY,
                    msgConstants.NO_RECORDS,
                    'warning'
                )
            }
        } else {
            swal(
                webConstants.MANAGE_SUBCATEGORY,
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

    getCategoryName(cell, row) {
        return (row.category_id) ? row.category_id.name : '';
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
            <p className="item-label"> Category Name : </p>
            <p className="item-value">{row.prevObj.category_id.name}</p>
            <hr className="view-divider" />
            <p className="item-label"> Sub-Category Name : </p>
            <p className="item-value">{row.prevObj.name}</p>
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


    /* Set Add New button */
    customToolbarButtons = props => {
        return (
            <ButtonGroup className='my-custom-class pull-right' sizeClass='btn-group-md'>
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
            </ButtonGroup>
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
                                                <h3 className="manage-page-title">Manage {webConstants.MANAGE_SUBCATEGORY} </h3>
                                            </div>}
                                    </div>


                                    <div className="box-body subcategory-tbl custom-pagination no-data-found">
                                        {(!this.state.manageLoading) ?
                                            <BootstrapTable ref='table'
                                                data={(this.props.SubCategoryReducer.subCategoryData) ? this.props.SubCategoryReducer.subCategoryData : []}
                                                selectRow={selectRowProp}
                                                pagination={true}
                                                search={true}
                                                searchPlaceholder={'Search here'}
                                                options={options}
                                                tableHeaderClass='my-header-class'
                                                tableBodyClass='my-body-class'
                                                containerClass='my-container-class'
                                                tableContainerClass='my-table-container-class'
                                                headerContainerClass='my-header-container-class'
                                                bodyContainerClass='my-body-container-class'>
                                                <TableHeaderColumn autoValue={true}
                                                    dataField='_id'
                                                    isKey={true}
                                                    hidden={true}>SUB - CATEGORY Id</TableHeaderColumn>

                                                <TableHeaderColumn dataField="any"
                                                    dataFormat={this.indexN.bind(this)}>SUB
                                                    - CATEGORY ID</TableHeaderColumn>

                                                <TableHeaderColumn dataField='created_at'
                                                    dataFormat={this.dateFormatter.bind(this)}
                                                    filterValue={this.filterType.bind(this)}
                                                    filterFormatted>CREATED DATE</TableHeaderColumn>

                                                <TableHeaderColumn dataField='any'
                                                    dataFormat={this.getCategoryName.bind(this)}>CATEGORY
                                                    NAME </TableHeaderColumn>

                                                <TableHeaderColumn dataField='name'> SUB - CATEGORY
                                                    NAME </TableHeaderColumn>

                                                <TableHeaderColumn
                                                    dataField='button'
                                                    dataFormat={this.cellButton.bind(this)}
                                                >ACTION</TableHeaderColumn>
                                            </BootstrapTable> : ''}
                                    </div>
                                    {/* -- Box body --*/}

                                    {/* Add /Edit Modal */}
                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{this.state.currentOperationStatus} {webConstants.MANAGE_SUBCATEGORY}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form name="faqForm" className="faqForm"
                                                onSubmit={this.onSubmit.bind(this)}>
                                                <div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
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

                                                <div className="col-md-6 col-sm-6 col-xs-6 no-padding-right">
                                                    <div className="form-group">
                                                        <label>Sub-category Name</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="subcategoryName"
                                                            placeholder="Sub-category Name"
                                                            ref="subcategoryName"
                                                            onChange={this.handleChange.bind(this, 'subcategoryName')}
                                                            value={this.state.fields['subcategoryName']} />
                                                        <span
                                                            className="error-message">{this.state.errors['subcategoryName']}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
                                                    <div className="form-group">
                                                        <label>Arabic Sub-category Name</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="arabicSubcategoryName"
                                                            placeholder="Arabic sub-category Name"
                                                            ref="arabicSubcategoryName"
                                                            onChange={this.handleChange.bind(this, 'arabicSubcategoryName')}
                                                            value={this.state.fields['arabicSubcategoryName']} />
                                                        <span
                                                            className="error-message">{this.state.errors['arabicSubcategoryName']}</span>
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


                                    {/* View Modal */}
                                    <Modal show={this.state.viewShow} onHide={this.handleClose} bsSize="large">
                                        <Modal.Header closeButton>
                                            <Modal.Title>View {webConstants.MANAGE_SUBCATEGORY}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="view-block">
                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Category Name</p>
                                                    <p className="item-value"> {this.state.selectedRowData.category}</p>
                                                </div>

                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Sub-Category Name</p>
                                                    <p className="item-value">{this.state.selectedRowData.subcategory}</p>
                                                </div>
                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Arabic Sub-Category Name</p>
                                                    <p className="item-value"> {this.state.selectedRowData.ar_name}</p>
                                                </div>
                                            </div>

                                            <div className="history-block">
                                                <h4 className="history-title">History</h4>

                                                <div className="history-table">
                                                    <BootstrapTable ref='table'
                                                        data={(this.props.SubCategoryReducer.subCategorySelectedHistoryData) ? this.props.SubCategoryReducer.subCategorySelectedHistoryData : []}
                                                        pagination={true}
                                                        options={historyOptions}
                                                        tableHeaderClass='my-header-class'
                                                        tableBodyClass='my-body-class'
                                                        containerClass='my-container-class'
                                                        tableContainerClass='my-table-container-class'
                                                        headerContainerClass='my-header-container-class'
                                                        bodyContainerClass='my-body-container-class'>
                                                        <TableHeaderColumn autoValue={true} dataField='_id' isKey={true}
                                                            hidden={true}>SUB - CATEGORY
                                                            ID</TableHeaderColumn>
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

export default SubCategoryManage;