export const chartData =
{
    labels: ["2009", "2010", "2011", "2012", "2013"],
    datasets: [ {
        backgroundColor: "#3292DF",
        data: [100, 75, 50, 70, 55]
    }]
}

    /*
export const chartData =
    {
        labels: ["2009", "2010", "2011", "2012", "2013"],
        datasets: [ {
            label: "Customer",
            backgroundColor: "#3292DF",
            data: [100, 75, 50, 70, 55]
        },
            {
                label: "Service Provider",
                backgroundColor: "#DEDEDE",
                data: [95, 60, 45, 65, 30]
            }]
    }*/

 export const chartOptions =
     {
        responsive: true,

        legend: {
            position: ""
        },
        title: {
            display: true,
            text: ""
        },
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        scales: {
            xAxes: [{
                categoryPercentage: 0.4,
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    beginAtZero: true,
                    steps: 25,
                    stepValue: 5
                }
            }]
        }
    }