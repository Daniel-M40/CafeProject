//const ws = new WebSocket("ws://localhost:5000");

/*
window.addEventListener("load", function () {

    const obj = {
        operation: 2,
        subOperation: 10,
        date: getDate()
    }
    let json = JSON.stringify(obj);

    sendMessage(ws, json);

})
*/
var myLineChart;
var myPieChart;
var myBarChart;
// Load charts: 
$(document).ready(function () {
    displayLineChart();
    displayBarChart();
    displayPieChart();
});


document.getElementById("submitSettings").addEventListener("click", function () {
    var myBarChartCanvas = document.getElementById("myBarChart");
    var myLineChartCanvas = document.getElementById("myLineChart");
    var myPieChartCanvas = document.getElementById("myPieChart");
    var settingsForm = document.forms.dashboardSettings.elements;
    var chartType = settingsForm.chart.value;
    var date = parseInt(settingsForm.date.value);
    var operation = 2;
    var obj = {};
    if (date === 7) {
        obj = {
            operation: operation,
            subOperation: 11,
            date: getDate()
        }
    }
    else if (date === 1) {
        obj = {
            operation: operation,
            subOperation: 10,
            date: getDate()
        }
    }
    else if (date === 12) {
        obj = {
            operation: operation,
            subOperation: 12,
            date: getDate()
        }
    }

    if (chartType === "myLineChart") {
        init(myLineChart, displayLineChart)
    }
    else if (chartType === "myPieChart") {
        init(myPieChart, displayPieChart)
    }
    else if (chartType === "myBarChart") {
        init(myBarChart, displayBarChart)
    }

    let json = JSON.stringify(obj);
    //sendMessage(ws, json);
})

function getDate() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy;
    console.log(today);
    return today;

}

var salesData = {
    data: {
        date: ["01/01/2021", "01/02/2021", "01/03/2021", "01/04/2021", "01/05/2021", "01/06/2021", "01/07/2021", "01/08/2021", "01/09/2021", "01/10/2021", "01/11/2021", "01/12/2021", "01/01/2022", "01/02/2022", "01/03/2022", "01/04/2022", "01/05/2022", "01/06/2022", "01/07/2022", "01/08/2022"],
        item_sales: [35, 7, 95, 42, 69, 87, 75, 81, 88, 61, 70, 34, 100, 43, 38, 54, 55, 87, 5, 39]
    }
};
// **** salesDataJSON is fake JSON in place of the JSON from the server.
var salesDataJSON = JSON.stringify(salesData);

// **** userDataJSON is fake JSON in place of the JSON from the server.
var userData = {
    data: {
        age: ["16 to 20", "21 to 30", "31 to 40", "41 to 50", "51 to 60"],
        visits: [342, 231, 98, 57, 23]
    }
};
var userDataJSON = JSON.stringify(userData);

// **** deviceDataJSON is fake JSON in place of the JSON from the server.
var deviceData = {
    data: {
        device: ["iphone", "ipad", "android Phone", "android tablet", "Windows laptop", "Windows Desktop", "Apple laptop", "Apple desktop"],
        visits: [563, 231, 749, 328, 503, 337, 312, 220]
    }
};

var deviceDataJSON = JSON.stringify(deviceData);
var salesData = JSONParse(salesDataJSON);
var userData = JSONParse(userDataJSON);
var deviceData = JSONParse(deviceDataJSON);
var padding = 20;

function displayLineChart() {
    var canvasID = document.getElementById("myLineChart");

    var lineData = {
        labels: salesData.data.date,
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(255,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: salesData.data.item_sales
        }]
    }

    var lineOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: padding
        },
        legend: { display: false },
        title: {
            display: true,
            text: "Monthly Sales."
        },
    }

    // define the chart 
    myLineChart = new Chart(canvasID, {
        type: "line",
        data: lineData,
        options: lineOptions
    });

    return myLineChart;
}

function displayBarChart() {
    var canvasID = document.getElementById("myBarChart");

    var barColors = [];
    var barData = {
        labels: userData.data.age,
        datasets: [{
            fill: false,
            backgroundColor: barColors,
            data: userData.data.visits
        }]
    }

    var barOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: padding
        },
        title: {
            display: true,
            text: "User visits."
        },
    }


    for (let count = 0; count < userData.data.age.length; count++) {
        barColors.push(random_rgba());
    }


    // define the chart 
    myBarChart = new Chart(canvasID, {
        type: "bar",
        data: barData,
        options: barOptions
    });

    return myBarChart;
}

function displayPieChart() {
    var canvasID = document.getElementById("myPieChart");

    var pieColors = [];
    var pieData = {
        labels: deviceData.data.device,
        datasets: [{
            fill: false,
            backgroundColor: pieColors,
            data: deviceData.data.visits
        }]
    }
    var pieOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: padding
        },
        title: {
            display: true,
            text: "Devices."
        },
    }

    for (let count = 0; count < deviceData.data.device.length; count++) {
        pieColors.push(random_rgba());
    }


    // define the chart 
    myPieChart = new Chart(canvasID, {
        type: "pie",
        data: pieData,
        options: pieOptions
    });
    return myPieChart;
}

function JSONParse(json) {
    return JSON.parse(json);
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}


function updateChartType(selected_chart_id) {

    var all_types = ["myLineChart", "myPieChart", "myBarChart"];
    var class_type = ["displayLine", "displayPie", "displayBar"];

    for (var i = 0; i < all_types.length; i++) {
        if (all_types[i] == selected_chart_id) {
            document.getElementById(all_types[i]).style.display = "";
            document.getElementsByClassName(class_type[i])[0].style.display = "block";
        } else {
            document.getElementById(all_types[i]).style.display = "none";
            document.getElementsByClassName(class_type[i])[0].style.display = "none";

        }
    }

}

function init(myChart, displayChart) {
    myChart = displayChart();
    myChart.update();
}

function toggleChart() {
    myBarChart.destroy();
    this.chartType = (this.chartType == 'bar') ? 'line' : 'bar';
    init();
}