import { connect } from 'react-redux';
import RolesManage from '../components/Roles/RolesManage';
import { bindActionCreators } from 'redux';
import { RolesList, RolesRemove, RolesDeleteAll } from '../action/rolesActions';
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
            RolesList,
            RolesRemove ,
            RolesDeleteAll ,
            login,
            logout
        }, dispatch);
};

const RoleManageContainer = connect(mapStateToProps,mapDispatchToProps)(RolesManage);

export default RoleManageContainer;
