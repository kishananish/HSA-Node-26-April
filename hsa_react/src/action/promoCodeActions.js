import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const PromoCodeSave = (promoCodeParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL;
    let request = axios.post(saveUrl, promoCodeParams);
    return {
        type: actionTypes.PROMOCODE_SAVE,
        payload: request
    }
};

export const PromoCodeList = (activePage, PerPageSize) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL + '?page=' + activePage + '&items=' + PerPageSize;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.PROMOCODE_LIST,
        payload: request
    }
};

export const PromoCodeUpdate = (promoCodeId, promoCodeParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL + '/' + promoCodeId;
    let request = axios.patch(updateUrl, promoCodeParams);
    return {
        type: actionTypes.PROMOCODE_UPDATE,
        payload: request
    }
};

export const PromoCodeView = (promoCodeId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL;
    let request = axios.get(viewUrl, promoCodeId);
    return {
        type: actionTypes.PROMOCODE_VIEW,
        payload: request
    }
};

export const PromoCodeRemove = (promoCodeId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL + '/' + promoCodeId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.PROMOCODE_REMOVE,
        payload: request
    }
};

export const PromoCodeHistory = (promoCodeId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL + '/history/' + promoCodeId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.PROMOCODE_HISTORY,
        payload: request
    }
};


export const PromoCodeDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.PROMOCODE_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.PROMOCODE_DELETE_ALL,
        payload: request
    }
};