// React component
import {CircleLoader} from "react-spinners";
import React, {Component} from "react";

// CSS
import '../../assets/css/styles.css';

class Loader extends Component {
    render() {
        return (
            <div className="loading-spinner">
                <CircleLoader
                    className=''
                    sizeUnit={"px"}
                    size={50}
                    color={'#27ae60'}
                    loading={true}
                />
            </div>
        )
    }
}

export default Loader;