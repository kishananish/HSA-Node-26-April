import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard/Dashboard';
import { bindActionCreators } from 'redux';
import { DashboardCount, DashboardSalesChart, DashboardCustomerGrowth} from '../action/adminActions';
import { login, logout } from '../action/adminActions';


const mapStateToProps=(state)=>{

    return{
        DashboardReducer : state.DashboardReducer,
        LoginReducer : state.LoginReducer
    }
}
const mapDispatchToProps = dispatch =>{
    return bindActionCreators(
        {
            DashboardCount,
            DashboardSalesChart,
            DashboardCustomerGrowth,
            login,
            logout
        }, dispatch);
};

const DashboardContainer = connect(mapStateToProps,mapDispatchToProps)(Dashboard);

export default DashboardContainer;
