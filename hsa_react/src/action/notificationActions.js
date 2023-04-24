import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const NotificationSave = (notificationParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL;
    let request = axios.post(saveUrl, notificationParams);
    return {
        type: actionTypes.NOTIFICATION_SAVE,
        payload: request
    }
};

export const NotificationList = () => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.NOTIFICATION_LIST,
        payload: request
    }
};

export const NotificationUpdate = (notificationId, notificationParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL + '/' + notificationId;
    let request = axios.patch(updateUrl, notificationParams);
    return {
        type: actionTypes.NOTIFICATION_UPDATE,
        payload: request
    }
};

export const NotificationView = (notificationId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL;
    let request = axios.get(viewUrl, notificationId);
    return {
        type: actionTypes.NOTIFICATION_VIEW,
        payload: request
    }
};

export const NotificationRemove = (notificationId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL + '/' + notificationId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.NOTIFICATION_REMOVE,
        payload: request
    }
};

export const NotificationHistory = (notificationId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL + '/history/' + notificationId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.NOTIFICATION_HISTORY,
        payload: request
    }
};


export const NotificationDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.NOTIFICATION_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.NOTIFICATION_DELETE_ALL,
        payload: request
    }
};

export const SearchUserWithRole= (roleName) => {
    let searchUrl = apiConstants.BASE_API_URL + apiConstants.SEARCH_USER_WITH_ROLE + '?role=' + roleName;
    let request = axios.get(searchUrl);
    return {
        type: actionTypes.SEARCH_USER_WITH_ROLE,
        payload: request
    }
};