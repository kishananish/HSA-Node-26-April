import { connect } from 'react-redux';
import RolesView from '../components/Roles/RolesView';
import { bindActionCreators } from 'redux';
import { RoleView, RolesAccessLevel } from '../action/rolesActions';
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
            RoleView,
            RolesAccessLevel,
            login,
            logout
        }, dispatch);
};

const RoleViewContainer = connect(mapStateToProps,mapDispatchToProps)(RolesView);

export default RoleViewContainer;
