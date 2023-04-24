import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedCategory: {},
    categoryData : {},
    categorySelectedHistoryData : {}
};

const CategoryReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.CATEGORY_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.CATEGORY_LIST:
            return {
                ...state,
                categoryData: action.payload.data.data
            };
            break;

        case actionTypes.CATEGORY_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.CATEGORY_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.CATEGORY_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.CATEGORY_HISTORY:
            return {
                ...state,
                categorySelectedHistoryData: action.payload.data.data.reverse()
            };
            break;

        case actionTypes.CATEGORY_IMAGE_UPLOAD:
            return {
                ...state
            };
            break;

        default:
            return state;
    }

}

export default CategoryReducer;
