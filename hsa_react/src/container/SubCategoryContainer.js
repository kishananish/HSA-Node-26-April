import { connect } from 'react-redux';
import SubCategoryManage from '../components/SubCategory/SubCategoryManage';
import { bindActionCreators } from 'redux';
import { SubCategorySave,
         SubCategoryList,
         SubCategoryView,
         SubCategoryUpdate,
         SubCategoryRemove,
         SubCategoryHistory,
         SubCategoryDeleteAll } from '../action/subcategoryActions';
import { login, logout } from '../action/adminActions';
import { CategoryList } from '../action/categoryActions';


const mapStateToProps=(state)=>{

    return{
        SubCategoryReducer : state.SubCategoryReducer,
        LoginReducer : state.LoginReducer,
        CategoryReducer : state.CategoryReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            SubCategorySave,
            SubCategoryList,
            SubCategoryView,
            SubCategoryUpdate,
            SubCategoryRemove ,
            SubCategoryHistory,
            SubCategoryDeleteAll ,
            login,
            logout,
            CategoryList,
        }, dispatch);
};

const SubCategoryContainer = connect(mapStateToProps,mapDispatchToProps)(SubCategoryManage);

export default SubCategoryContainer;
