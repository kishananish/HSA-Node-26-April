import { connect } from 'react-redux';
import SideBar from '../components/Comman/SideBar';
import { bindActionCreators } from 'redux';
import { login, logout } from '../action/adminActions';

const mapStateToProps=(state)=>{

    return{
        LoginReducer : state.LoginReducer
    }
}
const mapDispatchToProps = dispatch =>{
    return bindActionCreators({login, logout}, dispatch);
};

const SidebarContainer = connect(mapStateToProps,mapDispatchToProps)(SideBar);

export default SidebarContainer;
