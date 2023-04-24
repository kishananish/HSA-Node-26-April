import { connect } from 'react-redux';
import ServiceRequestAdd from '../components/ServiceRequest/ServiceRequestAdd';
import { bindActionCreators } from 'redux';
import {
	ServiceRequestView,
	ServiceRequestUpdate,
	ServiceRequestHistory,
	ServiceRequestResolution,
} from '../action/serviceRequestActions';
import { login, logout } from '../action/adminActions';
import ServiceRequestReducer from '../reducer/serviceRequestReducer';
import { CityList } from '../action/commanActions';

const mapStateToProps = state => {
	return {
		ServiceRequestReducer: state.ServiceRequestReducer,
		LoginReducer: state.LoginReducer,
		CommanReducer: state.CommanReducer,
	};
};
const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			ServiceRequestView,
			ServiceRequestUpdate,
			ServiceRequestHistory,
			ServiceRequestResolution,
			login,
			logout,
			CityList,
		},
		dispatch
	);
};

const ServiceProviderManageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ServiceRequestAdd);

export default ServiceProviderManageContainer;
