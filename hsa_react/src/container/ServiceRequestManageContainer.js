import { connect } from 'react-redux';
import ServiceRequestManage from '../components/ServiceRequest/ServiceRequestManage';
import { bindActionCreators } from 'redux';
import { ServiceRequestList, ServiceRequestRemove, ServiceRequestDeleteAll, ServiceRequestHistory, ServiceRequestPaymentDeposit } from '../action/serviceRequestActions';
import { login, logout } from '../action/adminActions';

const mapStateToProps=(state)=>{

    return{
        ServiceRequestReducer : state.ServiceRequestReducer,
        LoginReducer : state.LoginReducer,
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            ServiceRequestList,
            ServiceRequestRemove,
            ServiceRequestDeleteAll,
            ServiceRequestHistory,
            ServiceRequestPaymentDeposit,
            login,
            logout
        }, dispatch);
};

const ServiceProviderManageContainer = connect(mapStateToProps,mapDispatchToProps)(ServiceRequestManage);

export default ServiceProviderManageContainer;


