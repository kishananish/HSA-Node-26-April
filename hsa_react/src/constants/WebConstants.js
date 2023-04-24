/* Comman Constants */
import Pagination from "react-js-pagination";
import React from "react";

export const SUBMIT_BUTTON_TEXT =  'SUBMIT';
export const CANCEL_BUTTON_TEXT =  'CANCEL';
export const PER_PAGE_SIZE = 10;
export const TOTAL_RATINGS = 5;
export const INDEX_ID = 'Q';
export const ROLE_USER = 'user';
export const ROLE_SERVICE_PROVIDER = 'service_provider';

/* Pages */
export const LOGIN_PAGE = 'Login';
export const FORGOT_PASSWORD_PAGE = 'Forgot Password';
export const UPDATE_PASSWORD_PAGE = 'Update Password';
export const DASHBOARD = 'Dashboard';

/* Module Wise Constants */
export const MANAGE_CUSTOMER =  'Customers';
export const MANAGE_CONFIGURATION =  'Configuration';
export const MANAGE_FAQ =  'FAQ';
export const MANAGE_CATEGORY =  'Category';
export const MANAGE_SUBCATEGORY =  'Sub-Category';
export const MANAGE_PROMOCODE =  'Promo Code';
export const MANAGE_QUERY =  'Query/Suggestion';
export const MANAGE_NOTIFICATION = 'Notifications';
export const MANAGE_ROLES = 'Roles';
export const MANAGE_SERVICE_REQUEST = 'Service Request';
export const MANAGE_SERVICE_PROVIDER = 'Users';
export const MANAGE_MATERIAL = 'Material';

export const ROLES_OPERATIONS = [ 'add' , 'edit' , 'view', 'delete' , 'payment' ];
export const ROLE_STATUS = [ 'Active', 'Inactive' ];
export const USER_TYPE = [ 'Customer', 'Service Provider' ];

export const REPORT_ACTIVE_TIME = 'Active Time of Service Provider';
export const REPORT_EARNING = 'Earnings';
export const REPORT_EARNING_SERVICE = 'Earnings By Service Provider';
export const REPORT_RATING = 'Rating Report';
export const REPORT_RESPONSE_TIME = 'Response Time of Service Provider';
export const REPORT_SERVICE_REQUEST = 'Service Request';
export const REPORT_SERVICE_REQUEST_SUBTITLE = '(Accepted/Rejected)';


export const CHART_OPTIONS =
    {
        responsive: true,
        legend: {
            position: ""
        },
        title: {
            display: true,
            text: ""
        },
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        scales: {
            xAxes: [{
                categoryPercentage: 0.4,
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    beginAtZero: true,
                    steps: 25,
                    stepValue: 5
                }
            }]
        }
    };

export const  CHART_BAR_COLOR = "#3292DF";

export const PREVIOUS_PAGE = "Previous";
export const NEXT_PAGE = "Next";