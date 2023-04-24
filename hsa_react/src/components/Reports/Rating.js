// React Components
import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import Moment from 'react-moment';
import Datetime from 'react-datetime';
import 'moment-timezone';
import moment from 'moment';
import Pagination from "react-js-pagination";
import ReactDOM from "react-dom";
import padStart from "pad-start";
import Select from 'react-select';

// CSS / Components
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import Loader from "../Comman/Loader";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import ReportTimeCalculation from '../Comman/ReportTimeCalculation';
import StarRatingComponent from 'react-star-rating-component';

// Const Files
import * as reportDataList from '../../data/_reportActiveTime';
import * as webConstants from "../../constants/WebConstants";
import swal from "sweetalert2";

let userDataArray;
let userAllId = [];
let userTypeData = [
        { value : '' , label : "All" },
        { value : 'user', label : "Customer"},
        { value : 'service_provider', label : "Service Provider"}
    ];

class Rating extends Component {

    constructor(props, context) {
        super(props, context);
        console.log(this.props);
        this.state = {
            manageLoading: false,
            filters: {fromDate: new Date(moment().format("YYYY-MM-01")), toDate: new Date(moment().format("YYYY-MM-") + moment().daysInMonth())},
            activePage: 1,
            perPageSize: webConstants.PER_PAGE_SIZE,
            wrapHeight : '500px',
            userDataList : [],
            isUserList : false,
            selectedUsers : '',
            selectedUserType : '',
            errors : {}
        };

        this.handleFromDateChange = this.handleFromDateChange.bind(this);
        this.handleToDateChange = this.handleToDateChange.bind(this);
        this.handleUsersChange = this.handleUsersChange.bind(this);
        this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
    }

    setWrapHeight() {
        let wrapDivHeight;
        let windowHeight = window.innerHeight;
        let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
        if (domElement) {
            let contentHeight = domElement.clientHeight;
            console.log(windowHeight, contentHeight);
            if (windowHeight >= contentHeight) {
                wrapDivHeight = '100vh';
            } else {
                wrapDivHeight = '100%';
            }
            this.setState({wrapHeight: wrapDivHeight});
        }
    }

    componentWillMount() {
        this.setWrapHeight();
        this.getReportData(this.state.filters.fromDate, this.state.filters.toDate, this.state.selectedUserType.value, this.state.selectedUsers.value);
    }

    componentDidMount(){
        this.setWrapHeight();
    }


    /* Date picker - start */
    handleFromDateChange(date) {
        this.setState({
            filters: { fromDate: date }
        });
        this.handleChange('fromDate',  '', date);
    }

    handleToDateChange(date) {
        this.setState({
            filters: { toDate : date }
        });
        this.handleChange('toDate', '',  date);
    }
    /* Date picker - end */

    handleUsersChange(selectedUsersOption){
        this.setState({
            selectedUsers : selectedUsersOption
        });
        this.handleChange('users', '', selectedUsersOption);
    }

    handleUserTypeChange(selectedUserTypeOption){
        this.setState({
            selectedUserType : selectedUserTypeOption
        });
        this.getUserList(selectedUserTypeOption.value);
        this.handleChange('userType', '', selectedUserTypeOption);
    }

    /* on change set data for validation */
    handleChange(filter, e, optionalData){
        let filters = this.state.filters;
        let value;
        value = optionalData;
        filters[filter] = value;
        this.setState({filters});
        this.handleValidation();
    }

    handleValidation(){
        let filters = this.state.filters;
        let errors = {};
        let formIsValid = true;
        let sDate = new Date(filters["fromDate"]);
        let eDate = new Date(filters["toDate"]);

        if(!filters["fromDate"])
        {
            formIsValid = false;
            errors["fromDate"] = "From Date is required";
        }

        if(!filters["toDate"])
        {
            formIsValid = false;
            errors["toDate"] = "To Date is required";

        }

        if(sDate > eDate)
        {
            formIsValid = false;
            errors["toDate"] = "To Date is greater than or equal to the From Date.";

        }
        this.setState({errors: errors});
        return formIsValid;
    }

