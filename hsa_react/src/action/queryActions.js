import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const QuerySave= (queryParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL;
    let request = axios.post(saveUrl, queryParams);
    return {
        type: actionTypes.QUERY_SAVE,
        payload: request
    }
};

export const QueryList = (activePage, PerPageSize) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL + '/admin?page=' + activePage + '&items=' + PerPageSize;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.QUERY_LIST,
        payload: request
    }
};

export const QueryUpdate = (queryId, queryParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL + '/' + queryId;
    let request = axios.patch(updateUrl, queryParams);
    return {
        type: actionTypes.QUERY_UPDATE,
        payload: request
    }
};

export const QueryView = (queryId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL + '/' + queryId;
    let request = axios.get(viewUrl, queryId);
    return {
        type: actionTypes.QUERY_VIEW,
        payload: request
    }
};

export const QueryRemove = (queryId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL + '/' + queryId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.QUERY_REMOVE,
        payload: request
    }
};

export const QueryHistory = (queryId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL + '/history/' + queryId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.QUERY_HISTORY,
        payload: request
    }
};


export const QueryDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.QUERY_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.QUERY_DELETE_ALL,
        payload: request
    }
};