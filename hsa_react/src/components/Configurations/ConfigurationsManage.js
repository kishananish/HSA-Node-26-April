// React Components
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from '../Comman/Loader';

// Const Files
import * as webConstants from '../../constants/WebConstants';
import * as msgConstants from '../../constants/MsgConstants';
import * as languageData from '../../data/_languages';
import * as cityData from '../../data/_city';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';

class ConfigurationManage extends Component {
	constructor(props, context) {
		super(props, context);
		//console.log('edit id', this.props.location.id);

		this.state = {
			show: false,
			viewShow: false,
			fields: {
				id: '',
				credits: '',
				range: '',
			},
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
			focusedField:"none"
		};
	}

	componentWillMount() {
		this.setWrapHeight();
		this.getConfigData();
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


	/* on change set data for validation */
	handleChange(field, e, optionalData) {
		
		let fields = this.state.fields;		
		let value;
		if (field == 'language' || field == 'city1' || field == 'city2') {
			value = optionalData.value;
		} else {
			value = e.target.value;
		}
		fields[field] = value;
		console.log(field);
		this.setState({ fields,focusedField:field });
		this.handleValidation();
	}


	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		let nnumberRegex = /^[0-9]{2,30}$/;

		if (fields['credits'] === '') {
			formIsValid = false;
			errors['credits'] = 'Credits is required.';
		}

		
		if (!fields['range']) {
			formIsValid = false;
			errors['range'] = 'Range is required.';
		}
		let isValidrange = nnumberRegex.test(fields['range']);
		if (!isValidrange) {
			formIsValid = false;
			errors['range'] = 'Range should contain only characters.';
		}

		this.setState({ errors: errors });
		return formIsValid;
	}

	checkPassword(passwordInput) {
		let passwordRegularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
		return passwordRegularExpression.test(passwordInput);
	}

	/* Set Edit Data */

	getConfigData() {
		this.setState({
			loading: true,
		});
		this.props
			.getConfig()
			.then(response => {
				const responseData = response.payload;			
				if (responseData.status === 200) {
					if (responseData.data.status == 'success') {
						let customerData = responseData.data.data;
					
						this.setState({
							loading: false,
							fields: {
								id: '',
								credits: customerData.credits,
								range: customerData.range
							},
						});
					}
				}
			})
			.catch(error => {
				if (error.response !== undefined) {
					this.setState({
						loading: false,
					});
					swal(webConstants.MANAGE_CONFIGURATION, error.response.data.message, 'error');
				}
			});
		
	}

	/* Save and Edit Functions */
	onSubmit(e) {
		//console.log(this.state.fields);
		e.preventDefault();
		if (this.handleValidation()) {
			this.setState({ loading: true, isButton: 'none' });
			let activeStatus;
			if (this.state.fields.status == 'active') {
				activeStatus = true;
			} else {
				activeStatus = false;
			}

			let configurationParams = {
				credits: this.state.fields.credits,
				range: this.state.fields.range,
				
			};
			this.props
					.configurationSave(configurationParams)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							this.setState({
								loading: false,
								isButton: 'block',
							});
							swal(webConstants.MANAGE_CONFIGURATION, msgConstants.ON_UPDATE, 'success');
						}
					})
					.catch(error => {
						if (error.response !== undefined) {
							this.setState({
								loading: false,
								isButton: 'block',
								fields: {
									id: '',
									credits: '',
									range: '',
								}
							});
							swal(webConstants.MANAGE_CONFIGURATION, error.response.data.message, 'error');
						}
					});
		} else {
			console.log('Form has errors.');
			this.setState({ isLogin: false,focusedField:"" });
		}
	}

	render() {
		return (
			<div>
				<HeaderContainer />
				<SidebarContainer />
				<div className="content-wrapper" ref="bodyContent" /*style={{ minHeight: this.state.wrapHeight }}*/>
					<section className="content-header">
						<div className="row">
							<div className="col-md-12">
								<div className="customer-box">
									<div className="box-header with-border">
										<h3 className="page-title display-in-bk">
											{' '}
											Set {webConstants.MANAGE_CONFIGURATION}{' '}
										</h3>
									</div>

									<div className="box-body">
										{this.state.loading ? (
											<div style={{ height: '100vh' }}>
												<Loader />
											</div>
										) : (
											<form
												name="customerForm"
												className="customerForm"
												autoComplete="off"
												onSubmit={this.onSubmit.bind(this)}
											>
												{/* React tool tip */}
												<ReactTooltip place="right" effect="solid" />

												<div className="form_wrapper col-md-12">
													<div className="row no-margin">
														<div className="form-header">
															<h4 className="form-sub-heading"> Configurations </h4>
															<div className="col-md-12 no-padding">
																<div className="row">
																	<div className="col-md-4 col-sm-6 col-xs-6">
																		<div className="form-group">
																			<label className="top-label">
																				Default Credits
																			</label>
																			<input
																				type="number"
																				className="form-control"
																				id="credits"
																				placeholder="First Name"
																				ref="credits"
																				value={this.state.fields['credits']}
																				onChange={this.handleChange.bind(
																					this,
																					'credits'
																				)}
																			/>
																			<span className="error-message">
																				{(this.state.focusedField == 'credits' || this.state.focusedField == "") ? this.state.errors['credits']:""}
																			</span>
																		</div>
																	</div>

																	<div className="col-md-4 col-sm-6 col-xs-6">
																		<div className="form-group">
																			<label className="top-label">
																				Range
																			</label>
																			<input
																				type="number"
																				className="form-control"
																				id="range"
																				placeholder="Last Name"
																				ref="range"
																				value={this.state.fields['range']}
																				onChange={this.handleChange.bind(
																					this,
																					'range'
																				)}
																			/>
																			<span className="error-message">
																				{this.state.focusedField == 'range' || this.state.focusedField == ""?this.state.errors['range']:""}
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
													{/* section 1 */}
												
												</div>
												<div className="">
													{!this.state.loading ? (
														<div className="button-block">
															<button
																type="submit"
																id="add-button"
																className="green-button"
															>
																Save
															</button>
														</div>
													) : (
														''
													)}
												</div>
											</form>
										)}
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

export default ConfigurationManage;
