// React Components
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2';
import StarRatingComponent from 'react-star-rating-component';

// CSS / Component
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import '../../assets/css/progress-bar.css';
import Loader from '../Comman/Loader';

// const Files
import * as webConstants from '../../constants/WebConstants';
import * as ServiceRequestStepData from '../../data/_serviceRequestSteps';
import * as msgConstants from '../../constants/MsgConstants';
import * as cityData from '../../data/_city';
import * as apiConstants from '../../constants/APIConstants';
import * as serviceRequestStepData from '../../data/_serviceRequestSteps';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';
import { Modal } from 'react-bootstrap';

class ServiceRequestAdd extends Component {
	constructor(props, context) {
		super(props, context);
		//console.log(props);
		//console.log('edit id', this.props.location.id);

		this.handleCityChange = this.handleCityChange.bind(this);
		this.quotehandleClose = this.quotehandleClose.bind(this);

		this.state = {
			fields: { id: '', addressLine: '', zipcode: '', city: '', resolution: '' },
			selectedEditData: {},
			errors: {},
			loading: false,
			wrapHeight: '500px',
			selectedLanguage: '',
			selectedCity: '',
			filterProgressData: [],
			viewQuoteShow: false,
			quoteDetailsView: {},
			cityList: [],
		};
	}

	componentWillMount() {
		this.setWrapHeight();
		this.getCityData();
		if (this.props.location.id) {
			this.getSelectedData(this.props.location.id);
		} else {
			this.props.history.push(menuLinkConstants.SERVICE_REQUEST_MANAGE_LINK);
		}
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

	getCityData() {
		this.setState({ manageLoading: true });
		this.props
			.CityList()
			.then(response => {
				const responseData = response.payload;
				if (responseData.status === 200) {
					if (responseData.data.status === 'success') {
						const cityNames = responseData.data.data;
						let cityNamesArray = [];
						for (let i = 0; i < cityNames.length; i++) {
							cityNamesArray.push({ value: cityNames[i].name, label: cityNames[i].name });
						}
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

	/* on change set data for validation */
	handleChange(field, e, optionalData) {
		let fields = this.state.fields;
		let value;
		if (field === 'city' || field === 'language') {
			value = optionalData.value;
		} else {
			value = e.target.value;
		}
		fields[field] = value;
		this.setState({ fields });
		this.handleValidation();
	}

	handleCityChange(selectedCityOption) {
		this.setState({
			selectedCity: selectedCityOption,
		});
		this.handleChange('city', '', selectedCityOption);
	}

	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		//let zipCodeRegex = /^[0-9]{6}([- /]?[0-9]{5})?$/;

		if (!fields['addressLine']) {
			formIsValid = false;
			errors['addressLine'] = 'Address is required.';
		}
		if (!fields['zipcode']) {
			formIsValid = false;
			errors['zipcode'] = 'Zipcode is required.';
		}
		/*let isValidZipcode = zipCodeRegex.test(fields["zipcode"]);
        if (!isValidZipcode) {
            formIsValid = false;
            errors["zipcode"] = "Zipcode should be valid.";
        }*/
		if (!fields['city']) {
			formIsValid = false;
			errors['city'] = 'Please select city.';
		}
		this.setState({ errors: errors });
		return formIsValid;
	}

	getProgressData(currentProgress) {
		let testData = [];
		let tempProgressArray = ['accepted', 'rejected', 'quote_accepted', 'quote_rejected'];
		let isProgressAvailable = tempProgressArray.includes(currentProgress);
		if (isProgressAvailable) {
			if (currentProgress === 'accepted') {
				testData = serviceRequestStepData.serviceRequestSteps.filter(function (selectedProgress) {
					return selectedProgress.progress !== 'rejected';
				});
			} else if (currentProgress === 'rejected') {
				testData = serviceRequestStepData.serviceRequestSteps.filter(function (selectedProgress) {
					return selectedProgress.progress !== 'accepted';
				});
			} else if (currentProgress === 'quote_accepted') {
				testData = serviceRequestStepData.serviceRequestSteps.filter(function (selectedProgress) {
					return selectedProgress.progress !== 'quote_rejected';
				});
			} else if (currentProgress === 'quote_rejected') {
				testData = serviceRequestStepData.serviceRequestSteps.filter(function (selectedProgress) {
					return selectedProgress.progress !== 'quote_accepted';
				});
			}
		} else {
			testData = serviceRequestStepData.serviceRequestSteps.filter(function (selectedProgress) {
				return selectedProgress.progress !== 'quote_rejected' && selectedProgress.progress !== 'rejected';
			});
		}
		return testData;
	}

	/* Set Edit Data */
	getSelectedData(selectedId) {
		if (selectedId) {
			this.setState({
				loading: true,
			});
			this.props
				.ServiceRequestView(selectedId)
				.then(response => {
					const responseData = response.payload;
					if (responseData.status === 200) {
						if (responseData.data.status === 'success') {
							let serviceRequestData = responseData.data.data;
							let selectedCityData;
							let paymentDetails = '';
							// console.log('serviceRequestData', serviceRequestData);
							selectedCityData = this.state.cityList.filter(function (cityRow) {
								// return cityRow.value == serviceRequestData.address.city;
								return cityRow.value == serviceRequestData.customer_id.addresses.length ? serviceRequestData.customer_id.addresses[0].city : '';
							});
							let serviceProviderName = '-';
							if (serviceRequestData.service_provider_id) {
								serviceProviderName =
									serviceRequestData.service_provider_id ?
										serviceRequestData.service_provider_id.first_name +
										' ' +
										serviceRequestData.service_provider_id.last_name : 'NA'
							}
							let selectedProgressData = serviceRequestStepData.serviceRequestSteps.find(
								requestProgress => requestProgress.progress == serviceRequestData.progress
							);

							let reviewComment = '';
							let reviewRating = 0;
							if (serviceRequestData.review_id) {
								reviewComment = serviceRequestData.review_id.service_provider_comment;
								reviewRating = serviceRequestData.review_id.service_provider_rating;
							}

							let quoteDetails = [];
							let serviceCost = 0;
							let serviceComment = '';
							if (serviceRequestData.quote.length > 0) {
								quoteDetails = serviceRequestData.quote;
								serviceCost = serviceRequestData.service_cost;
								serviceComment = serviceRequestData.comment;
							}

							let totalCost = 0;
							let totalAmountPaid = 0;
							let totalAmountPending = 0;
							paymentDetails = serviceRequestData.payment_id;
							let paymentDate = '';
							let paymentMode = '';
							if (paymentDetails != undefined) {
								totalCost = paymentDetails.total_cost;
								totalAmountPaid = paymentDetails.total_amount_paid;
								totalAmountPending = paymentDetails.total_amount_pending;
								paymentDate = paymentDetails.created_at;
								paymentMode = paymentDetails.payment_mode;
							}
							let filterProgressData = this.getProgressData(serviceRequestData.progress);
							this.setState({
								loading: false,
								filterProgressData: filterProgressData,
								selectedEditData: {
									firstName: serviceRequestData.customer_id.first_name,
									lastName: serviceRequestData.customer_id.last_name,
									mobileNo: serviceRequestData.customer_id.mobile_no,
									email: serviceRequestData.customer_id.email,
									serviceProviderName: serviceProviderName,
									description: serviceRequestData.description,
									progress: serviceRequestData.progress,
									progressId: selectedProgressData ? selectedProgressData.id : '',
									reviewComment: reviewComment,
									reviewRating: reviewRating,
									quote: serviceRequestData.quote,
									quoteDetails: {
										data: quoteDetails,
										serviceCost: serviceCost,
										serviceComment: serviceComment,
									},
									serviceCost: serviceCost,
									serviceComment: serviceComment,
									paymentDetails: paymentDetails,
									totalCost: totalCost,
									totalAmountPaid: totalAmountPaid,
									totalAmountPending: totalAmountPending,
									paymentDate: paymentDate,
									paymentMode: paymentMode,
									complaintRaised: serviceRequestData.user_complain,
									complaintResolution: serviceRequestData.complain_resolution,
								},
								fields: {
									// addressLine: serviceRequestData.address.address,
									addressLine: serviceRequestData.address ? serviceRequestData.address.address : 'NA',
									// zipcode: serviceRequestData.address.zipcode,
									zipcode: serviceRequestData.address ? serviceRequestData.address.zipcode : 'NA',
									city: serviceRequestData.address ? serviceRequestData.address.city : 'NA',
									resolution: serviceRequestData.complain_resolution,
								},
								selectedCity: serviceRequestData.address.city,
							});
						}
					}
				})
				.catch(error => {
					if (error.response !== undefined) {
						this.setState({
							loading: false,
						});
						swal(webConstants.MANAGE_SERVICE_REQUEST, error.response.data.message, 'error');
					}
				});
		}
	}

	onStarClick(nextValue) {
		this.setState({ rating: nextValue });
	}

	viewQuoteDetailsModalShow() {
		this.setState({ viewQuoteShow: true, currentRowIndex: '' });
	}
	quotehandleClose() {
		this.setState({ viewQuoteShow: false });
	}

	onQuoteDetails(quoteDetails) {
		//console.log(quoteDetails.data);
		let i;
		let materialCost = 0;
		let totalCost = 0;
		for (i = 0; i < quoteDetails.data.length; i++) {
			materialCost = parseInt(materialCost) + parseInt(quoteDetails.data[i].cost);
		}
		totalCost = parseInt(quoteDetails.serviceCost) + parseInt(materialCost);
		this.setState({
			quoteDetailsView: {
				data: quoteDetails.data,
				serviceCost: quoteDetails.serviceCost,
				serviceComment: quoteDetails.serviceComment,
				totalMaterialCost: materialCost,
				totalCost: totalCost,
			},
		});
		this.viewQuoteDetailsModalShow();
	}

	/* Save and Edit Functions */
	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			this.setState({ loading: true, isButton: 'none' });
			let addressDetails = {
				address: this.state.fields.addressLine,
				city: this.state.fields.city,
				zipcode: this.state.fields.zipcode,
			};
			//console.log(addressDetails);
			let resolutionParams = {
				service_id: this.props.location.id,
				complain_resolution: this.state.fields.resolution,
			};
			let serviceRequestParams = {
				address: addressDetails,
			};
			this.props
				.ServiceRequestUpdate(this.props.location.id, serviceRequestParams)
				.then(response => {
					const responseData = response.payload;
					if (responseData.status === 200) {
						this.setState({
							loading: false,
							isButton: 'block',
							fields: {
								id: '',
								addressLine: '',
								zipcode: '',
								city: '',
							},
							selectedCity: '',
						});
						swal(webConstants.MANAGE_SERVICE_REQUEST, msgConstants.ON_UPDATE, 'success');
						this.props.history.push(menuLinkConstants.SERVICE_REQUEST_MANAGE_LINK);
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
						swal(webConstants.MANAGE_SERVICE_REQUEST, error.response.data.message, 'error');
					}
				});

			/* Resolution Add */
			if (this.state.fields.resolution) {
				this.props
					.ServiceRequestResolution(resolutionParams)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							this.setState({
								loading: false,
								isButton: 'block',
								fields: {
									id: '',
									addressLine: '',
									zipcode: '',
									city: '',
									resolution: '',
								},
								selectedCity: '',
							});
							swal(webConstants.MANAGE_SERVICE_REQUEST, msgConstants.ON_UPDATE, 'success');
							this.props.history.push(menuLinkConstants.SERVICE_REQUEST_MANAGE_LINK);
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
							swal(webConstants.MANAGE_SERVICE_REQUEST, error.response.data.message, 'error');
						}
					});
			}
		} else {
			//console.log("Form has errors.");
			this.setState({ isLogin: false });
		}
	}

