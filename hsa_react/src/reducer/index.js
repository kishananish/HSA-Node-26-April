import { combineReducers } from 'redux';
import LoginReducer from './loginReducer';
import CustomerReducer from './customerReducer';
import FaqReducer from './faqReducer';
import CategoryReducer from './categoryReducer';
import SubCategoryReducer from './subcategoryReducer';
import PromoCodeReducer from './promoCodeReducer';
import QueryReducer from './queryReducer';
import NotificationReducer from './notificationReducer';
import RoleReducer from './roleReducer';
import ServiceRequestReducer from './serviceRequestReducer';
import ReportReducer from './reportReducer';
import ServiceProviderReducer from './serviceProviderReducer';
import DashboardReducer from './dashboardReducer';
import MaterialReducer from './materialReducer';
import CommanReducer from './commanReducer';
import ConfigurationReducer  from './configurationReducer';

const rootReducer = combineReducers({
	LoginReducer,
	CustomerReducer,
	FaqReducer,
	CategoryReducer,
	SubCategoryReducer,
	PromoCodeReducer,
	QueryReducer,
	NotificationReducer,
	RoleReducer,
	ServiceRequestReducer,
	ServiceProviderReducer,
	ReportReducer,
	DashboardReducer,
	MaterialReducer,
	CommanReducer,
	ConfigurationReducer,
});

export default rootReducer;
