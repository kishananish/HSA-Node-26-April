import * as actionTypes from '../action/actionTypes';

var initialState = {
    selectedSubCategory: {},
    subCategoryData : {},
    subCategorySelectedHistoryData : {}
};

const SubCategoryReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.SUBCATEGORY_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.SUBCATEGORY_LIST:
            return {
                ...state,
                subCategoryData: action.payload.data.data
            };
            break;

        case actionTypes.SUBCATEGORY_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.SUBCATEGORY_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.SUBCATEGORY_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.SUBCATEGORY_HISTORY:
            return {
                ...state,
                subCategorySelectedHistoryData: action.payload.data.data.reverse()
            };
            break;

        default:
            return state;
    }

}

export default SubCategoryReducer;
