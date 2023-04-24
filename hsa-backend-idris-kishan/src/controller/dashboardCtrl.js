import formatResponse from '../../utils/formatResponse';
import User from '../models/User';
import Service from '../models/Service';
import Customer from '../models/Customer';
import Role from '../models/Role';
import Payment from '../models/Payment';

    export const dashboard = async (req, res) => {

    const serviceProviderRoleId = await Role.findOne({ name: 'service_provider' }, { _id: true });
    const serviceCount = Service.find({ progress: { $in: ['task_done', 'payment_done', 'review'] } }).countDocuments();
    const customerCount = Customer.find({ isDeleted: { $in: ['false'] } }).countDocuments();
    const providerCount = User.find({ isDeleted: { $in: ['false'] }, role: { $in: [serviceProviderRoleId._id] } }).countDocuments();

    // Payment Calculation
    let amount_gain_last_day = '0';
    let amount_gain_last_week = '0';
    let amount_gain_last_month = '0';
    let amount_gain_last_year = '0';
    let total_amount = '0';
    const projection = {
        total_amount_paid: 1
    };

    const totalAmountResultPromise = await Payment.find({
        total_amount_paid: {
            $gt: 0
        }
    }, projection);
    totalAmountResultPromise.forEach(ele => {
        total_amount = parseInt(total_amount) + ele.total_amount_paid;
        JSON.stringify(total_amount);
    });
    console.log('totalAmountResultPromise :', total_amount);


    
    // Last Day
    let currentDate = new Date();
    let lastDayDate = new Date();
    lastDayDate.setDate(currentDate.getDate() - 1);
    const totalAmountLastDayResultPromise = await Payment.find({
        created_at: { '$gt': lastDayDate, '$lte': currentDate }
    }, projection);
    totalAmountLastDayResultPromise.forEach(ele => {
        amount_gain_last_day = parseInt(amount_gain_last_day) + ele.total_amount_paid;
        JSON.stringify(amount_gain_last_day);
    });
    console.log('amount_gain_last_day :', amount_gain_last_day);



    // Last Week
    let lastWeekDate = new Date();
    lastWeekDate.setDate(currentDate.getDate() - 7);
    const totalAmountLastWeekPromise = await Payment.find({
        created_at: { '$gte': lastWeekDate, '$lt': currentDate }
    }, projection);
    totalAmountLastWeekPromise.forEach(ele => {
        amount_gain_last_week = parseInt(amount_gain_last_week) + ele.total_amount_paid;
        JSON.stringify(amount_gain_last_week);
    });    
    console.log('amount_gain_last_week :', amount_gain_last_week);



    // Last Month
    let lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const totalAmountLastMonthPromise = await Payment.find({
        created_at: { '$gte': lastMonthDate, '$lt': currentDate }
    }, projection);
    totalAmountLastMonthPromise.forEach(ele => {
        amount_gain_last_month = parseInt(amount_gain_last_month) + ele.total_amount_paid;
        JSON.stringify(amount_gain_last_month);
    });

    // Last Year
   let lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
    const totalAmountLastYearPromise = await Payment.find({
        created_at: { '$gte': lastYearDate, '$lt': currentDate }
    }, projection);
    totalAmountLastYearPromise.forEach(ele => {
        amount_gain_last_year = parseInt(amount_gain_last_year) + ele.total_amount_paid;
        JSON.stringify(amount_gain_last_year);
    });    
    console.log('amount_gain_last_year :', amount_gain_last_year);

    const [
        customer,
        provider,
        request_serviced,
        totalAmountResult,
        totalAmountLastDayResult,
        totalAmountLastWeekResult,
        totalAmountLastMonthResult,
        totalAmountLastYearResult
    ] = await Promise.all([
        customerCount,
        providerCount,
        serviceCount,
        totalAmountResultPromise,
        totalAmountLastDayResultPromise,
        totalAmountLastWeekPromise,
        totalAmountLastMonthPromise,
        totalAmountLastYearPromise
    ]);


    const data = { customer, provider, request_serviced, amount_gain_last_day, amount_gain_last_week, amount_gain_last_month, amount_gain_last_year, total_amount };

    formatResponse(res, data);
};

export const saleGrowthGraph = async (req, res) => {
    const year = new Date().getFullYear();
    const results = await Service.aggregate([
        { $project: { progress: 1, created_at: 1, month: { $month: '$created_at' }, year: { $year: '$created_at' } } },
        { $match: { year: year, progress: { $in: ['task_done', 'payment_done', 'review'] } } },
        { $group: { _id: '$month', count: { $sum: 1 } } }
    ]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = new Array(months.length).fill(0);
    results.map(result => {
        data[result._id - 1] = result.count;
    });
    const total = data.reduce((total, num) => total + num);
    const graphData = { months, total, data };
    formatResponse(res, graphData);
};

export const customerGrowthGraph = async (req, res) => {
    const year = new Date().getFullYear();
    const results = await Customer.aggregate([
        { $project: { isDeleted: 1, created_at: 1, month: { $month: '$created_at' }, year: { $year: '$created_at' } } },
        { $match: { year: year, isDeleted: { $in: [false] } } },
        { $group: { _id: '$month', count: { $sum: 1 } } }
    ]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = new Array(months.length).fill(0);
    results.map(result => {
        data[result._id - 1] = result.count;
    });
    const total = data.reduce((total, num) => total + num);
    const graphData = { months, total, data };
    formatResponse(res, graphData);
};