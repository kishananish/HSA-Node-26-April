import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedPromoCode: {},
    promoCodeData : {},
    promoCodeSelectedHistoryData : {}
};

const PromoCodeReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.PROMOCODE_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.PROMOCODE_LIST:
            return {
                ...state,
                promoCodeData: action.payload.data.data
            };
            break;

        case actionTypes.PROMOCODE_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.PROMOCODE_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.PROMOCODE_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.PROMOCODE_HISTORY:
            return {
                ...state,
                promoCodeSelectedHistoryData: action.payload.data.data.reverse()
            };
            break;

        default:
            return state;
    }

}

export default PromoCodeReducer;
