import { connect } from 'react-redux';
import RolesAdd from '../components/Roles/RolesAdd';
import { bindActionCreators } from 'redux';
import { RolesAccessLevel, RolesSave, RolesUpdate, RoleView } from '../action/rolesActions';
import { login, logout } from '../action/adminActions';


const mapStateToProps=(state)=>{

    return{
        RoleReducer : state.RoleReducer,
        LoginReducer : state.LoginReducer,
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            RolesAccessLevel,
            RolesSave,
            RolesUpdate,
            RoleView,
            login,
            logout
        }, dispatch);
};

const RoleAddContainer = connect(mapStateToProps,mapDispatchToProps)(RolesAdd);

export default RoleAddContainer;
