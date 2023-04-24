import React, {Component} from 'react';
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import '../../assets/css/manage.css';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import * as reportDataList from '../../data/_reportEarningService';
import * as webConstants from "../../constants/WebConstants";
import { Modal} from 'react-bootstrap';
import Loader from "../Comman/Loader";
import swal from 'sweetalert2'
import Moment from 'react-moment';
import DatePicker from 'react-datepicker';
import Datetime from 'react-datetime';
import 'moment-timezone';
import actionImage from '../../assets/img/actions.png';
import * as msgConstants from "../../constants/MsgConstants";
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Pagination from "react-js-pagination";
import ReactDOM from "react-dom";
import padStart from "pad-start";



class EarningService extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            manageLoading: false,
            fields: {name: '', fromDate: new Date()   , toDate: new Date() },
            activePage: 1,
            perPageSize: webConstants.PER_PAGE_SIZE,
            wrapHeight : '500px'
        };
    }

    componentWillMount(){
    }


    componentDidMount(){
        let wrapDivHeight;
        let windowHeight = window.innerHeight;
        let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
        if (domElement){
            let contentHeight = domElement.clientHeight;
            console.log(windowHeight, contentHeight);
            if(windowHeight >= contentHeight)
            {
                wrapDivHeight = '100vh';
            } else {
                wrapDivHeight = '100%';
            }
            this.setState({ wrapHeight : wrapDivHeight});
        }
    }


    /* Set index/ id for column */
    indexN(cell, row, enumObject, index) {
        return (<div>{webConstants.INDEX_ID}{padStart(index+1,4, '0')}</div>)
    }

    /* Set Date format - for date column */
    dateFormatter(cell) {
        if (!cell) {
            return "";
        }
        return ( <Moment format="DD-MMM-YYYY">
            {cell}
        </Moment>);
    }

    /* Set Search bar */
    customSearchbar = props => {
        return (
            <div className="search-wrapper increase-width">
                { props.components.btnGroup }
                { props.components.searchPanel }
            </div>
        );
    }

    /* Set Add New button */
    customToolbarButtons = props => {
        return (
            <ButtonGroup  className='my-report-custom-class pull-right' sizeClass='btn-group-md'>
                <div className="date-wrapper">
                    <label className="from-label pull-left"> From </label>

                    <span className="from-date pull-left calendar-full-width">
                        <Datetime open={false}
                                value={ moment(this.state.fields.fromDate).format('DD-MM-YYYY') }
                                dateFormat="DD-MM-YYYY"
                                closeOnSelect={true}
                                timeFormat={false}
                                inputProps={{"placeholder":"FROM DATE"}}
                        />
                    </span>

                    <label className="to-label pull-left"> To </label>

                    <span className="to-date pull-left calendar-full-width">
                        <Datetime open={false}
                                closeOnSelect={true}
                                timeFormat={false}
                                value={ moment(this.state.fields.toDate).format('DD-MM-YYYY')}
                                dateFormat="DD-MM-YYYY"
                                inputProps={{"placeholder":"TO DATE"}}
                        />
                    </span>
                </div>
                <div className="select-wrapper">
                    <span className="name-select pull-left width-150">
                        <select className="form-control">
                            <option>Select Name</option>
                            <option>John</option>
                            <option>Max</option>
                        </select>
                    </span>

                    <span className="name-select pull-left width-150">
                        <select className="form-control">
                            <option>Select Location</option>
                            <option>Dubai</option>
                            <option>China</option>
                        </select>
                    </span>
                </div>
                <div className="button-wrapper">
                    <button className="btn btn-success green-button pull-left"> SUBMIT </button>
                </div>
            </ButtonGroup>
        );
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

        const calculationData = [
            [
                {
                    label: 'TOTAL',
                    columnIndex: 5,
                    align: 'right',
                },
                {
                    label: 'Total',
                    columnIndex: 6,
                    align: 'center',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            label += tableData[i].card;
                        }
                        return (
                            <strong>{ label }</strong>
                        );
                    }
                },
                {
                    label: 'Total',
                    columnIndex: 7,
                    align: 'left',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            label += tableData[i].cash;
                        }
                        return (
                            <strong>{ label }</strong>
                        );
                    }
                },
                {
                    label: 'Total',
                    columnIndex: 8,
                    align: 'left',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            label += tableData[i].total_cash;
                        }
                        return (
                            <strong>{ label }</strong>
                        );
                    }
                },
                {
                    label: 'Total',
                    columnIndex: 9,
                    align: 'left',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            label += tableData[i].deposit;
                        }
                        return (
                            <strong>{ label }</strong>
                        );
                    }
                },
                {
                    label: 'Total',
                    columnIndex: 10,
                    align: 'left',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            label += tableData[i].pending;
                        }
                        return (
                            <strong>{ label }</strong>
                        );
                    }
                },

            ]
        ];

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
                                                <h3 className="manage-page-title"> { webConstants.REPORT_EARNING_SERVICE} </h3>
                                            </div> }
                                    </div>


                                    <div className="box-body earning-service-tbl custom-pagination no-data-found report-tbl">
                                        { (!this.state.manageLoading) ?
                                            <div>
                                                <BootstrapTable ref='table'
                                                                data={ reportDataList.reportData }
                                                                selectRow={ selectRowProp }
                                                                pagination={ false }
                                                                footer={true}
                                                                footerData={ calculationData }
                                                                searchPlaceholder={ 'Search here'}
                                                                options={options}
                                                                tableHeaderClass='my-header-class'
                                                                tableBodyClass='my-body-class'
                                                                containerClass='my-container-class'
                                                                tableContainerClass='my-table-container-class'
                                                                headerContainerClass='my-header-container-class'
                                                                bodyContainerClass='my-body-container-class'>
                                                    <TableHeaderColumn autoValue={true} dataField='_id' isKey={true} hidden={true}>SERVICE PROVIDER ID</TableHeaderColumn>
                                                    <TableHeaderColumn dataField="any" dataFormat={this.indexN.bind(this)}>SERVICE PROVIDER ID</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='date_of_joining' dataFormat={this.dateFormatter.bind(this)}>DATE OF JOINING</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='first_name'>FIRST NAME</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='last_name'>LAST NAME</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='location'>LOCATION</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='card'>CARD</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='cash'>CASH</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='total_cash'>TOTAL CASH</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='deposit'>DEPOSIT (SAR)</TableHeaderColumn>
                                                    <TableHeaderColumn dataField='pending'>PENDING (SAR)</TableHeaderColumn>
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

export default EarningService;