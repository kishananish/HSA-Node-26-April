// React Components
import React, { Component } from 'react';
import {
  BootstrapTable,
  TableHeaderColumn,
  ButtonGroup
} from 'react-bootstrap-table';
import swal from 'sweetalert2';
import 'moment-timezone';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import ReactDOM from 'react-dom';
import padStart from 'pad-start';

// CSS/Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from '../Comman/Loader';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// Const Files
import * as webConstants from '../../constants/WebConstants';
import actionImage from '../../assets/img/actions.png';
import * as msgConstants from '../../constants/MsgConstants';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';

let activeManageMenuPermissions;

class RolesManage extends Component {
  constructor(props, context) {
    super(props, context);
    //console.log('Roles props', props);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      show: false,
      viewShow: false,
      fields: { id: '', name: '', status: '' },
      errors: {},
      isButton: true,
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
    this.getRolesList(this.state.activePage, this.state.perPageSize);
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

  handlePageChange(pageNumber) {
    //console.log(pageNumber);
    this.setState({
      activePage: pageNumber
    });
    this.getRolesList(pageNumber, this.state.perPageSize);
  }

  setUserPermissions() {
    let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0]
      .access_level;
    let activeManageMenu = loginUserAllPermissions.find(
      menuRow => menuRow.name === 'Manage Roles'
    );
    activeManageMenuPermissions = activeManageMenu.actions;
    //console.log('role Permissions' , activeManageMenuPermissions);
  }

  getRolesList(activePage, PerPageSize) {
    this.setState({ manageLoading: true, currentRowIndex: '' });
    this.props
      .RolesList(activePage, PerPageSize)
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
          swal(webConstants.MANAGE_ROLES, error.response.data.message, 'error');
        }
      });
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
          .RolesRemove(selectedRow._id)
          .then(response => {
            const responseData = response.payload;
            if (responseData.status === 200) {
              this.setState({
                manageLoading: false
              });
              swal(
                webConstants.MANAGE_ROLES,
                msgConstants.ON_DELETED,
                'success'
              );
              this.getRolesList(this.state.activePage, this.state.perPageSize);
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
                webConstants.MANAGE_ROLES,
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
    console.log('->->', row);
    this.props.history.push({
      pathname: menuLinkConstants.ROLE_VIEW_LINK,
      id: row._id
    });
  }

  onEdit(row) {
    this.props.history.push({
      pathname: menuLinkConstants.ROLE_ADD_LINK,
      id: row._id
    });
  }

  onAdd() {
    this.props.history.push(menuLinkConstants.ROLE_ADD_LINK);
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
        }).then(result => {
          if (result.value) {
            this.setState({
              manageLoading: true
            });
            this.props
              .RolesDeleteAll(selectIds)
              .then(response => {
                const responseData = response.payload;
                if (responseData.status === 200) {
                  this.setState({
                    manageLoading: false
                  });
                  swal(
                    webConstants.MANAGE_ROLES,
                    msgConstants.ON_DELETED,
                    'success'
                  );
                  this.getRolesList(
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
                    webConstants.MANAGE_ROLES,
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
        swal(webConstants.MANAGE_ROLES, msgConstants.NO_RECORDS, 'warning');
      }
    } else {
      swal(webConstants.MANAGE_ROLES, msgConstants.ERROR, 'error');
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

          {row.name == 'user' || row.name == 'service_provider' ? (
            // <p className={{ padding: '3px' }}>No Any Action Available For This Role</p>
            <div>
              {activeManageMenuPermissions.delete === true ? (
                <li onClick={() => this.onView(row)} className="without_link">
                  <i className="fa fa-trash-o" aria-hidden="true" /> View
                </li>
              ) : (
                ''
              )}
            </div>
          ) : (
            <div>
              {activeManageMenuPermissions.delete === true ? (
                <li onClick={() => this.onView(row)} className="without_link">
                  <i className="fa fa-trash-o" aria-hidden="true" /> View
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
            </div>
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

  /* Set Date format - for date column */
  dateFormatter(cell, row) {
    let statusColor = row.active == true ? 'white' : 'red';

    if (!cell) {
      return '';
    }
    return (
      <div
      // style={{
      //   background: statusColor,
      //   color: statusColor == 'red' ? 'white' : 'black'
      // }}
      >
        {moment(cell).format('DD-MMM-YYYY')
          ? moment(cell).format('DD-MMM-YYYY')
          : moment(cell).format('DD-MMM-YYYY')}
      </div>
    );
  }

  roleName(cell, row) {
    let statusColor = row.active == true ? 'white' : 'red';

    if (!cell) {
      return '';
    } else {
      let roleName = '';
      if (cell === 'user') {
        cell = 'customer';
      }
      roleName = cell
        .split('_')
        .join('  ')
        .toLowerCase()
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
      return (
        <div
          style={{
            background: statusColor,
            color: statusColor == 'red' ? 'white' : 'black'
          }}
        >
          {' '}
          {roleName}{' '}
        </div>
      );
    }
  }

  statusFormat(cell) {
    //console.log(cell);
    if (!cell) {
      return '';
    } else {
      let status;
      if (cell === false) {
        status = 'Active';
      } else {
        status = 'Inactive';
      }
      return status;
    }
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
        {activeManageMenuPermissions.add === true ? (
          <button
            onClick={() => {
              this.onAdd();
            }}
            className="btn btn-success link-add-new green-button"
            title="Add New"
          >
            {' '}
            NEW
          </button>
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

  trClassFormat = (row, rowIndex) => {
    return { background: 'red' };
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
      btnGroup: this.customToolbarButtons
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
                          Manage {webConstants.MANAGE_ROLES}{' '}
                        </h3>
                      </div>
                    )}
                  </div>

                  <div className="box-body roles-tbl custom-pagination no-data-found">
                    {!this.state.manageLoading ? (
                      <div>
                        <BootstrapTable
                          ref="table"
                          data={
                            this.props.RoleReducer.roleData.result
                              ? this.props.RoleReducer.roleData.result
                              : []
                          }
                          trClassName={this.trClassFormat}
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
                            ROLE ID
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            dataField="any"
                            dataFormat={this.indexN.bind(this)}
                          >
                            ROLE ID
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
                            dataField="name"
                            dataFormat={this.roleName.bind(this)}
                          >
                            ROLE NAME
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
                            this.props.RoleReducer.roleData.total
                              ? this.props.RoleReducer.roleData.total
                              : 0
                          }
                          pageRangeDisplayed={
                            this.props.RoleReducer.roleData.pages
                              ? this.props.RoleReducer.roleData.pages
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

export default RolesManage;
