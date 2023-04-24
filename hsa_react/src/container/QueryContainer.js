import { connect } from 'react-redux';
import QueryManage from '../components/Query/QueryManage';
import { bindActionCreators } from 'redux';
import { QuerySave, QueryList, QueryView, QueryUpdate,  QueryRemove, QueryHistory, QueryDeleteAll } from '../action/queryActions';
import { login, logout } from '../action/adminActions';
import { CategoryList } from '../action/categoryActions';


const mapStateToProps=(state)=>{

    return{
        QueryReducer : state.QueryReducer,
        LoginReducer : state.LoginReducer,
        CategoryReducer : state.CategoryReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            QuerySave,
            QueryList,
            QueryView,
            QueryUpdate,
            QueryRemove ,
            QueryHistory,
            QueryDeleteAll ,
            login,
            logout,
            CategoryList,
        }, dispatch);
};

const QueryContainer = connect(mapStateToProps,mapDispatchToProps)(QueryManage);

export default QueryContainer;
