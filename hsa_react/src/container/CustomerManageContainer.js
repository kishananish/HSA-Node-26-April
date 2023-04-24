import { connect } from 'react-redux';
import CustomerManage from '../components/Customer/CustomerManage';
import { bindActionCreators } from 'redux';
import { CustomerList,
         CustomerRemove,
         CustomerDeleteAll,
         CustomerHistory} from '../action/customerActions';


const mapStateToProps=(state)=>{

    return{
        CustomerReducer : state.CustomerReducer,
        LoginReducer : state.LoginReducer
    }
}
const mapDispatchToProps = dispatch =>{
    return bindActionCreators({
        CustomerList,
        CustomerRemove,
        CustomerDeleteAll,
        CustomerHistory
    }, dispatch);
};

const CustomerManageContainer = connect(mapStateToProps,mapDispatchToProps)(CustomerManage);

export default CustomerManageContainer;
