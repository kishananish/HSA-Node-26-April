import { connect } from 'react-redux';
import NotificationManage from '../components/Notification/NotificationManage';
import { bindActionCreators } from 'redux';
import { NotificationSave,
         NotificationList,
         NotificationView,
         NotificationUpdate,
         NotificationRemove,
         NotificationHistory,
         NotificationDeleteAll,
         SearchUserWithRole} from '../action/notificationActions';
import { login, logout } from '../action/adminActions';
import { CustomerList } from '../action/customerActions';
import { CategoryList } from '../action/categoryActions';
import { RolesList } from '../action/rolesActions';
import RoleReducer from "../reducer/roleReducer";


const mapStateToProps=(state)=>{

    return{
        NotificationReducer : state.NotificationReducer,
        LoginReducer : state.LoginReducer,
        CategoryReducer : state.CategoryReducer,
        CustomerReducer: state.CustomerReducer,
        RoleReducer: state.RoleReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            NotificationSave,
            NotificationList,
            NotificationView,
            NotificationUpdate,
            NotificationRemove ,
            NotificationHistory,
            NotificationDeleteAll ,
            SearchUserWithRole,
            login,
            logout,
            CategoryList,
            CustomerList,
            RolesList
        }, dispatch);
};

const NotificationContainer = connect(mapStateToProps,mapDispatchToProps)(NotificationManage);

export default NotificationContainer;
