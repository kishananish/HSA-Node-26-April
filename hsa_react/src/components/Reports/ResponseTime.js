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
import * as reportDataList from '../../data/_reportResponseTime';
import * as webConstants from '../../constants/WebConstants';
import swal from 'sweetalert2';

let serviceProviderDataArray = [];

class ResponseTime extends Component {
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
			serviceProviderList: [],
			selectedServiceProvider: '',
			errors: {},
		};
		this.handleServiceProviderChange = this.handleServiceProviderChange.bind(this);
		this.handleFromDateChange = this.handleFromDateChange.bind(this);
		this.handleToDateChange = this.handleToDateChange.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
	}

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
		this.getReportData(
			this.state.filters.fromDate,
			this.state.filters.toDate,
			this.state.selectedServiceProvider.value,
			this.state.activePage,
			this.state.perPageSize
		);
	}

	componentDidMount() {
		this.setWrapHeight();
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
		this.handleChange('fromDate', date);
	}

	handleToDateChange(date) {
		this.setState({
			filters: { toDate: date },
		});
		this.handleChange('toDate', date);
	}
	/* Date picker - end */

	/* on change set data for validation */
	handleChange(filter, optionalData) {
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
		console.log('ctrae :', cell)
		return <Moment format="DD-MMM-YYYY">{cell}</Moment>;
	}

	dataRoundup(cell) {
		console.log(cell);
		if (!cell) {
			return '';
		}
		return Math.round(cell * 100) / 100;
	}

	serviceProviderName(cell) {
		if (!cell) {
			return '';
		}
		return cell.first_name + ' ' + cell.last_name;
	}

	serviceProviderArea(cell) {
		if (!cell) {
			return '';
		}
		return cell.area_assigned;
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
			<ButtonGroup className="my-report-custom-class pull-right" sizeClass="btn-group-md">
				<form name="reportForm" className="reportForm" onSubmit={this.onSubmit.bind(this)}>
					<div className="date-wrapper report-date-format">
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

					<div className="select-wrapper">
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
					</div>
					<div className="button-wrapper">
						<button className="btn btn-success green-button"> SUBMIT </button>
					</div>
				</form>
			</ButtonGroup>
		);
	};

	getReportData(startDate, endDate, userId, pageNumber, perPageSize) {
		startDate = new Date(startDate).toISOString();
		endDate = new Date(endDate).toISOString();
		this.setState({ manageLoading: true });
		this.props
			.ResponseTimeReportData(startDate, endDate, userId, pageNumber, perPageSize)
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
				console.log(error);
				if (error.response !== undefined) {
					this.setState({
						manageLoading: false,
					});
					swal(webConstants.REPORT_SERVICE_REQUEST, error.response.data.message, 'error');
				}
			});
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			let reportParams = {
				from_date: moment(this.state.filters.fromDate),
				to_date: moment(this.state.filters.toDate),
				service_provider: this.state.selectedServiceProvider.value
					? this.state.selectedServiceProvider.value
					: '',
			};
			console.log(reportParams);
			this.getReportData(
				this.state.filters.fromDate,
				this.state.filters.toDate,
				this.state.selectedServiceProvider.value,
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
					label: 'TOTAL TIME',
					columnIndex: 5,
					align: 'left',
				},
				{
					label: 'Total value',
					columnIndex: 6,
					align: 'left',
					formatter: tableData => {
						let responseTime = 0;
						let tableDataLen = tableData.length;
						let i;
						for (i = 0; i < tableDataLen; i++) {
							responseTime = responseTime + tableData[i].response_time;
						}
						console.log('total', responseTime);
						return <ReportTimeCalculation timeInSeconds={responseTime} />;
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
													<h3 className="manage-page-title">
														{' '}
														{webConstants.REPORT_RESPONSE_TIME}{' '}
													</h3>
												</div>
											)}
									</div>
									<div className="box-body response-time-report-tbl custom-pagination no-data-found report-tbl">
										{!this.state.manageLoading ? (
											<div>
												<BootstrapTable
													ref="table"
													data={this.props.ReportReducer.responseTimeData}
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
														dataField="_id"
														isKey={true}
														hidden={true}
													>
														ID
													</TableHeaderColumn>
													<TableHeaderColumn
														dataField="any"
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
													<TableHeaderColumn dataField="location">
														AREA ASSIGNED
													</TableHeaderColumn>
													<TableHeaderColumn
														dataField="response_time"
														dataFormat={this.dataRoundup.bind(this)}
													>
														RESPONSE TIME (IN SECONDS)
													</TableHeaderColumn>
												</BootstrapTable>
												{/* <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                                                    totalItemsCount={this.props.ReportReducer.responseTimeData.total}
                                                    pageRangeDisplayed={this.props.ReportReducer.responseTimeData.pages}
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

export default ResponseTime;
