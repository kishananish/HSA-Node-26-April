import * as actionTypes from '../action/actionTypes';

var initialState = {
    configData : {},
    configAccessLevelData : {},
    selectedConfigDetails : '',
    selectedConfigAccessLevel: ''
};

const ConfigurationReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.CONFIGURATION_SAVED:
            return {
                ...state
            };
            break;

        case actionTypes.CONFIGURATION_LIST:
            return {
                ...state,
                configData: action.payload.data.data
            };
            break;

        default:
            return state;
    }

}

export default ConfigurationReducer;
