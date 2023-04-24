import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedQuery: {},
    queryData : {},
    querySelectedHistoryData : {}
};

const QueryReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.QUERY_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.QUERY_LIST:
            return {
                ...state,
                queryData: action.payload.data.data
            };
            break;

        case actionTypes.QUERY_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.QUERY_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.QUERY_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.QUERY_HISTORY:
            return {
                ...state,
                querySelectedHistoryData: action.payload.data.data.reverse()
            };
            break;

        default:
            return state;
    }

}

export default QueryReducer;
