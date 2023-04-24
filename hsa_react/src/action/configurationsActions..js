import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const configurationSave = (configParams) => {
    let saveUrl = apiConstants.BASE_API_URL +apiConstants.CONFIG_API_URL;
    let request = axios.post(saveUrl, configParams);
    return {
        type: actionTypes.CONFIGURATION_SAVED,
        payload: request
    }
};

export const getConfig = () => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.CONFIG_API_URL;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.CONFIGURATION_LIST,
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

