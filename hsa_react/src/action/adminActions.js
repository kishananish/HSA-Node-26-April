import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

let accessToken = localStorage.getItem('LOGIN_USER_TOKEN');

export const login = (adminLoginParamers) => {
    let url = apiConstants.BASE_API_URL + apiConstants.ADMIN_LOGIN_API_URL;
    adminLoginParamers = JSON.stringify(adminLoginParamers);
    let request = axios.post(url, adminLoginParamers);
    return {
        type: actionTypes.LOGIN,
        payload: request
    }
};

export const logout = () => {
    return {
        type: actionTypes.LOGOUT,
        payload: ''
    }
};

export const DashboardCount = () => {
    let CountUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_DASHBOARD_API_URL;
    let request = axios.get(CountUrl);
    return {
        type: actionTypes.DASHBOARD_COUNT,
        payload: request
    }
};

export const DashboardSalesChart = () => {
    let salesChartUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_DASHBOARD_API_URL + '/sale-chart';
    let request = axios.get(salesChartUrl);
    return {
        type: actionTypes.DASHBOARD_SALES_CHART,
        payload: request
    }
};

export const DashboardCustomerGrowth = () => {
    let customerGrowthUrl = apiConstants.BASE_API_URL + apiConstants.ADMIN_DASHBOARD_API_URL + '/customer-growth';
    let request = axios.get(customerGrowthUrl);
    return {
        type: actionTypes.DASHBOARD_CUSTOMER_GROWTH,
        payload: request
    }
};