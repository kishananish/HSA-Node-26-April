// React Components
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import Moment from 'react-moment';
import Datetime from 'react-datetime';
import 'moment-timezone';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import ReactDOM from 'react-dom';
import padStart from 'pad-start';
import Select from 'react-select';

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from '../Comman/Loader';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import ReportTimeCalculation from '../Comman/ReportTimeCalculation';

// Const Files
import * as reportDataList from '../../data/_reportActiveTime';
import * as webConstants from '../../constants/WebConstants';
import * as cityData from '../../data/_city';
import swal from 'sweetalert2';

let serviceProviderDataArray = [];
let paymentTypeData = [{ value: '', label: 'All' }, { value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }];

class Earnings extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			manageLoading: false,
			filters: {
				fromDate: new Date(moment().format('YYYY-MM-01')),
				toDate: new Date(moment().format('YYYY-MM-') + moment().daysInMonth()),
			},
			activePage: 1,
			perPageSize: webConstants.PER_PAGE_SIZE,
			wrapHeight: '500px',
			categoryList: [],
			serviceProviderList: [],
			selectedCity: '',
			selectedServiceProvider: '',
			selectedPaymentType: '',
			errors: {},
		};
		this.handleCityChange = this.handleCityChange.bind(this);
		this.handleServiceProviderChange = this.handleServiceProviderChange.bind(this);
		this.handlePaymentTypeChange = this.handlePaymentTypeChange.bind(this);
		this.handleFromDateChange = this.handleFromDateChange.bind(this);
		this.handleToDateChange = this.handleToDateChange.bind(this);
	}

	setWrapHeight() {
		let wrapDivHeight;
		let windowHeight = window.innerHeight;
		let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
		if (domElement) {
			let contentHeight = domElement.clientHeight;
			if (windowHeight >= contentHeight) {
				wrapDivHeight = '100vh';
			} else {
				wrapDivHeight = '100%';
			}
			this.setState({ wrapHeight: wrapDivHeight });
		}
	}

	componentWillMount() {
		this.setWrapHeight();
		let serviceProviderData = this.props.ServiceProviderReducer.serviceProviderUserListData.result;
		if (serviceProviderData.length > 0) {
			let j;
			for (j = 0; j < serviceProviderData.length; j++) {
				serviceProviderDataArray.push({
					value: serviceProviderData[j].userId,
					label: serviceProviderData[j].first_name + ' ' + serviceProviderData[j].last_name,
				});
			}
			this.setState({
				serviceProviderList: serviceProviderDataArray,
			});
		}
		this.getCityData();
		this.getReportData(this.state.filters.fromDate, this.state.filters.toDate);
	}

	getCityData() {
		this.setState({ manageLoading: true });
		this.props
			.CityList()
			.then(response => {
				const responseData = response.payload;
				if (responseData.status === 200) {
					if (responseData.data.status === 'success') {
						const cityNamesArray = responseData.data.data;
						this.setState({ manageLoading: false, cityList: cityNamesArray });
					}
				}
			})
			.catch(error => {
				if (error.response !== undefined) {
					this.setState({ manageLoading: false });
				}
			});
	}

	handleCityChange(selectedCityOption) {
		this.setState({
			selectedCity: selectedCityOption,
		});
		this.handleChange('city', '', selectedCityOption);
	}

	handlePaymentTypeChange(selectedPaymentType) {
		this.setState({
			selectedPaymentType: selectedPaymentType,
		});
		this.handleChange('paymentType', '', selectedPaymentType);
	}

	handleServiceProviderChange(selecetdServiceProviderOption) {
		this.setState({
			selectedServiceProvider: selecetdServiceProviderOption,
		});
		this.handleChange('serviceProvider', selecetdServiceProviderOption);
	}
	/* Date picker - start */
	handleFromDateChange(date) {
		this.setState({
			filters: { fromDate: date },
		});
		this.handleChange('fromDate', '', date);
	}

	handleToDateChange(date) {
		this.setState({
			filters: { toDate: date },
		});
		this.handleChange('toDate', '', date);
	}
	/* Date picker - end */

	/* on change set data for validation */
	handleChange(filter, e, optionalData) {
		let filters = this.state.filters;
		filters[filter] = optionalData;
		this.setState({ filters });
		this.handleValidation();
	}

	handlePageChange(pageNumber) {
		//console.log(pageNumber);
		this.setState({
			activePage: pageNumber,
		});
		this.getReportData(
			this.state.filters.fromDate,
			this.state.filters.toDate,
			this.state.selectedServiceProvider.value,
			this.state.selectedCity.value,
			this.state.selectedPaymentType.value,
			pageNumber,
			this.state.perPageSize
		);
	}

	handleValidation() {
		let filters = this.state.filters;
		let errors = {};
		let formIsValid = true;
		let sDate = new Date(filters['fromDate']);
		let eDate = new Date(filters['toDate']);

		if (!filters['fromDate']) {
			formIsValid = false;
			errors['fromDate'] = 'From Date is required';
		}

		if (!filters['toDate']) {
			formIsValid = false;
			errors['toDate'] = 'To Date is required';
		}

		if (sDate > eDate) {
			formIsValid = false;
			errors['toDate'] = 'To Date is greater than or equal to the From Date.';
		}
		this.setState({ errors: errors });
		return formIsValid;
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

	/* Set Date format - for date column */
	dateFormatter(cell) {
		if (!cell) {
			return '';
		}
		return <Moment format="DD-MMM-YYYY">{cell}</Moment>;
	}

	paymentType(cell) {
		if (!cell) {
			return '';
		}
		return cell.toUpperCase();
	}

	serviceProviderName(cell) {
		if (!cell) {
			return '';
		}
		return cell.service_provider_id.first_name + ' ' + cell.service_provider_id.last_name;
	}

	serviceProviderArea(cell) {
		if (!cell) {
			return '';
		}
		return cell.service_provider_id.area_assigned;
	}

	paymentReceived(cell) {
		console.log(cell);
		if (!cell) {
			return 'No';
		} else {
			return 'Yes';
		}
	}

	/* Set Search bar */
	customSearchbar = props => {
		return (
			<div className="search-wrapper increase-width">
				{props.components.btnGroup}
				{props.components.searchPanel}
			</div>
		);
	};

	/* Set Add New button */
	customToolbarButtons = props => {
		return (
			<ButtonGroup className="my-report-custom-class" sizeClass="btn-group-md">
				<form name="reportForm" className="reportForm" onSubmit={this.onSubmit.bind(this)}>
					<div className="date-wrapper float-right-sm">
						<label className="from-label pull-left"> From </label>
						<span className="from-date pull-left calendar-full-width">
							<Datetime
								open={false}
								closeOnSelect={true}
								inputProps={{ placeholder: 'From Date' }}
								input={true}
								selected={this.state.filters.fromDate}
								value={
									this.state.filters.fromDate === ''
										? this.state.filters.fromDate
										: moment(this.state.filters.fromDate).format('DD-MM-YYYY')
								}
								timeFormat={false}
								onChange={this.handleFromDateChange}
							/>
							<p className="error-message">{this.state.errors['fromDate']}</p>
						</span>

						<label className="to-label pull-left"> To </label>
						<span className="to-date pull-left calendar-full-width">
							<Datetime
								open={false}
								closeOnSelect={true}
								timeFormat={false}
								value={this.state.filters.toDate}
								dateFormat="DD-MM-YYYY"
								inputProps={{ placeholder: 'TO DATE' }}
								onChange={this.handleToDateChange}
							/>
							<p className="error-message">{this.state.errors['toDate']}</p>
						</span>
					</div>

					<div className="select-wrapper float-right-sm">
						<span className="name-select pull-left width-150 report-autocomplete-select">
							<Select
								placeholder="Service Provider"
								value={this.state.selectedServiceProvider}
								options={this.state.serviceProviderList}
								ref="serviceProvider"
								id="serviceProvider"
								isSearchable="true"
								onChange={this.handleServiceProviderChange}
							/>
						</span>

						<span className="category-select pull-left width-150 report-autocomplete-select">
							<Select
								placeholder="Select City"
								value={this.state.selectedCity}
								options={this.state.cityList}
								ref="city"
								id="city"
								onChange={this.handleCityChange}
							/>
						</span>

						<span className="name-select  pull-left width-150 report-autocomplete-select">
							<Select
								placeholder="Select Payment Type"
								value={this.state.selectedPaymentType}
								options={paymentTypeData}
								ref="paymentType"
								id="paymentType"
								onChange={this.handlePaymentTypeChange}
							/>
						</span>
					</div>
					<div className="button-wrapper">
						<button className="btn btn-success green-button"> SUBMIT </button>
					</div>
				</form>
			</ButtonGroup>
		);
	};

	getReportData(startDate, endDate, userId, city, paymentType) {
		startDate = new Date(startDate).toISOString();
		endDate = new Date(endDate).toISOString();
		this.setState({ manageLoading: true });
		this.props
			.EarningReportData(startDate, endDate, userId, city, paymentType)
			.then(response => {
				let responseData = response.payload;
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
					swal(webConstants.REPORT_EARNING, error.response.data.message, 'error');
				}
			});
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			let reportParams = {
				from_date: moment(this.state.filters.fromDate),
				to_date: moment(this.state.filters.toDate),
				city: this.state.selectedCity.value ? this.state.selectedCity.value : '',
				service_provider: this.state.selectedServiceProvider.value
					? this.state.selectedServiceProvider.value
					: '',
				payment_type: this.state.selectedPaymentType.value ? this.state.selectedPaymentType.value : '',
			};
			// console.log(reportParams);
			this.getReportData(
				this.state.filters.fromDate,
				this.state.filters.toDate,
				this.state.selectedServiceProvider.value,
				this.state.selectedCity.value,
				this.state.selectedPaymentType.value,
				this.state.activePage,
				this.state.perPageSize
			);
		}
	}

	render() {
		// console.log(this.state.wrapHeight);
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

		const calculationData = [
			[
				{
					label: 'TOTAL EARNINGS ',
					columnIndex: 7,
					align: 'right',
				},
				{
					label: 'Total cost',
					columnIndex: 8,
					align: 'left',
					formatter: tableData => {
						let totalCost = 0;
						for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
							totalCost = parseInt(totalCost) + parseInt(tableData[i].total_cost);
						}
						return <strong>{totalCost.toLocaleString('en')}</strong>;
					},
				},
				{
					label: 'Total Deposit',
					columnIndex: 9,
					align: 'left',
					formatter: tableData => {
						let totalPaid = 0;
						for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
							totalPaid = parseInt(totalPaid) + parseInt(tableData[i].total_amount_paid);
						}
						return <strong>{totalPaid.toLocaleString('en')}</strong>;
					},
				},
				{
					label: 'Total pending',
					columnIndex: 10,
					align: 'left',
					formatter: tableData => {
						let totalPending = 0;
						for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
							totalPending = parseInt(totalPending) + parseInt(tableData[i].total_amount_pending);
						}
						return <strong>{totalPending.toLocaleString('en')}</strong>;
					},
				},
			],
		];

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
												<h3 className="manage-page-title"> {webConstants.REPORT_EARNING} </h3>
											</div>
										)}
									</div>
									<div className="box-body earning-report-tbl custom-pagination no-data-found report-tbl">
										{!this.state.manageLoading ? (
											<div>
												<BootstrapTable
													ref="table"
													data={this.props.ReportReducer.earningData}
													selectRow={selectRowProp}
													pagination={false}
													footer={true}
													footerData={calculationData}
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
														dataField="service_provider_id"
														isKey={true}
														hidden={true}
													>
														ID
													</TableHeaderColumn>
													<TableHeaderColumn
														dataField="service_provider_id"
														dataFormat={this.indexN.bind(this)}
													>
														ID
													</TableHeaderColumn>
													<TableHeaderColumn
														dataField="date_of_joining"
														dataFormat={this.dateFormatter.bind(this)}
													>
														DATE OF JOINING
													</TableHeaderColumn>
													<TableHeaderColumn dataField="first_name">
														FIRST NAME
													</TableHeaderColumn>
													<TableHeaderColumn dataField="last_name">
														LAST NAME
													</TableHeaderColumn>
													<TableHeaderColumn dataField="area_assigned">
														SERVICE PROVIDER AREA
													</TableHeaderColumn>
													<TableHeaderColumn dataField="payment_mode">
														TYPE OF PAYMENT
													</TableHeaderColumn>
													<TableHeaderColumn dataField="total_amount_paid">
														PAYMENT RECEIVED
													</TableHeaderColumn>
													<TableHeaderColumn dataField="total_cost">
														TOTAL COST (SAR){' '}
													</TableHeaderColumn>
													<TableHeaderColumn dataField="total_amount_deposit">
														{' '}
														DEPOSIT (SAR){' '}
													</TableHeaderColumn>
													<TableHeaderColumn dataField="total_amount_pending">
														{' '}
														PENDING (SAR){' '}
													</TableHeaderColumn>
												</BootstrapTable>

												{/* <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                                                    totalItemsCount={this.props.ReportReducer.earningData.total}
                                                    pageRangeDisplayed={this.props.ReportReducer.earningData.pages}
                                                    onChange={this.handlePageChange}
                                                    prevPageText="Previous"
                                                    nextPageText="Next"
                                                /> */}
											</div>
										) : (
											''
										)}
									</div>{' '}
									{/* -- Box body --*/}
								</div>{' '}
								{/* <!-- Box --> */}
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

export default Earnings;
