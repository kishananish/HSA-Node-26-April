// React Components
import React, { Component } from 'react';
import {
  BootstrapTable,
  TableHeaderColumn,
  ButtonGroup
} from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert2';
import Moment from 'react-moment';
import 'moment-timezone';
import ReactDOM from 'react-dom';
import padStart from 'pad-start';
import moment from 'moment';

// CSS / Components / Images
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import Loader from '../Comman/Loader';
import '../../assets/css/manage.css';
import fileUploadImg from '../../assets/img/file-upload.png';
import actionImage from '../../assets/img/actions.png';

// Const Files
// import * as categoryData from '../../data/_category';
import * as webConstants from '../../constants/WebConstants';
import * as apiConstants from '../../constants/APIConstants';
import * as msgConstants from '../../constants/MsgConstants';
import * as serviceRequestStepData from '../../data/_serviceRequestSteps';

let activeManageMenuPermissions = {};

class CategoryManage extends Component {
  constructor(props, context) {
    super(props, context);
    //console.log('category props', props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      viewShow: false,
      fields: { name: '', imageName: '', id: '', ar_name: '' },
      errors: {},
      isButton: true,
      loading: false,
      manageLoading: false,
      selectedRow: {},
      currentOperationStatus: '',
      checkedId: [],
      wrapHeight: '500px',
      fileUploadLoading: false,
      selectedImage: '',
      selectedImageName: '',
      ImagePath: fileUploadImg
    };
  }

  componentWillMount() {
    this.getCategoryList();
    this.setWrapHeight();
    this.setUserPermissions();
  }

  componentDidMount() {
    this.setWrapHeight();
  }

  /* To Set Dynamic Height to Wrapper */
  setWrapHeight() {
    let wrapDivHeight;
    let windowHeight = window.innerHeight;
    let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
    if (domElement) {
      let contentHeight = domElement.clientHeight;
      console.log(windowHeight, contentHeight);
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
      menuRow => menuRow.name === 'Manage Category'
    );
    activeManageMenuPermissions = activeManageMenu.actions;
    console.log('category Permissions', activeManageMenuPermissions);
  }

  /* Get Category List */
  getCategoryList() {
    this.setState({ manageLoading: true, currentRowIndex: '' });
    this.props
      .CategoryList()
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
            webConstants.MANAGE_CATEGORY,
            error.response.data.message,
            'error'
          );
        }
      });
  }

  /* Open Add /Edit modal and set Edit data  */
  handleShow(currentOperation, editData) {
    let setEditData;
    let selectedImage;
    let ImagePath;
    let setStateData = {
      show: true,
      currentRowIndex: '',
      currentOperationStatus: currentOperation
    };
    if (editData) {
      setEditData = {
        categoryName: editData.name,
        ar_name: editData.ar_name,
        id: editData._id
      };
      selectedImage = editData.imageName;
      ImagePath = editData.image_url;
    } else {
      setEditData = { categoryName: '', id: '', ar_name: '' };
      selectedImage = '';
      ImagePath = fileUploadImg;
    }
    setStateData.fields = setEditData;
    setStateData.selectedImage = selectedImage;
    setStateData.ImagePath = ImagePath;
    this.setState(setStateData);
  }

  /* To Show View detail Modal */
  viewModalShow() {
    this.setState({ viewShow: true, currentRowIndex: '' });
  }

  /* To Close All Models */
  handleClose() {
    this.setState({ show: false, viewShow: false, manageLoading: false });
  }

  /* To Set Fields and data for Validation */
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    // if(field == "categoryName") {
    //     fields['ar_name'] = 'المنتجuuu';
    // }
    this.setState({ fields });
    this.handleValidation();
  }

  /* To set validations of Form Fields */
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields['categoryName']) {
      formIsValid = false;
      errors['categoryName'] = 'Category Name is required';
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  /* To Upload Category Image */
  fileChangedHandler = event => {
    this.setState({
      fileUploadLoading: true
    });
    if (event.target.files && event.target.files.length > 0) {
      let profileImage = event.target.files[0];
      let profileImageExtension = profileImage.name.split('.').pop();
      if (
        profileImageExtension === 'png' ||
        profileImageExtension === 'jpeg' ||
        profileImageExtension === 'jpg'
      ) {
        const formData = new FormData();
        formData.append('category_image', event.target.files[0]);
        this.props
          .CategoryImageUpload(formData)
          .then(response => {
            const responseData = response.payload;
            if (responseData.status === 200) {
              if (responseData.data.status === 'success') {
                this.setState({
                  fileUploadLoading: false,
                  selectedImage: responseData.data.data.image,
                  selectedImageName: profileImage.name,
                  ImagePath:
                    apiConstants.BASE_IMAGE_URL + responseData.data.data.image
                });
              }
            }
          })
          .catch(error => {
            if (error.response !== undefined) {
              swal(
                webConstants.MANAGE_CATEGORY,
                error.response.data.message,
                'error'
              );
            }
          });
      } else {
        swal(
          webConstants.MANAGE_CATEGORY + ' Image',
          'Only Images are allowed. Other files are not accepted.',
          'error'
        );
        this.setState({
          fileUploadLoading: false
        });
      }
    }
  };

  /* To Save and Edit */
  onSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
      if (this.state.selectedImage) {
        this.setState({ loading: true, isButton: 'none' });
        let categoryParams = {
          name: this.state.fields.categoryName,
          ar_name: this.state.fields.ar_name,
          imageName: this.state.selectedImage
        };
        console.log('categoryParams :', categoryParams);
        if (this.state.currentOperationStatus === 'New') {
          // Add
          this.props
            .CategorySave(categoryParams)
            .then(response => {
              const responseData = response.payload;
              if (responseData.status === 200) {
                if (responseData.data.status === 'success') {
                  this.setState({
                    loading: false,
                    isButton: 'block',
                    selectedFileName: '',
                    fields: { name: '', id: '', ar_name: '' },
                    selectedImage: '',
                    selectedImageName: '',
                    ImagePath: fileUploadImg,
                    fileUploadLoading: false
                  });
                  this.handleClose();
                  swal(
                    webConstants.MANAGE_CATEGORY,
                    msgConstants.ON_SAVE,
                    'success'
                  );
                  this.getCategoryList();
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
                  webConstants.MANAGE_CATEGORY,
                  error.response.data.message,
                  'error'
                );
              }
            });
        } else {
          // Edit
          this.props
            .CategoryUpdate(this.state.fields.id, categoryParams)
            .then(response => {
              const responseData = response.payload;
              if (responseData.status === 200) {
                if (responseData.data.status === 'success') {
                  this.setState({
                    loading: false,
                    isButton: 'block',
                    selectedFileName: '',
                    fields: { name: '', id: '' },
                    selectedImage: '',
                    selectedImageName: '',
                    ImagePath: fileUploadImg,
                    fileUploadLoading: false
                  });
                  this.handleClose();
                  swal(
                    webConstants.MANAGE_CATEGORY,
                    msgConstants.ON_UPDATE,
                    'success'
                  );
                  this.getCategoryList();
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
                  webConstants.MANAGE_CATEGORY,
                  error.response.data.message,
                  'error'
                );
              }
            });
        }
      } else {
        swal(
          webConstants.MANAGE_CATEGORY + ' Image',
          'Category Image is required',
          'error'
        );
      }
    } else {
      console.log('Form has errors.');
      this.setState({ isLogin: false });
    }
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
          .CategoryRemove(selectedRow._id)
          .then(response => {
            const responseData = response.payload;
            if (responseData.status === 200) {
              if (responseData.data.status === 'success') {
                this.setState({
                  manageLoading: false
                });
                swal(
                  webConstants.MANAGE_CATEGORY,
                  msgConstants.ON_DELETED,
                  'success'
                );
                this.getCategoryList();
              }
            }
          })
          .catch(error => {
            if (error.response !== undefined) {
              this.setState({
                manageLoading: false
              });
              swal(
                webConstants.MANAGE_CATEGORY,
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
    this.setState({ selectedRow: row, manageLoading: true });
    console.log('row :', row);
    /* To do history API */
    this.props
      .CategoryHistory(row._id)
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
            webConstants.MANAGE_CATEGORY,
            error.response.data.message,
            'error'
          );
        }
      });
  }

  /* On Row selected - Manage list */
  onRowSelect = (row, isSelected, e) => {
    //Get Selected Data

    if (isSelected) {
      let checkedId = [...this.state.checkedId, row];
      //   console.log('->', checkedId);
      this.setState({ checkedId });
    } else {
      let checkedId = this.state.checkedId.filter(item => item._id != row._id);
      //   console.log('->', checkedId);
      this.setState({ checkedId });
    }
  };

  /* On all row selected */
  onSelectAll = (isSelected, rows) => {
    let checkedId = [...this.state.checkedId, ...rows];
    // console.log('->', checkedId);
    this.setState({ checkedId });
  };

  // /* Delete Function */
  // onDelete = (selectedRow) => {
  //     console.log(selectedRow._id,'checking id for delete customer-manage')
  /* Delete selected all records */
  handleDropBtnClick() {
    let selectIds = this.state.checkedId.map(arr => {
      return (arr = arr._id);
    });

    console.log('->', selectIds);
    if (this.refs.table !== undefined) {
      if (this.refs.table.state.selectedRowKeys.length > 0) {
        //let selectIds = this.refs.table.state.selectedRowKeys;
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
              .CategoryDeleteAll(selectIds)
              .then(response => {
                const responsCategoryeData = response.payload;
                if (responsCategoryeData.status === 200) {
                  if (responsCategoryeData.data.status === 'success') {
                    this.setState({
                      manageLoading: false
                    });
                    swal(
                      webConstants.MANAGE_CATEGORY,
                      msgConstants.ON_DELETED,
                      'success'
                    );
                    this.getCategoryList();
                  }
                }
              })
              .catch(error => {
                if (error.response !== undefined) {
                  this.setState({
                    manageLoading: false
                  });
                  swal(
                    webConstants.MANAGE_CATEGORY,
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
        swal(webConstants.MANAGE_CATEGORY, msgConstants.NO_RECORDS, 'warning');
      }
    } else {
      swal(webConstants.MANAGE_CATEGORY, msgConstants.ERROR, 'error');
      this.forceUpdate();
    }
  }

  /* Manage table - set Action List */
  cellButton(cell, row, enumObject, rowIndex) {
    console.log('row cell :', cell);
    return (
      <div className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <img src={actionImage} alt="Image" />
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
            <li
              className="without_link"
              onClick={() => {
                this.handleShow('Edit', row);
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

  /* Filter Type */
  filterType(cell, row) {
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

  historyTimeFormatter(cell) {
    if (!cell) {
      return '';
    }
    return <Moment format="HH:MM A">{cell}</Moment>;
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
      <div className="item-view">
        <p className="item-label"> Category Name </p>
        <p className="item-value">{row.prevObj.name}</p>
        <hr className="view-divider" />
        <p className="item-label"> Category Image </p>
        <p className="item-value">
          <img
            src={apiConstants.BASE_IMAGE_URL + row.prevObj.imageName}
            className="manage-image"
            alt="Image"
          />
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
        {activeManageMenuPermissions.add === true ? (
          <button
            onClick={() => {
              this.handleShow('New');
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
                          Manage {webConstants.MANAGE_CATEGORY}{' '}
                        </h3>
                      </div>
                    )}
                  </div>

                  <div
                    className="box-body manage-catergory-tbl no-data-found custom-pagination"
                    id="pid"
                  >
                    {!this.state.manageLoading ? (
                      <BootstrapTable
                        ref="table"
                        data={
                          this.props.CategoryReducer.categoryData
                            ? this.props.CategoryReducer.categoryData
                            : []
                        }
                        selectRow={selectRowProp}
                        pagination={true}
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
                          CATEGORY Id
                        </TableHeaderColumn>

                        <TableHeaderColumn
                          dataField="any"
                          dataFormat={this.indexN.bind(this)}
                        >
                          CATEGORY ID
                        </TableHeaderColumn>

                        <TableHeaderColumn
                          dataField="created_at"
                          dataFormat={this.dateFormatter.bind(this)}
                          filterValue={this.filterType.bind(this)}
                          filterFormatted
                        >
                          CREATED DATE
                        </TableHeaderColumn>

                        <TableHeaderColumn dataField="name">
                          CATEGORY NAME
                        </TableHeaderColumn>
                        {/* <TableHeaderColumn dataField='ar_name'>ARABIC NAME</TableHeaderColumn> */}

                        <TableHeaderColumn dataField="imageName" hidden={true}>
                          CATEGORY Image
                        </TableHeaderColumn>

                        <TableHeaderColumn
                          dataField="button"
                          dataFormat={this.cellButton.bind(this)}
                          hidden={
                            activeManageMenuPermissions.edit === false &&
                            activeManageMenuPermissions.view === false &&
                            activeManageMenuPermissions.delete === false
                              ? true
                              : false
                          }
                        >
                          ACTION
                        </TableHeaderColumn>
                      </BootstrapTable>
                    ) : (
                      ''
                    )}
                  </div>
                  {/* -- Box body --*/}

                  {/* Add /Edit Modal */}
                  <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>
                        {this.state.currentOperationStatus}{' '}
                        {webConstants.MANAGE_CATEGORY}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <form
                        name="faqForm"
                        className="faqForm"
                        onSubmit={this.onSubmit.bind(this)}
                      >
                        <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                          <div className="form-group margin-bottom-25">
                            <label>Category Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="categoryName"
                              placeholder="Category Name"
                              ref="categoryName"
                              onChange={this.handleChange.bind(
                                this,
                                'categoryName'
                              )}
                              value={
                                this.state.fields['categoryName'] === undefined
                                  ? ''
                                  : this.state.fields['categoryName']
                              }
                            />
                            <span className="error-message">
                              {this.state.errors['categoryName']}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                          <div className="form-group margin-bottom-25">
                            <label>Arabic Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="ar_name"
                              placeholder="Arabic Name"
                              ref="ar_name"
                              onChange={this.handleChange.bind(this, 'ar_name')}
                              value={
                                this.state.fields['ar_name'] === undefined
                                  ? ''
                                  : this.state.fields['ar_name']
                              }
                            />
                            <span className="error-message">
                              {this.state.errors['ar_name']}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 fileContainer">
                          <div className="form-group margin-bottom-25">
                            {this.state.fileUploadLoading ? (
                              <p className="image-uploading">
                                Image Uploading..
                              </p>
                            ) : (
                              <label className="">
                                <img
                                  src={this.state.ImagePath}
                                  className="category-upload-img"
                                />
                                <br />
                                {this.state.selectedImage != '' ? (
                                  <p className="selected-file-name">
                                    {this.state.selectedImageName}
                                  </p>
                                ) : (
                                  ''
                                )}
                                Click here to{' '}
                                {this.state.selectedImage != ''
                                  ? 'change'
                                  : 'upload'}{' '}
                                category image
                                <input
                                  type="file"
                                  onChange={this.fileChangedHandler.bind(this)}
                                />
                              </label>
                            )}
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

                  {/* View Modal */}
                  <Modal
                    show={this.state.viewShow}
                    onHide={this.handleClose}
                    bsSize="large"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        View {webConstants.MANAGE_CATEGORY}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="view-block">
                        <div className="item-view">
                          <p className="item-label">Category Name</p>
                          <p className="item-value">
                            {this.state.selectedRow.name}
                          </p>
                        </div>
                        <div className="item-view">
                          <p className="item-label">Arabic Name</p>
                          <p className="item-value">
                            {this.state.selectedRow.ar_name}
                          </p>
                        </div>
                        <div className="item-view width-100">
                          <p className="item-label">Category Image</p>
                          <p className="item-value fileViewContainer">
                            <img
                              src={this.state.selectedRow.image_url}
                              className="manage-image"
                            />
                          </p>
                        </div>
                      </div>

                      <div className="history-block">
                        <h4 className="history-title">History</h4>
                        {console.log(
                          'this.props.CategoryReducer :',
                          this.props.CategoryReducer
                        )}
                        <div className="history-table">
                          <BootstrapTable
                            ref="table"
                            data={
                              this.props.CategoryReducer
                                .categorySelectedHistoryData
                                ? this.props.CategoryReducer
                                    .categorySelectedHistoryData
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
                              CATEGORY Id
                            </TableHeaderColumn>

                            <TableHeaderColumn
                              dataField="operation_date"
                              dataFormat={this.dateFormatter.bind(this)}
                            >
                              DATE
                            </TableHeaderColumn>

                            <TableHeaderColumn
                              dataField="operation_date"
                              dataFormat={this.historyTimeFormatter.bind(this)}
                            >
                              TIME
                            </TableHeaderColumn>

                            <TableHeaderColumn
                              dataField="link"
                              dataFormat={this.historyUsernameFormat}
                            >
                              CHANGES DONE BY{' '}
                            </TableHeaderColumn>

                            <TableHeaderColumn
                              dataField="link"
                              dataFormat={this.historyChangesDone}
                            >
                              {' '}
                              CHANGES DONE{' '}
                            </TableHeaderColumn>
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
    );
  }
}

export default CategoryManage;
