import { connect } from 'react-redux';
import Earnings from '../components/Reports/Earnings';
import { bindActionCreators } from 'redux';
import { EarningReportData } from '../action/reportActions';
import { login, logout } from '../action/adminActions';
import { ServiceProviderList } from '../action/serviceProviderActions';
import { CityList } from '../action/commanActions';

const mapStateToProps = state => {
	return {
		ReportReducer: state.ReportReducer,
		LoginReducer: state.LoginReducer,
		ServiceProviderReducer: state.ServiceProviderReducer,
		CommanReducer: state.CommanReducer,
	};
};
const mapDispatchToProps = dispatch => {
	return bindActionCreators({ EarningReportData, login, logout, ServiceProviderList, CityList }, dispatch);
};

const ReportEarningContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Earnings);

export default ReportEarningContainer;
