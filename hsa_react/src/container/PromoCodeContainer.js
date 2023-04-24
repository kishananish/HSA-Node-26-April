import { connect } from 'react-redux';
import PromoCodeManage from '../components/PromoCode/PromoCodeManage';
import { bindActionCreators } from 'redux';
import { PromoCodeSave,
         PromoCodeList,
         PromoCodeView,
         PromoCodeUpdate,
         PromoCodeRemove,
         PromoCodeHistory,
         PromoCodeDeleteAll } from '../action/promoCodeActions';
import { login, logout } from '../action/adminActions';
import { CategoryList } from '../action/categoryActions';


const mapStateToProps=(state)=>{

    return{
        PromoCodeReducer : state.PromoCodeReducer,
        LoginReducer : state.LoginReducer,
        CategoryReducer : state.CategoryReducer
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            PromoCodeSave,
            PromoCodeList,
            PromoCodeView,
            PromoCodeUpdate,
            PromoCodeRemove ,
            PromoCodeHistory,
            PromoCodeDeleteAll ,
            login,
            logout,
            CategoryList,
        }, dispatch);
};

const PromoCodeContainer = connect(mapStateToProps,mapDispatchToProps)(PromoCodeManage);

export default PromoCodeContainer;
