import { connect } from 'react-redux';
import ServiceProviderAdd from '../components/ServiceProvider/ServiceProviderAdd';
import { bindActionCreators } from 'redux';
import {
	ServiceProviderSave,
	ServiceProviderUpdate,
	ServiceProviderView,
	ServiceProviderProfileImgUpload,
	ServiceProviderHistory,
	CategoryList
} from '../action/serviceProviderActions';
import { RolesList } from '../action/rolesActions';
import { CityList } from '../action/commanActions';
import RoleReducer from '../reducer/roleReducer';

const mapStateToProps = state => {
	return {
		ServiceProviderReducer: state.ServiceProviderReducer,
		LoginReducer: state.LoginReducer,
		RoleReducer: state.RoleReducer,
		CommanReducer: state.CommanReducer,
	};
};
const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			ServiceProviderSave,
			CategoryList,
			ServiceProviderUpdate,
			ServiceProviderView,
			ServiceProviderProfileImgUpload,
			RolesList,
			ServiceProviderHistory,
			CityList,
		},
		dispatch
	);
};

const ServiceProviderAddContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ServiceProviderAdd);

export default ServiceProviderAddContainer;
