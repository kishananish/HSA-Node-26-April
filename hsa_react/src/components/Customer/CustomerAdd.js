// React Components
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'
import Geocode from "react-geocode";

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

Geocode.setApiKey("AIzaSyD4Hqaox38w6HDx-EjwE-PpMaJVg1iNl9s");
class CustomerAdd extends Component {
  constructor(props, context) {
    super(props, context);
    //console.log('edit id', this.props.location.id);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleCity1Change = this.handleCity1Change.bind(this);
    this.handleCity2Change = this.handleCity2Change.bind(this);

    this.state = {
      show: false,
      viewShow: false,
      fields: {
        id: '',
        firstName: '',
        lastName: '',
        countryCode: '966',
        phoneNo: '',
        emailAddress: '',
        password: '',
        status: 'active',
        addressLine1: '',
        addressLine2: '',
        zipcode1: '',
        zipcode2: '',
        city1: '',
        city2: '',
        language: 'en',
        credits: '0',
        location_1: {
          coordinates: [0, 0],
          type: 'Point',
        },
        location_2: {
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
      selected1City: '',
      selected2City: '',
      cityList: [],
      focusedField: 'none'
    };
  }

  componentWillMount() {
    this.setWrapHeight();
    this.getCityData();
    if (this.props.location.id) {
      this.getSelectedData(this.props.location.id);
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
    this.setState({ fields, focusedField: field });
    this.handleValidation();
  }

  handleLanguageChange(selectedLanguageOption) {
    selectedLanguageOption =
      selectedLanguageOption === null ? '' : selectedLanguageOption;
    this.setState({
      selectedLanguage: selectedLanguageOption
    });
    this.handleChange('language', '', selectedLanguageOption);
  }

  handleCity1Change(selectedCity1Option) {
    this.setState({
      selected1City: selectedCity1Option
    });
    this.handleChange('city1', '', selectedCity1Option);
  }

  handleCity2Change(selectedCity2Option) {
    this.setState({
      selected2City: selectedCity2Option
    });
    this.handleChange('city2', '', selectedCity2Option);
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
    let percentageExpression = /^[0-9]+([,.][0-9]+)?$/g;

    if (fields['credits'] === '') {
      formIsValid = false;
      errors['credits'] = 'Credits is required.';
    }

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
      if (fields['password'] != '' && !this.checkPassword(fields['password'])) {
        formIsValid = false;
        errors['password'] = msgConstants.PASSWORD_VALIDATION_MESSAGE;
      }
    }

    if (!fields['countryCode']) {
      formIsValid = false;
      errors['phoneNo'] = 'Country Code is required';
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
    if (!fields['addressLine1']) {
      formIsValid = false;
      errors['addressLine1'] = 'Address is required.';
    }
    if (!fields['zipcode1']) {
      formIsValid = false;
      errors['zipcode1'] = 'Zipcode is required.';
    }
    /* let isValidZipcode = zipCodeRegex.test(fields["zipcode1"]);
        if (!isValidZipcode) {
            formIsValid = false;
            errors["zipcode1"] = "Zipcode should be valid.";
        }*/
    if (!fields['city1']) {
      formIsValid = false;
      errors['city1'] = 'Please select city.';
    }
    if (!fields['language']) {
      formIsValid = false;
      errors['language'] = 'Please select preferred language.';
    }

    let isValidCredits = percentageExpression.test(fields['credits']);
    if (!isValidCredits) {
      formIsValid = false;
      errors['credits'] = 'Credits should be valid';
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  checkPassword(passwordInput) {
    let passwordRegularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return passwordRegularExpression.test(passwordInput);
  }

  /* Set Edit Data */

  getSelectedData(selectedId) {
    if (selectedId) {
      this.setState({
        loading: true
      });
      this.props
        .CustomerView(selectedId)
        .then(response => {
          const responseData = response.payload;

          if (responseData.status == 200) {

            if (responseData.data.status == 'success') {

              let customerData = responseData.data.data;

              let selectedLanguageData = languageData.languages.filter(function (
                languageRow
              ) {
                return languageRow.value == customerData.preferred_language;
              });

              let selectedCityData1 = [];
              if (customerData.addresses.length) {
                selectedCityData1 = this.state.cityList.filter(function (
                  cityRow1
                ) {
                  return cityRow1.value == customerData.addresses[0].city;
                });
              }

              let statusValue =
                customerData.active == true ? 'active' : 'inactive';

              let selectedCityData2 = '';
              let city2 = '';
              let addressLine2 = '';
              let zipcode2 = '';

              if (customerData.addresses[1]) {

                if (customerData.addresses[1].city) {

                  selectedCityData2 = this.state.cityList.filter(function (
                    cityRow2
                  ) {

                    return customerData.addresses[1].city.includes(cityRow2.value);
                  });
                  city2 = selectedCityData2[0].value;

                }
                addressLine2 = customerData.addresses[1].address;

                zipcode2 = customerData.addresses[1].zipcode;

              }

              console.log(customerData)
              this.setState({
                loading: false,
                fields: {
                  id: '',
                  firstName: customerData.first_name,
                  lastName: customerData.last_name,
                  countryCode: customerData.country_code,
                  phoneNo: customerData.mobile_no,
                  emailAddress: customerData.email,
                  password: '',
                  status: statusValue,
                  language: selectedLanguageData.length
                    ? selectedLanguageData[0].value
                    : '',
                  credits: customerData.credits,
                  addressLine1: customerData.addresses.length
                    ? customerData.addresses[0].address
                    : '',
                  zipcode1: customerData.addresses.length
                    ? customerData.addresses[0].zipcode
                    : '',

                  city1: selectedCityData1.length
                    ? selectedCityData1[0].value
                    : '',
                  addressLine2: addressLine2,
                  zipcode2: zipcode2,
                  city2: city2,
                  location_1: {
                    coordinates: customerData.addresses.length ? customerData.addresses[0].location.coordinates : [0, 0],
                    type: 'Point',
                  },
                  location_2: {
                    coordinates: customerData.addresses.length ? customerData.addresses[1].location.coordinates : [0, 0],
                    type: 'Point',
                  },
                },
                selectedLanguage: selectedLanguageData,
                selected1City: selectedCityData1,
                selected2City: selectedCityData2
              });
              
            } else {              
              this.setState({
                loading: false
              });
            }
          } else {
            this.setState({
              loading: false
            });
          }
        })
        .catch(error => {
          if (error.response !== undefined) {
            this.setState({
              loading: false
            });
            swal(
              webConstants.MANAGE_CUSTOMER,
              error.response.data.message,
              'error'
            );
          }
        });
    }
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

      let addressDetails = [
        {
          location: {
            coordinates: this.state.fields.location_1 != undefined ? this.state.fields.location_1.coordinates : [0, 0],
            type: 'Point'
          },
          isDefault: false,
          type: 'home',
          address: this.state.fields.addressLine1,
          city: this.state.fields.city1,
          zipcode: this.state.fields.zipcode1,
          country: ''
        },
        {
          location: {
            coordinates: this.state.fields.location_2 != undefined ? this.state.fields.location_2.coordinates : [0, 0],
            type: 'Point'
          },
          isDefault: false,
          type: 'office',
          address: this.state.fields.addressLine2
            ? this.state.fields.addressLine2
            : '',
          city: this.state.fields.city2 ? this.state.fields.city2 : '',
          zipcode: this.state.fields.zipcode2 ? this.state.fields.zipcode2 : '',
          country: ''
        }
      ];

      let customerParams = {
        role: webConstants.ROLE_USER,
        first_name: this.state.fields.firstName,
        last_name: this.state.fields.lastName,
        email: this.state.fields.emailAddress,
        country_code: this.state.fields.countryCode,
        mobile_no: this.state.fields.phoneNo,
        password: this.state.fields.password,
        status: this.state.fields.status,
        active: activeStatus,
        preferred_language: this.state.fields.language,
        credits: this.state.fields.credits,
        addresses: addressDetails
      };
      // console.log('customerParams >>>',customerParams);
      if (this.props.location.id == undefined) {
        //console.log('save');
        this.props
          .CustomerSave(customerParams)
          .then(response => {
            const responseData = response.payload;
            if (responseData.status === 200) {
              this.setState({
                loading: false,
                isButton: 'block'
              });
              swal(
                webConstants.MANAGE_CUSTOMER,
                msgConstants.ON_SAVE,
                'success'
              );
              this.props.history.push(menuLinkConstants.CUSTOMER_MANAGE_LINK);
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
                  phoneNo: '',
                  countryCode: '',
                  emailAddress: '',
                  password: '',
                  status: '',
                  addressLine1: '',
                  addressLine2: '',
                  zipcode1: '',
                  zipcode2: '',
                  city1: '',
                  city2: '',
                  language: '',
                  credits: ''
                },
                selectedLanguage: '',
                selected1City: '',
                selected2City: ''
              });
              swal(
                webConstants.MANAGE_CUSTOMER,
                error.response.data.message,
                'error'
              );
            }
          });
      } else {
        // Edit
        // console.log('edit');
        this.props
          .CustomerUpdate(this.props.location.id, customerParams)
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
                  addressLine1: '',
                  addressLine2: '',
                  zipcode1: '',
                  zipcode2: '',
                  city1: '',
                  city2: '',
                  language: '',
                  credits: ''
                },
                selectedLanguage: '',
                selected1City: '',
                selected2City: ''
              });
              swal(
                webConstants.MANAGE_CUSTOMER,
                msgConstants.ON_UPDATE,
                'success'
              );
              this.props.history.push(menuLinkConstants.CUSTOMER_MANAGE_LINK);
            }
          })
          .catch(error => {
            //console.log(error);
            //console.log(JSON.stringify(error));
            if (error.response !== undefined) {
              this.setState({
                loading: false,
                isButton: 'block'
              });
              swal(
                webConstants.MANAGE_CUSTOMER,
                error.response.data.message,
                'error'
              );
            }
          });
      }
    } else {
      console.log('Form has errors.');
      this.setState({ isLogin: false, focusedField: '' });
    }
  }

  handleChangeLocationaddressLine1 = (address) => {
    console.log('handleChangeLocation', address);
    const { fields } = this.state;
    fields.addressLine1 = address;
    // const { fields } = this.state;
    // fields['addressLine'] = address;
    this.setState({ fields });
    // this.handleValidation();
  };

  handleSelectaddressLine1 = address => {
    // console.log('addressaddress', address);
    const { fields } = this.state;
    fields.addressLine1 = address;
    console.log('fiedl from state :', this.state);
    // Get latidude & longitude from address.
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        fields.location_1.coordinates = [lat, lng]
        console.log('lat lng', lat, lng);
      },
      error => {
        console.error(error);
      }
    );
    this.setState({ fields })
  };

  handleChangeLocationaddressLine2 = (address) => {
    console.log('handleChangeLocation', address);
    const { fields } = this.state;
    fields.addressLine2 = address;
    // const { fields } = this.state;
    // fields['addressLine'] = address;
    this.setState({ fields });
    // this.handleValidation();
  };

  handleSelectaddressLine2 = address => {
    // console.log('addressaddress', address);
    const { fields } = this.state;
    fields.addressLine2 = address;
    // console.log('filed :', fields);
    // Get latidude & longitude from address.
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;        
        if (fields.location_2 == undefined) {
          return;
        } else {
          fields.location_2.coordinates = [lat, lng]
        }        
      },
      error => {
        console.error(error);
      }
    );
    this.setState({ fields })
  };

  render() {
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
                  <div className="box-header with-border">
                    <h3 className="page-title display-in-bk">
                      {' '}
                      {this.props.location.id ? 'Edit' : 'Add'}{' '}
                      {webConstants.MANAGE_CUSTOMER}{' '}
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
                                <h4 className="form-sub-heading">
                                  {' '}
                                Personal Details{' '}
                                </h4>
                                <div className="col-md-12 no-padding">
                                  <div className="row">
                                    <div className="col-md-4 col-sm-6 col-xs-6">
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
                                          value={this.state.fields['firstName']}
                                          onChange={this.handleChange.bind(
                                            this,
                                            'firstName'
                                          )}
                                        />
                                        <span className="error-message">
                                          {this.state.focusedField ==
                                            'firstName' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['firstName']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
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
                                          value={this.state.fields['lastName']}
                                          onChange={this.handleChange.bind(
                                            this,
                                            'lastName'
                                          )}
                                        />
                                        <span className="error-message">
                                          {this.state.focusedField ==
                                            'lastName' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['lastName']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-lg-4 col-md-8 col-sm-12 col-xs-12">
                                      <div className="form-group">
                                        <label className="top-label">
                                          Phone No
                                      </label>
                                        <div className="phone-number col-md-6 col-sm-8 col-xs-12">
                                          <span className="col-xs-4">
                                            <input
                                              type="number"
                                              id="countryCode"
                                              className="form-control"
                                              placeholder="+971"
                                              ref="countryCode"
                                              value={
                                                this.state.fields['countryCode']
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
                                              value={this.state.fields['phoneNo']}
                                              onChange={this.handleChange.bind(
                                                this,
                                                'phoneNo'
                                              )}
                                            />
                                          </span>
                                          <span className="error-message">
                                            {this.state.focusedField ==
                                              'phoneNo' ||
                                              this.state.focusedField == ''
                                              ? this.state.errors['phoneNo']
                                              : ''}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <br />
                                  </div>
                                </div>
                                <br />
                                <div className="col-md-12  no-padding">
                                  <div className="row">
                                    <div className="col-md-4 col-sm-6 col-xs-6">
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
                                            this.state.fields['emailAddress']
                                          }
                                          onChange={this.handleChange.bind(
                                            this,
                                            'emailAddress'
                                          )}
                                        />
                                        <span className="error-message">
                                          {this.state.focusedField ==
                                            'emailAddress' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['emailAddress']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group">
                                        <label className="top-label">
                                          {this.props.location.id
                                            ? 'Change Password ?'
                                            : 'Password'}
                                        </label>
                                        {/*<span data-tip={msgConstants.PASSWORD_INFO} className="data-tool-tip">
                                                                                <i className="fa fa-info-circle" aria-hidden="true"/>
                                                                            </span>*/}
                                        <input
                                          type="password"
                                          className="form-control"
                                          id="password"
                                          placeholder="Password"
                                          ref="password"
                                          value={this.state.fields['password']}
                                          autoComplete="new-password"
                                          onChange={this.handleChange.bind(
                                            this,
                                            'password'
                                          )}
                                        />
                                        <span className="error-message">
                                          {this.state.focusedField ==
                                            'password' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['password']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
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
                                          <option value="">Select Status</option>
                                          <option value="active">Active</option>
                                          <option value="inactive">
                                            Inactive
                                        </option>
                                        </select>
                                        <span className="error-message">
                                          {this.state.focusedField == 'status' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['status']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* section 1 */}

                            <div className="row no-margin">
                              <div className="form-header">
                                <h4 className="form-sub-heading"> Address 1 </h4>
                                <div className="col-md-12  no-padding">
                                  <div className="row">
                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group">
                                        <label className="top-label">
                                          Address Line 1
                                      </label>
                                        {/* <input
                                          type="text"
                                          className="form-control"
                                          id="addressLine1"
                                          placeholder="Address Line 1"
                                          ref="addressLine1"
                                          value={
                                            this.state.fields['addressLine1']
                                          }
                                          onChange={this.handleChange.bind(
                                            this,
                                            'addressLine1'
                                          )}
                                        /> */}

                                        <PlacesAutocomplete
                                          value={this.state.fields.addressLine1}
                                          onChange={this.handleChangeLocationaddressLine1}
                                          onSelect={this.handleSelectaddressLine1}
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
                                          {this.state.focusedField ==
                                            'addressLine1' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['addressLine1']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group">
                                        <label className="top-label">
                                          Zipcode
                                      </label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="zipcode1"
                                          placeholder="Zipcode"
                                          ref="zipcode1"
                                          value={this.state.fields['zipcode1']}
                                          onChange={this.handleChange.bind(
                                            this,
                                            'zipcode1'
                                          )}
                                        />
                                        <span className="error-message">
                                          {this.state.focusedField ==
                                            'zipcode1' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['zipcode1']
                                            : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group autoComplete-select">
                                        <label className="top-label">City</label>
                                        <Select
                                          placeholder="Select City"
                                          value={this.state.selected1City}
                                          options={this.state.cityList}
                                          ref="city1"
                                          id="city1"
                                          isSearchable="true"
                                          onChange={this.handleCity1Change}
                                        />
                                        <span className="error-message">
                                          {this.state.focusedField == 'city1' ||
                                            this.state.focusedField == ''
                                            ? this.state.errors['city1']
                                            : ''}
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
                                <h4 className="form-sub-heading"> Address 2 </h4>
                                <div className="col-md-12  no-padding">
                                  <div className="row">
                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group">
                                        <label className="top-label">
                                          Address Line 2
                                      </label>
                                        {/* <input
                                          type="text"
                                          className="form-control"
                                          id="addressLine2"
                                          ref="addressLine2"
                                          placeholder="Address Line 2"
                                          value={
                                            this.state.fields['addressLine2']
                                          }
                                          onChange={this.handleChange.bind(
                                            this,
                                            'addressLine2'
                                          )}
                                        /> */}
                                        <PlacesAutocomplete
                                          value={this.state.fields.addressLine2}
                                          onChange={this.handleChangeLocationaddressLine2}
                                          onSelect={this.handleSelectaddressLine2}
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

                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group">
                                        <label className="top-label">
                                          Zipcode
                                      </label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="zipcode2"
                                          ref="zipcode2"
                                          placeholder="Zipcode"
                                          value={this.state.fields['zipcode2']}
                                          onChange={this.handleChange.bind(
                                            this,
                                            'zipcode2'
                                          )}
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-xs-6">
                                      <div className="form-group autoComplete-select">
                                        <label className="top-label">City</label>
                                        <Select
                                          placeholder="Select City"
                                          value={this.state.selected2City}
                                          options={this.state.cityList}
                                          ref="city2"
                                          id="city2"
                                          isSearchable="true"
                                          onChange={this.handleCity2Change}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* section 3 */}

                            <div className="row no-margin">
                              <div className="row">
                                <div className="form-header col-md-4">
                                  <h4 className="form-sub-heading">
                                    {' '}
                                  Preferred Language{' '}
                                  </h4>
                                  <div className="form-group autoComplete-select">
                                    <label className="top-label">Language</label>
                                    <Select
                                      clearable
                                      placeholder="Select Language"
                                      value={this.state.selectedLanguage}
                                      options={languageData.languages}
                                      ref="language"
                                      id="language"
                                      isSearchable="true"
                                      onChange={this.handleLanguageChange}
                                    />
                                    <span className="error-message">
                                      {this.state.focusedField == 'language' ||
                                        this.state.focusedField == ''
                                        ? this.state.errors['language']
                                        : ''}
                                    </span>
                                  </div>
                                </div>

                                <div className="form-header col-md-4">
                                  <h4 className="form-sub-heading"> Credits </h4>
                                  <div className="form-group">
                                    <label className="top-label">Credits</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="credits"
                                      ref="credits"
                                      value={this.state.fields['credits']}
                                      onChange={this.handleChange.bind(
                                        this,
                                        'credits'
                                      )}
                                      placeholder="Credits"
                                    />
                                    <span className="error-message">
                                      {this.state.focusedField == 'credits' ||
                                        this.state.focusedField == ''
                                        ? this.state.errors['credits']
                                        : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* section 4 */}
                          </div>
                          <div className="">
                            {!this.state.loading ? (
                              <div className="button-block">
                                <Link
                                  to={menuLinkConstants.CUSTOMER_MANAGE_LINK}
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
                                  {webConstants.MANAGE_CUSTOMER}
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

export default CustomerAdd;
