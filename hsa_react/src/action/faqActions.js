import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const FaqSave = (FaqParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL;
    let request = axios.post(saveUrl, FaqParams);
    return {
        type: actionTypes.FAQ_SAVE,
        payload: request
    }
};

export const FaqList = (activePage, PerPageSize, filter) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL + '?page=' + activePage + '&items=' + PerPageSize + (filter != "-1" ? ('&filter=' + filter) : '');
    console.log(listUrl)
    let request = axios.get(listUrl);
    return {
        type: actionTypes.FAQ_LIST,
        payload: request
    }
};

export const FaqUpdate = (faqId, faqParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL + '/' + faqId;
    let request = axios.patch(updateUrl, faqParams);
    return {
        type: actionTypes.FAQ_UPDATE,
        payload: request
    }
};

export const FaqView = (faqId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL;
    let request = axios.get(viewUrl, faqId);
    return {
        type: actionTypes.FAQ_VIEW,
        payload: request
    }
};

export const FaqRemove = (faqId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL + '/' + faqId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.FAQ_REMOVE,
        payload: request
    }
};

export const FaqHistory = (faqId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL + '/history/' + faqId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.FAQ_HISTORY,
        payload: request
    }
};


export const FaqDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.FAQ_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.FAQ_DELETE_ALL,
        payload: request
    }
};