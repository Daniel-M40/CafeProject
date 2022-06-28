const ws = new WebSocket("ws://localhost:5000");
var title = "Default;"
var myChart;

// **** deviceDataJSON is fake JSON in place of the JSON from the server.
var deviceData = {
    data: {
        device: ["iphone", "ipad", "android Phone", "android tablet", "Windows laptop", "Windows Desktop", "Apple laptop", "Apple desktop"],
        visits: [563, 231, 749, 328, 503, 337, 312, 220]
    }
};

var deviceDataJSON = JSON.stringify(deviceData);
var deviceData = JSONParse(deviceDataJSON);
var padding = 20;


window.addEventListener("load", function () {
    let chartType = "line"
    let date = "week"; // So we can subtract the start date to get the end date (will be either days or months)
    let operation = 2;
    let subOperation = 10;
    var obj = {};

    title = "Weekly Sales";
    obj = createObject(operation, subOperation, getDate(), date)
    let json = JSON.stringify(obj);

    waitForOpenConnection(ws);
    sendMessage(ws, json);

    ws.onmessage = function (event) {
        let data = JSON.parse(event.data)
        change(chartType, data);
    }
})


function change(newType, data) {
    var ctx = document.getElementById("canvas").getContext("2d");

    // Remove the old chart and all its event handles
    if (myChart) {
        myChart.destroy();
    }

    if (newType === "line") {
        var temp = jQuery.extend(true, {}, displayLineChart(data));
        temp.type = newType;
        myChart = new Chart(ctx, temp);
    }

    else if (newType === "pie") {
        var temp = jQuery.extend(true, {}, displayPieChart(data));
        temp.type = newType;
        myChart = new Chart(ctx, temp);
    }

    else if (newType === "bar") {
        var temp = jQuery.extend(true, {}, displayBarChart(data));
        temp.type = newType;
        myChart = new Chart(ctx, temp);
    }
    else {
        // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
        var temp = jQuery.extend(true, {}, config);
        temp.type = newType;
        myChart = new Chart(ctx, temp);
    }

};


document.getElementById("submitSettings").addEventListener("click", function () {
    let settingsForm = document.forms.dashboardSettings.elements;
    let chartType = settingsForm.chart.value;
    let date = (settingsForm.date.value); // So we can subtract the start date to get the end date (will be either days or months)
    let operation = 2;
    let subOperation = 10;
    var obj = {};

    if (date === "week") {
        title = "Weekly Sales";
        obj = createObject(operation, subOperation, getDate(), date)
    }
    else if (date === "month") {
        title = "Monthly Sales";
        obj = createObject(operation, subOperation, getDate(), date)
    }
    else if (date === "year") {
        title = "Yearly Sales";
        obj = createObject(operation, subOperation, getDate(), date)
    }

    let json = JSON.stringify(obj);
    sendMessage(ws, json);


    ws.onmessage = function (event) {
        let data = JSON.parse(event.data)
        change(chartType, data);
    }
})

function createObject(operation, subOperation, startDate, endDate) {
    return obj = {
        operation: operation,
        subOperation: subOperation,
        startDate: startDate,
        endDate: endDate
    };

}


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


function displayLineChart(data) {
    const lineChart = {
        data: {
            labels: data.Date,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(255,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: data.Data
            }]
        },

        options: {
            maintainAspectRatio: false,
            layout: {
                padding: padding
            },
            legend: { display: false },
            title: {
                display: true,
                text: title
            },
        }
    }

    return lineChart;
}

function displayBarChart(data) {
    var barColors = [];
    const barChart = {

        data: {
            labels: data.Date,
            datasets: [{
                fill: false,
                backgroundColor: barColors,
                data: data.Data
            }]
        },

        options: {
            maintainAspectRatio: false,
            layout: {
                padding: padding
            },
            title: {
                display: true,
                text: "User visits."
            },
        }
    }

    for (let count = 0; count < data.Data.length; count++) {
        barColors.push(random_rgba());
    }

    return barChart;
}

function displayPieChart() {
    var pieColors = [];

    const pieChart = {
        data: {
            labels: deviceData.data.device,
            datasets: [{
                fill: false,
                backgroundColor: pieColors,
                data: deviceData.data.visits
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: padding
            },
            title: {
                display: true,
                text: "Devices."
            },
        }
    }

    for (let count = 0; count < deviceData.data.device.length; count++) {
        pieColors.push(random_rgba());
    }
    return pieChart;
}

function JSONParse(json) {
    return JSON.parse(json);
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}