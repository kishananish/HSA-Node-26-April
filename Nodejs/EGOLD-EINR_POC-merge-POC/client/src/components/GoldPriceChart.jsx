import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';

function GoldPriceChart() {
    const [data, setData] = useState([]);
    const [currency, setCurrency] = useState('priceUSD');
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/goldPrice/get`);
            setData([...response.data]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const options = {
            chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#126CEE'],
            dataLabels: {
                enabled: true,
            },
            title: {
                text: 'EGOLD Price per Gram',
                align: 'left'
            },
            series: [
                {
                    name: 'EGold Price',
                    data: data.map((d) => d[currency]),
                },
            ],
            xaxis: {
                title: {
                    text: 'Date'
                },
                categories: data.map((d) => d.createdAt.substring(0, 10)),
                type: 'datetime',
                labels: {
                    datetimeUTC: false,
                },
        },
            yaxis: {
                title: {
                    text: `${currency.includes('USD') ?"USD": "INR"
                }`
                },
            },
            markers: {
                size: 2
            },
            stroke: {
                curve: 'smooth'
            },
        };

        const chart = new ApexCharts(document.querySelector('#gold-price-chart'), options);
        chart.render();

        return () => chart.destroy();
    }, [data, currency]);

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <div>
            <div id="gold-price-chart" />
            <div>
                <label>
                    <input type="radio" value="priceUSD" checked={currency === 'priceUSD'} onChange={handleCurrencyChange} /> USD
                </label>
                <label>
                    <input type="radio" value="priceINR" checked={currency === 'priceINR'} onChange={handleCurrencyChange} /> INR
                </label>
            </div>
        </div>
    );
}

export default GoldPriceChart;
