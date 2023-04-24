// React Components
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert2';
import Moment from 'react-moment';
import Datetime from 'react-datetime';
import 'moment-timezone';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import ReactDOM from 'react-dom';
import padStart from 'pad-start';

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import actionImage from '../../assets/img/actions.png';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// Const Files
import * as promocodeData from '../../data/_promocode';
import * as webConstants from '../../constants/WebConstants';
import Loader from '../Comman/Loader';
import * as msgConstants from '../../constants/MsgConstants';

let activeManageMenuPermissions;

class PromoCodeManage extends Component {
	constructor(props, context) {
		super(props, context);
		//console.log('promo code props', props);
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);

		this.state = {
			show: false,
			viewShow: false,
			fields: {
				promoCode: '',
				category: '',
				startDate: '',
				endDate: '',
				discountPercentage: '',
				discountAmount: '',
				id: '',
			},
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
			wrapHeight: '500px',
		};
	}

	componentWillMount() {
		this.setWrapHeight();
		this.getPromoCodeList(this.state.activePage, this.state.perPageSize);
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

	setUserPermissions() {
		let loginUserAllPermissions = this.props.LoginReducer.loginUser.role[0].access_level;
		let activeManageMenu = loginUserAllPermissions.find(menuRow => menuRow.name === 'Manage Promo Code');
		activeManageMenuPermissions = activeManageMenu.actions;
		//console.log('Promocode Permissions' , activeManageMenuPermissions);
	}

	getPromoCodeList(activePage, PerPageSize) {
		this.setState({ manageLoading: true, currentRowIndex: '' });
		this.props
			.PromoCodeList(activePage, PerPageSize)
			.then(response => {
				//console.log(response);
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
				//console.log(error);
				if (error.response !== undefined) {
					this.setState({
						manageLoading: false,
					});
					swal(webConstants.MANAGE_PROMOCODE, error.response.data.message, 'error');
				}
			});
	}

	handlePageChange(pageNumber) {
		//console.log(pageNumber);
		this.setState({
			activePage: pageNumber,
		});
		this.getPromoCodeList(pageNumber, this.state.perPageSize);
	}

	/* Show Add /Edit modal and set data  */
	handleShow(currentOperation, editData) {
		let setEditData;
		let setStateData = {
			show: true,
			currentRowIndex: '',
			currentOperationStatus: currentOperation,
		};
		if (editData) {
			/* startDate: moment(editData.start_date).format('DD-MM-YYYY'),
                            endDate:  moment(editData.end_date).format('DD-MM-YYYY'), */
			setEditData = {
				promoCode: editData.code,
				category: editData.category_id._id,
				startDate: editData.start_date,
				endDate: editData.end_date,
				discountPercentage: editData.percentage,
				discountAmount: editData.amount,
				id: editData._id,
			};
		} else {
			setEditData = {
				promoCode: '',
				category: '',
				startDate: '',
				endDate: '',
				discountPercentage: '',
				discountAmount: '',
				id: '',
			};
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
		this.setState({ show: false, viewShow: false, manageLoading: false,errors: {} });
	}

	/* on change set data for validation */
	handleChange(field, e, dateValue) {
		let fields = this.state.fields;
		let value;
		if (field === 'startDate' || field === 'endDate') {
			value = dateValue;
		} else {
			value = e.target.value;
		}
		fields[field] = value;
		this.setState({ fields });
		this.handleValidation();
	}

	/* Date picker - start */
	handleStartDateChange(date) {
		//console.log(date);
		this.setState({
			fields: { startDate: date },
		});
		this.handleChange('startDate', '', date);
	}

	handleEndDateChange(date) {
		this.setState({
			fields: { endDate: date },
		});
		this.handleChange('endDate', '', date);
	}

	/* Date picker - end */

	/* Set Validations for Form fields */
	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		let currentDate = new Date();
		let alphaNumericExpression = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
		let percentageExpression = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
		let amountExpression = /^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(.[0-9]{2})?$/;

		if (!fields['promoCode']) {
			formIsValid = false;
			errors['promoCode'] = 'Promo Code required';
		}
		// let isAlphanumeric = alphaNumericExpression.test(fields["promoCode"]);
		// if (!isAlphanumeric) {
		//     formIsValid = false;
		//     errors["promoCode"] = "Promo Code should be Alphanumeric.";
		// }

		if (!fields['category']) {
			formIsValid = false;
			errors['category'] = 'Category is required';
		}

		if (!fields['startDate']) {
			formIsValid = false;
			errors['startDate'] = 'Start Date is required';
		}

		if (!fields['endDate']) {
			formIsValid = false;
			errors['endDate'] = 'End Date is required';
		}

		let sDate = new Date(fields['startDate']);
		let eDate = new Date(fields['endDate']);
		let todayDate = new Date();

		if (sDate > todayDate) {
			formIsValid = false;
			errors['startDate'] = 'Start Date is less than or equal to Today.';
		}

		if (eDate < todayDate) {
			formIsValid = false;
			errors['endDate'] = 'End Date is greater than Today.';
		}

		if (sDate >= eDate) {
			formIsValid = false;
			errors['endDate'] = 'End Date is greater than the Start Date.';
		}

		if (new Date(fields['startDate']) === new Date(fields['endDate'])) {
			formIsValid = false;
			errors['endDate'] = 'Start date and end date should not be same.';
			errors['startDate'] = 'Start date and end date should not be same.';
		}

		if (fields['discountPercentage'] == '' && fields['discountAmount'] == '') {
			formIsValid = false;
			errors['discountPercentage'] = 'Either Discount Percentage or Discount Amount should be required.';
			errors['discountAmount'] = 'Either Discount Percentage or Discount Amount should be required.';
		}

		if (fields['discountPercentage']) {
			let isPercentage = percentageExpression.test(fields['discountPercentage']);
			if (!isPercentage) {
				formIsValid = false;
				errors['discountPercentage'] = 'Percentage should be valid';
			}
		}

		if (fields['discountAmount']) {
			let isAmount = amountExpression.test(fields['discountAmount']);
			if (!isAmount) {
				formIsValid = false;
				errors['discountAmount'] = 'Amount should be valid';
			}
		}

		this.setState({ errors: errors });
		return formIsValid;
	}

	/* Save and Edit Functions */
	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			//console.log(this.state.fields);
			this.setState({ loading: true, isButton: 'none' });

			let promocodeParams = {
				code: this.state.fields.promoCode,
				category_id: this.state.fields.category,
				start_date: this.state.fields.startDate,
				end_date: this.state.fields.endDate,
				percentage: this.state.fields.discountPercentage,
				amount: this.state.fields.discountAmount,
			};
			if (this.state.currentOperationStatus === 'New') {
				this.props
					.PromoCodeSave(promocodeParams)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							if (responseData.data.status === 'success') {
								this.setState({
									loading: false,
									isButton: 'block',
									fields: {
										promoCode: '',
										category: '',
										startDate: '',
										endDate: '',
										discountPercentage: '',
										discountAmount: '',
										id: '',
									},
								});
								this.handleClose();
								swal(webConstants.MANAGE_PROMOCODE, msgConstants.ON_SAVE, 'success');
								this.getPromoCodeList(this.state.activePage, this.state.perPageSize);
							}
						}
					})
					.catch(error => {
						if (error.response !== undefined) {
							this.setState({
								loading: false,
								isButton: 'block',
							});
							swal(webConstants.MANAGE_PROMOCODE, error.response.data.message, 'error');
						}
					});
			} else {
				// Edit PromoCode
				this.props
					.PromoCodeUpdate(this.state.fields.id, promocodeParams)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							if (responseData.data.status === 'success') {
								this.setState({
									loading: false,
									isButton: 'block',
									fields: {
										promoCode: '',
										category: '',
										startDate: '',
										endDate: '',
										discountPercentage: '',
										discountAmount: '',
										id: '',
									},
								});
								this.handleClose();
								swal(webConstants.MANAGE_PROMOCODE, msgConstants.ON_UPDATE, 'success');
								this.getPromoCodeList(this.state.activePage, this.state.perPageSize);
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
							swal(webConstants.MANAGE_PROMOCODE, error.response.data.message, 'error');
						}
					});
			}
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
					.PromoCodeRemove(selectedRow._id)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							if (responseData.data.status === 'success') {
								this.setState({
									manageLoading: false,
								});
								swal(webConstants.MANAGE_PROMOCODE, msgConstants.ON_DELETED, 'success');
								this.getPromoCodeList(this.state.activePage, this.state.perPageSize);
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
							swal(webConstants.MANAGE_PROMOCODE, error.response.data.message, 'error');
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
			selectedRow: row,
			manageLoading: true,
			selectedRowData: { category: row.category_id.name, code: row.code.toUpperCase() },
		});
		/* To do history API */
		this.props
			.PromoCodeHistory(row._id)
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
						manageLoading: false,
					});
					swal(webConstants.MANAGE_PROMOCODE, error.response.data.message, 'error');
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
							.PromoCodeDeleteAll(selectIds)
							.then(response => {
								const responseData = response.payload;
								if (responseData.status === 200) {
									if (responseData.data.status === 'success') {
										this.setState({
											manageLoading: false,
										});
										swal(webConstants.MANAGE_PROMOCODE, msgConstants.ON_DELETED, 'success');
										this.getPromoCodeList(this.state.activePage, this.state.perPageSize);
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
									swal(webConstants.MANAGE_PROMOCODE, error.response.data.message, 'error');
								}
							});
					} else {
						//console.log('cancel');
					}
				});
			} else {
				swal(webConstants.MANAGE_PROMOCODE, msgConstants.NO_RECORDS, 'warning');
			}
		} else {
			swal(webConstants.MANAGE_PROMOCODE, msgConstants.ERROR, 'error');
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

	promoCodeFormat(cell) {
		if (!cell) {
			return '';
		} else {
			return cell.toUpperCase();
		}
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
				<p className="item-label"> Promo Code </p>
				<p className="item-value">{row.prevObj.code.toUpperCase()}</p>
				<hr className="view-divider" />
				<p className="item-label"> Category </p>
				<p className="item-value">{row.prevObj.category_id.name}</p>
				<hr className="view-divider" />
				<p className="item-label"> Start Date </p>
				<p className="item-value">
					<Moment format="DD-MMM-YYYY">{row.prevObj.start_date}</Moment>
				</p>
				<hr className="view-divider" />
				<p className="item-label"> End Date </p>
				<p className="item-value">
					<Moment format="DD-MMM-YYYY">{row.prevObj.end_date}</Moment>
				</p>
				<hr className="view-divider" />
				<p className="item-label"> Discount Percentage </p>
				<p className="item-value">
					{row.prevObj.percentage} {row.prevObj.percentage ? '%' : '-'}
				</p>
				<hr className="view-divider" />
				<p className="item-label"> Discount Amount (SAR) </p>
				<p className="item-value">
					{row.prevObj.amount} {row.prevObj.amount ? 'SAR' : '-'}
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
			<ButtonGroup className="my-custom-class pull-right" sizeClass="btn-group-md">
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
			onSelectAll: this.onSelectAll,
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
			width: '100%',
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
									<div className="">{this.state.manageLoading ? <Loader /> : ''}</div>

									<div className="box-header with-border">
										{this.state.manageLoading ? (
											''
										) : (
											<div className="col-lg-12 no-padding">
												<h3 className="manage-page-title">
													Manage {webConstants.MANAGE_PROMOCODE}{' '}
												</h3>
											</div>
										)}
									</div>

									<div className="box-body promocode-tbl custom-pagination no-data-found">
										{!this.state.manageLoading ? (
											<div>
												<BootstrapTable
													ref="table"
													data={
														this.props.PromoCodeReducer.promoCodeData.result
															? this.props.PromoCodeReducer.promoCodeData.result
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
														PROMO CODE ID
													</TableHeaderColumn>

													<TableHeaderColumn
														dataField="any"
														dataFormat={this.indexN.bind(this)}
													>
														PROMO CODE ID
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
														dataField="code"
														dataFormat={this.promoCodeFormat.bind(this)}
													>
														PROMO CODE
													</TableHeaderColumn>

													<TableHeaderColumn
														dataField="start_date"
														dataFormat={this.dateFormatter.bind(this)}
														filterValue={this.filterType.bind(this)}
														filterFormatted
													>
														START DATE
													</TableHeaderColumn>

													<TableHeaderColumn
														dataField="end_date"
														dataFormat={this.dateFormatter.bind(this)}
														filterValue={this.filterType.bind(this)}
														filterFormatted
													>
														END DATE
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
														this.props.PromoCodeReducer.promoCodeData.total
															? this.props.PromoCodeReducer.promoCodeData.total
															: 0
													}
													pageRangeDisplayed={
														this.props.PromoCodeReducer.promoCodeData.pages
															? this.props.PromoCodeReducer.promoCodeData.pages
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

									{/* Add /Edit PromoCode Modal */}
									<Modal show={this.state.show} onHide={this.handleClose}>
										<Modal.Header closeButton>
											<Modal.Title>
												{this.state.currentOperationStatus} {webConstants.MANAGE_PROMOCODE}
											</Modal.Title>
										</Modal.Header>
										<Modal.Body>
											<form
												name="faqForm"
												className="faqForm"
												onSubmit={this.onSubmit.bind(this)}
											>
												<div className="col-md-12 col-sm-12 col-xs-12 no-padding">
													<div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
														<div className="form-group">
															<label>Promo Code</label>
															<input
																type="text"
																className="form-control"
																id="promoCode"
																placeholder="Promo Code"
																ref="promoCode"
																onChange={this.handleChange.bind(this, 'promoCode')}
																value={this.state.fields['promoCode']}
															/>
															<span className="error-message">
																{this.state.errors['promoCode']}
															</span>
														</div>
													</div>

													<div className="col-md-6 col-sm-6 col-xs-6 no-padding-right">
														<div className="form-group">
															<label> Category</label>
															<select
																className="form-control"
																id="category"
																ref="category"
																onChange={this.handleChange.bind(this, 'category')}
																value={this.state.fields['category']}
															>
																<option value="">Select Category</option>
																{this.props.CategoryReducer.categoryData.map(
																	(categoryRow, index) => {
																		return (
																			<option key={index} value={categoryRow._id}>
																				{categoryRow.name}
																			</option>
																		);
																	}
																)}
															</select>
															<span className="error-message">
																{this.state.errors['category']}
															</span>
														</div>
													</div>
												</div>

												<div className="col-md-12 col-sm-12 col-xs-12 no-padding">
													<div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
														<div className="form-group">
															<label>Start Date</label>
															<Datetime
																open={false}
																closeOnSelect={true}
																inputProps={{ placeholder: 'Select Start Date' }}
																input={true}
																selected={this.state.fields.startDate}
																value={
																	this.state.fields.startDate === ''
																		? this.state.fields.startDate
																		: moment(this.state.fields.startDate).format(
																				'DD-MM-YYYY'
																		  )
																}
																timeFormat={false}
																onChange={this.handleStartDateChange}
															/>
															<span className="error-message">
																{this.state.errors['startDate']}
															</span>
														</div>
													</div>

													<div className="col-md-6 col-lg-6 col-xs-6 no-padding-right">
														<div className="form-group">
															<label> End Date</label>
															<Datetime
																open={false}
																closeOnSelect={true}
																inputProps={{ placeholder: 'Select End Date' }}
																input={true}
																selected={this.state.fields.endDate}
																value={
																	this.state.fields.endDate === ''
																		? this.state.fields.endDate
																		: moment(this.state.fields.endDate).format(
																				'DD-MM-YYYY'
																		  )
																}
																dateFormat="DD-MM-YYYY"
																timeFormat={false}
																onChange={this.handleEndDateChange}
															/>
															<span className="error-message">
																{this.state.errors['endDate']}
															</span>
														</div>
													</div>
												</div>

												<div className="col-md-12 col-sm-12 col-xs-12 no-padding">
													<div className="col-md-6 col-sm-6 col-xs-6 no-padding-left">
														<div className="form-group">
															<label>Discount Percentage (%)</label>
															<input
																type="text"
																className="form-control"
																id="discountPercentage"
																placeholder="Discount Percentage"
																ref="discountPercentage"
																onChange={this.handleChange.bind(
																	this,
																	'discountPercentage'
																)}
																value={this.state.fields['discountPercentage']}
															/>
															<span className="error-message">
																{this.state.errors['discountPercentage']}
															</span>
														</div>
													</div>

													<div className="col-md-6 col-sm-6 col-xs-6 no-padding-right">
														<div className="form-group">
															<label>Discount Amount (SAR)</label>
															<input
																type="text"
																className="form-control"
																id="discountAmount"
																placeholder="Discount Amount (SAR)"
																ref="discountAmount"
																onChange={this.handleChange.bind(
																	this,
																	'discountAmount'
																)}
																value={this.state.fields['discountAmount']}
															/>
															<span className="error-message">
																{this.state.errors['discountAmount']}
															</span>
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

									{/* Add /Edit PromoCode Modal */}
									<Modal show={this.state.viewShow} onHide={this.handleClose} bsSize="large">
										<Modal.Header closeButton>
											<Modal.Title>View {webConstants.MANAGE_PROMOCODE}</Modal.Title>
										</Modal.Header>
										<Modal.Body>
											<div className="view-block col-md-12 col-lg-12 no-padding">
												<div className="item-view col-md-6 col-lg-6">
													<p className="item-label">Promo Code</p>
													<p className="item-value">{this.state.selectedRowData.code}</p>
												</div>

												<div className="item-view col-md-6 col-lg-6">
													<p className="item-label">Category Name</p>
													<p className="item-value">{this.state.selectedRowData.category}</p>
												</div>
											</div>

											<div className="view-block col-md-12 col-lg-12 no-padding">
												<div className="item-view col-md-6 col-lg-6">
													<p className="item-label">Start Date</p>
													<p className="item-value">
														<Moment format="DD-MMM-YYYY">
															{this.state.selectedRow.start_date}
														</Moment>
													</p>
												</div>

												<div className="item-view col-md-6 col-lg-6">
													<p className="item-label">End Date</p>
													<p className="item-value">
														<Moment format="DD-MMM-YYYY">
															{this.state.selectedRow.end_date}
														</Moment>
													</p>
												</div>
											</div>

											<div className="view-block col-md-12 col-lg-12 no-padding">
												<div className="item-view col-md-6 col-lg-6">
													<p className="item-label">Discount Percentage</p>
													<p className="item-value">
														{this.state.selectedRow.percentage}{' '}
														{this.state.selectedRow.percentage ? '%' : '-'}
													</p>
												</div>

												<div className="item-view col-md-6 col-lg-6">
													<p className="item-label">Discount Amount (SAR)</p>
													<p className="item-value">
														{this.state.selectedRow.amount}{' '}
														{this.state.selectedRow.amount ? 'SAR' : '-'}
													</p>
												</div>
											</div>

											<div className="history-block">
												<h4 className="history-title">History</h4>

												<div className="history-table">
													{
														<BootstrapTable
															ref="table"
															data={
																this.props.PromoCodeReducer.promoCodeSelectedHistoryData
																	? this.props.PromoCodeReducer
																			.promoCodeSelectedHistoryData
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

export default PromoCodeManage;
