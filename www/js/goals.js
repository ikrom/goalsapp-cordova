var lineChart;
var lineChartData = [];

AmCharts.ready(function () {
    makePieChart('pie1', 5, '#F8D720');
});

function makePieChart( div, value, color ) {
    var pieChart = new AmCharts.AmPieChart();
    pieChart.addLabel("50%", "45%", "" + value + "%", "middle", 20);
    pieChart.dataProvider = [{
        "title": "Label",
            "value": value,
            "color": color
    }, {
            "value": 100 - value,
            "color": "#BCBBB9"
    }];
    pieChart.valueField = "value";
    pieChart.outlineColor = "#BCBBB9";
    pieChart.outlineAlpha = 0.8;
    pieChart.outlineThickness = 0;
    pieChart.colorField = "color";
    pieChart.radius = "42%";
    pieChart.innerRadius = "80%";
    pieChart.labelsEnabled = false;

    // WRITE
    pieChart.write(div);
}