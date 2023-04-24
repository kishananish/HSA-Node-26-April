// React Components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import padStart from 'pad-start';
import moment from 'moment';

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from '../Comman/Loader';
import swal from 'sweetalert2';
import Moment from 'react-moment';
import 'moment-timezone';
import actionImage from '../../assets/img/actions.png';

// Const Files
import * as queryData from '../../data/_query';
import * as webConstants from '../../constants/WebConstants';
import * as msgConstants from '../../constants/MsgConstants';

let activeManageMenuPermissions;

class QueryManage extends Component {
	constructor(props, context) {
		super(props, context);
		//console.log('query props', props);
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);

		this.state = {
			show: false,
			viewShow: false,
			fields: { id: '', title: '', description: '', response: '', imageName: '' },
			errors: {},
			isButton: true,
			loading: false,
			manageLoading: false,
			selectedRow: {},
			selectedRowData: {},
			currentOperationStatus: '',
			checkedId: [],
			wrapHeight: '500px',
			selectedFile: null,
			activePage: 1,
			selectedFileName: null,
			perPageSize: webConstants.PER_PAGE_SIZE,
		};
	}

	componentWillMount() {
		this.getQueryList(this.state.activePage, this.state.perPageSize);
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
		let activeManageMenu = loginUserAllPermissions.find(menuRow => menuRow.name === 'Manage Query / Suggestion');
		activeManageMenuPermissions = activeManageMenu.actions;
		//console.log('Query Permissions' , activeManageMenuPermissions);
	}

	getQueryList(activePage, PerPageSize) {
		this.setState({ manageLoading: true, currentRowIndex: '' });
		this.props
			.QueryList(activePage, PerPageSize)
			.then(response => {
				const responseData = response.payload;
				if (responseData.status === 200) {
					if (responseData.data.status === 'success') {
						this.setState({
							manageLoading: false,
						});
					}
				}
			})
			.catch(error => {
				if (error.response !== undefined) {
					this.setState({
						manageLoading: false,
					});
					swal(webConstants.MANAGE_QUERY, error.response.data.message, 'error');
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
			currentOperationStatus: currentOperation,
		};
		if (editData) {
			setEditData = {
				id: editData._id,
				title: editData.title,
				description: editData.description,
				response: editData.response,
				imageName: '',
			};
		} else {
			setEditData = { id: '', title: '', description: '', response: '', imageName: '' };
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

	fileChangedHandler = event => {
		if (event.target.files && event.target.files.length > 0) {
			let categoryImage = event.target.files[0];
			let categoryImageExtension = categoryImage.name.split('.').pop();
			if (
				categoryImageExtension === 'gif' ||
				categoryImageExtension === 'png' ||
				categoryImageExtension === 'jpeg' ||
				categoryImageExtension === 'jpg'
			) {
				//console.log(categoryImage.name);
				this.setState({ selectedFile: event.target.files[0], selectedFileName: categoryImage.name });
			} else {
				swal(
					webConstants.MANAGE_QUERY + ' Image',
					'Only Images are allowed. Other files are not accepted.',
					'error'
				);
			}
		}
	};

	/* Set Validations for Form fields */
	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields['response']) {
			formIsValid = false;
			errors['response'] = 'Query Resolution is required';
		}
		this.setState({ errors: errors });
		return formIsValid;
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			this.setState({ loading: true, isButton: 'none' });
			let data = {
				response: this.state.fields.response,
			};
			let formData = new FormData();
			formData.append('response', this.state.fields.response);
			this.props
				.QueryUpdate(this.state.fields.id, data)
				.then(response => {
					const responseData = response.payload;
					if (responseData.status === 200) {
						if (responseData.data.status === 'success') {
							this.setState({
								loading: false,
								isButton: 'block',
								selectedFileName: '',
								fields: { id: '', title: '', description: '', response: '', imageName: '' },
							});
							this.handleClose();
							swal(webConstants.MANAGE_QUERY, msgConstants.ON_UPDATE, 'success');
							this.getQueryList(this.state.activePage, this.state.perPageSize);
						}
					}
				})
				.catch(error => {
					//console.log(error);
					//console.log(JSON.stringify(error));
					if (error.response !== undefined) {
						this.setState({
							loading: false,
							isButton: 'block',
						});
						swal(webConstants.MANAGE_QUERY, error.response.data.message, 'error');
					}
				});
		} else {
			//console.log("Form has errors.");
			this.setState({ isLogin: false });
		}
	}

	/* Delete Function */
	onDelete = selectedRow => {
		this.setState({
			currentRowIndex: '',
		});
		//console.log('Delete Row', selectedRow._id);
		swal({
			title: msgConstants.DELETE_TITLE,
			text: msgConstants.CONFIRM_DELETE,
			type: 'question',
			showCancelButton: true,
			confirmButtonColor: '#27ae60',
			cancelButtonColor: '#b5bfc4',
			confirmButtonText: msgConstants.DELETE_BUTTON_LABEL,
		}).then(result => {
			if (result.value) {
				this.setState({
					manageLoading: true,
				});
				this.props
					.QueryRemove(selectedRow._id)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							if (responseData.data.status === 'success') {
								this.setState({
									manageLoading: false,
								});
								swal(webConstants.MANAGE_QUERY, msgConstants.ON_DELETED, 'success');
								this.getQueryList(this.state.activePage, this.state.perPageSize);
							}
						}
					})
					.catch(error => {
						//console.log(error);
						//console.log(JSON.stringify(error));
						if (error.response !== undefined) {
							this.setState({
								manageLoading: false,
							});
							swal(webConstants.MANAGE_QUERY, error.response.data.message, 'error');
						}
					});
			} else {
				//console.log('cancel');
			}
		});
	};

	/* View Function */
	onView(row) {
		this.setState({
			manageLoading: true,
			selectedRowData: {
				title: row.title,
				createdBy: row.query_by!=null?(row.query_by.first_name + ' ' + row.query_by.last_name):'',
				description: row.description,
				response: row.response,
				imageName: '',
			},
		});
		/* To do history API */
		this.props
			.QueryHistory(row._id)
			.then(response => {
				const responseData = response.payload;
				//console.log(responseData);
				if (responseData.status === 200) {
					if (responseData.data.status === 'success') {
						//History Response
						this.viewModalShow();
					}
				}
			})
			.catch(error => {
				//console.log(error);
				//console.log(JSON.stringify(error));
				if (error.response !== undefined) {
					this.setState({
						manageLoading: false,
					});
					swal(webConstants.MANAGE_QUERY, error.response.data.message, 'error');
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
					currentRowIndex: '',
				});
				swal({
					title: msgConstants.DELETE_TITLE,
					text: msgConstants.CONFIRM_DELETE,
					type: 'question',
					showCancelButton: true,
					confirmButtonColor: '#27ae60',
					cancelButtonColor: '#b5bfc4',
					confirmButtonText: msgConstants.DELETE_BUTTON_LABEL,
				}).then(result => {
					if (result.value) {
						this.setState({
							manageLoading: true,
						});
						this.props
							.QueryDeleteAll(selectIds)
							.then(response => {
								const responseData = response.payload;
								if (responseData.status === 200) {
									if (responseData.data.status === 'success') {
										this.setState({
											manageLoading: false,
										});
										swal(webConstants.MANAGE_QUERY, msgConstants.ON_DELETED, 'success');
										this.getQueryList(this.state.activePage, this.state.perPageSize);
									}
								}
							})
							.catch(error => {
								//console.log(error);
								//console.log(JSON.stringify(error));
								if (error.response !== undefined) {
									this.setState({
										manageLoading: false,
									});
									swal(webConstants.MANAGE_QUERY, error.response.data.message, 'error');
								}
							});
					} else {
						//console.log('cancel');
					}
				});
			} else {
				swal(webConstants.MANAGE_QUERY, msgConstants.NO_RECORDS, 'warning');
			}
		} else {
			swal(webConstants.MANAGE_QUERY, msgConstants.ERROR, 'error');
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
						<li onClick={() => this.onView(row)} className="with_link">
							<a href="" data-toggle="control-sidebar">
								<i className="fa fa-eye" aria-hidden="true" /> View{' '}
							</a>
						</li>
					}

					{// Add / Edit Query Suggestion
					// (row.hasOwnProperty("response") == true) ?
					//     (activeManageMenuPermissions.edit === true) ?
					//     <li className="without_link" onClick={() => {
					//         this.handleShow('Edit', row)
					//         }}>
					//     <i className="fa fa-pencil" aria-hidden="true"/> Edit
					//     </li> : '' :
					//     (activeManageMenuPermissions.add === true) ?
					//     <li className="without_link" onClick={() => {
					//     this.handleShow('Add', row)
					//          }}>
					//     <i className="fa fa-pencil" aria-hidden="true"/> Add
					//    </li> : ''

					activeManageMenuPermissions.edit === true ? (
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

	onClickProductSelected(cell, row, rowIndex, enumObject) {
		this.setState({
			currentRowIndex: rowIndex,
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
	dateFormatter(cell) {
		if (!cell) {
			return '';
		}
		return `${
			moment(cell).format('DD-MMM-YYYY') ? moment(cell).format('DD-MMM-YYYY') : moment(cell).format('DD-MMM-YYYY')
		}`;
	}

	createdByName(cell, row) {
		if (!cell) {
			return '';
		}
		return cell.first_name + ' ' + cell.last_name;
	}

	getCategoryName(cell, row) {
		return row.category_id ? row.category_id.name : '';
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
				<p className="item-label"> Query Subject </p>
				<p className="item-value">{row.prevObj.title}</p>
				<hr className="view-divider" />
				<p className="item-label"> Query Description </p>
				<p className="item-value">{row.prevObj.description}</p>
				<hr className="view-divider" />
				<p className="item-label"> Query Resolution </p>
				<p className="item-value">{row.prevObj.response}</p>
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

	handlePageChange(pageNumber) {
		this.setState({
			activePage: pageNumber,
		});
		this.getQueryList(pageNumber, this.state.perPageSize);
	}

	/* Set Add New button */
	customToolbarButtons = props => {
		return (
			<ButtonGroup className="my-custom-class pull-right" sizeClass="btn-group-md">
				{/*<button onClick={() => {this.handleShow('New')}} className="btn btn-success link-add-new green-button"> NEW </button>*/}

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
			onSelectAll: this.onSelectAll,
		};

		const options = {
			toolBar: this.customSearchbar,
			btnGroup: this.customToolbarButtons,
			prePage: 'Previous',
			nextPage: 'Next',
			paginationPosition: 'bottom',
			hideSizePerPage: true,
			sizePerPage: 10,
		};

		const historyOptions = {
			prePage: 'Previous',
			nextPage: 'Next',
			paginationPosition: 'bottom',
			hideSizePerPage: true,
			sizePerPage: 2,
			width: '100%',
		};
		return (
			<div>
				<HeaderContainer />
				<SidebarContainer />
				<div ref="bodyContent" className="content-wrapper" style={{ minHeight: this.state.wrapHeight }}>
					<section className="content-header">
						<div className="row">
							<div className="col-md-12">
								<div className="customer-box">
									<div className="">{this.state.manageLoading ? <Loader /> : ''}</div>

									<div className="box-header with-border">
										{this.state.manageLoading ? (
											''
										) : (
											<div className="col-lg-12 no-padding">
												<h3 className="manage-page-title">
													Manage {webConstants.MANAGE_QUERY}{' '}
												</h3>
											</div>
										)}
									</div>

									<div className="box-body query-tbl custom-pagination no-data-found">
										{!this.state.manageLoading ? (
											<div>
												<BootstrapTable
													ref="table"
													data={
														this.props.QueryReducer.queryData.result
															? this.props.QueryReducer.queryData.result
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
														QUERY ID
													</TableHeaderColumn>
													<TableHeaderColumn
														dataField="any"
														dataFormat={this.indexN.bind(this)}
													>
														QUERY ID
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
														dataField="query_by"
														dataFormat={this.createdByName.bind(this)}
														filterValue={this.filterType.bind(this)}
														filterFormatted
													>
														CREATED BY
													</TableHeaderColumn>

													<TableHeaderColumn dataField="title">
														QUERY SUBJECT{' '}
													</TableHeaderColumn>
													<TableHeaderColumn dataField="description">
														{' '}
														QUERY DESCRIPTION{' '}
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
														this.props.QueryReducer.queryData.total
															? this.props.QueryReducer.queryData.total
															: 0
													}
													pageRangeDisplayed={
														this.props.QueryReducer.queryData.pages
															? this.props.QueryReducer.queryData.pages
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

									{/* Add /Edit Modal */}
									<Modal show={this.state.show} onHide={this.handleClose}>
										<Modal.Header closeButton>
											<Modal.Title>
												{this.state.currentOperationStatus} {webConstants.MANAGE_QUERY}
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
														<label>Query Subject</label>
														<p>{this.state.fields['title']}</p>
														<span className="error-message">
															{this.state.errors['title']}
														</span>
													</div>
												</div>

												<div className="col-md-12 col-sm-12 col-xs-12 no-padding">
													<div className="form-group">
														<label>Query Description</label>
														<p id="description" className="item-value">
															{' '}
															{this.state.fields['description']}
														</p>
														<span className="error-message">
															{this.state.errors['description']}
														</span>
													</div>
												</div>

												<div className="col-md-12 col-sm-12 col-xs-12 no-padding">
													<div className="form-group">
														<label>Query Resolution</label>
														<textarea
															id="response"
															className="form-control"
															placeholder="Query Resolution"
															ref="response"
															onChange={this.handleChange.bind(this, 'response')}
															value={this.state.fields['response']}
														/>
														<span className="error-message">
															{this.state.errors['response']}
														</span>
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
									<Modal show={this.state.viewShow} onHide={this.handleClose} bsSize="large">
										<Modal.Header closeButton>
											<Modal.Title>View {webConstants.MANAGE_QUERY}</Modal.Title>
										</Modal.Header>
										<Modal.Body>
											<div className="view-block">
												<div className="item-view col-md-12 col-lg-12">
													<div className="col-md-6 col-lg-6">
														<p className="item-label">Query Subject</p>
														<p className="item-value">{this.state.selectedRowData.title}</p>
													</div>
													<div className="col-md-6 col-lg-6">
														<p className="item-label">Created By</p>
														<p className="item-value">
															{this.state.selectedRowData.createdBy}
														</p>
													</div>
												</div>

												<div className="item-view col-md-12 col-lg-12">
													<div className="col-md-6 col-lg-6">
														<p className="item-label">Query Description</p>
														<p className="item-value">
															{this.state.selectedRowData.description}
														</p>
													</div>

													<div className="col-md-6 col-lg-6">
														<p className="item-label">Query Resolution</p>
														<p className="item-value">
															{this.state.selectedRowData.response}
														</p>
													</div>
												</div>
											</div>

											<div className="history-block">
												<h4 className="history-title">History</h4>

												<div className="history-table">
													{
														<BootstrapTable
															ref="table"
															data={
																this.props.QueryReducer.querySelectedHistoryData
																	? this.props.QueryReducer.querySelectedHistoryData
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
																SUB - CATEGORY ID
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
													}
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

export default QueryManage;
