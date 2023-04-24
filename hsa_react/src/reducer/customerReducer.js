import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedCustomerData : {},
    customerData : {},
    selectedCustomerHistory : {}
};

const CustomerReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.CUSTOMER_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.CUSTOMER_LIST:
            return {
                ...state,
                customerData: action.payload.data.data
            };
            break;

        case actionTypes.CUSTOMER_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.CUSTOMER_VIEW:
            return {
                ...state,
                selectedCustomerData: action.payload.data.data
            };
            break;

        case actionTypes.CUSTOMER_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.CUSTOMER_HISTORY:
            return {
                ...state,
                selectedCustomerHistory: action.payload.data.data.result
            };
            break;

        default:
            return state;
    }

}

export default CustomerReducer;