	render() {
		return (
			<div>
				<HeaderContainer />
				<SidebarContainer />
				<div className="content-wrapper" ref="bodyContent" style={{ minHeight: this.state.wrapHeight }}>
					<section className="content-header">
						<div className="row">
							<div className="col-md-12">
								<div className="customer-box">
									<div className="box-header with-border">
										<h3 className="page-title display-in-bk">
											Edit {webConstants.MANAGE_SERVICE_REQUEST}{' '}
										</h3>
									</div>
									{this.state.loading ? (
										<div style={{ height: '100vh' }}>
											<Loader />
										</div>
									) : (
											<div className="box-body">
												<form
													name="serviceRequestForm"
													className="serviceRequestForm"
													onSubmit={this.onSubmit.bind(this)}
												>
													<div className="form_wrapper col-md-12">
														<div className="row no-margin">
															<div className="form-header">
																<div className="col-md-12 no-padding">
																	<div className="row">
																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">
																					First Name
																			</label>
																				<p>
																					{this.state.selectedEditData.firstName}
																				</p>
																			</div>
																		</div>

																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">
																					Last Name
																			</label>
																				<p>
																					{this.state.selectedEditData.lastName}
																				</p>
																			</div>
																		</div>

																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">
																					Email ID
																			</label>
																				<p>{this.state.selectedEditData.email}</p>
																			</div>
																		</div>

																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">
																					Phone No
																			</label>
																				<p>
																					{this.state.selectedEditData.mobileNo}
																				</p>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														{/* section 1 */}

														<div className="row no-margin">
															<div className="form-header">
																<div className="col-md-12  no-margin no-padding">
																	<div className="row">
																		<h4 className="form-sub-heading"> Address </h4>
																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">
																					Address Line{' '}
																				</label>
																				<input
																					type="text"
																					className="form-control"
																					id="addressLine"
																					placeholder="Address Line"
																					ref="addressLine"
																					value={this.state.fields['addressLine']}
																					onChange={this.handleChange.bind(
																						this,
																						'addressLine'
																					)}
																				/>
																				<span className="error-message">
																					{this.state.errors['addressLine']}
																				</span>
																			</div>
																		</div>

																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">Zipcode</label>
																				<input
																					type="number"
																					className="form-control"
																					id="zipcode"
																					placeholder="Zipcode"
																					ref="zipcode"
																					value={this.state.fields['zipcode']}
																					onChange={this.handleChange.bind(
																						this,
																						'zipcode'
																					)}
																				/>
																				<span className="error-message">
																					{this.state.errors['zipcode']}
																				</span>
																			</div>
																		</div>

																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group autocomplete-select">
																				<label className="top-label">City</label>
																				<Select
																					placeholder="Select City"
																					value={this.state.selectedCity}
																					options={this.state.cityList}
																					ref="city"
																					id="city"
																					onChange={this.handleCityChange}
																				/>
																				<span className="error-message">
																					{this.state.errors['city']}
																				</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														{/* section 2 */}

														<div className="row no-margin">
															<div className="form-header">
																<div className="col-md-12  no-padding">
																	<div className="row">
																		<div className="col-md-3 col-sm-6 col-xs-6">
																			<div className="form-group">
																				<label className="top-label">
																					Service Provider
																			</label>
																				<p>
																					{
																						this.state.selectedEditData
																							.serviceProviderName
																					}
																				</p>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														{/* section 2 */}

														<div className="row no-margin no-padding">
															<div className="section-wrapper">
																<div className="row">
																	<h4 className="form-sub-heading"> Service Details </h4>
																</div>

																<div className="form-group">
																	<label className="top-label">Description</label>
																	<p>{this.state.selectedEditData.description}</p>
																</div>

																<div className="form-group">
																	<label className="top-label"> Progress</label>
																</div>

																<ul className="progress-tracker">
																	{this.state.filterProgressData.map((stepRow, index) => {
																		let stepClass = '';
																		let progressId = this.state.selectedEditData
																			.progressId;
																		if (
																			stepRow.progress ===
																			this.state.selectedEditData.progress
																		) {
																			stepClass = 'is-active';
																		}
																		if (stepRow.id < progressId) {
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
																	})}
																</ul>
															</div>
														</div>
														<div className="request-content row section-wrapper">
															<div className="col-sm-4 brd-right">
																{this.state.selectedEditData.quoteDetails > 0 ? (
																	<div className="data">
																		{this.state.selectedEditData.quote.length > 0 ? (
																			<a
																				onClick={() =>
																					this.onQuoteDetails(
																						this.state.selectedEditData
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

																{this.state.selectedEditData.paymentDetails != undefined ? (
																	<div>
																		<div className="row">
																			<div className="col-sm-12 col-md-6">
																				<p className="title">Payment Details</p>
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
																						this.state.selectedEditData
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
																					{this.state.selectedEditData.totalCost}{' '}
																					SAR
																			</div>
																			</div>
																		</div>
																		<div className="row">
																			<div className="col-sm-12 col-md-6">
																				<div className="title">Amount Deposit</div>
																			</div>
																			<div className="col-sm-12 col-md-6">
																				<div className="data">
																					{
																						this.state.selectedEditData
																							.totalAmountPaid
																					}{' '}
																					SAR
																			</div>
																			</div>
																		</div>
																		<div className="row">
																			<div className="col-sm-12 col-md-6">
																				<div className="title">Amount Pending</div>
																			</div>
																			<div className="col-sm-12 col-md-6">
																				<div className="data">
																					{
																						this.state.selectedEditData
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
																{this.state.selectedEditData.reviewComment ? (
																	<div>
																		{/*<div className="title">Ratings & Review
                                                                             </div>
                                                                             <div className="ratings-wrapper">
                                                                                 <StarRatingComponent
                                                                                     starCount={webConstants.TOTAL_RATINGS}
                                                                                     value={this.state.selectedEditData.reviewRating}
                                                                                 />
                                                                             </div> */}

																		<div className="title"> Ratings & Review </div>
																		<div className="comments-section">
																			<div className="review-rating">
																				<StarRatingComponent
																					starCount={webConstants.TOTAL_RATINGS}
																					value={
																						this.state.selectedEditData
																							.reviewRating
																					}
																				/>
																			</div>
																		</div>
																		<br />

																		<div className="title">Comments</div>
																		<div className="comments-section">
																			{this.state.selectedEditData.reviewComment}
																		</div>
																	</div>
																) : (
																		''
																	)}
															</div>

															<div className="col-sm-4">
																{this.state.selectedEditData.complaintRaised !=
																	undefined ? (
																		<div>
																			<div className="title">Complaint Raised</div>
																			<div className="comments-section">
																				{this.state.selectedEditData.complaintRaised}
																			</div>
																		</div>
																	) : (
																		''
																	)}
															</div>
														</div>

														<div className="complaint-resolution-textarea section-wrapper">
															{this.state.selectedEditData.complaintRaised != undefined ? (
																<div>
																	<div className="title">Complaint Resolution</div>
																	<textarea
																		placeholder="Complaint Resolution"
																		id="resolution"
																		ref="resolution"
																		value={this.state.fields['resolution']}
																		onChange={this.handleChange.bind(
																			this,
																			'resolution'
																		)}
																	/>
																</div>
															) : (
																	''
																)}
														</div>
													</div>
													<div className="">
														{!this.state.loading ? (
															<div className="button-block">
																<Link
																	to={menuLinkConstants.SERVICE_REQUEST_MANAGE_LINK}
																	className="grey-button"
																>
																	{webConstants.CANCEL_BUTTON_TEXT}
																</Link>
																<button
																	type="submit"
																	id="add-button"
																	className="green-button"
																>
																	Edit {webConstants.MANAGE_SERVICE_REQUEST}
																</button>
															</div>
														) : (
																''
															)}
													</div>
												</form>
											</div>
										)}
								</div>
								{/* <!-- Box --> */}
							</div>

							{/* Quote Details */}
							<div>
								<Modal show={this.state.viewQuoteShow} onHide={this.quotehandleClose}>
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
														<td> Cost </td>
													</tr>
												</thead>
												<tbody className="my-body-class">
													{this.state.quoteDetailsView.data != undefined
														? this.state.quoteDetailsView.data.map((detailRow, index) => {
															return (
																<tr key={index}>
																	<td> {detailRow.description} </td>
																	<td> {detailRow.quantity} </td>
																	<td> {detailRow.cost} </td>
																</tr>
															);
														})
														: ''}
													<tr className="table-footer">
														<td />
														<td> </td>
														<td> </td>
													</tr>
													<tr className="table-footer">
														<td />
														<td> Total Material Cost</td>
														<td> {this.state.quoteDetailsView.totalMaterialCost} SAR </td>
													</tr>
													<tr className="table-footer">
														<td />
														<td>Total Service Cost</td>
														<td> {this.state.quoteDetailsView.serviceCost} SAR</td>
													</tr>
													<tr className="table-footer">
														<td />
														<td> Total </td>
														<td> {this.state.quoteDetailsView.totalCost} SAR</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Modal.Body>
								</Modal>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

export default ServiceRequestAdd;
