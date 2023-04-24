import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');
axios.defaults.headers.common['access_token'] = (accessToken) ? accessToken : '';

export const MaterialSave = (materialParams) => {
    let saveUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL;
    let request = axios.post(saveUrl, materialParams);
    return {
        type: actionTypes.MATERIAL_SAVE,
        payload: request
    }
};

export const SubCategoryList = (id) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.CATEGORY_API_URL + "/" + id + '/sub-categories';
    let request = axios.get(listUrl);
    return {
        type: actionTypes.SUB_CATEGORY_LIST,
        payload: request
    }
};

export const MaterialList = (activePage, PerPageSize) => {
    let listUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL + '?page=' + activePage + '&items=' + PerPageSize;
    let request = axios.get(listUrl);
    return {
        type: actionTypes.MATERIAL_LIST,
        payload: request
    }

};

export const MaterialUpdate = (materialId, materialParams) => {
    let updateUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL + '/' + materialId;
    let request = axios.put(updateUrl, materialParams);
    return {
        type: actionTypes.MATERIAL_EDIT,
        payload: request
    }
};

export const MaterialView = (materialId) => {
    let viewUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL;
    let request = axios.get(viewUrl, materialId);
    return {
        type: actionTypes.MATERIAL_VIEW,
        payload: request
    }
};

export const MaterialRemove = (materialId) => {
    let removeUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL + '/' + materialId;
    let request = axios.delete(removeUrl);
    return {
        type: actionTypes.MATERIAL_REMOVE,
        payload: request
    }
};

export const MaterialHistory = (materialId) => {
    let historyUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL + '/history/' + materialId;
    let request = axios.get(historyUrl);
    return {
        type: actionTypes.MATERIAL_HISTORY,
        payload: request
    }
};


export const MaterialDeleteAll = (ids) => {
    let deleteAllUrl = apiConstants.BASE_API_URL + apiConstants.MATERIAL_API_URL + '/all';
    let axiosConfig = {
        data: {
            ids: ids
        }
    };
    let request = axios.delete(deleteAllUrl, axiosConfig);
    return {
        type: actionTypes.MATERIAL_DELETE_ALL,
        payload: request
    }
};