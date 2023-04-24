import * as actionTypes from '../action/actionTypes';

var initialState = {
    countData : {},
    salesChartData : {},
    customerGrowthData : {}
};

const DashboardReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.DASHBOARD_COUNT:
            return {
                ...state,
                countData: action.payload.data
            };
            break;

        case actionTypes.DASHBOARD_SALES_CHART:
            return {
                ...state,
                salesChartData: action.payload.data
            };
            break;

        case actionTypes.DASHBOARD_CUSTOMER_GROWTH:
            return {
                ...state,
                customerGrowthData: action.payload.data
            };
            break;

        default:
            return state;
    }

}

export default DashboardReducer;
