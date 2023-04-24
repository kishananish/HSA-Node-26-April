// React Components
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert2'
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment';
import Pagination from "react-js-pagination";
import ReactDOM from "react-dom";
import padStart from "pad-start";

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import actionImage from '../../assets/img/actions.png';
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

// Const Files
import * as webConstants from "../../constants/WebConstants";
import Loader from "../Comman/Loader";
import * as msgConstants from "../../constants/MsgConstants";

let activeManageMenuPermissions;

class MaterialManage extends Component {
    constructor(props, context) {
        super(props, context);
        //console.log('Material props', props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

        this.state = {
            show: false,
            viewShow: false,
            fields: {
                name: '',
                price: '',
                category: '',
                subcategoryName: '',
                id: ''
            },
            errors: {},
            isButton: 'show',
            loading: false,
            manageLoading: false,
            selectedRow: {},
            currentOperationStatus: '',
            checkedId: [],
            selectedRowData: {},
            activePage: 1,
            perPageSize: webConstants.PER_PAGE_SIZE,
            wrapHeight: '500px'
        };
    }

    componentWillMount() {
        this.setWrapHeight();
        this.getMaterialList(this.state.activePage, this.state.perPageSize);
        let tableElement = ReactDOM.findDOMNode(this.refs.table);
        if (tableElement) {
            let tableHeight = tableElement.clientHeight;
            //console.log('table', tableHeight);
        }
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

    componentWillReceiveProps() {
        let tableElement = ReactDOM.findDOMNode(this.refs.table);
        if (tableElement) {
            let tableHeight = tableElement.clientHeight;
            //console.log('table', tableHeight);
        }
    }

    setUserPermissions() {
        let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0].access_level;
        let activeManageMenu = loginUserAllPermissions.find(menuRow => menuRow.name === 'Manage Material');
        activeManageMenuPermissions = activeManageMenu.actions;
        //console.log('Material Permissions' , activeManageMenuPermissions);
    }

