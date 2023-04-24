import * as actionTypes from '../action/actionTypes';

var initialState = {
    serviceRequestData : {},
    selectedServiceRequestHistory : {}
};

const ServiceRequestReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.SERVICE_REQUEST_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_REQUEST_LIST:
            return {
                ...state,
                serviceRequestData : action.payload.data.data
            };
            break;

        case actionTypes.SERVICE_REQUEST_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_REQUEST_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_REQUEST_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_REQUEST_HISTORY:
            return {
                ...state,
                selectedServiceRequestHistory : action.payload.data.data
            };
            break;

        default:
            return state;
    }

}

export default ServiceRequestReducer;
