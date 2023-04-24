import { connect } from 'react-redux';
import Login from '../components/Admin/Login';
import { bindActionCreators } from 'redux';
import { login, logout } from '../action/adminActions';
import { CustomerList} from "../action/customerActions";
import { ServiceProviderUserList} from "../action/serviceProviderActions";
import { RolesList} from "../action/rolesActions";
import { CategoryList} from "../action/categoryActions";


const mapStateToProps=(state)=>{

    return{
        LoginReducer : state.LoginReducer,
        CustomerReducer : state.CustomerReducer,
        ServiceProviderReducer : state.ServiceProviderReducer,
        RoleReducer : state.RoleReducer,
        CategoryReducer : state.CategoryReducer
    }
}

const mapDispatchToProps = dispatch =>{
    return bindActionCreators({
            login,
            logout,
            CustomerList,
            ServiceProviderUserList,
            RolesList,
            CategoryList
        }
        , dispatch);
};
const LoginContainer = connect(mapStateToProps,mapDispatchToProps)(Login);
export default LoginContainer;
