// React Components
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import MetisMenu from 'react-metismenu';
import RouterLink from 'react-metismenu-router-link';

// CSS/Data
import '../../assets/css/sidemenu.css';
import * as menu from '../../data/_menu';
import * as menuLinkConstants from "../../constants/MenuLinkConstants";

let menuListArray = [];
let isReport = false;
let manageMenuList = [];
let rolePermissions;

let dashboardMenuItem = {
    icon: 'th-large',
    label: 'Dashboard',
    to: menuLinkConstants.DASHBOARD_LINK,
}

let manageMenuItems = {
    icon: 'cogs',
    label: 'Manage',
    content: manageMenuList,
    to : '#'
};


let reportsMenuItem = {
    icon: 'list',
    label: 'Reports',
    content: [
        {
            icon: '',
            label: 'Active Time',
            to: menuLinkConstants.REPORT_ACTIVE_TIME_LINK
        },
        {
            icon: '',
            label: 'Earnings',
            to: menuLinkConstants.REPORT_EARNING_LINK
        },
        {
            icon: '',
            label: 'Rating',
            to: menuLinkConstants.REPORT_RATING_LINK
        },
        {
            icon: '',
            label: 'Response Time',
            to: menuLinkConstants.REPORT_RESPONSE_TIME_LINK
        },
        {
            icon: '',
            label: 'Service Request',
            to: menuLinkConstants.REPORT_SERVICE_REQUEST_LINK
        }]
  };

class SideBar extends Component {
    constructor(props) {
        //console.log(props.LoginReducer.loginUser.first_name + ' ' + props.LoginReducer.loginUser.last_name);
        //console.log('Role', props.LoginReducer.loginUser.role[0].name);
        //console.log('Permissions', props.LoginReducer.loginUser.role[0].access_level);
        super(props);
        this.state = {
            menuOpen: false
        };
    }

    componentWillMount() {
        rolePermissions = this.props.LoginReducer.loginUser.role[0].access_level;
        let i;
        for (i = 0; i < rolePermissions.length; i++) {
            if (rolePermissions[i].name != "Reports") {
                if (rolePermissions[i].actions.view === true) {
                    manageMenuList.push({icon: '', label: rolePermissions[i].name, to: rolePermissions[i].link})
                }
            } else {
                if (rolePermissions[i].actions.view === true) {
                    isReport = true;
                }
            }
        }
        manageMenuItems.content = manageMenuList;
        menuListArray.push(dashboardMenuItem);
        menuListArray.push(manageMenuItems);
        (isReport) ? menuListArray.push(reportsMenuItem) : '';
    }

    componentDidMount(){
        manageMenuList = [];
        menuListArray = [];
        isReport = false;
    }

    render() {
        return (
            <div>
                <aside className="main-sidebar" ref="sidebarContent">
                    <section className="sidebar">
                        {
                            (menuListArray.length > 0) ?
                            <MetisMenu content={menuListArray}
                                       activeLinkFromLocation LinkComponent={RouterLink}
                            /> : ''
                        }
                    </section>
                </aside>
            </div>
        )
    }
}

export default withRouter(SideBar);

