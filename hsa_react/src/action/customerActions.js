import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';
import * as webConstants from '../constants/WebConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const CustomerSave = (customerParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/add';
    let request = axios.post(saveUrl, customerParams);
    return {
        type: actionTypes.CUSTOMER_SAVE,
        payload: request
    }
};

export const CustomerList = (activePage, PerPageSize) => {
   // let listUrl = apiConstants.BASE_API_URL + apiConstants.USER_LIST_API_URL + '/all?page=' + activePage + '&items=' + PerPageSize + '&role=' + webConstants.ROLE_USER;
    let listUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/all?page=' + activePage + '&items=' + PerPageSize;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.CUSTOMER_LIST,
        payload: request
    }
};

export const CustomerUpdate = (customerId, customerParams) => {
    //let updateUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/update/' + customerId;
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/' + customerId;
    let request = axios.put(updateUrl, customerParams);
    return {
        type: actionTypes.CUSTOMER_UPDATE,
        payload: request
    }
};

export const CustomerView = (customerId) => {
    //let viewUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/get/' + customerId;
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/' + customerId;
    let request = axios.get(viewUrl);
    return {
        type: actionTypes.CUSTOMER_VIEW,
        payload: request
    }
};

export const CustomerRemove = (customerId) => {
   // let removeUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/delete/' + customerId;
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/' + customerId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.CUSTOMER_REMOVE,
        payload: request
    }
};

export const CustomerDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.CUSTOMER_DELETE_ALL,
        payload: request
    }
};

export const CustomerHistory = (customerId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.CUSTOMER_API_URL + '/history/' + customerId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.CUSTOMER_HISTORY,
        payload: request
    }
};

