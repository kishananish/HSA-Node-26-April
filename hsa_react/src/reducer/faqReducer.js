import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedFaq: {},
    faqData : {},
    faqSelectedHistoryData : {}
};

const FaqReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.FAQ_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.FAQ_LIST:
            return {
                ...state,
                faqData: action.payload.data.data
            };
            break;

        case actionTypes.FAQ_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.FAQ_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.FAQ_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.FAQ_HISTORY:
            return {
                ...state,
                faqSelectedHistoryData: action.payload.data.data.reverse()
            };
            break;

        default:
            return state;
    }

}

export default FaqReducer;
