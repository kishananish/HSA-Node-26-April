import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as apiConstants from '../constants/APIConstants';

export const CityList = () => {
	let getCityUrl = apiConstants.BASE_API_URL + 'cities';
	let request = axios.get(getCityUrl);
	return {
		type: actionTypes.GET_CITY,
		payload: request,
	};
};
