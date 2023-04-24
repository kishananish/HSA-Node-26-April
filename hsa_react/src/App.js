/* imports of react core components */
import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';

/* imports of functional components */
import ForgotPassword from './components/Admin/ForgotPassword';
import UpdatePassword from './components/Admin/UpdatePassword';

/* imports of container */
import DashboardContainer from './container/DashboardContainer';
import LoginContainer from './container/LoginContainer';
import CustomerAddContainer from './container/CustomerAddContainer';
import CustomerManageContainer from './container/CustomerManageContainer';
import FaqContainer from './container/FaqContainer';
import CategoryContainer from './container/CategoryContainer';
import SubCategoryContainer from './container/SubCategoryContainer';
import PromoCodeContainer from './container/PromoCodeContainer';
import QueryContainer from './container/QueryContainer';
import NotificationContainer from './container/NotificationContainer';
import RoleManageContainer from './container/RoleManageContainer';
import RoleViewContainer from './container/RoleViewContainer';
import RoleAddContainer from './container/RoleAddContainer';
import ServiceRequestManageContainer from './container/ServiceRequestManageContainer';
import ServiceRequestAddContainer from './container/ServiceRequestAddContainer';
import ServiceProviderManageContainer from './container/ServiceProviderManageContainer';
import ServiceProviderAddContainer from './container/ServiceProviderAddContainer';
import MaterialManageContainer from './container/MaterialManageContainer';
import ConfigurationManageContainer from './container/ConfigurationManageContainer';

import ReportActiveTimeContainer from './container/ReportActiveTimeContainer';
import ReportEarningContainer from './container/ReportEarningContainer';
import ReportEarningServiceContainer from './container/ReportEarningServiceContainer';
import ReportRatingContainer from './container/ReportRatingContainer';
import ReportResponseTimeContainer from './container/ReportResponseTimeContainer';
import ReportServiceRequestContainer from './container/ReportServiceRequestContainer';

/* Const Files */
import * as menuLinkConstants from "./constants/MenuLinkConstants";

let history = createBrowserHistory({});
class App extends Component {
  render() {
    return (
        <Router history={history}>
          <Switch>
              <Route exact path={menuLinkConstants.START_LINK} component={ LoginContainer }/>
              <Route exact path={menuLinkConstants.LOGIN_LINK} component={ LoginContainer }/>
              <Route exact path={menuLinkConstants.FORGOT_PASSWORD_LINK} component={ ForgotPassword }/>
              <Route exact path={menuLinkConstants.UPDATE_PASSWORD_LINK} component={ UpdatePassword }/>

              <Route exact path={menuLinkConstants.DASHBOARD_LINK} component={ DashboardContainer }/>
              <Route exact path={menuLinkConstants.CUSTOMER_ADD_LINK} component={ CustomerAddContainer } />
              <Route exact path={menuLinkConstants.CUSTOMER_MANAGE_LINK} component={ CustomerManageContainer }/>
              <Route exact path={menuLinkConstants.FAQ_MANAGE_LINK} component={ FaqContainer }/>
              <Route exact path={menuLinkConstants.CATEGORY_MANAGE_LINK} component={ CategoryContainer }/>
              <Route exact path={menuLinkConstants.SUBCATEGORY_MANAGE_LINK} component={ SubCategoryContainer }/>
              <Route exact path={menuLinkConstants.PROMOCODE_MANAGE_LINK} component={ PromoCodeContainer }/>
              <Route exact path={menuLinkConstants.QUERY_MANAGE_LINK} component={ QueryContainer }/>
              <Route exact path={menuLinkConstants.NOTIFICATION_MANAGE_LINK} component={ NotificationContainer }/>
              <Route exact path={menuLinkConstants.ROLE_MANAGE_LINK} component={ RoleManageContainer }/>
              <Route exact path={menuLinkConstants.ROLE_VIEW_LINK} component={ RoleViewContainer }/>
              <Route exact path={menuLinkConstants.ROLE_ADD_LINK} component={ RoleAddContainer }/>
              <Route exact path={menuLinkConstants.SERVICE_REQUEST_MANAGE_LINK} component={ ServiceRequestManageContainer }/>
              <Route exact path={menuLinkConstants.SERVICE_REQUEST_ADD_LINK} component={ ServiceRequestAddContainer }/>
              <Route exact path={menuLinkConstants.SERVICE_PROVIDER_MANAGE_LINK} component={ ServiceProviderManageContainer }/>
              <Route exact path={menuLinkConstants.SERVICE_PROVIDER_ADD_LINK} component={ ServiceProviderAddContainer }/>
              <Route exact path={menuLinkConstants.MATERIAL_MANAGE_LINK} component={ MaterialManageContainer }/>


              <Route exact path={menuLinkConstants.REPORT_ACTIVE_TIME_LINK} component={ ReportActiveTimeContainer }/>
              <Route exact path={menuLinkConstants.REPORT_EARNING_LINK} component={ ReportEarningContainer }/>
              <Route exact path={menuLinkConstants.REPORT_EARING_SERVICE_LINK} component={ ReportEarningServiceContainer }/>
              <Route exact path={menuLinkConstants.REPORT_RATING_LINK} component={ ReportRatingContainer }/>
              <Route exact path={menuLinkConstants.REPORT_RESPONSE_TIME_LINK} component={ ReportResponseTimeContainer }/>
              <Route exact path={menuLinkConstants.REPORT_SERVICE_REQUEST_LINK} component={ ReportServiceRequestContainer }/>
              <Route exact path={menuLinkConstants.CONFIGURATION_MANAGE_LINK} component={ConfigurationManageContainer} />
          </Switch>
      </Router>
    );
  }
}

export default App;
