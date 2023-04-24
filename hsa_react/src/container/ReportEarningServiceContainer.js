import { connect } from 'react-redux';
import EarningService from '../components/Reports/EarningService';
import { bindActionCreators } from 'redux';
import { EarningServiceReportData  } from '../action/reportActions';
import { login, logout } from '../action/adminActions';


const mapStateToProps=(state)=>{

    return{
        ReportReducer : state.ReportReducer,
        LoginReducer : state.LoginReducer,
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            EarningServiceReportData,
            login,
            logout
        }, dispatch);
};

const ReportEarningServiceContainer = connect(mapStateToProps,mapDispatchToProps)(EarningService);

export default ReportEarningServiceContainer;
