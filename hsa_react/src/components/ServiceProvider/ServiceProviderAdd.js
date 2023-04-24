// React Components
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2';
import Select from 'react-select';
import StarRatingComponent from 'react-star-rating-component';
import Moment from 'react-moment';
// import PlacesAutocomplete from 'react-places-autocomplete';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete'
import Geocode from "react-geocode";

// CSS/ Component / Image
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from '../Comman/Loader';
import ServiceProviderProfileImage from '../../assets/img/user.png';

// Const Files
import * as webConstants from '../../constants/WebConstants';
import * as apiConstants from '../../constants/APIConstants';
import * as msgConstants from '../../constants/MsgConstants';
import * as languageData from '../../data/_languages';
import * as cityData from '../../data/_city';
import * as menuLinkConstants from '../../constants/MenuLinkConstants';

const Option = Select.Option;
// HSA Consumer app
Geocode.setApiKey("AIzaSyD4Hqaox38w6HDx-EjwE-PpMaJVg1iNl9s");

let roleDataArray = [];
let selectedRoleData = [];

class ServiceProviderAdd extends Component {
	constructor(props, context) {
		super(props, context);
		//console.log(props);
		//console.log('edit id', this.props.location.id);

		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleCityChange = this.handleCityChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleAreaChange = this.handleAreaChange.bind(this);
		this.handleRoleChange = this.handleRoleChange.bind(this);

		this.state = {
			show: false,
			viewShow: false,
			fileUploadLoading: false,
			addressForLocation: '',
			deleteProfile: false,
			fields: {
				id: '',
				firstName: '',
				lastName: '',
				countryCode: 966,
				phoneNo: '',
				emailAddress: '',
				oldpassword: "",
				password: '',
				status: 'active',
				material: 'inactive',
				addressLine: '',
				zipcode: '',
				city: '',
				language: 'en',
				roles: '',
				area: '',
				location: {
					coordinates: [0, 0],
					type: 'Point',
				},
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
			selectedLanguage: { value: 'English', label: 'English' },
			selectedCity: '',
			selectedCategory: '',
			selectedRole: '',
			selectedArea: '',
			rating: 0,
			selectedProfilePic: '',
			selectedProfilePicName: '',
			profileImage: ServiceProviderProfileImage,
			isRoleData: false,
			roleData: [],
			cityList: [],
			catrgoryList: []
		};
	}

	componentWillMount() {
		this.setWrapHeight();
		this.getCityData();
		this.getCategoryData();
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
						const cityNamesArray = responseData.data.data;
						this.setState({ manageLoading: false, cityList: cityNamesArray });
						this.getRoleList();
					}
				}
			})
			.catch(error => {
				if (error.response !== undefined) {
					this.setState({ manageLoading: false });
				}
			});
	}

	getCategoryData() {
		this.setState({ manageLoading: true });
		this.props
			.CategoryList()
			.then(response => {
				const responseData = response.payload;
				if (responseData.status === 200) {
					if (responseData.data.status === 'success') {
						const categoryNamesArray = responseData.data.data;
						const categoryDataArray = [];
						if (categoryNamesArray.length > 0) {
							let i;
							for (i = 0; i < categoryNamesArray.length; i++) {
								let categoryValue = categoryNamesArray[i].name;
								categoryNamesArray[i].name = categoryNamesArray[i].name
									.split('_')
									.join(' ')
									.toLowerCase()
									.split(' ')
									.map(s => s.charAt(0).toUpperCase() + s.substring(1))
									.join(' ');
								categoryDataArray.push({ value: categoryValue, label: categoryNamesArray[i].name, id: categoryNamesArray[i]._id });
							}
							this.setState({
								manageLoading: false,
								catrgoryList: categoryDataArray,
							});
						}
					}
				}
			})
			.catch(error => {
				if (error.response !== undefined) {
					this.setState({ manageLoading: false });
				}
			});
	}


	getRoleList() {
		roleDataArray = [];
		this.props
			.RolesList(0, 0)
			.then(response => {
				const roleResponseData = response.payload;
				if (roleResponseData.status === 200) {
					if (roleResponseData.data.status === 'success') {
						let roleData = roleResponseData.data.data.result;
						if (roleData.length > 0) {
							let i;
							for (i = 0; i < roleData.length; i++) {
								if (roleData[i].name != 'user' && roleData[i].active == true) {
									let roleValue = roleData[i].name;
									roleData[i].name = roleData[i].name
										.split('_')
										.join(' ')
										.toLowerCase()
										.split(' ')
										.map(s => s.charAt(0).toUpperCase() + s.substring(1))
										.join(' ');
									roleDataArray.push({ value: roleValue, label: roleData[i].name });
								}
							}
							this.setState({
								manageLoading: false,
								isRoleData: true,
								roleData: roleDataArray,
							});
							if (this.props.location.id) {
								this.getSelectedData(this.props.location.id);
							}
						}
					}
				}
			})
			.catch(error => {
				//console.log(error);
				if (error.response !== undefined) {
					swal(webConstants.MANAGE_ROLES, error.response.data.message, 'error');
				}
			});
	}

	/* on change set data for validation */
	handleChange(field, e, optionalData) {
		let fields = this.state.fields;
		let value;
		if (field === 'city' || field === 'area' || field === 'language' || field === 'roles' || field === 'category') {
			value = optionalData.value;
		}
		else {
			value = e.target.value;
		}
		fields[field] = value;
		this.setState({ fields });
		this.handleValidation();
	}

	handleChangeLocation = address => {
		// console.log('handleChangeLocation', address);
		const { fields } = this.state;
		fields.addressLine = address;
		// const { fields } = this.state;
		// fields['addressLine'] = address;
		this.setState({ fields });
		// this.handleValidation();
	};

	handleSelect = address => {
		// console.log('addressaddress', address);
		const { fields } = this.state;
		fields.addressLine = address;
		// Get latidude & longitude from address.
		Geocode.fromAddress(address).then(
			response => {
				const { lat, lng } = response.results[0].geometry.location;
				fields.location.coordinates = [lat, lng]
				console.log('lat lng', lat, lng);
			},
			error => {
				console.error(error);
			}
		);
		this.setState({ fields })

		// this.setState({ addressForLocation: address, fields })

		// geocodeByAddress(address)
		// 	.then(results => getLatLng(results[0]))
		// 	.then(latLng => console.log('Success', latLng))
		// 	.catch(error => console.error('Error', error));
	};

	handleLanguageChange(selectedLanguageOption) {
		this.setState({
			selectedLanguage: selectedLanguageOption,
		});
		this.handleChange('language', '', selectedLanguageOption);
	}

	handleCityChange(selectedCityOption) {
		this.setState({
			selectedCity: selectedCityOption,
		});
		this.handleChange('city', '', selectedCityOption);
	}

	handleCategoryChange(selectedCategoryOption) {
		this.setState({
			selectedCategory: selectedCategoryOption,
		});
		this.handleChange('category', '', selectedCategoryOption);
	}

	handleRoleChange(selectedRoleOption) {
		this.setState({
			selectedRole: selectedRoleOption,
		});
		this.handleChange('roles', '', selectedRoleOption);
	}

	handleAreaChange(selectedAreaOption) {
		this.setState({
			selectedArea: selectedAreaOption,
		});
		this.handleChange('area', '', selectedAreaOption);
	}

	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		let nameRegex = /^[a-zA-Z ]{2,30}$/;
		// let emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let phoneNoRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3}$/;
		let zipCodeRegex = /^[0-9]{6}([- /]?[0-9]{5})?$/;
		let percentageExpression = /^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(.[0-9]{2})?$/;
		if (!fields['firstName']) {
			formIsValid = false;
			errors['firstName'] = 'First name is required.';
		}
		let isValidName = nameRegex.test(fields['firstName']);
		if (!isValidName) {
			formIsValid = false;
			errors['firstName'] = 'Name should contain only characters.';
		}
		if (!fields['lastName']) {
			formIsValid = false;
			errors['lastName'] = 'Last name is required.';
		}
		let isValidlastName = nameRegex.test(fields['lastName']);
		if (!isValidlastName) {
			formIsValid = false;
			errors['lastName'] = 'Last name should contain only characters.';
		}
		if (!fields['emailAddress']) {
			formIsValid = false;
			errors['emailAddress'] = 'Email ID is required.';
		}
		let isValidemail = emailRegex.test(fields['emailAddress']);
		if (!isValidemail) {
			formIsValid = false;
			errors['emailAddress'] = 'Email ID should be valid.';
		}

		if (!this.props.location.id) {
			if (!fields['password']) {
				formIsValid = false;
				errors['password'] = 'Password is required.';
			}
			if (!this.checkPassword(fields['password'])) {
				formIsValid = false;
				errors['password'] = msgConstants.PASSWORD_VALIDATION_MESSAGE;
			}
		} else {
			if (fields['password'] != "" && !this.checkPassword(fields['password'])) {
				formIsValid = false;
				errors['password'] = msgConstants.PASSWORD_VALIDATION_MESSAGE;
			}
		}

		if (!fields['countryCode']) {
			formIsValid = false;
			errors['countryCode'] = 'Country Code is required';
		}

		if (!fields['phoneNo']) {
			formIsValid = false;
			errors['phoneNo'] = 'Phone number is required';
		}
		// let isValidPhoneno = phoneNoRegex.test(fields['phoneNo']);
		// if (!isValidPhoneno) {
		// 	formIsValid = false;
		// 	errors['phoneNo'] = 'Phone number should be valid.';
		// }

		if (fields['phoneNo'].length <= 5 || fields['phoneNo'].length > 10) {
			formIsValid = false;
			errors['phoneNo'] = 'Phone number should be valid.';
		}

		if (!fields['status']) {
			formIsValid = false;
			errors['status'] = 'Please select status.';
		}

		if (!fields['material']) {
			formIsValid = false;
			errors['material'] = 'Please select material.';
		}

		if (!fields['addressLine']) {
			formIsValid = false;
			errors['addressLine'] = 'Address is required.';
		}
		if (!fields['zipcode']) {
			formIsValid = false;
			errors['zipcode'] = 'Zipcode is required.';
		}

		let isValidZipcode = zipCodeRegex.test(fields["zipcode"]);
		if (!isValidZipcode) {
			formIsValid = false;
			errors["zipcode"] = "please enter only numbers and upto 6 digits only.";
		}
		if (!fields['city']) {
			formIsValid = false;
			errors['city'] = 'Please select city.';
		}

		if (!fields['category']) {
			formIsValid = false;
			errors['category'] = 'Please select category.';
		}
		// if (!fields['location'].) {
		// 	formIsValid = false;
		// 	errors['location'] = 'Please select location.';
		// }
		/*if (!fields["area"]) {
            formIsValid = false;
            errors["area"] = "Please select area.";
        }*/
		if (!fields['language']) {
			formIsValid = false;
			errors['language'] = 'Please select preferred language.';
		}
		if (!fields['roles']) {
			formIsValid = false;
			errors['roles'] = 'Role is required.';
		}
		this.setState({ errors: errors });
		return formIsValid;
	}

	checkPassword(passwordInput) {
		let passwordRegularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
		return passwordRegularExpression.test(passwordInput);
	}

	/* Set Edit Data */
	async getSelectedData(selectedId) {
		this.setState({
			loading: true,
		});
		if (selectedId) {
			await this.props
				.ServiceProviderView(selectedId, this.props.LoginReducer.loginUser.token)
				.then(response => {
					const responseData = response.payload;
					if (responseData.status === 200) {
						let serviceProviderData = responseData.data.data[0];

						let statusValue = serviceProviderData.active == true ? 'active' : 'inactive';
						let materialValue = serviceProviderData.add_material_flag == true ? 'active' : 'inactive';

						let selectedLanguageData = languageData.languages.filter(function (languageRow) {
							return languageRow.value == serviceProviderData.preferred_language;
						});

						let selectedCityData = this.state.cityList.filter(function (cityRow) {
							return cityRow.value == serviceProviderData.addresses[0].city;
						});

						let roleArray = serviceProviderData.role;
						let filterRoleArray = roleArray.filter(function (role) {
							return role.value !== 'user';
						});
						let roles;

						if (this.state.roleData.length > 0) {
							selectedRoleData = this.state.roleData.filter(function (roleRow) {
								return roleRow.value === filterRoleArray[0].name;
							});
							roles = filterRoleArray[0].name;
						}

						let selectedCategoryData = this.state.catrgoryList.filter(function (categoryRow) {
							return categoryRow.id == serviceProviderData.category_id;
						});

						let selectedAreaData = [];
						let areaName = '';
						if (serviceProviderData.area_assigned) {
							selectedAreaData = this.state.cityList.filter(function (areaRow) {
								return areaRow.value == serviceProviderData.area_assigned;
							});
							areaName = selectedAreaData[0].value;
						}

						let profileImg;
						if (serviceProviderData.profile_pic == '') {
							profileImg = ServiceProviderProfileImage;
						} else {
							profileImg = serviceProviderData.profile_pic_url;
						}
						// console.log('fname', serviceProviderData.first_name);

						// console.log('add', serviceProviderData.addresses[0].address);
						// console.log('zipcode', serviceProviderData.addresses[0].zipcode);
						// console.log('city', selectedCityData[0].value);
						// console.log('lang', selectedLanguageData[0].value);
						// console.log('role', selectedRoleData[0].value);
						setTimeout(
							function () {
								this.setState({
									loading: false,
									fields: {
										id: '',
										firstName: serviceProviderData.first_name,
										lastName: serviceProviderData.last_name,
										countryCode: serviceProviderData.country_code,
										phoneNo: serviceProviderData.mobile_no,
										emailAddress: serviceProviderData.email,
										password: '',
										status: statusValue,
										material: materialValue,
										addressLine: serviceProviderData.addresses.length ? serviceProviderData.addresses[0].address : '',
										zipcode: serviceProviderData.addresses[0].zipcode,
										city: selectedCityData[0].value,
										category: selectedCategoryData[0].value,
										area: areaName,
										language: selectedLanguageData[0].value,
										roles: selectedRoleData[0].value,
										location: serviceProviderData.addresses.length ? serviceProviderData.addresses[0].location : {
											coordinates: [0, 0],
											type: 'Point',
										},
									},
									selectedCity: selectedCityData,
									selectedProfilePic: serviceProviderData.profile_pic,
									profileImage: profileImg,
									rating: serviceProviderData.rating,
									selectedArea: selectedAreaData,
									selectedLanguage: selectedLanguageData,
									selectedRole: selectedRoleData,
									selectedCategory: selectedCategoryData
								});
							}.bind(this),
							1000
						);
					}
				})
				.catch(error => {
					if (error.response !== undefined) {
						this.setState({
							loading: false,
						});
						swal(webConstants.MANAGE_SERVICE_PROVIDER, error.response.data.message, 'error');
					}
				});
		}
	}

	onStarClick(nextValue) {
		this.setState({ rating: nextValue });
	}

	onUploadProfileImage = event => {
		this.setState({
			fileUploadLoading: true,
			deleteProfile:false,
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
				formData.append('profile_pic', event.target.files[0]);
				this.props
					.ServiceProviderProfileImgUpload(formData)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							if (responseData.data.status === 'success') {
								//console.log(apiConstants.BASE_IMAGE_URL + responseData.data.data.image);
								this.setState({
									fileUploadLoading: false,
									selectedProfilePic: responseData.data.data.image,
									selectedProfilePicName: profileImage.name,
									profileImage: apiConstants.BASE_IMAGE_URL + responseData.data.data.image,
								});
							}
						}
					})
					.catch(error => {
						if (error.response !== undefined) {
							swal(webConstants.MANAGE_SERVICE_PROVIDER, error.response.data.message, 'error');
						}
					});
			} else {
				swal(
					webConstants.MANAGE_SERVICE_PROVIDER + ' Profile Image',
					'Only Images are allowed. Other files are not accepted.',
					'error'
				);
				this.setState({
					fileUploadLoading: false,
				});
			}
		}
	};

	/* Save and Edit Functions */
	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			this.setState({ loading: true, isButton: 'none' });
			let addressDetails = [
				{
					// location: {
					// 	coordinates: [0, 0],
					// 	type: 'Point',
					// },
					isDefault: false,
					type: 'home',
					address: this.state.fields.addressLine,
					city: this.state.fields.city,
					zipcode: this.state.fields.zipcode,
					location: this.state.fields.location,
					country: '',
				},
			];
			let statusType;
			if (this.state.fields.status == 'active') {
				statusType = true;
			} else {
				statusType = false;
			}

			let materialType;
			if (this.state.fields.material == 'active') {
				materialType = true;
			} else {
				materialType = false;
			}

			let serviceProviderParams = {
				//role: webConstants.ROLE_SERVICE_PROVIDER,
				role: this.state.fields.roles,
				first_name: this.state.fields.firstName,
				last_name: this.state.fields.lastName,
				email: this.state.fields.emailAddress,
				country_code: this.state.fields.countryCode,
				mobile_no: this.state.fields.phoneNo,
				password: this.state.fields.password,
				status: this.state.fields.status,
				active: statusType,
				add_material_flag: materialType,
				preferred_language: this.state.fields.language,
				rating: this.state.rating,
				addresses: addressDetails,
				profile_pic: this.state.selectedProfilePic,
				area_assigned: this.state.fields.area,
				category_id: this.state.selectedCategory.id
			};

			if (this.props.location.id == undefined) {
				//console.log('save');
				this.props
					.ServiceProviderSave(serviceProviderParams)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							this.setState({
								loading: false,
								isButton: 'block',
							});
							swal(webConstants.MANAGE_SERVICE_PROVIDER, msgConstants.ON_SAVE, 'success');
							this.props.history.push(menuLinkConstants.SERVICE_PROVIDER_MANAGE_LINK);
						}
					})
					.catch(error => {
						if (error.response !== undefined) {
							this.setState({
								loading: false,
								isButton: 'block',
								fields: {
									id: '',
									firstName: '',
									lastName: '',
									countryCode: '',
									phoneNo: '',
									emailAddress: '',
									password: '',
									status: '',
									addressLine: '',
									zipcode: '',
									city: '',
									language: '',
									roles: '',
									area: '',
									location: {
										coordinates: [0, 0],
										type: 'Point',
									},
								},
								selectedLanguage: '',
								selectedCity: '',
								selectedRole: '',
								selectedArea: '',
								rating: 0,
								selectedProfilePic: '',
								selectedProfilePicName: '',
								profileImage: ServiceProviderProfileImage,
								fileUploadLoading: false,
							});
							swal(webConstants.MANAGE_SERVICE_PROVIDER, error.response.data.message, 'error');
						}
					});
			} else {
				// Edit
				//console.log('edit');
				delete serviceProviderParams.password;
				this.props
					.ServiceProviderUpdate(this.props.location.id, serviceProviderParams)
					.then(response => {
						const responseData = response.payload;
						if (responseData.status === 200) {
							this.setState({
								loading: false,
								isButton: 'block',
								fields: {
									id: '',
									firstName: '',
									lastName: '',
									countryCode: '',
									phoneNo: '',
									emailAddress: '',
									password: '',
									status: '',
									material: '',
									addressLine: '',
									zipcode: '',
									city: '',
									language: '',
									roles: '',
									area: '',
									location: {
										coordinates: [0, 0],
										type: 'Point',
									},
								},
								selectedLanguage: '',
								selectedCity: '',
								selectedCategory: '',
								selectedRole: '',
								selectedArea: '',
								rating: 0,
								selectedProfilePic: '',
								selectedProfilePicName: '',
								profileImage: ServiceProviderProfileImage,
								fileUploadLoading: false,
							});
							swal(webConstants.MANAGE_SERVICE_PROVIDER, msgConstants.ON_UPDATE, 'success');
							this.props.history.push(menuLinkConstants.SERVICE_PROVIDER_MANAGE_LINK);
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
							swal(webConstants.MANAGE_SERVICE_PROVIDER, error.response.data.message, 'error');
						}
					});
			}
		} else {
			//console.log("Form has errors.");
			this.setState({ isLogin: false });
		}
	}

	dateFormatter(cell) {
		if (!cell) {
			return '';
		}
		return <Moment format="DD-MMM-YYYY">{cell}</Moment>;
	}

	deleteProfile = () => {
		this.setState({ deleteProfile: true, selectedProfilePicName:'' })
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
											{' '}
											{this.props.location.id ? 'Edit' : 'Add'}{' '}
											{webConstants.MANAGE_SERVICE_PROVIDER}{' '}
										</h3>
									</div>

									<div className="box-body">
										{this.state.loading ? (
											<div style={{ height: '100vh' }}>
												<Loader />
											</div>
										) : (
												<form
													name="serviceProviderForm"
													className="serviceProviderForm"
													autoComplete="off"
													onSubmit={this.onSubmit.bind(this)}
												>
													<div className="form_wrapper col-md-12 service-provider-form">
														<div className="row no-margin">
															<div className="form-header">
																<div className="col-md-12 no-padding">
																	<div className="row">
																		<div className="col-md-4 col-sm-4 col-xs-12">
																			<div className="form-group">
																				<div className="fileContainer">
																					<div className="form-group margin-bottom-25">
																						{this.state.fileUploadLoading ? (
																							<p className="image-uploading">
																								Image Uploading..
																							</p>
																						) : (
																								<label className="">
																									{this.state.deleteProfile === false ?
																										<img className='profile-image'
																											src={
																												this.state
																													.profileImage
																											}
																										/>
																										: <img className='profile-image'
																											src={
																												ServiceProviderProfileImage
																											}
																										/>
																									}
																									<br />
																									{this.state
																										.selectedProfilePic !=
																										'' ? (
																											<p className="selected-file-name">
																												{
																													this.state
																														.selectedProfilePicName
																												}
																											</p>
																										) : (
																											''
																										)}
																									Click here to{' '}
																									{this.state
																										.selectedProfilePic !=
																										''
																										? 'change'
																										: 'upload'}{' '}
																									image
																									<input
																										type="file"
																										onChange={this.onUploadProfileImage.bind(
																											this
																										)}
																									/>
																								</label>
																							)}
																							{this.state.selectedProfilePicName?<p className='delete-profile-text' onClick={this.deleteProfile}>Delete profile</p>:null}
																					</div>
																				
																				</div>
																			</div>
																		</div>
																		<div className="col-md-8 col-sm-8 col-xs-12">
																			<div className="col-md-12 col-sm-12 col-xs-12">
																				<h4 className="form-sub-heading">
																					{' '}
																					Personal Details{' '}
																				</h4>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="clearfix" />
																				<div className="form-group">
																					<label className="top-label">
																						First Name
																				</label>
																					<input
																						type="text"
																						className="form-control"
																						id="firstName"
																						placeholder="First Name"
																						ref="firstName"
																						value={
																							this.state.fields['firstName']
																						}
																						onChange={this.handleChange.bind(
																							this,
																							'firstName'
																						)}
																					/>
																					<span className="error-message">
																						{this.state.errors['firstName']}
																					</span>
																				</div>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Last Name
																				</label>
																					<input
																						type="text"
																						className="form-control"
																						id="lastName"
																						placeholder="Last Name"
																						ref="lastName"
																						value={
																							this.state.fields['lastName']
																						}
																						onChange={this.handleChange.bind(
																							this,
																							'lastName'
																						)}
																					/>
																					<span className="error-message">
																						{this.state.errors['lastName']}
																					</span>
																				</div>
																			</div>
																			<div className="clearfix" />
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Email ID
																				</label>
																					<input
																						type="email"
																						className="form-control"
																						id="emailAddress"
																						placeholder="Email ID"
																						ref="emailAddress"
																						autoComplete="nope"
																						value={
																							this.state.fields[
																							'emailAddress'
																							]
																						}
																						onChange={this.handleChange.bind(
																							this,
																							'emailAddress'
																						)}
																					/>
																					<span className="error-message">
																						{this.state.errors['emailAddress']}
																					</span>
																				</div>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						{this.props.location.id
																							? 'Change Password ?'
																							: 'Password'}{' '}
																					</label>
																					<input
																						type="password"
																						className="form-control"
																						id="password"
																						placeholder="Password"
																						ref="password"
																						autoComplete="new-password"
																						value={
																							this.state.fields['password']
																						}
																						onChange={this.handleChange.bind(
																							this,
																							'password'
																						)}
																					/>
																					<span className="error-message">
																						{this.state.errors['password']}
																					</span>
																				</div>
																			</div>
																			<div className="clearfix" />
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Phone No
																				</label>
																					<div className="phone-number col-xs-12">
																						<span className="col-xs-4">
																							<input
																								type="number"
																								id="countryCode"
																								className="form-control"
																								placeholder="+971"
																								ref="countryCode"
																								value={
																									this.state.fields[
																									'countryCode'
																									]
																								}
																								onChange={this.handleChange.bind(
																									this,
																									'countryCode'
																								)}
																							/>
																						</span>
																						<span className="col-xs-8">
																							<input
																								type="number"
																								className="form-control"
																								id="phoneNo"
																								placeholder="Phone No"
																								ref="phoneNo"
																								value={
																									this.state.fields[
																									'phoneNo'
																									]
																								}
																								onChange={this.handleChange.bind(
																									this,
																									'phoneNo'
																								)}
																							/>
																						</span>
																						<span className="error-message">
																							{this.state.errors['phoneNo']}
																						</span>
																					</div>
																				</div>
																			</div>

																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Status
																				</label>
																					<select
																						className="form-control select-blank custom_select"
																						ref="status"
																						onChange={this.handleChange.bind(
																							this,
																							'status'
																						)}
																						id="status"
																						value={this.state.fields['status']}
																					>
																						<option value="">
																							Select Status
																					</option>
																						<option value="active">
																							Active
																					</option>
																						<option value="inactive">
																							Inactive
																					</option>
																					</select>
																					<span className="error-message">
																						{this.state.errors['status']}
																					</span>
																				</div>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Add Material
																				</label>
																					<select
																						className="form-control select-blank custom_select"
																						ref="status"
																						onChange={this.handleChange.bind(
																							this,
																							'material'
																						)}
																						id="material"
																						value={this.state.fields['material']}
																					>
																						<option value="">
																							Select
																					</option>
																						<option value="active">
																							Active
																					</option>
																						<option value="inactive">
																							Inactive
																					</option>
																					</select>
																					<span className="error-message">
																						{this.state.errors['material']}
																					</span>
																				</div>
																			</div>
																			<div className="col-md-12 col-sm-12 col-xs-12">
																				<h4 className="form-sub-heading">
																					{' '}
																					Address 1{' '}
																				</h4>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Address Line{' '}
																					</label>
																					{/* <input
																						type="text"
																						className="form-control"
																						id="addressLine"
																						placeholder="Address Line"
																						ref="addressLine"
																						value={
																							this.state.fields['addressLine']
																						}
																						onChange={this.handleChange.bind(
																							this,
																							'addressLine'
																						)}
																					/> */}
																					<PlacesAutocomplete
																						value={this.state.fields.addressLine}
																						onChange={this.handleChangeLocation}
																						onSelect={this.handleSelect}
																					>
																						{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
																							<div>
																								<input
																									{...getInputProps({
																										placeholder: 'Address Line',
																										className: "form-control",
																									})}
																								/>
																								<div className="form-group">
																									{loading && <div>Loading...</div>}
																									{suggestions.map(suggestion => {
																										const className = suggestion.active
																											? 'suggestion-item-active'
																											: 'suggestion-item';

																										return (
																											<div
																												{...getSuggestionItemProps(suggestion, {
																													className,
																												})}
																											>
																												<span>{suggestion.description}</span>
																											</div>
																										);
																									})}
																								</div>
																							</div>
																						)}
																					</PlacesAutocomplete>
																					<span className="error-message">
																						{this.state.errors['addressLine']}
																					</span>
																				</div>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<label className="top-label">
																						Zipcode
																				</label>
																					<input
																						type="number"
																						maxLength="6"
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
																			<div className="clearfix" />
																			{/* <div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group autoComplete-select">
																					<label className="top-label">
																						Location
																				</label>
																					<PlacesAutocomplete
																						value={this.state.addressForLocation}
																						onChange={(address) => this.setState({ addressForLocation: address })}
																						onSelect={this.handleSelect}
																					>
																						{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
																							<div>
																								<input
																									{...getInputProps({
																										placeholder: 'Location',
																										className: "form-control",
																									})}
																								/>
																								<div className="form-group">
																									{loading && <div>Loading...</div>}
																									{suggestions.map(suggestion => {
																										const className = suggestion.active
																											? 'suggestion-item-active'
																											: 'suggestion-item';

																										return (
																											<div
																												{...getSuggestionItemProps(suggestion, {
																													className,
																												})}
																											>
																												<span>{suggestion.description}</span>
																											</div>
																										);
																									})}
																								</div>
																							</div>
																						)}
																					</PlacesAutocomplete>
																					<span className="error-message">
																						{this.state.errors['location']}
																					</span>
																				</div>
																			</div> */}
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group autoComplete-select">
																					<label className="top-label">
																						City
																				</label>
																					<Select
																						placeholder="Select City"
																						value={this.state.selectedCity}
																						options={this.state.cityList}
																						ref="city"
																						id="city"
																						isSearchable="true"
																						onChange={this.handleCityChange}
																					/>
																					<span className="error-message">
																						{this.state.errors['city']}
																					</span>
																				</div>
																			</div>

																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group autoComplete-select">
																					<label className="top-label">
																						Add Category
																				</label>
																					<Select
																						placeholder="Select Category"
																						value={this.state.selectedCategory}
																						options={this.state.catrgoryList}
																						ref="category"
																						id="category"
																						isSearchable="true"
																						onChange={this.handleCategoryChange}
																					/>
																					<span className="error-message">
																						{this.state.errors['category']}
																					</span>
																				</div>
																			</div>

																			<div className="col-md-12 col-sm-12 col-xs-12">
																				<h4 className="form-sub-heading">
																					{' '}
																					Area Assigned{' '}
																				</h4>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group autoComplete-select">
																					<label className="top-label">
																						Area
																				</label>
																					<Select
																						placeholder="Select Area"
																						value={this.state.selectedArea}
																						options={this.state.cityList}
																						ref="area"
																						id="area"
																						isSearchable="true"
																						onChange={this.handleAreaChange}
																					/>
																					<span className="error-message">
																						{this.state.errors['area']}
																					</span>
																				</div>
																			</div>

																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group">
																					<div className="service-provider-rating">
																						<label className="top-label">
																							Rating
																					</label>
																						<StarRatingComponent
																							name="rating"
																							starCount={
																								webConstants.TOTAL_RATINGS
																							}
																							value={this.state.rating}
																							onStarClick={this.onStarClick.bind(
																								this
																							)}
																						/>
																					</div>
																				</div>
																			</div>

																			<div className="clearfix" />
																			<div className="col-md-12 col-sm-12 col-xs-12">
																				<h4 className="form-sub-heading">
																					{' '}
																					Languages & Roles{' '}
																				</h4>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group autoComplete-select">
																					<label className="top-label">
																						Languages
																				</label>
																					<Select
																						placeholder="Select Language"
																						value={this.state.selectedLanguage}
																						options={languageData.languages}
																						ref="language"
																						id="language"
																						isSearchable="true"
																						onChange={this.handleLanguageChange}
																					/>
																					<span className="error-message">
																						{this.state.errors['language']}
																					</span>
																				</div>
																			</div>
																			<div className="col-md-6 col-sm-6 col-xs-6">
																				<div className="form-group autoComplete-select">
																					<label className="top-label">
																						Roles
																				</label>
																					{this.state.isRoleData ? (
																						<Select
																							placeholder="Select Roles"
																							value={this.state.selectedRole}
																							options={this.state.roleData}
																							ref="roles"
																							id="roles"
																							isSearchable="true"
																							onChange={this.handleRoleChange}
																						/>
																					) : (
																							''
																						)}
																					<span className="error-message">
																						{this.state.errors['roles']}
																					</span>
																				</div>
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
																<Link
																	to={menuLinkConstants.SERVICE_PROVIDER_MANAGE_LINK}
																	className="grey-button"
																>
																	{webConstants.CANCEL_BUTTON_TEXT}
																</Link>
																<button
																	type="submit"
																	id="add-button"
																	className="green-button"
																>
																	{this.props.location.id ? 'Edit' : 'Add'}{' '}
																	{webConstants.MANAGE_SERVICE_PROVIDER}
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

export default ServiceProviderAdd;
