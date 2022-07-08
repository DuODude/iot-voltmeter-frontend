window.onload = function () {
    let backendIP = "";
    let GlobalVoltage = 0;
    while (backendIP == "") {
        backendIP = prompt("Enter IP");
    }

    const socket = new WebSocket("ws://" + backendIP + "/8000");

    socket.addEventListener("open", function (event) {
        socket.send("Connection Established");
    });

    socket.addEventListener("message", function (event) {
        GlobalVoltage = parseFloat(event.data);
    });

    var dps = []; // dataPoints
    var chart1 = new CanvasJS.Chart("chart1Container", {
        data: [
            {
                type: "line",
                dataPoints: dps,
            },
        ],
        axisY: {
            minimum: -4,
            maximum:  4,
        },
    });

    var xVal = 0;
    var yVal = 0;
    var updateInterval = 10;
    var dataLength = 500; // number of dataPoints visible at any point

    var updateChart = function (count) {
        count = count || 1;

        for (var j = 0; j < count; j++) {
            yVal = GlobalVoltage;
            dps.push({
                x: xVal,
                y: yVal,
            });
            xVal++;
        }

        if (dps.length > dataLength) {
            dps.shift();
        }

        chart1.render();

        document.getElementById("val1").innerHTML = yVal;
    };

    updateChart(dataLength);
    setInterval(function () {
        updateChart();
    }, updateInterval);
};
