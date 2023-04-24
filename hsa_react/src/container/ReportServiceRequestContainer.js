import { connect } from 'react-redux';
import ServiceRequest from '../components/Reports/ServiceRequest';
import { bindActionCreators } from 'redux';
import { ServiceRequestReportData  } from '../action/reportActions';
import { login, logout } from '../action/adminActions';
import { CategoryList } from '../action/categoryActions';
import { ServiceProviderList } from '../action/serviceProviderActions';


const mapStateToProps=(state)=>{

    return{
        ReportReducer : state.ReportReducer,
        LoginReducer : state.LoginReducer,
        CategoryReducer: state.CategoryReducer,
        ServiceProviderReducer : state.ServiceProviderReducer,
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            ServiceRequestReportData,
            login,
            logout,
            CategoryList,
            ServiceProviderList
        }, dispatch);
};

const ReportServiceRequestContainer = connect(mapStateToProps,mapDispatchToProps)(ServiceRequest);

export default ReportServiceRequestContainer;
