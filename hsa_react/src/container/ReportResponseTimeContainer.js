import { connect } from 'react-redux';
import ResponseTime from '../components/Reports/ResponseTime';
import { bindActionCreators } from 'redux';
import { ResponseTimeReportData  } from '../action/reportActions';
import { login, logout } from '../action/adminActions';
import { ServiceProviderList } from '../action/serviceProviderActions';


const mapStateToProps=(state)=>{

    return{
        ReportReducer : state.ReportReducer,
        LoginReducer : state.LoginReducer,
        ServiceProviderReducer : state.ServiceProviderReducer,
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            ResponseTimeReportData,
            login,
            logout,
            ServiceProviderList
        }, dispatch);
};

const ReportResponseTimeContainer = connect(mapStateToProps,mapDispatchToProps)(ResponseTime);

export default ReportResponseTimeContainer;
