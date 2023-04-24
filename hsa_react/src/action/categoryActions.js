import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

let axiosConfig = {};
export const CategorySave = (CategoryParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL;
    let request = axios.post(saveUrl, CategoryParams);
    return {
        type: actionTypes.CATEGORY_SAVE,
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

export const CategoryUpdate = (categoryId, categoryParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL + '/' + categoryId;
    let request = axios.patch(updateUrl, categoryParams);
    return {
        type: actionTypes.CATEGORY_UPDATE,
        payload: request
    }
};

export const CategoryView = (categoryId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL;
    let request = axios.get(viewUrl, categoryId);
    return {
        type: actionTypes.CATEGORY_VIEW,
        payload: request
    }
};

export const CategoryRemove = (categoryId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL + '/' + categoryId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.CATEGORY_REMOVE,
        payload: request
    }
};

export const CategoryHistory = (categoryId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL + '/history/' + categoryId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.CATEGORY_HISTORY,
        payload: request
    }
};


export const CategoryDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL + '/all';
     axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.CATEGORY_DELETE_ALL,
        payload: request
    }
};

export const CategoryImageUpload = (file) => {
    let uploadImgUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_IMAGE_UPLOAD;
    let request = axios.post(uploadImgUrl, file);
    return {
        type: actionTypes.CATEGORY_IMAGE_UPLOAD,
        payload: request
    }
};