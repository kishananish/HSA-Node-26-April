import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';
import * as webConstants from '../constants/WebConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const ServiceProviderSave = (serviceProviderParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/add';
    let request = axios.post(saveUrl, serviceProviderParams);
    return {
        type: actionTypes.SERVICE_PROVIDER_SAVE,
        payload: request
    }
};

export const ServiceProviderList = (activePage, PerPageSize) => {
    //let listUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_LIST_API_URL + '/all?page=' + activePage + '&items=' + PerPageSize;
    let listUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/all?page=' + activePage + '&items=' + PerPageSize;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.SERVICE_PROVIDER_LIST,
        payload: request
    }
};

export const ServiceProviderUserList = (activePage, PerPageSize) => {
    let userlistUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/all?page=' + activePage + '&items=' + PerPageSize + '&role=service_provider';
    let request = axios.get(userlistUrl);
    return {
        type: actionTypes.SERVICE_PROVIDER_USER_LIST,
        payload: request
    }
};

export const ServiceProviderUpdate = (serviceProviderId, serviceProviderParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/update/' + serviceProviderId;
    let request = axios.post(updateUrl, serviceProviderParams);
    return {
        type: actionTypes.SERVICE_PROVIDER_UPDATE,
        payload: request
    }
};

export const ServiceProviderView = (serviceProviderId,) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL +'/get/' + serviceProviderId;
    let request = axios.get(viewUrl);
    return {
        type: actionTypes.SERVICE_PROVIDER_VIEW,
        payload: request
    }
};

export const ServiceProviderRemove = (serviceProviderId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/delete/' + serviceProviderId;
    let request = axios.get(removeUrl);
    return {
        type: actionTypes.SERVICE_PROVIDER_REMOVE,
        payload: request
    }
};

export const ServiceProviderHistory = (serviceProviderId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/history/' + serviceProviderId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.SERVICE_PROVIDER_HISTORY,
        payload: request
    }
};

export const ServiceProviderDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_API_URL + '/deleteAll';
    let request = axios.put(deleteAllUrl, {ids: ids});
    return {
        type: actionTypes.SERVICE_PROVIDER_DELETE_ALL,
        payload: request
    }
};

export const ServiceProviderProfileImgUpload = (file) => {
    let uploadImgUrl = apiConstants.BASE_API_URL + apiConstants.SERVICE_PROVIDER_PROFILE_IMAGE_UPLOAD;
    let request = axios.post(uploadImgUrl, file);
    return {
        type: actionTypes.SERVICE_PROVIDER_DELETE_ALL,
        payload: request
    }
};

export const CategoryList = () => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.CATEGORY_LIST,
        payload: request
    }
};