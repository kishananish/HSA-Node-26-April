'use strict';

import formatResponse from '../../utils/formatResponse';
import AccessLevels from '../models/AccessLevels';

export const getAccessLevels = async (req, res) => {
    const access_level = [
        {
            name: 'admin',
            active: true,
            isDeleted: false,
            access_level: [
                {
                    name: 'Manage Customers',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Users',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Service Request',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Category',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Sub-Category',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Material',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage FAQ',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Promo Code',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Query / Suggestion',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Notifications',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Manage Roles',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                },
                {
                    name: 'Reports',
                    actions: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false,
                        payment: false
                    }
                }
            ]
        }
    ];
    formatResponse(res, access_level);
};

export const add = async (req, res) => {
    const data = [{ 'name': 'Customer Management', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Service Request', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Category', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Sub Category', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Users', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage FAQ', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Promo', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Query', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Report', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Notification', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Role', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }];
    const access_levels = await AccessLevels.insertMany(data);
    formatResponse(res, access_levels);
};
