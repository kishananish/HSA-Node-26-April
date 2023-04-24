import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedServiceProviderData : {},
    serviceProviderData : {},
    selectedServiceProviderHistory : {},
    serviceProviderProfileImage : {},
    serviceProviderUserListData : {}
};

const ServiceProviderReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.SERVICE_PROVIDER_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_PROVIDER_LIST:
            return {
                ...state,
                serviceProviderData: action.payload.data.data
            };
            break;

        case actionTypes.SERVICE_PROVIDER_USER_LIST:
            return {
                ...state,
                serviceProviderUserListData: action.payload.data.data
            };
            break;

        case actionTypes.SERVICE_PROVIDER_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_PROVIDER_VIEW:
            return {
                ...state,
                selectedServiceProviderData: action.payload.data.data
            };
            break;

        case actionTypes.SERVICE_PROVIDER_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.SERVICE_PROVIDER_HISTORY:
            return {
                ...state,
                selectedServiceProviderHistory: action.payload.data.data
            };
            break;

        case actionTypes.SERVICE_PROVIDER_PROFILE_IMG_UPLOAD:
            return {
                ...state,
                serviceProviderProfileImage: action.payload.data.data
            };
            break;
        case actionTypes.CATEGORY_LIST:
            return {
                ...state,
                categoryData: action.payload.data.data
            };
            break;    



        default:
            return state;
    }

}

export default ServiceProviderReducer;
