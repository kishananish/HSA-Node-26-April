import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const SubCategorySave = (SubCategoryParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL;
    let request = axios.post(saveUrl, SubCategoryParams);
    return {
        type: actionTypes.SUBCATEGORY_SAVE,
        payload: request
    }
};

export const SubCategoryList = () => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.SUBCATEGORY_LIST,
        payload: request
    }
};

export const SubCategoryUpdate = (SubCategoryId, SubCategoryParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL + '/' + SubCategoryId;
    let request = axios.patch(updateUrl, SubCategoryParams);
    return {
        type: actionTypes.SUBCATEGORY_UPDATE,
        payload: request
    }
};

export const SubCategoryView = (subcategoryId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL;
    let request = axios.get(viewUrl, subcategoryId);
    return {
        type: actionTypes.SUBCATEGORY_VIEW,
        payload: request
    }
};

export const SubCategoryRemove = (subcategoryId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL + '/' + subcategoryId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.SUBCATEGORY_REMOVE,
        payload: request
    }
};

export const SubCategoryHistory = (subcategoryId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL + '/history/' + subcategoryId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.SUBCATEGORY_HISTORY,
        payload: request
    }
};


export const SubCategoryDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.SUBCATEGORY_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.SUBCATEGORY_DELETE_ALL,
        payload: request
    }
};