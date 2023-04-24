import { connect } from 'react-redux';
import Header from '../components/Comman/Header';
import { bindActionCreators } from 'redux';
import { login, logout } from '../action/adminActions';

const mapStateToProps=(state)=>{

    return{
        LoginReducer : state.LoginReducer
    }
}
const mapDispatchToProps = dispatch =>{
    return bindActionCreators({
        login,
        logout
    }, dispatch);
};

const HeaderContainer = connect(mapStateToProps,mapDispatchToProps)(Header);

export default HeaderContainer;
