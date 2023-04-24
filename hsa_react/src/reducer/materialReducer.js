import * as actionTypes from '../action/actionTypes';

var initialState = {
    materialData: {},
    materialHistoryData: {},
    SubCategoryList: []
};

const MaterialReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.MATERIAL_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.MATERIAL_LIST:
            return {
                ...state,
                materialData: action.payload.data.data
            };
            break;

        case actionTypes.MATERIAL_EDIT:
            return {
                ...state,
            };
            break;

        case actionTypes.MATERIAL_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.MATERIAL_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.MATERIAL_HISTORY:
            return {
                ...state,
                materialHistoryData: action.payload.data.data.reverse()
            };
            break;

        case actionTypes.MATERIAL_DELETE_ALL:
            return {
                ...state,
            };
            break;
        case actionTypes.SUB_CATEGORY_LIST:
            return {
                ...state,
                SubCategoryList:  action.payload.data.data
            };
            break;


        default:
            return state;
    }

}

export default MaterialReducer;
