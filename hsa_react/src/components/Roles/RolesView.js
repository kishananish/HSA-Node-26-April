// React Components
import React, { Component } from 'react';
import swal from 'sweetalert2';
import 'moment-timezone';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { ButtonGroup } from 'react-bootstrap-table';

// CSS/Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from '../Comman/Loader';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// Const Files
import * as webConstants from '../../constants/WebConstants';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';

class RolesView extends Component {
  constructor(props, context) {
    super(props, context);
    //console.log('Roles props', props);
    //console.log('selected id', this.props.location.id);
    //console.log(this.props.RoleReducer.rolesAccessLevelData[0].access_level);
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
      wrapHeight: '500px',
      isViewData: false
    };
  }

  componentWillMount() {
    this.getRolesAccessLevelList();
    if (this.props.location.id) {
      this.getSelectedRoleDetails(this.props.location.id);
    } else {
      this.props.history.push(menuLinkConstants.ROLE_MANAGE_LINK);
    }
    this.setWrapHeight();
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

  getRolesAccessLevelList() {
    this.setState({ manageLoading: true, currentRowIndex: '' });
    this.props
      .RolesAccessLevel()
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

  getSelectedRoleDetails(selectedId) {
    this.setState({ manageLoading: true, currentRowIndex: '' });
    this.props
      .RoleView(selectedId)
      .then(response => {
        const responseData = response.payload;
        if (responseData.status === 200) {
          if (responseData.data.status === 'success') {
            this.setState({
              manageLoading: false,
              isViewData: true
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

  setData(menuName, selectedColumnHeaderName, accessLevelActionDetails) {
    //console.log(accessLevelActionDetails);
    //console.log(selectedColumnHeaderName);
    let selectedRoleAccessLevelData = this.props.RoleReducer.selectedRoleDetails
      .data.access_level;
    let iconName;
    if (selectedColumnHeaderName != undefined) {
      if (accessLevelActionDetails[selectedColumnHeaderName] === false) {
        iconName = 'fa fa-close';
        for (
          let selectedRoleAccessLevelIndex = 0;
          selectedRoleAccessLevelIndex < selectedRoleAccessLevelData.length;
          selectedRoleAccessLevelIndex++
        ) {
          if (
            selectedRoleAccessLevelData[selectedRoleAccessLevelIndex]['name'] ==
            menuName
          ) {
            let actionObject =
              selectedRoleAccessLevelData[selectedRoleAccessLevelIndex][
                'actions'
              ];
            if (actionObject[selectedColumnHeaderName] === true) {
              iconName = 'fa fa-check';
            } else {
              iconName = 'fa fa-close';
            }
          }
        }
      }
    }
    return <i className={iconName} />;
  }

  /* Set Add New button */
  customToolbarButtons = props => {
    return (
      <ButtonGroup
        className="my-custom-class pull-right"
        sizeClass="btn-group-md"
      >
        <button className="btn btn-success link-add-new green-button">
          {' '}
          NEW
        </button>
        <i className="fa fa-trash link-remove-all" aria-hidden="true" />
      </ButtonGroup>
    );
  };

  render() {
    const selectRowProp = {
      mode: '',
      clickToSelect: false
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

                  {this.state.isViewData ? (
                    <div>
                      <div className="box-header with-border">
                        {this.state.manageLoading ? (
                          ''
                        ) : (
                          <div className="col-lg-12 no-padding">
                            <h3 className="manage-page-title">
                              View {webConstants.MANAGE_ROLES}{' '}
                            </h3>
                            <div className="role-details with-values">
                              <span className="role-view-label">Role : </span>
                              <span className="role-view-value text-capitalize">
                                {this.props.RoleReducer.selectedRoleDetails.data.name
                                  .split('_')
                                  .join('  ')
                                  .toLowerCase()
                                  .split(' ')
                                  .map(
                                    s =>
                                      s.charAt(0).toUpperCase() + s.substring(1)
                                  )
                                  .join(' ')}
                              </span>
                              <span className="role-view-label">Status : </span>
                              <span className="role-view-value text-capitalize">
                                {this.props.RoleReducer.selectedRoleDetails
                                  .data['active']
                                  ? 'ACTIVE'
                                  : 'INACTIVE'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="box-body roles-tbl">
                        {!this.state.manageLoading ? (
                          <div>
                            <table border="1" className="table">
                              <thead className="my-header-class">
                                <tr>
                                  <td> Access Module </td>
                                  {webConstants.ROLES_OPERATIONS.map(
                                    (columnHeader, id) => {
                                      return <td key={id}>{columnHeader}</td>;
                                    }
                                  )}
                                </tr>
                              </thead>
                              <tbody className="my-body-class">
                                {this.props.RoleReducer.rolesAccessLevelData[0].access_level.map(
                                  (columnRows, id) => {
                                    //console.log(columnRows);
                                    return (
                                      <tr key={id}>
                                        <td>{columnRows.name}</td>
                                        {webConstants.ROLES_OPERATIONS.map(
                                          (columnHeader, id) => {
                                            return (
                                              <td key={id}>
                                                {this.setData(
                                                  columnRows.name,
                                                  columnHeader,
                                                  columnRows.actions
                                                )}
                                              </td>
                                            );
                                          }
                                        )}
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          ''
                        )}
                        <div className="">
                          <div className="button-block">
                            <Link
                              to={menuLinkConstants.ROLE_MANAGE_LINK}
                              className="grey-button"
                            >
                              {webConstants.CANCEL_BUTTON_TEXT}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Loader />
                  )}
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

export default RolesView;
