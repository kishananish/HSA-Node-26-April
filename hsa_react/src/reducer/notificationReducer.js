import * as actionTypes from '../action/actionTypes';

var initialState = {
    notificationData : {},
    notificationSelectedHistoryData : {}
};

const NotificationReducer = (state = initialState, action)=> {
    switch (action.type) {
        case actionTypes.NOTIFICATION_SAVE:
            return {
                ...state,
            };
            break;

        case actionTypes.NOTIFICATION_LIST:
            return {
                ...state,
                notificationData: action.payload.data.data
            };
            break;

        case actionTypes.NOTIFICATION_UPDATE:
            return {
                ...state,
            };
            break;

        case actionTypes.NOTIFICATION_VIEW:
            return {
                ...state,
            };
            break;

        case actionTypes.NOTIFICATION_REMOVE:
            return {
                ...state,
            };
            break;

        case actionTypes.NOTIFICATION_HISTORY:
            return {
                ...state,
                notificationSelectedHistoryData: action.payload.data.data.reverse()
            };
            break;

        default:
            return state;
    }

}

export default NotificationReducer;
