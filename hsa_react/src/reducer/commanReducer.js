import * as actionTypes from '../action/actionTypes';

var initialState = {
	cityList: null,
};

const CommanReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_CITY:
			return {
				...state,
				cityList: action.payload.data.data,
			};
			break;

		default:
			return state;
	}
};

export default CommanReducer;
