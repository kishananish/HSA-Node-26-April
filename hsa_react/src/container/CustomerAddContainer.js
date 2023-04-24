import { connect } from 'react-redux';
import CustomerAdd from '../components/Customer/CustomerAdd';
import { bindActionCreators } from 'redux';
import { CustomerSave, CustomerUpdate, CustomerView, CustomerHistory } from '../action/customerActions';
import { CityList } from '../action/commanActions';

const mapStateToProps = state => {
	return {
		CustomerReducer: state.CustomerReducer,
		LoginReducer: state.LoginReducer,
		CommanReducer: state.CommanReducer,
	};
};
const mapDispatchToProps = dispatch => {
	return bindActionCreators({ CustomerSave, CustomerUpdate, CustomerView, CustomerHistory, CityList }, dispatch);
};

const CustomerAddContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CustomerAdd);

export default CustomerAddContainer;
