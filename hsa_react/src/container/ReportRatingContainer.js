import { connect } from 'react-redux';
import Rating from '../components/Reports/Rating';
import { bindActionCreators } from 'redux';
import { RatingReportData  } from '../action/reportActions';
import { login, logout } from '../action/adminActions';
import { SearchUserWithRole }  from '../action/notificationActions';


const mapStateToProps=(state)=>{

    return{
        ReportReducer : state.ReportReducer,
        LoginReducer : state.LoginReducer,
        NotificationReducer : state.NotificationReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            RatingReportData,
            login,
            logout,
            SearchUserWithRole
        }, dispatch);
};

const ReportRatingContainer = connect(mapStateToProps,mapDispatchToProps)(Rating);

export default ReportRatingContainer;
