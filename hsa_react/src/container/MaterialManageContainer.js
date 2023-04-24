import { connect } from 'react-redux';
import MaterialManage from '../components/Material/MaterialManage';
import { bindActionCreators } from 'redux';
import { MaterialSave,
         MaterialList,
         MaterialView,
         MaterialUpdate,
         MaterialRemove,
         MaterialHistory,
         MaterialDeleteAll,
         SubCategoryList } from '../action/materialActions';
import { login, logout } from '../action/adminActions';


const mapStateToProps=(state)=>{

    return{
        MaterialReducer : state.MaterialReducer,
        LoginReducer : state.LoginReducer,
        CategoryReducer : state.CategoryReducer,
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            MaterialSave,
            MaterialList,
            MaterialView,
            MaterialUpdate,
            MaterialRemove ,
            MaterialHistory,
            MaterialDeleteAll ,
            SubCategoryList,
            login,
            logout
        }, dispatch);
};

const MaterialContainer = connect(mapStateToProps,mapDispatchToProps)(MaterialManage);

export default MaterialContainer;
