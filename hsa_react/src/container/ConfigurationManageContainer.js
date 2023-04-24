import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getConfig, configurationSave } from '../action/configurationsActions.';
import ConfigurationsManage from './../components/Configurations/ConfigurationsManage'

const mapStateToProps = (state) => {
    
    return {
		LoginReducer: state.LoginReducer,
    }
}

const mapDispatchToProps = dispatch => {

    return bindActionCreators (
        {
            configurationSave,
            getConfig
        }, dispatch)
};

const ConfigrationManageConatiner = connect(mapStateToProps, mapDispatchToProps) (ConfigurationsManage);
export default ConfigrationManageConatiner;
