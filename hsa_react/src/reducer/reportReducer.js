import * as actionTypes from '../action/actionTypes';

var initialState = {
    activeTimeData : {},
    earningData : {},
    earningServiceData : {},
    ratingData : {},
    responseTimeData : {},
    serviceRequestReportData : {},
};

const ReportReducer = (state = initialState, action)=> {
    switch (action.type) {

        case actionTypes.ACTIVE_TIME_REPORT_LIST:
            return {
                ...state,
                activeTimeData: action.payload.data.data
            };
            break;

        case actionTypes.EARNING_REPORT_LIST:
            return {
                ...state,
                earningData: action.payload.data.data
            };
            break;

        case actionTypes.EARNING_SERVICE_REPORT_LIST:
            return {
                ...state,
                earningServiceData: action.payload.data.data
            };
            break;

        case actionTypes.RATING_REPORT_LIST:
            return {
                ...state,
                ratingData: action.payload.data.data
            };
            break;

        case actionTypes.RESPONSE_TIME_REPORT_LIST:
            return {
                ...state,
                responseTimeData: action.payload.data.data
            };
        break;

        case actionTypes.SERVICE_REQUEST_REPORT_LIST:
            return {
                ...state,
                serviceRequestReportData: action.payload.data.data
            };
            break;

        default:
            return state;
    }

}

export default ReportReducer;
