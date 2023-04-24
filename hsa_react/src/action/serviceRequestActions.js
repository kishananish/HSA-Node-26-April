import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const ServiceRequestSave = (serviceRequestParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL;
    let request = axios.post(saveUrl, serviceRequestParams);
    return {
        type: actionTypes.SERVICE_REQUEST_SAVE,
        payload: request
    }
};

export const ServiceRequestList = (activePage, PerPageSize) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL + '?page=' + activePage + '&items=' + PerPageSize
    let request = axios.get(listUrl);
    return {
        type: actionTypes.SERVICE_REQUEST_LIST,
        payload: request
    }
};

export const ServiceRequestUpdate = (serviceRequestId, serviceRequestParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL + '/' + serviceRequestId;
    let request = axios.put(updateUrl, serviceRequestParams);
    return {
        type: actionTypes.SERVICE_REQUEST_UPDATE,
        payload: request
    }
};

export const ServiceRequestView = (serviceRequestId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL + '/' + serviceRequestId;
    let request = axios.get(viewUrl);
    return {
        type: actionTypes.SERVICE_REQUEST_VIEW,
        payload: request
    }
};

export const ServiceRequestRemove = (serviceRequestId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL + '/' + serviceRequestId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.SERVICE_REQUEST_REMOVE,
        payload: request
    }
};

export const ServiceRequestHistory = (serviceRequestId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL + '/history/' + serviceRequestId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.SERVICE_REQUEST_HISTORY,
        payload: request
    }
};


export const ServiceRequestDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL;
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.SERVICE_REQUEST_DELETE_ALL,
        payload: request
    }
};

export const ServiceRequestResolution = (serviceRequestResolutionParams) => {
    let AddupdateUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_REQUEST_API_URL + '/resolution';
    let request = axios.post(AddupdateUrl, serviceRequestResolutionParams);
    return {
        type: actionTypes.SERVICE_REQUEST_ADD_RESOLUTION,
        payload: request
    }
};

export const ServiceRequestPaymentDeposit = (paymentDetails) => {
    let paymentDepositUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_PAYMENT + '/deposit';
    let request = axios.post(paymentDepositUrl, paymentDetails);
    return {
        type: actionTypes.SERVICE_REQUEST_PAYMENT,
        payload: request
    }
};

