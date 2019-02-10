

jQuery(document).ready(function ($) {

    var ctx = document.getElementById("donut1").getContext('2d');

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Red", "Blue", "Yellow"],
            datasets: [{
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    var ctx = document.getElementById("donut4").getContext('2d');

    var myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: ['24-28-2019', '24-28-2019', '24-28-2019', '24-28-2019', '24-28-2019'],
			datasets: [{
				label: 'Attendance Boolean',
				data: [1,0,1,1,0],
			}]
		},
		options: {
			title: {
				display: true,
				text: 'Attendance at 58%'
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
    });
    

    var ctx = document.getElementById("donut5").getContext("2d");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["3rd Mock", "5th Mock", "1st Test", "Astronomy", "Organic Chemistry"],
            datasets: [{
                label: 'Exam Performance in %',
                data: [98, 10, 24, 67, 34],
                fillColor: "rgba(255,255,255,0)",
                strokeColor: "rgba(16,133,135,0)",
                pointColor: "rgba(16,133,135,0)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(16,133,135,0)",
                responsive: true
            }]
        },
        options: {
            title: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});