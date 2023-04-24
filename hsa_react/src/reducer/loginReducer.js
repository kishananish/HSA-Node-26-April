import * as actionTypes from '../action/actionTypes';

var initialState = {
    isAuthenticated: false,
    loginUser: {},
};

const LoginReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.LOGIN:
            let loginStatus, loginData;
            if(action.payload.data !== undefined){
                loginStatus = action.payload.data.status;
                loginData = action.payload.data.data;
            } else {
                loginStatus = false;
                loginData = action.payload.data;
            }
            return {
                ...state,
                isAuthenticated: loginStatus,
                loginUser: loginData
            };
            break;

        case actionTypes.LOGOUT:
            return {
                isAuthenticated: false,
                loginUser: {},
            };
            break;

        default:
            return state;
    }

}

export default LoginReducer;
