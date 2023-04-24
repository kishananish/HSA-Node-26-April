import React, {Component} from 'react';
import Header from '../Comman/Header'
import SideBar from '../Comman/SideBar';
import '../../assets/css/report.css';

const reportData = [
    {
        reportName : 'Ratings',
        reportLogo : require('../../assets/img/lock.png'),
        reportDescription : 'Lorem ipsum is simply dummy text of typesetting industry'
    },
    {
        reportName : 'Service Request (Accepted/Rejected)',
        reportLogo : require('../../assets/img/lock.png'),
        reportDescription : 'Lorem ipsum is simply dummy text of typesetting industry'
    },
    {
        reportName : 'Earnings',
        reportLogo : require('../../assets/img/lock.png'),
        reportDescription : 'Lorem ipsum is simply dummy text of typesetting industry'
    },
    {
        reportName : 'Active Time',
        reportLogo : require('../../assets/img/lock.png'),
        reportDescription : 'Lorem ipsum is simply dummy text of typesetting industry'
    },
    {
        reportName : 'Time Availability',
        reportLogo : require('../../assets/img/lock.png'),
        reportDescription : 'Lorem ipsum is simply dummy text of typesetting industry'
    }];
class Reports extends Component {

    render(){
        return (
            <div>
                <Header/>
                <SideBar/>
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="report-box">
                                    <div className="box-header with-border">
                                        <h3 className="page-title">Report </h3>
                                    </div>

                                    <div className="report-box-body">
                                        <div className="row">
                                            {
                                                (reportData).map((reportRow, index) => {
                                                    return(
                                                        <div className="report-block col-md-11" key={index}>
                                                            <img src={reportRow.reportLogo} alt="Report"/>
                                                            <span className="report-details">
                                                                <h3 className="report-name"> {reportRow.reportName} </h3>
                                                                <p className="report-description">{reportRow.reportDescription}</p>
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            }
                                       </div>
                                    </div>
                                </div> {/* <!-- Box --> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
export default Reports;