    getMaterialList(activePage, PerPageSize) {
        this.setState({ manageLoading: true, currentRowIndex: '' });
        this.props.MaterialList(activePage, PerPageSize)
            .then(response => {
                const responseData = response.payload;
                //console.log(responseData);
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
                        webConstants.MANAGE_MATERIAL,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    handlePageChange(pageNumber) {
        this.setState({
            activePage: pageNumber,
        });
        this.getMaterialList(pageNumber, this.state.perPageSize);
    }


    /* Show Add /Edit modal and set data  */
    handleShow(currentOperation, editData) {
        console.log('--->', currentOperation, editData)

        let setEditData;
        let setStateData = {
            show: true,
            currentRowIndex: '',
            currentOperationStatus: currentOperation
        }
        if (editData) {
            setEditData = {
                // service_provider_name: editData.service_provider_id.first_name + ' ' + editData.service_provider_id.last_name,
                service_provider_name: editData.name,
                name: editData.name,
                price: editData.price,
                category: editData.material_category_id && editData.material_category_id._id,
                subcategoryName: editData.material_sub_category_id && editData.material_sub_category_id._id,
                id: editData._id
            };
        } else {
            setEditData = {
                service_provider_name: '',
                name: '',
                price: '',
                category: '',
                subcategoryName: '',
                id: ''
            };
        }
        console.log('111-->', setEditData)
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
        let value;
        value = e.target.value;
        fields[field] = value;
        this.setState({ fields });
        this.handleValidation();
        if (field === "category") {
            this.props.SubCategoryList(value)
        }
    }

    /* Set Validations for Form fields */
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        let amountExpression = /^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(.[0-9]{2})?$/;

        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Name is required";
        }

        if (!fields["price"]) {
            formIsValid = false;
            errors["price"] = "Price is required";
        }

        let isAmount = amountExpression.test(fields["price"]);
        if (!isAmount) {
            formIsValid = false;
            errors["price"] = "Price should be valid";
        }
        if (!fields['category']) {
            formIsValid = false;
            errors["category"] = "Category is required";
        }
        if (!fields['subcategoryName']) {
            formIsValid = false;
            errors["subcategoryName"] = "Sub category is required";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }


    /* Save and Edit Functions */
    onSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.setState({ loading: true, isButton: 'hidden' });
            let materialParams = {
                name: this.state.fields.name,
                price: this.state.fields.price,
                material_category_id: this.state.fields.category,
                material_sub_category_id: this.state.fields.subcategoryName
            }
            if (!this.state.fields.id) {
                this.props.MaterialSave(materialParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    loading: false,
                                    isButton: 'show',
                                    fields: {
                                        name: '',
                                        price: '',
                                        category: '',
                                        subcategoryName: '',
                                        id: ''
                                    }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_MATERIAL,
                                    msgConstants.ON_SAVE,
                                    'success'
                                );
                                this.getMaterialList(this.state.activePage, this.state.perPageSize);
                            } else if (responseData.statusCode === 409) {
                                this.setState({
                                    loading: false,
                                    isButton: 'show',
                                });
                                swal(
                                    webConstants.MANAGE_MATERIAL,
                                    responseData.message,
                                    'error'
                                );
                            }
                        }
                    })
                    .catch((error) => {
                        if (error.response !== undefined) {
                            this.setState({
                                loading: false,
                                isButton: 'show',
                            });
                            swal(
                                webConstants.MANAGE_MATERIAL,
                                error.response.data.message,
                                'error'
                            );
                        }
                    });
            } else {
                // Edit PromoCode
                this.props.MaterialUpdate(this.state.fields.id, materialParams)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    loading: false,
                                    isButton: 'show',
                                    fields: {
                                        name: '',
                                        price: '',
                                        category: '',
                                        subcategoryName: '',
                                        id: ''
                                    }
                                });
                                this.handleClose();
                                swal(
                                    webConstants.MANAGE_MATERIAL,
                                    msgConstants.ON_UPDATE,
                                    'success'
                                );
                                this.getMaterialList(this.state.activePage, this.state.perPageSize);
                            } else if (responseData.statusCode === 409) {
                                this.setState({
                                    loading: false,
                                    isButton: 'show',
                                });
                                swal(
                                    webConstants.MANAGE_MATERIAL,
                                    responseData.message,
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
                                isButton: 'show',
                            });
                            swal(
                                webConstants.MANAGE_MATERIAL,
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
                this.props.MaterialRemove(selectedRow._id)
                    .then(response => {
                        const responseData = response.payload;
                        if (responseData.status === 200) {
                            if (responseData.data.status === "success") {
                                this.setState({
                                    manageLoading: false,
                                });
                                swal(
                                    webConstants.MANAGE_MATERIAL,
                                    msgConstants.ON_DELETED,
                                    'success'
                                )
                                this.getMaterialList(this.state.activePage, this.state.perPageSize);
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
                                webConstants.MANAGE_MATERIAL,
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
        this.setState({
            selectedRow: row,
            manageLoading: true,
            selectedRowData: { serviceProviderName: row.service_provider_id ? row.service_provider_id.first_name + ' ' + row.service_provider_id.last_name : '' }
        });

        /* To do history API */
        this.props.MaterialHistory(row._id)
            .then(response => {
                const responseData = response.payload;
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.viewModalShow();
                    }
                }
            })
            .catch((error) => {
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.MANAGE_MATERIAL,
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
                        this.props.MaterialDeleteAll(selectIds)
                            .then(response => {
                                const responseData = response.payload;
                                if (responseData.status === 200) {
                                    if (responseData.data.status === "success") {
                                        this.setState({
                                            manageLoading: false,
                                        });
                                        swal(
                                            webConstants.MANAGE_MATERIAL,
                                            msgConstants.ON_DELETED,
                                            'success'
                                        )
                                        this.getMaterialList(this.state.activePage, this.state.perPageSize);
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
                                        webConstants.MANAGE_MATERIAL,
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
                    webConstants.MANAGE_MATERIAL,
                    msgConstants.NO_RECORDS,
                    'warning'
                )
            }
        } else {
            swal(
                webConstants.MANAGE_MATERIAL,
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
                <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <img src={actionImage} alt="Action" />
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

    nameFormat(cell) {
        return (cell) ? <span> {cell.first_name} {cell.last_name} </span> : ''
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
            <p className="item-label"> Material Name </p>
            <p className="item-value">{row.prevObj.name}</p>
            <hr className="view-divider" />
            <p className="item-label"> Material Price </p>
            <p className="item-value">{row.prevObj.price}</p>
            <hr className="view-divider" />
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
                    <button onClick={() => {
                        this.handleShow('New')
                    }} className="btn btn-success link-add-new green-button"> NEW
                    </button>
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
                                                <h3 className="manage-page-title">Manage {webConstants.MANAGE_MATERIAL} </h3>
                                            </div>}
                                    </div>


                                    <div className="box-body promocode-tbl custom-pagination no-data-found">
                                        {(!this.state.manageLoading) ?
                                            <div>
                                                <BootstrapTable ref='table'
                                                    data={(this.props.MaterialReducer.materialData.result) ? this.props.MaterialReducer.materialData.result : []}
                                                    selectRow={selectRowProp}
                                                    pagination={false}
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
                                                        hidden={true}>MATERIAL ID</TableHeaderColumn>

                                                    <TableHeaderColumn dataField="any"
                                                        dataFormat={this.indexN.bind(this)}>MATERIAL
                                                        ID</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='created_at'
                                                        dataFormat={this.dateFormatter.bind(this)}
                                                        filterValue={this.filterType.bind(this)}
                                                        filterFormatted>CREATED DATE</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='name'>MATERIAL NAME</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='price'>MATERIAL PRICE</TableHeaderColumn>

                                                    <TableHeaderColumn dataField='service_provider_id'
                                                        dataFormat={this.nameFormat.bind(this)}>ADDED BY</TableHeaderColumn>

                                                    <TableHeaderColumn
                                                        dataField='button'
                                                        dataFormat={this.cellButton.bind(this)}
                                                    >ACTION</TableHeaderColumn>
                                                </BootstrapTable>
                                                <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                                                    totalItemsCount={(this.props.MaterialReducer.materialData.total) ? this.props.MaterialReducer.materialData.total : 0}
                                                    pageRangeDisplayed={(this.props.MaterialReducer.materialData.pages) ? this.props.MaterialReducer.materialData.pages : 0}
                                                    onChange={this.handlePageChange}
                                                    prevPageText="Previous"
                                                    nextPageText="Next"
                                                />
                                            </div> : ''}
                                    </div>
                                    {/* -- Box body --*/}

                                    {/* Add /Edit PromoCode Modal */}
                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{this.state.currentOperationStatus} {webConstants.MANAGE_MATERIAL}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form name="faqForm" className="faqForm"
                                                onSubmit={this.onSubmit.bind(this)}>
                                                <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                                    <div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
                                                        <div className="form-group">
                                                            <label>Material Name</label>
                                                            <input type="text"
                                                                className="form-control"
                                                                id="name"
                                                                placeholder="Material Name"
                                                                ref="name"
                                                                onChange={this.handleChange.bind(this, 'name')}
                                                                value={this.state.fields['name']} />
                                                            <span
                                                                className="error-message">{this.state.errors['name']}</span>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 col-sm-6 col-xs-6 no-padding-right">
                                                        <div className="form-group">
                                                            <label> Material Price </label>
                                                            <input type="number"
                                                                className="form-control"
                                                                id="price"
                                                                placeholder="Material Price"
                                                                ref="price"
                                                                onChange={this.handleChange.bind(this, 'price')}
                                                                value={this.state.fields['price']} />
                                                            <span
                                                                className="error-message">{this.state.errors['price']}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                                    {/* <div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
                                                        <div className="form-group">
                                                            <label>Service Provider Name (Added By )</label>
                                                            <p>{this.state.fields['service_provider_name']}</p>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
                                                        <div className="form-group">
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
                                                    </div>

                                                    <div className="col-md-6 col-sm-6 col-xs-6 no-padding-right">
                                                        <div className="form-group">
                                                            <label>Sub-category Name</label>
                                                            <select className="form-control"
                                                                id="subcategoryName"
                                                                ref="subcategoryName"
                                                                onChange={this.handleChange.bind(this, 'subcategoryName')}
                                                                value={this.state.fields['subcategoryName']}
                                                            >
                                                                <option value="">Sub-category Name</option>
                                                                {
                                                                    this.props.MaterialReducer.SubCategoryList && (this.props.MaterialReducer.SubCategoryList).map((categoryRow, index) => {
                                                                        return (
                                                                            <option key={index}
                                                                                value={categoryRow._id}>{categoryRow.name}
                                                                            </option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                            <span
                                                                className="error-message">{this.state.errors['subcategoryName']}</span>
                                                        </div>
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
                                                            className="green-button"> {webConstants.SUBMIT_BUTTON_TEXT}
                                                        </button>
                                                    </div>
                                                </Modal.Footer>
                                            </form>
                                        </Modal.Body>
                                    </Modal>


                                    {/* Add /Edit PromoCode Modal */}
                                    <Modal show={this.state.viewShow} onHide={this.handleClose} bsSize="large">
                                        <Modal.Header closeButton>
                                            <Modal.Title>View {webConstants.MANAGE_MATERIAL}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="view-block col-md-12 col-lg-12 no-padding">
                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Material Name</p>
                                                    <p className="item-value">{this.state.selectedRow.name}</p>
                                                </div>

                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Material Price</p>
                                                    <p className="item-value">{this.state.selectedRow.price}</p>
                                                </div>
                                            </div>

                                            <div className="view-block col-md-12 col-lg-12 no-padding">
                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Category Name</p>
                                                    <p className="item-value">{this.state.selectedRow.material_category_id && this.state.selectedRow.material_category_id.name}</p>
                                                </div>

                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Sub Category Name</p>
                                                    <p className="item-value">{this.state.selectedRow.material_sub_category_id && this.state.selectedRow.material_sub_category_id.name}</p>
                                                </div>
                                            </div>

                                            <div className="view-block col-md-12 col-lg-12 no-padding">
                                                <div className="item-view col-md-6 col-lg-6">
                                                    <p className="item-label">Service Provider Name (Added By)</p>
                                                    <p className="item-value">{this.state.selectedRowData.serviceProviderName}</p>
                                                </div>
                                            </div>

                                            <div className="history-block">
                                                <h4 className="history-title">History</h4>
                                                <div className="history-table">
                                                    {<BootstrapTable ref='table'
                                                        data={(this.props.MaterialReducer.materialHistoryData) ? this.props.MaterialReducer.materialHistoryData : []}
                                                        pagination={true}
                                                        options={historyOptions}
                                                        tableHeaderClass='my-header-class'
                                                        tableBodyClass='my-body-class'
                                                        containerClass='my-container-class'
                                                        tableContainerClass='my-table-container-class'
                                                        headerContainerClass='my-header-container-class'
                                                        bodyContainerClass='my-body-container-class'>
                                                        <TableHeaderColumn autoValue={true}
                                                            dataField='_id'
                                                            isKey={true}
                                                            hidden={true}>Promo Code
                                                            Id</TableHeaderColumn>

                                                        <TableHeaderColumn dataField='operation_date'
                                                            dataFormat={this.dateFormatter.bind(this)}>DATE</TableHeaderColumn>

                                                        <TableHeaderColumn dataField='operation_date'
                                                            dataFormat={this.historyTimeFormatter.bind(this)}>TIME</TableHeaderColumn>

                                                        <TableHeaderColumn dataField="link"
                                                            dataFormat={this.historyUsernameFormat}>CHANGES DONE BY </TableHeaderColumn>

                                                        <TableHeaderColumn dataField='link'
                                                            dataFormat={this.historyChangesDone}> CHANGES
                                                            DONE </TableHeaderColumn>
                                                    </BootstrapTable>}
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

export default MaterialManage;