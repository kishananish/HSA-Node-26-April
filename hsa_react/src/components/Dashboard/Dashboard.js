// React Components
import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {Bar} from 'react-chartjs-2';
import swal from "sweetalert2";
import axios from "axios";

// CSS/Components
import '../../assets/css/dashboard.css';
import HeaderContainer from '../../container/HeaderContainer';
import SidebarContainer from '../../container/SidebarContainer';
import Loader from "../Comman/Loader";

// Const files
import * as summaryCountData from '../../data/_dashboardSummary';
import * as webConstants from "../../constants/WebConstants";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        //console.log('Dashboard Props', props);
        this.state = {
            manageLoading: false,
            wrapHeight: '500px',
            countData: {},
            salesChartData: {},
            customerGrowthChartData: {}
        };
    }

    componentWillMount() {
        axios.defaults.headers.common['access_token'] = (this.props.LoginReducer.loginUser.token) ? this.props.LoginReducer.loginUser.token : '';
        this.getCountData();
        this.getSalesChartData();
        this.getSalesCustomerGrowth();
    }

    componentDidMount() {
        this.setWrapHeight();
        swal.close(); // Login alert closed
    }

    setWrapHeight() {
        let wrapDivHeight;
        let windowHeight = window.innerHeight;
        let domElement = ReactDOM.findDOMNode(this.refs.bodyContent);
        if (domElement) {
            let contentHeight = domElement.clientHeight;
            //console.log(windowHeight, contentHeight);
            if (windowHeight >= contentHeight) {
                wrapDivHeight = '100vh';
            } else {
                wrapDivHeight = '100%';
            }
            this.setState({wrapHeight: wrapDivHeight});
        }
    }

    getCountData() {
        this.setState({manageLoading: true});
        this.props.DashboardCount()
            .then(response => {
                const responseData = response.payload;
                if (responseData.status === 200) {
                    if (responseData.data.status === "success") {
                        this.setState({
                            manageLoading: false,
                            countData: responseData.data.data
                        });
                        console.log('responseData.data.data ::',responseData.data.data);
                    }
                }
            })
            .catch((error) => {
                //console.log(error);
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.DASHBOARD,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    getSalesChartData() {
        this.setState({manageLoading: true});
        let salesChartMonth = [];
        let salesChartDataValues = [];
        let salesChartTotalCount = 0;
        this.props.DashboardSalesChart()
            .then(response => {
                const salesChartResponseData = response.payload;
                if (salesChartResponseData.status === 200) {
                    if (salesChartResponseData.data.status === "success") {
                        salesChartMonth = salesChartResponseData.data.data.months;
                        salesChartDataValues = salesChartResponseData.data.data.data;
                        salesChartTotalCount = salesChartResponseData.data.data.total;
                        let salesChartData = {
                            title: {
                                display: true,
                                text: 'Custom Chart Title'
                            },
                            labels: salesChartMonth,
                            datasets: [{
                                backgroundColor: webConstants.CHART_BAR_COLOR,
                                data: salesChartDataValues
                            }]
                        };
                        console.log("salesChartData : ",salesChartData)
                        this.setState({
                            manageLoading: false,
                            salesChartData: {data: salesChartData, total: salesChartTotalCount}
                        });
                    }
                }
            })
            .catch((error) => {
                //console.log(error);
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.DASHBOARD,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    getSalesCustomerGrowth() {
        this.setState({manageLoading: true});
        let customerGrowthChartMonth = [];
        let customerGrowthDataValues = [];
        let customerGrowthTotalCount = 0;
        this.props.DashboardCustomerGrowth()
            .then(response => {
                const customerGrowthResponseData = response.payload;
                if (customerGrowthResponseData.status === 200) {
                    if (customerGrowthResponseData.data.status === "success") {
                        customerGrowthChartMonth = customerGrowthResponseData.data.data.months;
                        customerGrowthDataValues = customerGrowthResponseData.data.data.data;
                        customerGrowthTotalCount = customerGrowthResponseData.data.data.total;
                        let customerGrowthChartData = {
                            labels: customerGrowthChartMonth,
                            datasets: [{
                                backgroundColor: webConstants.CHART_BAR_COLOR,
                                data: customerGrowthDataValues
                            }]
                        };
                        this.setState({
                            manageLoading: false,
                            customerGrowthChartData: {data: customerGrowthChartData, total: customerGrowthTotalCount}
                        });
                    }
                }
            })
            .catch((error) => {
                //console.log(error);
                if (error.response !== undefined) {
                    this.setState({
                        manageLoading: false,
                    });
                    swal(
                        webConstants.DASHBOARD,
                        error.response.data.message,
                        'error'
                    )
                }
            });
    }

    render() {
        return (
            <div>
                <HeaderContainer/>
                <SidebarContainer/>
                <div className="content-wrapper" ref="bodyContent" style={{minHeight: this.state.wrapHeight}}>
                    <section className="content-header">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="dashboard-box">
                                    <div className="">
                                        {(this.state.manageLoading) ? <Loader/> : ''}
                                    </div>

                                    <div className="box-header with-border">
                                        {(this.state.manageLoading) ? '' :
                                            <div className="col-lg-12 no-padding">
                                                <h3 className="manage-page-title">{webConstants.DASHBOARD} </h3>
                                            </div>}
                                    </div>
                                    {(this.state.manageLoading) ? '' :
                                        <div className="box-body">
                                            <div className="row">
                                                <div className="col-md-12 no-padding dashboard-blocks">
                                                    {
                                                        (summaryCountData.summaryCount).map((summaryRow, index) => {
                                                            return (
                                                                <div className="board-block" key={index}>
                                                                    <div className="summary-block border-top"
                                                                         style={{borderColor: summaryRow.border_color}}>
                                                                        <h5 className="summary-count">
                                                                            { (parseInt(this.state.countData[summaryRow.value])).toLocaleString('en') }
                                                                            <sup>{summaryRow.optional_value}</sup></h5>
                                                                        <span
                                                                            className="summary-title">{summaryRow.title}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="col-sm-6 col-xs-6 no-padding-left">
                                                        <div className="chart-box">
                                                            <h4 className="chart-title">Sales Chart For Current
                                                                Year</h4>
                                                            <p className="chart-total-count"> Total Count
                                                                : {this.state.salesChartData.total} </p>                                                                
                                                            <div className="chart-block">
                                                                {console.log(this.state.salesChartData)}
                                                                <Bar
                                                                    data={this.state.salesChartData.data}
                                                                    options={webConstants.CHART_OPTIONS}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-xs-6 no-padding-right">
                                                        <div className="chart-box">
                                                            <h4 className="chart-title">Customer Growth For Current
                                                                Year</h4>
                                                            <p className="chart-total-count"> Total Count
                                                                : {this.state.customerGrowthChartData.total} </p>
                                                            <div className="chart-block">
                                                                <Bar
                                                                    data={this.state.customerGrowthChartData.data}
                                                                    options={webConstants.CHART_OPTIONS}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {/* <!-- Box --> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Dashboard;