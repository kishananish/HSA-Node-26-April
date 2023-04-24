import { connect } from 'react-redux';
import ServiceProviderManage from '../components/ServiceProvider/ServiceProviderManage';
import { bindActionCreators } from 'redux';
import {  ServiceProviderList,
          ServiceProviderRemove,
          ServiceProviderDeleteAll,
          ServiceProviderHistory,
          ServiceProviderUserList
      } from '../action/serviceProviderActions';


const mapStateToProps=(state)=>{

    return{
        ServiceProviderReducer : state.ServiceProviderReducer,
        LoginReducer : state.LoginReducer
    }
}
const mapDispatchToProps = dispatch =>{
    return bindActionCreators({
        ServiceProviderList,
        ServiceProviderRemove,
        ServiceProviderDeleteAll,
        ServiceProviderHistory,
        ServiceProviderUserList
    }, dispatch);
};

const ServiceProviderManageContainer = connect(mapStateToProps,mapDispatchToProps)(ServiceProviderManage);

export default ServiceProviderManageContainer;
