import * as menuLinkConstants from "../constants/MenuLinkConstants";

export const menuList=[
    {
        id : '1',
        icon: 'th-large',
        label: 'Dashboard',
        to: menuLinkConstants.DASHBOARD_LINK,
    },
    {
        icon: 'cogs',
        label: 'Manage',
        content: [
            {
                icon: '',
                label: 'Manage Customers',
                to: menuLinkConstants.CUSTOMER_MANAGE_LINK
            },
            {
                icon: '',
                label: 'Manage Service Provider',
                to: menuLinkConstants.SERVICE_PROVIDER_MANAGE_LINK
            },
            {
                icon: '',
                label: 'Manage Service Request',
                to: menuLinkConstants.SERVICE_REQUEST_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage Category',
                to: menuLinkConstants.CATEGORY_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage Sub-Category',
                to: menuLinkConstants.SUBCATEGORY_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage Material',
                to: menuLinkConstants.MATERIAL_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage FAQ',
                to: menuLinkConstants.FAQ_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage Promo Code',
                to: menuLinkConstants.PROMOCODE_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage Query / Suggestion',
                to: menuLinkConstants.QUERY_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Notifications',
                to: menuLinkConstants.NOTIFICATION_MANAGE_LINK,
            },
            {
                icon: '',
                label: 'Manage Roles',
                to: menuLinkConstants.ROLE_MANAGE_LINK,
            }
        ]
    },
    {
        icon: 'list',
        label: 'Reports',
        content: [
        {
            icon: '',
            label: 'Active Time',
            to: menuLinkConstants.REPORT_ACTIVE_TIME_LINK
        },
        {
            icon: '',
            label: 'Earnings',
            to: menuLinkConstants.REPORT_EARNING_LINK
        },
        /*{
            icon: '',
            label: 'Earning Services',
            to: menuLinkConstants.REPORT_EARNING_SERVICE_LINK
        },*/
        {
            icon: '',
            label: 'Rating',
            to: menuLinkConstants.REPORT_RATING_LINK
        },
        {
            icon: '',
            label: 'Response Time',
            to: menuLinkConstants.REPORT_RESPONSE_TIME_LINK
        },
        {
            icon: '',
            label: 'Service Request',
            to: menuLinkConstants.REPORT_SERVICE_REQUEST_LINK
        }
       ]
    }
];
