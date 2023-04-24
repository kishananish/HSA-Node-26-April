// Components/Containers
import React, { Component } from 'react';
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import Loader from '../Comman/Loader';

// css, images
import '../../assets/css/manage.css';
import actionImage from '../../assets/img/actions.png';

// data & constants
import * as webConstants from '../../constants/WebConstants';
import * as msgConstants from '../../constants/MsgConstants';
import * as serviceRequestStepData from '../../data/_serviceRequestSteps';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';

// React Components
import {
  BootstrapTable,
  TableHeaderColumn,
  ButtonGroup
} from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert2';
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import Pagination from 'react-js-pagination';
import ReactDOM from 'react-dom';
import padStart from 'pad-start';
import StarRatingComponent from 'react-star-rating-component';
import fileUploadImg from '../../assets/img/file-upload.png';

let activeManageMenuPermissions;
let filterProgressListData = [];

class ServiceRequestManage extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
    this.quotehandleClose = this.quotehandleClose.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = {
      viewShow: false,
      viewHistoryShow: false,
      viewPaymentShow: false,
      viewQuoteShow: false,
      manageLoading: false,
      selectedRow: {},
      selectedViewData: {},
      activePage: 1,
      perPageSize: webConstants.PER_PAGE_SIZE,
      wrapHeight: '500px',
      filterProgressListData: [],
      fields: { amountPaid: '', id: '' },
      errors: {},
      selectedPaymentData: {},
      quoteDetailsView: {}
    };
  }

  componentWillMount() {
    this.getServiceRequestList(this.state.activePage, this.state.perPageSize);
    this.setWrapHeight();
    this.setUserPermissions();
  }

  componentDidMount() {
    this.setWrapHeight();
  }

  /* Height Wrap with content-wrapper */
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
    let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0]
      .access_level;
    let activeManageMenu = loginUserAllPermissions.find(
      menuRow => menuRow.name === 'Manage Service Request'
    );
    activeManageMenuPermissions = activeManageMenu.actions;
    //console.log('servcice Request Permissions' , activeManageMenuPermissions);
  }

  /* Get List Data with Pagination details - API Integration */
  getServiceRequestList(activePage, PerPageSize) {
    this.setState({ manageLoading: true, currentRowIndex: '' });
    this.props
      .ServiceRequestList(activePage, PerPageSize)
      .then(response => {
        const responseData = response.payload;
        if (responseData.status === 200) {
          if (responseData.data.status === 'success') {
            this.setState({
              manageLoading: false
            });
          }
        }
      })
      .catch(error => {
        //console.log(error);
        if (error.response !== undefined) {
          this.setState({
            manageLoading: false
          });
          swal(
            webConstants.MANAGE_SERVICE_REQUEST,
            error.response.data.message,
            'error'
          );
        }
      });
  }

  /* List Pagination - On change of Page Number */
  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber
    });
    this.getServiceRequestList(pageNumber, this.state.perPageSize);
  }

  /* Open View Details Modal */
  viewModalShow() {
    this.setState({ viewShow: true, currentRowIndex: '' });
  }

  historyModalShow() {
    this.setState({ viewHistoryShow: true, currentRowIndex: '' });
  }

  paymentModalShow() {
    this.setState({ viewPaymentShow: true, currentRowIndex: '' });
  }

  viewQuoteDetailsModalShow() {
    this.setState({ viewQuoteShow: true, currentRowIndex: '' });
  }
  quotehandleClose() {
    this.setState({ viewQuoteShow: false });
  }

  /* Close Modal */
  handleClose() {
    this.setState({
      viewShow: false,
      viewHistoryShow: false,
      manageLoading: false,
      viewPaymentShow: false
    });
  }

  /* Delete by Selected Id - API Integration */
  onDelete = selectedRow => {
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
    }).then(result => {
      if (result.value) {
        this.setState({
          manageLoading: true
        });
        this.props
          .ServiceRequestRemove(selectedRow._id)
          .then(response => {
            const responseData = response.payload;
            if (responseData.status === 200) {
              if (responseData.data.status === 'success') {
                this.setState({
                  manageLoading: false
                });
                swal(
                  webConstants.MANAGE_SERVICE_REQUEST,
                  msgConstants.ON_DELETED,
                  'success'
                );
                this.getServiceRequestList(
                  this.state.activePage,
                  this.state.perPageSize
                );
              }
            }
          })
          .catch(error => {
            //console.log(error);
            //console.log(JSON.stringify(error));
            if (error.response !== undefined) {
              this.setState({
                manageLoading: false
              });
              swal(
                webConstants.MANAGE_SERVICE_REQUEST,
                error.response.data.message,
                'error'
              );
            }
          });
      } else {
        //console.log('cancel');
      }
    });
  };

  /* View by Selected Id - On Row Selection */
  onView(row) {
    // console.log('row -->', row.progress);
    this.setState({
      selectedRow: row
    });
    // console.log('RowData--->', row);
    let paymentDetails = '';
    let selectedProgressData = serviceRequestStepData.serviceRequestSteps.find(
      requestProgress => requestProgress.progress == row.progress
    );

    let serviceProviderName = '-';
    if (row.service_provider_id) {
      serviceProviderName =
        row.service_provider_id.first_name +
        ' ' +
        row.service_provider_id.last_name;
    }
    let reviewComment = '';
    let reviewRating = 0;
    if (row.review_id) {
      reviewComment = row.review_id.service_provider_comment;
      reviewRating = row.review_id.service_provider_rating;
    }

    let quoteDetails = '';
    let serviceCost = 0;
    let serviceComment = '';
    let totalMaterialCost = 0;
    let totalMaterialQuantity = 0;
    if (row.quote.length > 0) {
      quoteDetails = row.quote;
      serviceCost = row.service_cost;
      serviceComment = row.comment;
    }
    let filterProgressListData = this.getProgressData(row.progress);
    // console.log('this.getProgressData(row.progress) >>>', this.getProgressData(row.progress));
    let totalCost = 0;
    let totalAmountPaid = 0;
    let totalAmountPending = 0;
    paymentDetails = row.payment_id;
    let paymentDate = '';
    let paymentMode = '';
    if (paymentDetails != undefined) {
      totalCost = paymentDetails.total_cost;
      totalAmountPaid = paymentDetails.total_amount_paid;
      totalAmountPending = paymentDetails.total_amount_pending;
      paymentDate = paymentDetails.created_at;
      paymentMode = paymentDetails.payment_mode;
    }
    this.setState({
      selectedViewData: {
        firstName: row.customer_id.first_name,
        lastName: row.customer_id.last_name,
        email: row.customer_id.email,
        mobileNo: row.customer_id.mobile_no ? row.customer_id.mobile_no : 'NA',
        // addressLine: row.address.address,
        addressLine: row.address
          ? row.address.address
          : 'NA',
        // city: row.address.city,
        city: row.address
          ? row.address.city
          : 'NA',
        // zipcode: row.address.zipcode,
        zipcode: row.address
          ? row.address.zipcode
          : 'NA',
        serviceProviderName: serviceProviderName,
        progress: row.progress,
        progressId: selectedProgressData ? selectedProgressData.id : 'NA',
        reviewComment: reviewComment,
        reviewRating: reviewRating,
        quote: row.quote,
        quoteDetails: {
          data: quoteDetails,
          serviceCost: serviceCost,
          serviceComment: serviceComment
        },
        description: row.description,
        paymentDetails: paymentDetails,
        totalCost: totalCost,
        totalAmountPaid: totalAmountPaid,
        totalAmountPending: totalAmountPending,
        paymentDate: paymentDate,
        paymentMode: paymentMode,
        complaintRaised: row.user_complain,
        complaintResolution: row.complain_resolution
      },
      filterProgressListData: filterProgressListData
    });
    this.viewModalShow();
  }

  onQuoteDetails(quoteDetails) {
    //console.log(quoteDetails.data);
    let i;
    let materialCost = 0;
    let totalCost = 0;
    for (i = 0; i < quoteDetails.data.length; i++) {
      materialCost =
        parseInt(materialCost) + parseInt(quoteDetails.data[i].cost);
    }
    totalCost = parseInt(quoteDetails.serviceCost) + parseInt(materialCost);
    this.setState({
      quoteDetailsView: {
        data: quoteDetails.data,
        serviceCost: quoteDetails.serviceCost,
        serviceComment: quoteDetails.serviceComment,
        totalMaterialCost: materialCost,
        totalCost: totalCost
      }
    });
    this.viewQuoteDetailsModalShow();
  }

  getProgressData(currentProgress) {
    let testData = [];
    let tempProgressArray = [
      'accepted',
      'rejected',
      'quote_accepted',
      'quote_rejected'
    ];

    let isProgressAvailable = tempProgressArray.includes(currentProgress);
    if (isProgressAvailable) {
      if (currentProgress === 'accepted') {
        testData = serviceRequestStepData.serviceRequestSteps.filter(function (
          selectedProgress
        ) {
          return selectedProgress.progress !== 'rejected';
        });
      } else if (currentProgress === 'rejected') {
        testData = serviceRequestStepData.serviceRequestSteps.filter(function (
          selectedProgress
        ) {
          return selectedProgress.progress !== 'accepted';
        });
      } else if (currentProgress === 'quote_accepted') {
        testData = serviceRequestStepData.serviceRequestSteps.filter(function (
          selectedProgress
        ) {
          return selectedProgress.progress !== 'quote_rejected';
        });
      } else if (currentProgress === 'quote_rejected') {
        testData = serviceRequestStepData.serviceRequestSteps.filter(function (
          selectedProgress
        ) {
          return selectedProgress.progress !== 'quote_accepted';
        });
      }
    } else {
      testData = serviceRequestStepData.serviceRequestSteps.filter(function (
        selectedProgress
      ) {
        return (
          selectedProgress.progress !== 'quote_rejected' &&
          selectedProgress.progress !== 'rejected'
        );
      });
    }
    return testData;
  }

  onHistoryShow(row) {
    this.setState({
      selectedRow: row,
      manageLoading: true
    });
    /* To do history API */
    this.props
      .ServiceRequestHistory(row._id)
      .then(response => {
        const responseData = response.payload;
        if (responseData.status === 200) {
          if (responseData.data.status === 'success') {
            this.historyModalShow();
          }
        }
      })
      .catch(error => {
        //console.log(error);
        //console.log(JSON.stringify(error));
        if (error.response !== undefined) {
          this.setState({
            manageLoading: false
          });
          swal(
            webConstants.MANAGE_SERVICE_REQUEST,
            error.response.data.message,
            'error'
          );
        }
      });
  }

  onPayment(row) {
    this.setState({
      selectedPaymentData: {
        serviceId: row._id,
        paymentId: row.payment_id,
        totalCost: row.payment_id.total_cost,
        totalAmountPaid: row.payment_id.total_amount_paid,
        totalAmountPending: row.payment_id.total_amount_pending
      },
      fields: { amountPaid: row.payment_id.total_amount_paid },
      manageLoading: true
    });
    this.paymentModalShow();
  }

  /* To Set Fields and data for Validation */
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
    this.handleValidation();
  }

  /* To set validations of Form Fields */
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields['amountPaid']) {
      formIsValid = false;
      errors['amountPaid'] = 'Deposite Amount is required';
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  onPaymentSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ loading: true, isButton: 'none' });
      let paymentParams = {
        service_id: this.state.selectedPaymentData.serviceId,
        payment_id: this.state.selectedPaymentData.paymentId._id,
        deposit_amount: this.state.fields.amountPaid
      };
      //console.log(paymentParams);
      this.props
        .ServiceRequestPaymentDeposit(paymentParams)
        .then(response => {
          const responseData = response.payload;
          if (responseData.status === 200) {
            if (responseData.data.status === 'success') {
              this.setState({
                loading: false,
                isButton: 'block',
                fields: { amountPaid: '', id: '' }
              });
              this.handleClose();
              swal(
                webConstants.MANAGE_SERVICE_REQUEST,
                msgConstants.SUBMIT_SUCCESS,
                'success'
              );
              this.getServiceRequestList(
                this.state.activePage,
                this.state.perPageSize
              );
            }
          }
        })
        .catch(error => {
          if (error.response !== undefined) {
            this.setState({
              loading: false,
              isButton: 'block'
            });
            swal(
              webConstants.MANAGE_SERVICE_REQUEST,
              error.response.data.message,
              'error'
            );
          }
        });
    }
  }

  /* On Row selected - Manage list */
  onRowSelect(row, isSelected, e) {
    /*//console.log('row',e);*/
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
        }).then(result => {
          if (result.value) {
            this.setState({
              manageLoading: true
            });
            this.props
              .ServiceRequestDeleteAll(selectIds)
              .then(response => {
                const responseData = response.payload;
                if (responseData.status === 200) {
                  if (responseData.data.status === 'success') {
                    this.setState({
                      manageLoading: false
                    });
                    swal(
                      webConstants.MANAGE_SERVICE_REQUEST,
                      msgConstants.ON_DELETED,
                      'success'
                    );
                    this.getServiceRequestList(
                      this.state.activePage,
                      this.state.perPageSize
                    );
                  }
                }
              })
              .catch(error => {
                //console.log(error);
                //console.log(JSON.stringify(error));
                if (error.response !== undefined) {
                  this.setState({
                    manageLoading: false
                  });
                  swal(
                    webConstants.MANAGE_SERVICE_REQUEST,
                    error.response.data.message,
                    'error'
                  );
                }
              });
          } else {
            //console.log('cancel');
          }
        });
      } else {
        swal(
          webConstants.MANAGE_SERVICE_REQUEST,
          msgConstants.NO_RECORDS,
          'warning'
        );
      }
    } else {
      swal(webConstants.MANAGE_SERVICE_REQUEST, msgConstants.ERROR, 'error');
      this.forceUpdate();
    }
  }

  /* Manage table - set Action List */
  cellButton(cell, row, enumObject, rowIndex) {
    return (
      <div className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <img src={actionImage} />
        </a>
        <ul className="action_dropdown dropdown-menu">
          <li className="without_link close-actions">
            <i className="fa fa-times-circle" aria-hidden="true" />
          </li>
          {activeManageMenuPermissions.view === true ? (
            <li onClick={() => this.onView(row)} className="with_link">
              <a href="" data-toggle="control-sidebar">
                <i className="fa fa-eye" aria-hidden="true" /> View{' '}
              </a>
            </li>
          ) : (
              ''
            )}

          {activeManageMenuPermissions.edit === true ? (
            <li className="without_link" onClick={() => this.onEdit(row)}>
              <i className="fa fa-pencil" aria-hidden="true" /> Edit
            </li>
          ) : (
              ''
            )}

          {activeManageMenuPermissions.delete === true ? (
            <li onClick={() => this.onDelete(row)} className="without_link">
              <i className="fa fa-trash-o" aria-hidden="true" /> Delete
            </li>
          ) : (
              ''
            )}

          {activeManageMenuPermissions.view === true ? (
            <li
              onClick={() => this.onHistoryShow(row)}
              className="without_link"
            >
              <i className="fa fa-history" aria-hidden="true" /> History
            </li>
          ) : (
              ''
            )}

          {row.payment_id ? (
            activeManageMenuPermissions.payment === true ? (
              <li onClick={() => this.onPayment(row)} className="without_link">
                <i className="fa fa-rupee" aria-hidden="true" /> Payment
              </li>
            ) : (
                ''
              )
          ) : (
              ''
            )}
        </ul>
      </div>
    );
  }

  onClickProductSelected(cell, row, rowIndex, enumObject) {
    this.setState({
      currentRowIndex: rowIndex
    });
  }

  onEdit(row) {
    this.props.history.push({
      pathname: menuLinkConstants.SERVICE_REQUEST_ADD_LINK,
      id: row._id
    });
  }

  /* Set index/ id for column */
  indexN(cell, row, enumObject, index) {
    return `${webConstants.INDEX_ID + padStart(index + 1, 4, '0')}`;
  }

  filterType(cell, row) {
    // just return type for filtering or searching.
    //console.log('type', cell.type);
    return cell.type;
  }

  /* Set Date format - for date column */
  dateFormatter(cell) {
    if (!cell) {
      return '';
    }
    return `${
      moment(cell).format('DD-MMM-YYYY')
        ? moment(cell).format('DD-MMM-YYYY')
        : moment(cell).format('DD-MMM-YYYY')
      }`;
  }

  customerName(cell) {
    if (!cell) {
      return '';
    }
    return cell.first_name + ' ' + cell.last_name;
  }

  customerEmail(cell) {
    if (!cell) {
      return '';
    }
    return cell.email;
  }

  categoryName(cell) {
    if (!cell) {
      return '';
    }
    return cell.name;
  }

  subcategoryName(cell) {
    if (!cell) {
      return '';
    }
    return cell.name;
  }

  taskStatus(cell, row) {
    if (!cell) {
      return '';
    } else {
      //old code
      // let currentDate = moment(new Date());
      // let updatedDate = moment(row.progress_at);
      // let minuteDifference = currentDate.diff(updatedDate, 'minutes');      
      // let statusColor;
      // if (minuteDifference <= 30) {
      //   statusColor = 'green';
      // } else if (30 < minuteDifference && minuteDifference < 45) {
      //   statusColor = 'orange';
      // } else if (minuteDifference >= 45) {
      //   statusColor = 'red';
      // }

      //new code
      let statusColor;
      if (row.progress === 'journey_cancelled') {
        statusColor = 'red';
      } else {
        statusColor = 'green';
      }
      let requestProgressData = serviceRequestStepData.serviceRequestSteps.find(
        requestProgress => requestProgress.progress == cell
      );
      console.log(requestProgressData,'<><>',cell)
      return (
        <div
          style={{
            backgroundColor: statusColor,
            padding: '5px',
            color: 'white',
            fontSize: '13px'
          }}
        >
          {requestProgressData && requestProgressData.title}{' '}
          <p className="status-date">
            {moment(row.updated_at).format('DD-MMM-YYYY')
              ? moment(row.updated_at).format('DD-MMM-YYYY')
              : moment(row.updated_at).format('DD-MMM-YYYY')}
          </p>
        </div>
      );
    }
  }

  historyTimeFormatter(cell) {
    if (!cell) {
      return '';
    }
    return <Moment format="DD-MMM-YYYY HH:MM A">{cell}</Moment>;
  }

  historyUsernameFormat(cell, row) {
    return row.operator ? (
      <span>
        {' '}
        {row.operator.first_name} {row.operator.last_name}{' '}
      </span>
    ) : (
        ''
      );
  }

  historyChangesDone(cell, row) {
    return row.prevObj ? (
      <div className="item-view" style={{ width: '100%' }}>
        <p>
          <span className="item-label"> Customer Name </span> :{' '}
          <span className="item-value">
            {row.prevObj.customer_id.first_name}{' '}
            {row.prevObj.customer_id.last_name}
          </span>
        </p>
        <p>
          <span className="item-label"> Address </span> :{' '}
          <span className="item-value">{row.prevObj.address.address}</span>
        </p>
        <p>
          <span className="item-label"> City </span> :{' '}
          <span className="item-value">{row.prevObj.address.city}</span>
        </p>
        <p>
          <span className="item-label"> Zipcode </span> :{' '}
          <span className="item-value">{row.prevObj.address.zipcode}</span>
        </p>
      </div>
    ) : (
        <span className="item-label"> No Changes </span>
      );
  }

  /* Set Search bar */
  customSearchbar = props => {
    return (
      <div className="search-wrapper">
        {props.components.btnGroup}
        {props.components.searchPanel}
      </div>
    );
  };

  /* Set Add New button */
  customToolbarButtons = props => {
    return (
      <ButtonGroup
        className="my-custom-class pull-right"
        sizeClass="btn-group-md"
      >
        {activeManageMenuPermissions.delete === true ? (
          <i
            className="fa fa-trash link-remove-all"
            aria-hidden="true"
            title="Delete All"
            onClick={this.handleDropBtnClick.bind(this)}
          />
        ) : (
            ''
          )}
      </ButtonGroup>
    );
  };

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
      hideSizePerPage: true
    };

    const historyOptions = {
      prePage: 'Previous',
      nextPage: 'Next',
      paginationPosition: 'bottom',
      hideSizePerPage: true,
      sizePerPage: 2,
      width: '100%'
    };
    console.log('state :', this.state);
    return (
      <div>
        <HeaderContainer />
        <SidebarContainer />
        <div
          className="content-wrapper"
          ref="bodyContent"
          style={{ minHeight: this.state.wrapHeight }}
        >
          <section className="content-header">
            <div className="row">
              <div className="col-md-12">
                <div className="customer-box">
                  <div className="">
                    {this.state.manageLoading ? <Loader /> : ''}
                  </div>

                  <div className="box-header with-border">
                    {this.state.manageLoading ? (
                      ''
                    ) : (
                        <div className="col-lg-12 no-padding">
                          <h3 className="manage-page-title">
                            Manage {webConstants.MANAGE_SERVICE_REQUEST}{' '}
                          </h3>
                        </div>
                      )}
                  </div>

                  <div className="box-body service-request-tbl custom-pagination no-data-found">
                    {!this.state.manageLoading ? (
                      <div>
                        <BootstrapTable
                          ref="table"
                          data={
                            this.props.ServiceRequestReducer.serviceRequestData
                              .result
                              ? this.props.ServiceRequestReducer
                                .serviceRequestData.result
                              : []
                          }
                          selectRow={selectRowProp}
                          pagination={false}
                          search={true}
                          searchPlaceholder={'Search here'}
                          options={options}
                          tableHeaderClass="my-header-class"
                          tableBodyClass="my-body-class"
                          containerClass="my-container-class"
                          tableContainerClass="my-table-container-class"
                          headerContainerClass="my-header-container-class"
                          bodyContainerClass="my-body-container-class"
                        >
                          <TableHeaderColumn
                            autoValue={true}
                            dataField="_id"
                            isKey={true}
                            hidden={true}
                          >
                            SERVICE REQUEST ID
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="_id"
                            dataFormat={this.indexN.bind(this)}
                            filterValue={this.filterType.bind(this)}
                          >
                            SERVICE REQUEST ID
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="created_at"
                            dataFormat={this.dateFormatter.bind(this)}
                            filterValue={this.filterType.bind(this)}
                            filterFormatted
                          >
                            CREATED DATE
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="customer_id"
                            dataFormat={this.customerName.bind(this)}
                            filterFormatted
                          >
                            CUSTOMER NAME
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="description"
                            filterFormatted
                          >
                            REQUEST DESCRIPTION
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="progress"
                            dataFormat={this.taskStatus.bind(this)}
                            filterFormatted
                          >
                            STATUS OF TASK
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="category_id"
                            dataFormat={this.categoryName.bind(this)}
                            filterFormatted
                          >
                            CATEGORY
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="sub_category_id"
                            dataFormat={this.subcategoryName.bind(this)}
                            filterFormatted
                          >
                            SUB-CATEGORY
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="button"
                            dataFormat={this.cellButton.bind(this)}
                          >
                            ACTION
                          </TableHeaderColumn>
                        </BootstrapTable>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                          totalItemsCount={
                            this.props.ServiceRequestReducer.serviceRequestData
                              .total
                              ? this.props.ServiceRequestReducer
                                .serviceRequestData.total
                              : 0
                          }
                          pageRangeDisplayed={
                            this.props.ServiceRequestReducer.serviceRequestData
                              .pages
                              ? this.props.ServiceRequestReducer
                                .serviceRequestData.pages
                              : 0
                          }
                          onChange={this.handlePageChange}
                          prevPageText={webConstants.PREVIOUS_PAGE}
                          nextPageText={webConstants.NEXT_PAGE}
                        />
                      </div>
                    ) : (
                        ''
                      )}
                  </div>
                  {/* -- Box body --*/}

                  {/* View Modal */}
                  <div className="service-provider-view-modal">
                    <Modal
                      show={this.state.viewShow}
                      onHide={this.handleClose}
                      bsSize="large"
                      className="service-provider-view-modal"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          View {webConstants.MANAGE_SERVICE_REQUEST}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="service-provider-view-content">
                          <div className="view-block col-md-12 col-lg-12 no-padding">
                            <div className="form-sub-heading">
                              Customer Details
                            </div>
                            <div className="item-view col-md-3 col-lg-3">
                              <p className="item-label">First Name </p>
                              <p className="item-value">
                                {this.state.selectedViewData.firstName}
                              </p>
                            </div>

                            <div className="item-view col-md-3 col-lg-3">
                              <p className="item-label">Last Name</p>
                              <p className="item-value">
                                {this.state.selectedViewData.lastName}
                              </p>
                            </div>

                            <div className="item-view col-md-3 col-lg-3">
                              <p className="item-label">Email ID</p>
                              <p className="item-value">
                                {this.state.selectedViewData.email}
                              </p>
                            </div>

                            <div className="item-view col-md-3 col-lg-3">
                              <p className="item-label">Phone No</p>
                              <p className="item-value">
                                {this.state.selectedViewData.mobileNo}
                              </p>
                            </div>
                          </div>
                          <div className="view-block col-md-12 col-lg-12 no-padding">
                            <div className="item-view col-md-3 col-lg-3">
                              <p className="item-label">Address </p>
                              <p className="item-value">
                                {this.state.selectedViewData.addressLine}
                              </p>
                            </div>

                            <div className="item-view col-md-3 col-lg-3">
                              <p className="item-label">Zip Code</p>
                              <p className="item-value">
                                {this.state.selectedViewData.zipcode}
                              </p>
                            </div>
                            <div className="item-view col-md-6 col-lg-6">
                              <p className="item-label">City</p>
                              <p className="item-value">
                                {this.state.selectedViewData.city}
                              </p>
                            </div>
                          </div>

                          <div className="view-block col-md-12 col-lg-12 no-padding">
                            <div className="item-view col-md-12 col-lg-12">
                              <p className="item-label">Service Provider </p>
                              <p className="item-value">
                                {
                                  this.state.selectedViewData
                                    .serviceProviderName
                                }
                              </p>
                            </div>
                          </div>

                          <div className="row no-margin no-padding">
                            <div className="section-wrapper">
                              <div className="form-sub-heading">
                                Service Details
                              </div>

                              <div className="row">
                                <div className="col-sm-1 col-md-1">
                                  <div className="title item-title-label">
                                    Description
                                  </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                  <div
                                    className="data"
                                    style={{ marginLeft: '2%' }}
                                  >
                                    {this.state.selectedViewData.description}{' '}
                                  </div>
                                </div>
                              </div>

                              <p className="item-title-label"> Progress </p>
                              <ul className="progress-tracker">
                                {this.state.filterProgressListData.map(
                                  (stepRow, index) => {
                                    let stepClass = '';
                                    let progressId = this.state.selectedViewData
                                      .progressId;
                                    if (
                                      stepRow.progress ===
                                      this.state.selectedViewData.progress
                                    ) {
                                      stepClass = 'is-active';
                                    }
                                    if (stepRow.id <= progressId) {
                                      stepClass = 'is-complete';
                                    }
                                    return (
                                      <li
                                        className={`progress-step ${stepClass}`}
                                        key={index}
                                      >
                                        <span className="progress-marker">
                                          {stepClass === 'is-complete' ? (
                                            <i
                                              className="fa fa-check"
                                              aria-hidden="true"
                                            />
                                          ) : (
                                              ''
                                            )}
                                        </span>

                                        <span className="progress-text">
                                          {stepRow.title}
                                        </span>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="request-content row section-wrapper">
                            <div className="col-sm-4 brd-right">
                              {this.state.selectedViewData.quote ? (
                                <div className="data">
                                  {this.state.selectedViewData.quote.length >
                                    0 ? (
                                      <a
                                        onClick={() =>
                                          this.onQuoteDetails(
                                            this.state.selectedViewData
                                              .quoteDetails
                                          )
                                        }
                                        title="View Quote Details"
                                      >
                                        Quote Details
                                      </a>
                                    ) : (
                                      ''
                                    )}
                                </div>
                              ) : (
                                  ''
                                )}

                              {this.state.selectedViewData.paymentDetails !=
                                undefined ? (
                                  <div>
                                    <div className="row">
                                      <div className="col-sm-12 col-md-6">
                                        <p className="form-sub-heading">
                                          Payment Details
                                      </p>
                                      </div>
                                      <div className="col-sm-12 col-md-6" />
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-12 col-md-6">
                                        <div className="title">Payment Mode</div>
                                      </div>
                                      <div className="col-sm-12 col-md-6">
                                        <div
                                          className="data"
                                          style={{ textTransform: 'capitalize' }}
                                        >
                                          {
                                            this.state.selectedViewData
                                              .paymentMode
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    {/*(this.state.selectedViewData.paymentMode == "card") ?
                                                                            <div className="card-details">
                                                                                <div className="row">
                                                                                    <div className="col-sm-12 col-md-6">
                                                                                        <div className="title">Card No
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-6">
                                                                                        <div className="data">1234 XXX5
                                                                                            XXXX
                                                                                            9874
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-sm-12 col-md-6">
                                                                                        <div className="title">Expiry
                                                                                            Date
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-6">
                                                                                        <div className="data">11/78
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-sm-12 col-md-6">
                                                                                        <div className="title">CVV</div>
                                                                                    </div>
                                                                                    <div className="col-sm-12 col-md-6">
                                                                                        <div className="data">11/78
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> : ''
                                                                            */}
                                    <div className="row">
                                      <div className="col-sm-12 col-md-6">
                                        <div className="title">Total Cost</div>
                                      </div>
                                      <div className="col-sm-12 col-md-6">
                                        <div className="data">
                                          {this.state.selectedViewData.totalCost}{' '}
                                        SAR
                                      </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-12 col-md-6">
                                        <div className="title">
                                          Amount Deposit
                                      </div>
                                      </div>
                                      <div className="col-sm-12 col-md-6">
                                        <div className="data">
                                          {
                                            this.state.selectedViewData
                                              .totalAmountPaid
                                          }{' '}
                                        SAR
                                      </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-12 col-md-6">
                                        <div className="title">
                                          Amount Pending
                                      </div>
                                      </div>
                                      <div className="col-sm-12 col-md-6">
                                        <div className="data">
                                          {
                                            this.state.selectedViewData
                                              .totalAmountPending
                                          }{' '}
                                        SAR
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ''
                                )}
                            </div>
                            <div className="col-sm-4 brd-right">
                              {this.state.selectedViewData.reviewComment ? (
                                <div>
                                  <div className="title">Ratings & Review</div>
                                  <div className="ratings-wrapper">
                                    <StarRatingComponent
                                      starCount={webConstants.TOTAL_RATINGS}
                                      value={
                                        this.state.selectedViewData.reviewRating
                                      }
                                    />
                                  </div>
                                  <div className="title">Comments</div>
                                  <div className="comments-section">
                                    {this.state.selectedViewData.reviewComment}
                                  </div>
                                </div>
                              ) : (
                                  ''
                                )}
                            </div>
                            <div className="col-sm-4">
                              {this.state.selectedViewData.complaintRaised ? (
                                <div>
                                  <div className="title">Complaint Raised</div>
                                  <div className="comments-section">
                                    {
                                      this.state.selectedViewData
                                        .complaintRaised
                                    }
                                  </div>
                                </div>
                              ) : (
                                  ''
                                )}
                            </div>
                          </div>

                          {this.state.selectedViewData.complaintResolution ? (
                            <div className="complaint-resolution-textarea section-wrapper">
                              <div className="title">Complaint Resolution</div>
                              <p>
                                {' '}
                                {
                                  this.state.selectedViewData
                                    .complaintResolution
                                }{' '}
                              </p>
                            </div>
                          ) : (
                              ''
                            )}
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>

                  {/* Quote Details */}

                  <div>
                    <Modal
                      show={this.state.viewQuoteShow}
                      onHide={this.quotehandleClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title> Quote Details </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="row no-margin col-md-8 box-body roles-tbl">
                          <table border="1" className="table quote-tbl">
                            <thead className="my-header-class">
                              <tr>
                                <td> Material Details </td>
                                <td> Quantity </td>
                                <td> Cost (SAR) </td>
                              </tr>
                            </thead>
                            <tbody className="my-body-class">
                              {this.state.quoteDetailsView.data != undefined
                                ? this.state.quoteDetailsView.data.map(
                                  (detailRow, index) => {
                                    return (
                                      <tr key={index}>
                                        <td> {detailRow.description} </td>
                                        <td> {detailRow.quantity} </td>
                                        <td> {detailRow.cost} </td>
                                      </tr>
                                    );
                                  }
                                )
                                : ''}
                              <tr className="table-footer">
                                <td />
                                <td> </td>
                                <td> </td>
                              </tr>
                              <tr className="table-footer">
                                <td />
                                <td> Total Material Cost</td>
                                <td>
                                  {' '}
                                  {
                                    this.state.quoteDetailsView
                                      .totalMaterialCost
                                  }{' '}
                                  SAR{' '}
                                </td>
                              </tr>
                              <tr className="table-footer">
                                <td />
                                <td>Total Service Cost</td>
                                <td>
                                  {' '}
                                  {this.state.quoteDetailsView.serviceCost} SAR
                                </td>
                              </tr>
                              <tr className="table-footer">
                                <td />
                                <td> Total </td>
                                <td>
                                  {' '}
                                  {this.state.quoteDetailsView.totalCost} SAR
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>

                  {/* History */}
                  <div>
                    <Modal
                      show={this.state.viewHistoryShow}
                      onHide={this.handleClose}
                      bsSize="large"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          {' '}
                          {webConstants.MANAGE_SERVICE_REQUEST} History{' '}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="history-block">
                          <div className="history-table">
                            {
                              <BootstrapTable
                                ref="table"
                                data={
                                  this.props.ServiceRequestReducer
                                    .selectedServiceRequestHistory
                                    ? this.props.ServiceRequestReducer
                                      .selectedServiceRequestHistory
                                    : []
                                }
                                pagination={true}
                                options={historyOptions}
                                tableHeaderClass="my-header-class"
                                tableBodyClass="my-body-class"
                                containerClass="my-container-class"
                                tableContainerClass="my-table-container-class"
                                headerContainerClass="my-header-container-class"
                                bodyContainerClass="my-body-container-class"
                              >
                                <TableHeaderColumn
                                  autoValue={true}
                                  dataField="_id"
                                  isKey={true}
                                  hidden={true}
                                >
                                  SERVICE REQUEST ID
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                  dataField="operation_date"
                                  dataFormat={this.historyTimeFormatter.bind(
                                    this
                                  )}
                                >
                                  DATE AND TIME
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                  dataField="link"
                                  dataFormat={this.historyUsernameFormat}
                                >
                                  CHANGES DONE BY{' '}
                                </TableHeaderColumn>
                                <TableHeaderColumn dataField="operation">
                                  OPERATION
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                  dataField="link"
                                  dataFormat={this.historyChangesDone}
                                >
                                  {' '}
                                  CHANGES DONE{' '}
                                </TableHeaderColumn>
                              </BootstrapTable>
                            }
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>

                  {
                    /* Payment*/
                    <div>
                      <Modal
                        show={this.state.viewPaymentShow}
                        onHide={this.handleClose}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            {' '}
                            {webConstants.MANAGE_SERVICE_REQUEST} Payment{' '}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form
                            name="paymentForm"
                            className="paymentForm"
                            onSubmit={this.onPaymentSubmit.bind(this)}
                          >
                            <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                              <div className="form-group">
                                <label> Total Service Cost (SAR)</label>
                                <div>
                                  {' '}
                                  {
                                    this.state.selectedPaymentData.totalCost
                                  }{' '}
                                </div>
                              </div>

                              <div className="form-group">
                                <label> Payment Deposited (SAR) </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="amountPaid"
                                  placeholder="Payment Deposited"
                                  ref="amountPaid"
                                  onChange={this.handleChange.bind(
                                    this,
                                    'amountPaid'
                                  )}
                                  value={this.state.fields['amountPaid']}
                                />
                                <span className="error-message">
                                  {this.state.errors['amountPaid']}
                                </span>
                              </div>

                              <div className="form-group">
                                <label> Pending Amount (SAR) </label>
                                <div>
                                  {' '}
                                  {
                                    this.state.selectedPaymentData
                                      .totalAmountPending
                                  }{' '}
                                </div>
                              </div>
                            </div>

                            <Modal.Footer>
                              <div className="button-block">
                                {this.state.loading ? <Loader /> : ''}
                                <button
                                  type="button"
                                  onClick={this.handleClose}
                                  className="grey-button"
                                >
                                  Close
                                </button>
                                <button
                                  type="submit"
                                  id="add-button"
                                  className="green-button"
                                  style={{ display: this.state.isButton }}
                                >
                                  {' '}
                                  {webConstants.SUBMIT_BUTTON_TEXT}
                                </button>
                              </div>
                            </Modal.Footer>
                          </form>
                        </Modal.Body>
                      </Modal>
                    </div>
                  }
                </div>
                {/* <!-- Box --> */}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default ServiceRequestManage;
