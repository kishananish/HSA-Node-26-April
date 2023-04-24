import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const RolesSave = (rolesParams) => {
    let saveUrl = apiConstants.BASE_API_URL + 'role';
    let request = axios.post(saveUrl, rolesParams);
    return {
        type: actionTypes.ROLES_SAVE,
        payload: request
    }
};

export const RolesList = (activePage, PerPageSize) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.ROLE_API_URL + '?page=' + activePage + '&items=' + PerPageSize;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.ROLES_LIST,
        payload: request
    }
};

export const RolesUpdate = (rolesId, rolesParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.ROLE_API_URL + '/' + rolesId;
    let request = axios.patch(updateUrl, rolesParams);
    return {
        type: actionTypes.ROLES_UPDATE,
        payload: request
    }
};

export const RoleView = (roleId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.ROLE_API_URL + '/' + roleId;
    let request = axios.get(viewUrl);
    return {
        type: actionTypes.ROLE_VIEW,
        payload: request
    }
};

export const RolesRemove = (rolesId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.ROLE_API_URL + '/' + rolesId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.ROLES_REMOVE,
        payload: request
    }
};

export const RolesDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.ROLE_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.ROLES_DELETE_ALL,
        payload: request
    }
};


export const RolesAccessLevel = () => {
    let getListUrl = apiConstants.BASE_API_URL + 'access-level';
    let request = axios.get(getListUrl);
    return {
        type: actionTypes.ROLES_ACCESS_LEVEL,
        payload: request
    }
};