    getUserList(roleName){
        userDataArray = [];
        userAllId = [];
        if (roleName) {
            this.setState({
                isUserList: false,
            });
            this.props.SearchUserWithRole(roleName)
                .then(response => {
                    const responseData = response.payload;
                    if (responseData.status === 200) {
                        if (responseData.data.status == 'success') {
                            let userData = responseData.data.data;
                           // console.log(userData);
                            userDataArray.push({value: 'all', label: 'All'});
                            if(userData.length > 0) {
                                let i;
                                for (i = 0; i < userData.length; i++) {
                                    userDataArray.push({value: userData[i]._id, label: userData[i].first_name+' '+userData[i].last_name});
                                    userAllId.push(userData[i]._id);
                                }
                                this.setState({
                                    isUserList: true,
                                    userDataList : userDataArray
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    if (error.response !== undefined) {
                        this.setState({
                            isUserList: false,
                        });
                        swal(
                            webConstants.MANAGE_NOTIFICATION,
                            error.response.data.message,
                            'error'
                        )
                    }
                });
        }

        /*let userData = this.props.CustomerReducer.customerData.result;
        userDataArray.push({value: 'all', label: 'All'});
        if(userData.length > 0) {
            let i;
            for (i = 0; i < userData.length; i++) {
                userDataArray.push({value: userData[i].userId, label: userData[i].first_name+' '+userData[i].last_name});
                userAllId.push(userData[i].userId);
            }
        }*/
    }



    /* Set index/ id for column */
    indexN(cell, row, enumObject, index) {
        return (<div>{webConstants.INDEX_ID}{padStart(index+1,4, '0')}</div>)
    }

    ratingFormat(cell){
        if (!cell) {
            return "";
        }
        else {
            return(<StarRatingComponent
                starCount={ webConstants.TOTAL_RATINGS }
                value={ cell }
            />);
        }


    }

    /* Set Date format - for date column */
    dateFormatter(cell) {
        if (!cell) {
            return "";
        }
        return ( <Moment format="DD-MMM-YYYY">
            { cell }
        </Moment>);
    }

    firstName(cell) {
        if (!cell) {
            return "";
        } else {
            let firstName = '';
            if(cell[0]){
                firstName = cell[0].first_name;
            }
            return ( firstName );
        }
    }

    lastName(cell){
        if (!cell) {
            return "";
        } else {
            let lastName = '';
            if(cell[0]){
                lastName = cell[0].last_name;
            }
            return ( lastName );
        }
    }

    /* Set Search bar */
    customSearchbar = props => {
        return (
            <div className="search-wrapper increase-width full-width">
                { props.components.btnGroup }
                { props.components.searchPanel }
            </div>
        );
    }

    /* Set Add New button */
    customToolbarButtons = props => {
        return (
            <ButtonGroup  className='my-report-custom-class pull-right' sizeClass='btn-group-md'>
                <form name="reportForm" className="reportForm" onSubmit={this.onSubmit.bind(this)}>
                    <div className="date-wrapper report-date-format">
                        <label className="from-label pull-left"> From </label>
                        <span className="from-date pull-left calendar-full-width">
                         <Datetime open={false}
                                   closeOnSelect={true}
                                   inputProps={{"placeholder":"From Date"}}
                                   input={true}
                                   selected={ this.state.filters.fromDate }
                                   value={ (this.state.filters.fromDate === '') ? this.state.filters.fromDate : moment(this.state.filters.fromDate).format('DD-MM-YYYY') }
                                   timeFormat={false}
                                   onChange={this.handleFromDateChange}
                         />
                        <p className="error-message">{this.state.errors['fromDate']}</p>
                    </span>

                        <label className="to-label pull-left"> To </label>
                        <span className="to-date pull-left calendar-full-width">
                        <Datetime open={false}
                                  closeOnSelect={true}
                                  timeFormat={false}
                                  value={ this.state.filters.toDate}
                                  dateFormat="DD-MM-YYYY"
                                  inputProps={{"placeholder":"TO DATE"}}
                                  onChange={this.handleToDateChange}
                        />
                    <p className="error-message">{this.state.errors['toDate']}</p>
                    </span>
                    </div>

                    <div className="select-wrapper">
                    <span className="name-select pull-left width-150 report-autocomplete-select">
                        <Select
                            placeholder="Select User Type"
                            value={this.state.selectedUserType}
                            options={userTypeData}
                            ref='userType'
                            id="userType"
                            isSearchable="true"
                            onChange={this.handleUserTypeChange}
                        />
                    </span>

                        <span className="category-select pull-left width-150 report-autocomplete-select">
                            <Select
                                placeholder="Select Users"
                                value={this.state.selectedUsers}
                                options={this.state.userDataList}
                                ref='users'
                                id="users"
                                isSearchable="true"
                                onChange={this.handleUsersChange}
                            />
                        </span>
                    </div>

                    <div className="button-wrapper">
                        <button className="btn btn-success green-button pull-left"> SUBMIT </button>
                    </div>

                </form>
            </ButtonGroup>
        );
    }

    getReportData(startDate, endDate, userType, userId) {
        startDate = new Date(startDate).toISOString();
        endDate = new Date(endDate).toISOString();
        this.setState({manageLoading: true});
        this.props.RatingReportData(startDate, endDate, userType, userId)
            .then(response => {
                let responseData = response.payload;
                console.log(responseData);
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.setState({
                            manageLoading: false,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.REPORT_SERVICE_REQUEST,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    onSubmit(e){
        e.preventDefault();
        if(this.handleValidation()){
            let reportParams = {
                from_date : moment(this.state.filters.fromDate),
                to_date : moment(this.state.filters.toDate),
                user_type : (this.state.selectedUserType.value) ? this.state.selectedUserType.value : '',
                users : (this.state.selectedUsers.value) ? this.state.selectedUsers.value : ''
            }
            console.log(reportParams);
            this.getReportData(this.state.filters.fromDate, this.state.filters.toDate, this.state.selectedUserType.value, this.state.selectedUsers.value);
        }
    }

    render(){
        // console.log(this.state.wrapHeight);
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll
        };
        const options = {
            toolBar: this.customSearchbar,
            btnGroup: this.customToolbarButtons,
            prePage: 'Previous',
            nextPage: 'Next',
            paginationPosition: 'bottom',
            hideSizePerPage: true,
        };

        return (
            <div>
                <HeaderContainer/>
                <SidebarContainer/>
                <div className="content-wrapper" ref="bodyContent"  style={{ minHeight : this.state.wrapHeight }}>
                    <section className="content-header">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="customer-box">

                                    <div className="">
                                        { (this.state.manageLoading) ? <Loader/> : '' }
                                    </div>

                                    <div className="box-header with-border">
                                        { (this.state.manageLoading) ?  '' :
                                            <div className="col-lg-12 no-padding">
                                                <h3 className="manage-page-title"> { webConstants.REPORT_RATING } </h3>
                                            </div> }
                                    </div>


                                    <div className="box-body active-time-report-tbl custom-pagination no-data-found report-tbl">
                                        { (!this.state.manageLoading) ?
                                            <div>
                                                <BootstrapTable ref='table'
                                                                data={ this.props.ReportReducer.ratingData }
                                                                selectRow={ selectRowProp }
                                                                pagination={ true }
                                                                searchPlaceholder={ 'Search here'}
                                                                options={options}
                                                                tableHeaderClass='my-header-class'
                                                                tableBodyClass='my-body-class'
                                                                containerClass='my-container-class'
                                                                tableContainerClass='my-table-container-class'
                                                                headerContainerClass='my-header-container-class'
                                                                bodyContainerClass='my-body-container-class'>
                                                    <TableHeaderColumn autoValue={true} dataField='_id' isKey={true} hidden={true}> ID</TableHeaderColumn>
                                                    <TableHeaderColumn dataField="any" dataFormat={this.indexN.bind(this)}>ID</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='date_of_joining' dataFormat={this.dateFormatter.bind(this)}>DATE OF JOINING</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='first_name'>FIRST NAME</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='last_name'>LAST NAME</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='category_name'>CATEGORY</TableHeaderColumn>
                                                   <TableHeaderColumn dataField='service_date' dataFormat={this.dateFormatter.bind(this)}>SERVICE DATE</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='rating' dataFormat={this.ratingFormat.bind(this)}>RATING</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='user_type'>TYPE</TableHeaderColumn>
                                                </BootstrapTable>
                                                {/*<Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={webConstants.PER_PAGE_SIZE}
                                                    totalItemsCount={this.props.PromoCodeReducer.promoCodeData.total}
                                                    pageRangeDisplayed={this.props.PromoCodeReducer.promoCodeData.pages}
                                                    onChange={this.handlePageChange}
                                                    prevPageText="Previous"
                                                    nextPageText="Next"
                                                />*/}
                                            </div>: '' }


                                    </div> {/* -- Box body --*/ }
                                </div> {/* <!-- Box --> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Rating;