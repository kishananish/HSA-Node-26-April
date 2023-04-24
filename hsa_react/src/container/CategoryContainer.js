import { connect } from 'react-redux';
import CategoryManage from '../components/Category/CategoryManage';
import { bindActionCreators } from 'redux';
import { CategorySave,
         CategoryList,
         CategoryView,
         CategoryUpdate,
         CategoryRemove,
         CategoryHistory,
         CategoryDeleteAll,
         CategoryImageUpload
} from '../action/categoryActions';

import { login, logout } from '../action/adminActions';


const mapStateToProps=(state)=>{

    return{
        CategoryReducer : state.CategoryReducer,
        LoginReducer : state.LoginReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            CategorySave,
            CategoryList,
            CategoryView,
            CategoryUpdate,
            CategoryRemove ,
            CategoryHistory,
            CategoryDeleteAll ,
            CategoryImageUpload,
            login,
            logout
        }, dispatch);
};

const CategoryContainer = connect(mapStateToProps,mapDispatchToProps)(CategoryManage);

export default CategoryContainer;
