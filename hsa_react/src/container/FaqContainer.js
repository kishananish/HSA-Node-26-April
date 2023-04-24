import { connect } from 'react-redux';
import FaqManage from '../components/FAQ/FaqManage';
import { bindActionCreators } from 'redux';
import { FaqSave, FaqList, FaqView, FaqUpdate, FaqRemove, FaqHistory, FaqDeleteAll } from '../action/faqActions';
import { login, logout } from '../action/adminActions';
import { CategoryList } from '../action/categoryActions';

const mapStateToProps = (state) => {
    return {
        FaqReducer: state.FaqReducer,
        FaqReducerCopy: state.FaqReducer,
        LoginReducer: state.LoginReducer,
        CategoryReducer: state.CategoryReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            FaqSave,
            FaqList,
            FaqView,
            FaqUpdate,
            FaqRemove,
            FaqHistory,
            FaqDeleteAll,
            login,
            logout,
            CategoryList,
        }, dispatch);
};

const FaqContainer = connect(mapStateToProps, mapDispatchToProps)(FaqManage);

export default FaqContainer;
