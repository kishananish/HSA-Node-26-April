import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = accessToken ? accessToken : '';

export const ActiveTimeReportData = (startDate, endDate, userId, categoryId) => {
	let parameters = '';
	parameters += '&start_date=' + startDate;
	parameters += '&end_date=' + endDate;
	if (userId) {
		parameters += '&user_id=' + userId;
	}
	if (categoryId) {
		parameters += '&category_id=' + categoryId;
	}
	let ActiveTimeListUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_REPORT + '/active-time?' + parameters;
	let request = axios.get(ActiveTimeListUrl);
	return {
		type: actionTypes.ACTIVE_TIME_REPORT_LIST,
		payload: request,
	};
};

export const EarningReportData = (startDate, endDate, userId, city, paymentType) => {
	let parameters = '';
	parameters += 'start_date=' + startDate;
	parameters += '&end_date=' + endDate;
	if (userId) {
		parameters += '&service_provider_id=' + userId;
	}
	if (city) {
		parameters += '&area_assigned=' + city;
	}
	if (paymentType) {
		parameters += '&payment_mode=' + paymentType;
	}
	let EarningListUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_REPORT + '/earning?' + parameters;
	let request = axios.get(EarningListUrl);
	return { type: actionTypes.EARNING_REPORT_LIST, payload: request };
};

export const EarningServiceReportData = (activePage, PerPageSize) => {
	let EarningServiceListUrl =
		apiConstants.BASE_API_URL + 'earning-service-report?page=' + activePage + '&items=' + PerPageSize;
	let request = axios.get(EarningServiceListUrl);
	return {
		type: actionTypes.EARNING_SERVICE_REPORT_LIST,
		payload: request,
	};
};

export const RatingReportData = (startDate, endDate, userType, userId) => {
	let parameters = '';
	parameters += 'start_date=' + startDate;
	parameters += '&end_date=' + endDate;
	if (userType) {
		parameters += '&user_type=' + userType;
	}
	if (userId) {
		parameters += '&user_id=' + userId;
	}
	let RatingListUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_REPORT + '/rating?' + parameters;
	let request = axios.get(RatingListUrl);
	return {
		type: actionTypes.RATING_REPORT_LIST,
		payload: request,
	};
};

export const ResponseTimeReportData = (startDate, endDate, userId, activePage, PerPageSize) => {
	let parameters = '';
	parameters += 'page=' + activePage + '&items=' + PerPageSize;
	parameters += '&start_date=' + startDate;
	parameters += '&end_date=' + endDate;
	if (userId) {
		parameters += '&user_id=' + userId;
	}
	let ResponseTimeListUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_REPORT + '/response-time?' + parameters;
	let request = axios.get(ResponseTimeListUrl);
	return {
		type: actionTypes.RESPONSE_TIME_REPORT_LIST,
		payload: request,
	};
};

export const ServiceRequestReportData = (startDate, endDate, userId, categoryId) => {
	let parameters = '';
	parameters += 'start_date=' + startDate;
	parameters += '&end_date=' + endDate;
	if (userId) {
		parameters += '&user_id=' + userId;
	}
	if (categoryId) {
		parameters += '&category_id=' + categoryId;
	}
	let ServieRequestListUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_REPORT + '/service-request?' + parameters;
	console.log(ServieRequestListUrl);
	let request = axios.get(ServieRequestListUrl);
	return {
		type: actionTypes.SERVICE_REQUEST_REPORT_LIST,
		payload: request,
	};
};
