// React Components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BootstrapTable,
  TableHeaderColumn,
  ButtonGroup
} from 'react-bootstrap-table';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import swal from 'sweetalert2';
import 'moment-timezone';
import Pagination from 'react-js-pagination';
import padStart from 'pad-start';
import moment from 'moment';
import StarRatingComponent from 'react-star-rating-component';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

// CSS / Components
import actionImage from '../../assets/img/actions.png';
import Loader from '../Comman/Loader';
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import MapContainer from './MapContainer';
import '../../assets/css/manage.css';

// Const Files
import * as msgConstants from '../../constants/MsgConstants';
import * as webConstants from '../../constants/WebConstants';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';
import * as languageData from '../../data/_languages';
const AnyReactComponent = ({ text }) => <div>{text}</div>;

let activeManageMenuPermissions;
const defaultCountryCode = '000';
class CustomerManage extends Component {
  constructor(props, context) {
    super(props, context);
    console.log('Customer props', props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      show: false,
      viewShow: false,
      sidebarViewstatus: 'block',
      fields: { title: '', description: '', id: '' },
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
      selectedViewData: {},
      isList: false,
      customerListData: [],
      index: 0,
      cnt: 19
    };
  }

  componentWillMount() {
    this.getCustomerList(this.state.activePage, this.state.perPageSize);
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
    let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0]
      .access_level;
    let activeManageMenu = loginUserAllPermissions.find(
      menuRow => menuRow.name === 'Manage Customers'
    );
    activeManageMenuPermissions = activeManageMenu.actions;
    //console.log('Customer Permissions' , activeManageMenuPermissions);
  }

  getCustomerList(activePage, PerPageSize) {
    this.setState({ manageLoading: true, currentRowIndex: '' });
    this.props
      .CustomerList(activePage, PerPageSize)
      .then(response => {
        const responseData = response.payload;
        console.log('responseData ->', response);
        if (responseData.status === 200) {
          if (responseData.data.status === 'success') {
            this.setState({
              manageLoading: false,
              isList: true,
              customerListData: responseData.data.data
            });
            console.log('customerListData', this.state.customerListData);
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
            webConstants.MANAGE_CUSTOMER,
            error.response.data.message,
            'error'
          );
        }
      });
  }

  handlePageChange(pageNumber) {
    //console.log(pageNumber);
    this.setState({
      activePage: pageNumber
    });
    this.getCustomerList(pageNumber, this.state.perPageSize);
  }

  /* Show Add /Edit modal and set data  */
  handleShow(currentOperation, editData) {
    let setEditData;
    let setStateData = {
      show: true,
      currentRowIndex: '',
      currentOperationStatus: currentOperation
    };
    if (editData) {
      setEditData = {
        title: editData.title,
        description: editData.description,
        id: editData._id
      };
    } else {
      setEditData = { title: '', description: '', id: '' };
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

  /* Delete Function */
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
          .CustomerRemove(selectedRow.userId)
          .then(response => {
            const responseData = response.payload;
            //console.log(responseData);
            if (responseData.status === 200) {
              this.setState({
                manageLoading: false
              });
              swal(
                webConstants.MANAGE_CUSTOMER,
                msgConstants.ON_DELETED,
                'success'
              );
              this.getCustomerList(
                this.state.activePage,
                this.state.perPageSize
              );
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
                webConstants.MANAGE_CUSTOMER,
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

  /* View Function */
  onView(row) {
    let language = '';
    let selctedLanguageData = languageData.languages.find(
      languageRow => languageRow.value == row.preferred_language
    );

    let userStatusColor = row.active == true ? 'green' : 'red';
    language = selctedLanguageData ? selctedLanguageData.label : 'NA';
    console.log(row.addresses);
    this.setState({
      userStatusColor: userStatusColor,
      cnt: 19,
      currentRowIndex: '',
      selectedRow: row,
      sidebarViewstatus: 'block',
      selectedViewData: {
        address: row.addresses.length > 0 ? row.addresses[0].address : '',
        zipCode: row.addresses.length > 0 ? row.addresses[0].zipcode : '',
        city: row.addresses.length > 0 ? row.addresses[0].city : '',
        language: language,
        cnt: 19
      }
    });
    //console.log(this.state.sidebarViewstatus);
  }

  /* On Row selected - Manage list */
  onRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      let checkedId = [...this.state.checkedId, row];
      //   console.log('->', checkedId);
      this.setState({ checkedId });
    } else {
      let checkedId = this.state.checkedId.filter(item => item._id != row._id);
      //   console.log('->', checkedId);
      this.setState({ checkedId });
    }
    /* let rowStr = '';
         for (const prop in row) {
             rowStr += prop + ': "' + row[prop] + '"';
         }
         //console.log('row',e);
         //console.log(`is selected: ${isSelected}, ${rowStr}`); */
  };

  /* On all row selected */
  onSelectAll = (isSelected, rows) => {
    let checkedId = [...this.state.checkedId, ...rows];
    // console.log('->', checkedId);
    this.setState({ checkedId });
  };

  handleDropBtnClick() {
    let selectIds = this.state.checkedId.map(arr => {
      return (arr = arr._id);
    });

    console.log('->', selectIds);

    if (this.refs.table !== undefined) {
      if (this.refs.table.state.selectedRowKeys.length > 0) {
        //let selectIds = this.refs.table.state.selectedRowKeys;
        //console.log(selectIds);
        //this.onDelete(selectIds, 'all');

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
              .CustomerDeleteAll(selectIds)
              .then(response => {
                const responseData = response.payload;
                //console.log(responseData);
                if (responseData.status === 200) {
                  this.setState({
                    manageLoading: false
                  });
                  swal(
                    webConstants.MANAGE_CUSTOMER,
                    msgConstants.ON_DELETED,
                    'success'
                  );
                  this.getCustomerList(
                    this.state.activePage,
                    this.state.perPageSize
                  );
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
                    webConstants.MANAGE_CUSTOMER,
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
        swal(webConstants.MANAGE_CUSTOMER, msgConstants.NO_RECORDS, 'warning');
      }
    } else {
      swal(webConstants.MANAGE_CUSTOMER, msgConstants.ERROR, 'error');
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
                <i className="fa fa-eye" aria-hidden="true" /> View
              </a>
            </li>
          ) : (
            ''
          )}

          {activeManageMenuPermissions.edit === true ? (
            <li
              className="without_link"
              onClick={() => {
                this.onEdit(row);
              }}
            >
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
        </ul>
      </div>
    );
  }

  /* Set index/ id for column */
  indexN(cell, row, enumObject, index) {
    return (
      <div>
        {webConstants.INDEX_ID}
        {padStart(index + 1, 4, '0')}
      </div>
    );
  }

  filterType(cell, row) {
    // just return type for filtering or searching.
    //console.log('type', cell.type);
    return cell.type;
  }
  toolTip(cell, row, enumObject, index) {
    let tooltip = (
      <Tooltip id="tooltip">
        <strong>{row.email}</strong>
      </Tooltip>
    );
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <div>{row.email}</div>
      </OverlayTrigger>
    );
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

  phoneNumberFormat(cell, row) {
    if (!row.mobile_no && !row.country_code) {
      return '';
    } else {
      let countryCode = '';
      if (!row.country_code) {
        countryCode = defaultCountryCode;
      } else {
        countryCode = row.country_code;
      }
      return countryCode + ' - ' + row.mobile_no;
    }
  }

  historyTimeFormatter(cell) {
    if (!cell) {
      return '';
    }
    return `${
      moment(cell).format('DD-MMM-YYYY HH:MM A')
        ? moment(cell).format('DD-MMM-YYYY HH:MM A')
        : moment(cell).format('DD-MMM-YYYY HH:MM A')
    }`;
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
    let language = '';
    if (row.prevObj != null) {
      let selctedLanguageData = languageData.languages.find(
        languageRow => languageRow.value == row.prevObj.preferred_language
      );
      language = selctedLanguageData ? selctedLanguageData.label : 'NA';
    }
    return row.prevObj != null ? (
      <div className="item-view" style={{ width: '100%' }}>
        <p>
          <span className="item-label"> First Name </span> :{' '}
          <span className="item-value">{row.prevObj.first_name}</span>
        </p>
        <p>
          <span className="item-label"> Last Name </span> :{' '}
          <span className="item-value">{row.prevObj.last_name}</span>
        </p>
        <p>
          <span className="item-label"> Email ID </span> :{' '}
          <span className="item-value">{row.prevObj.email}</span>
        </p>
        <p>
          <span className="item-label"> Phone No </span> :{' '}
          <span className="item-value">
            {row.prevObj.country_code
              ? row.prevObj.country_code
              : defaultCountryCode}{' '}
            - {row.prevObj.mobile_no}
          </span>
        </p>
        <p>
          <span className="item-label"> Status </span> :{' '}
          <span className="item-value">
            {row.prevObj.active ? 'Active' : 'Inactive'}
          </span>
        </p>
        <p>
          <span className="item-label"> Address </span> :{' '}
          <span className="item-value">
            {row.prevObj.addresses.length > 0
              ? row.prevObj.addresses[0].address
              : ''}
          </span>
        </p>
        <p>
          <span className="item-label"> Zipcode </span> :{' '}
          <span className="item-value">
            {row.prevObj.addresses.length > 0
              ? row.prevObj.addresses[0].zipcode
              : ''}
          </span>
        </p>
        <p>
          <span className="item-label"> City </span> :{' '}
          <span className="item-value">
            {row.prevObj.addresses.length > 0
              ? row.prevObj.addresses[0].city
              : ''}
          </span>
        </p>
        <p>
          <span className="item-label"> Language </span> :{' '}
          <span className="item-value">{language}</span>
        </p>
        <p>
          <span className="item-label"> Credits </span> :{' '}
          <span className="item-value">{row.prevObj.credits}</span>
        </p>
      </div>
    ) : (
      <span className="item-label"> No Changes </span>
    );
  }
  onFilterChange(filterObj, colInfos) {
    let data = [];

    if (Object.keys(filterObj).length === 0) {
      this.filtering.currentFilter = {};
      if (this.filtering.searchText.length > 0) {
        this.filteredData = this.search(this.products, colInfos);
        data = this.filteredData;
      } else {
        this.filteredData = [];
        data = this.products;
      }
    } else {
      this.filtering.currentFilter = filterObj;
      data = this.filter(this.products);
      if (this.filtering.searchText.length > 0) {
        data = this.search(data, colInfos);
      }
      this.filteredData = data;
    }

    if (this.sorting.sortField && this.sorting.sortOrder) {
      data = this.sort(data, this.sorting.sortField, this.sorting.sortOrder);
    }

    this.setState({
      data: data.slice(0, this.state.sizePerPage),
      totalDataSize: data.length,
      currentPage: 1
    });
  }
  /* Set Search bar */
  customSearchbar = props => {
    console.log(props);
    return (
      <div className="search-wrapper">
        {props.components.btnGroup}
        {props.components.searchPanel}
      </div>
    );
  };

  onAdd() {
    this.props.history.push(menuLinkConstants.CUSTOMER_ADD_LINK);
  }

  onEdit(row) {
    this.props.history.push({
      pathname: menuLinkConstants.CUSTOMER_ADD_LINK,
      id: row.userId
    });
  }

  onHistoryShow(row) {
    this.setState({
      selectedRow: row,
      manageLoading: true
    });
    /* To do history API */
    this.props
      .CustomerHistory(row.userId)
      .then(response => {
        const responseData = response.payload;
        //console.log(responseData);
        if (responseData.status === 200) {
          if (responseData.data.status === 'success') {
            this.viewModalShow();
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
            webConstants.MANAGE_CUSTOMER,
            error.response.data.message,
            'error'
          );
        }
      });
  }

  /* Set Add New button */
  customToolbarButtons = props => {
    const tooltip = (
      <Tooltip id="tooltip">
        <strong>Add New Customer</strong>
      </Tooltip>
    );
    return (
      <ButtonGroup
        className="my-custom-class pull-right"
        sizeClass="btn-group-md"
      >
        {activeManageMenuPermissions.add === true ? (
          <OverlayTrigger placement="top" overlay={tooltip}>
            <button
              onClick={() => {
                this.onAdd();
              }}
              className="btn btn-success link-add-new green-button"
              //title="Add New"
            >
              {' '}
              NEW
            </button>
          </OverlayTrigger>
        ) : (
          ''
        )}
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

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  render() {
    console.log('->', this.state.checkedId);
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
      // defaultSortName: 'first_name',  // default sort column name
      // defaultSortOrder: 'desc'  // default sort order
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
                          Manage {webConstants.MANAGE_CUSTOMER}{' '}
                        </h3>
                      </div>
                    )}
                  </div>

                  <div className="box-body customer-tbl custom-pagination no-data-found">
                    {this.state.manageLoading === false &&
                    this.state.isList === true ? (
                      <div>
                        <BootstrapTable
                          ref="table"
                          data={
                            this.props.CustomerReducer.customerData.result
                              ? this.props.CustomerReducer.customerData.result
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
                            dataField="userId"
                            isKey={true}
                            hidden={true}
                          >
                            CUSTOMER Id
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="any"
                            dataFormat={this.indexN.bind(this)}
                          >
                            CUSTOMER ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="created_at"
                            dataFormat={this.dateFormatter.bind(this)}
                            filterValue={this.filterType.bind(this)}
                            filterFormatted
                            dataSort
                          >
                            DATE OF JOINING
                          </TableHeaderColumn>
                          <TableHeaderColumn dataField="first_name" dataSort>
                            FIRST NAME
                          </TableHeaderColumn>
                          <TableHeaderColumn dataField="last_name" dataSort>
                            LAST NAME
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            dataFormat={this.toolTip.bind(this)}
                            dataSort
                          >
                            EMAIL ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="mobile_no"
                            dataFormat={this.phoneNumberFormat.bind(this)}
                            dataSort
                          >
                            PHONE NUMBER
                          </TableHeaderColumn>
                          <TableHeaderColumn dataField="service_completed">
                            NUMBER OF SERVICE REQUEST COMPLETED
                          </TableHeaderColumn>
                          <TableHeaderColumn dataField="service_cancelled">
                            NUMBER OF SERVICE REQUEST CANCELLED
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
                            this.props.CustomerReducer.customerData.total
                              ? this.props.CustomerReducer.customerData.total
                              : 0
                          }
                          pageRangeDisplayed={
                            this.props.CustomerReducer.customerData.pages
                              ? this.props.CustomerReducer.customerData.total
                              : 0
                          }
                          onChange={this.handlePageChange}
                          prevPageText="Previous"
                          nextPageText="Next"
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  {/* -- Box body --*/}

                  {/* --- View --*/}
                  <aside className="control-sidebar">
                    <h3 className="view-title">
                      View {webConstants.MANAGE_CUSTOMER}
                    </h3>
                    <div className="aside-content">
                      <p data-toggle="control-sidebar" className="close-panel">
                        <i className="fa fa-times" aria-hidden="true" />
                      </p>
                      <div className="customer-view-content">
                        <div className="customer-name-block">
                          <h3>
                            {' '}
                            {this.state.selectedRow.first_name}{' '}
                            {this.state.selectedRow.last_name}
                          </h3>
                          <span
                            className="rating-star"
                            style={{ fontSize: '20px' }}
                          >
                            <StarRatingComponent
                              name="rating"
                              starCount={webConstants.TOTAL_RATINGS}
                              value={this.state.selectedRow.user_rating}
                            />
                          </span>
                          <span
                            className="edit-link"
                            onClick={() => {
                              this.onEdit(this.state.selectedRow);
                            }}
                          >
                            {activeManageMenuPermissions.edit === true ? (
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                                title="Edit Details"
                              />
                            ) : (
                              ''
                            )}
                          </span>
                        </div>

                        <div className="view-block">
                          <h3>Personal Details</h3>
                          <div className="item-view">
                            <p className="item-label">First Name</p>
                            <p className="item-value">
                              {this.state.selectedRow.first_name}
                            </p>
                          </div>

                          <div className="item-view">
                            <p className="item-label">Last Name</p>
                            <p className="item-value">
                              {this.state.selectedRow.last_name}
                            </p>
                          </div>

                          <div className="item-view">
                            <p className="item-label">Email ID</p>
                            <p className="item-value">
                              {this.state.selectedRow.email}
                            </p>
                          </div>

                          <div className="item-view">
                            <p className="item-label">Phone Number</p>
                            <p className="item-value">
                              {this.state.selectedRow.country_code
                                ? this.state.selectedRow.country_code
                                : defaultCountryCode}{' '}
                              - {this.state.selectedRow.mobile_no}
                            </p>
                          </div>

                          <div className="item-view">
                            <p className="item-label">Status</p>
                            <p
                              className="item-value"
                              style={{
                                color: this.state.userStatusColor,
                                fontWeight: 'bold'
                              }}
                            >
                              {this.state.selectedRow.active == true
                                ? 'ACTIVE'
                                : 'INACTIVE'}
                            </p>
                          </div>

                          {/* <div className="item-view">
														<p className="item-label">Location</p>
														<div className="item-value">
														{<MapContainer cnt={this.state.selectedViewData.cnt? this.state.selectedViewData.cnt:this.state.cnt}/>}	
														</div>
														
													</div> */}
                        </div>
                        <div className="view-block">
                          {
                            <MapContainer
                              cnt={
                                this.state.selectedViewData.cnt
                                  ? this.state.selectedViewData.cnt
                                  : this.state.cnt
                              }
                            />
                          }
                        </div>
                        <div className="view-block">
                          <h3>Address 1 Details </h3>

                          <div className="item-view">
                            <p className="item-label">Address Line 1</p>
                            <p className="item-value">
                              {this.state.selectedViewData.address}
                            </p>
                          </div>

                          <div className="item-view">
                            <p className="item-label">Zip code</p>
                            <p className="item-value">
                              {this.state.selectedViewData.zipCode}
                            </p>
                          </div>

                          <div className="item-view">
                            <p className="item-label">City</p>
                            <p className="item-value">
                              {this.state.selectedViewData.city}
                            </p>
                          </div>
                        </div>

                        <div className="view-block">
                          <h3>Preferred Language </h3>
                          <div className="item-view">
                            <p className="item-label">
                              {this.state.selectedViewData.language}
                            </p>
                          </div>
                        </div>

                        <div className="view-block">
                          <h3>Credits in Balance</h3>
                          <div className="item-view">
                            <p className="item-label">
                              {this.state.selectedRow.credits}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                  {/* --- Customer View --*/}

                  {/* History */}
                  <div>
                    <Modal
                      show={this.state.viewShow}
                      onHide={this.handleClose}
                      bsSize="large"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          {' '}
                          {webConstants.MANAGE_CUSTOMER} History{' '}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="history-block">
                          <div className="history-table">
                            {
                              <BootstrapTable
                                ref="table"
                                data={
                                  this.props.CustomerReducer
                                    .selectedCustomerHistory
                                    ? this.props.CustomerReducer
                                        .selectedCustomerHistory
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
                                  Promo Code Id
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

export default CustomerManage;
