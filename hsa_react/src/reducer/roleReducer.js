import * as actionTypes from '../action/actionTypes';

var initialState = {
    roleData : {},
    rolesAccessLevelData : {},
    selectedRoleDetails : '',
    selectedRoleAccessLevel: ''
};

const RoleReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.ROLES_SAVE:
            return {
                ...state
            };
            break;

        case actionTypes.ROLES_LIST:
            return {
                ...state,
                roleData: action.payload.data.data
            };
            break;

        case actionTypes.ROLES_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.ROLE_VIEW:
            return {
                ...state,
                selectedRoleDetails : action.payload.data
            };
            break;

        case actionTypes.ROLES_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.ROLES_HISTORY:
        return {
            ...state
        };
        break;

        case actionTypes.ROLES_ACCESS_LEVEL:
            return {
                ...state,
                rolesAccessLevelData : action.payload.data.data
            };
            break;

        default:
            return state;
    }

}

export default RoleReducer;
