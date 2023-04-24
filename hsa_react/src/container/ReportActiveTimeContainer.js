import { connect } from 'react-redux';
import ActiveTime from '../components/Reports/ActiveTime';
import { bindActionCreators } from 'redux';
import { ActiveTimeReportData  } from '../action/reportActions';
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
            ActiveTimeReportData,
            login,
            logout,
            CategoryList,
            ServiceProviderList
        }, dispatch);
};

const ReportActiveTimeContainer = connect(mapStateToProps,mapDispatchToProps)(ActiveTime);

export default ReportActiveTimeContainer;
