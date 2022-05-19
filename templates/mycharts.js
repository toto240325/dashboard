'use strict';

// reload the page every 10 minutes
setTimeout(function () {
    window.location.reload(1);
}, 10 * 60 * 1000);

/**
 * Enable deletion of a point on a graph by just clicking on it
 *
 * @param mycanvas, the canvas containing the chartjs chart
 * @param mychart, the chart in which to enable the deletion
 * @return {number} - this is an example, no return in this function
 */
function enable_deletion(mycanvas, mychart) {
    // console.log('Item: %o', mycanvas);
    mycanvas.onclick = function (evt) {
        // console.log("------------------");
        // console.log('mychart: %o', mychart);
        // console.log('mychart: %o', mychart);
        var activePoints = mychart.getElementsAtEventForMode(evt, 'index', { intersect: true }, false);
        var obj = activePoints;
        // console.log('Item: %o', obj);

        if (activePoints[0]) {
            // console.log("start");
            var obj = activePoints[0];
            // console.log('activePoints[0]: %o', activePoints[0]);
            var index = activePoints[0].index;
            // console.log('index: %o', index);

            var chart = mychart.$context.chart;
            // console.log('chart: %o', chart);
            var datasets = chart.config._config.data.datasets;
            // console.log('datasets: %o', datasets);

            var mydatetime = datasets[0].data[index].x;
            var value = datasets[0].data[index].y;
            var id = datasets[1].data[index].y;
            // console.log('mydatetime: %o', mydatetime);
            // console.log('value: %o', value);
            // console.log('id: %o', id);g

            // for (i = -1; i < 2; i++) {
            //     var val2 = mychart.data.datasets[0].data[index+i].y;
            //     var lab2 = mychart.data.datasets[0].data[index+i].x;
            //     var id2 = mychart.data.datasets[1].data[index+i].y;
            //     console.log("" + i + " val:" + val2 + ", date:" + lab2 + ", id:" + id2);
            // }

            var url = "http://192.168.0.73/event/api/event/delete.php?id=" + id;
            if (confirm("sure to want to delete point (value:" + value + ", date:" + mydatetime + ", id:" + id + ") ?")) {
                console.log("going to delete point");
                const Http = new XMLHttpRequest();
                Http.open("GET", url);
                Http.send();
                Http.onreadystatechange = (e) => {
                    console.log(Http.responseText)
                }
                console.log("splicing index %i", index);
                // console.log('before : datasets[0].data : %', datasets[0].data);
                var spliced = mychart.data.datasets[0].data.splice(index, 1);
                var spliced = mychart.data.datasets[1].data.splice(index, 1);

                // console.log('after : datasets[0].data : %', datasets[0].data);
                mychart.update();
                console.log("char/t updated ?");
            } else {
                console.log("OK, no deletion this time");
            }
        }
    }
};

function zoom_plugin() {
    var my_zoom_plugin = {
        pan: {
            enabled: true,
            mode: 'x',
            threshold: 10
        },
        zoom: {
            wheel: {
                enabled: true,
                // speed: 0.1,
                modifierKey: 'shift'
            },
            drag: {
                enabled: true,
                modifierKey: 'alt'
            },
            pinch: {
                enabled: true
            },
            mode: 'x',
        }
    }
    return my_zoom_plugin;
}


function myConfig(labels, values, chart_type) {
    // var timeFormat = 'yyyy/MM/dd H:mm:ss';
    var timeFormat = 'yyyy/MM/dd';

    var a = [];
    for (let i = 0; i < labels.length; i++) {
        let b = { x: labels[i], y: values[i] };
        a.push(b);
    }
    var data_array_1a = a;

    var xA = {
        type: "time",
        time: {
            //     format: timeFormat,
            //     // unit: 'day',
            parser: 'yyyy-MM-dd H:m:s'
            //     tooltipFormat: 'll'
        },
        scaleLabel: {
            display: true,
            labelString: 'Date1'
        }
    };
    var yA = {
        scaleLabel: {
            display: true,
            labelString: 'value'
        }
    };
    var scales1 = {
        xAxes: xA,
        yAxes: yA
    };

    var options1 = {
        responsive: true,
        scales: scales1,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                // reverse: true
            },
            title: {
                text: "Chart.js Time Scale",
                display: true
            }
        }

    };
    var config1 = {
        //type: "line",
        //type: "bar",
        type: chart_type,
        data: {
            labels: labels,
            datasets: [
                {
                    label: "temperature2",
                    data: data_array_1a,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    lineTension: 0.1
                }
            ]
        },
        options: options1
    };
    return config1;
}

function myConfig2(title, values, values_unit, labels, chart_type, unit, label) {
    // var timeFormat = 'yyyy/MM/dd H:mm:ss';
    var timeFormat = 'yyyy/MM/dd';
    // var timeFormat = 'H:mm';

    var a = [];
    for (let i = 0; i < labels.length; i++) {
        let b = { x: labels[i], y: values[i] };
        a.push(b);
    }
    var data_array_1a = a;

    var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    var datetime2 = "LastSync: " + nowStr;

    var xA = {
        type: "time",
        time: {
            // format: timeFormat,

            displayFormats: {
                'millisecond': 'MMM dd',
                'second': 'MMM dd',
                'minute': 'H:mm',
                'hour': 'H:mm',
                'day': 'dd/MM',
                'week': 'MMM dd',
                'month': 'MMM dd',
                'quarter': 'MMM dd',
                'year': 'MMM dd',
            },
            unit: unit,
            parser: 'yyyy-MM-dd H:m:s'
        },
        scaleLabel: {
            display: true,
            labelString: datetime2
        }
    };
    var yA = {
        scaleLabel: {
            display: true,
            labelString: values_unit
        }
    };
    var scales1 = {
        xAxes: xA,
        yAxes: yA
    };

    var options1 = {
        responsive: true,
        scales: scales1,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                // reverse: true
            },
            title: {
                text: title,
                display: true
            },
            zoom: zoom_plugin()
        }
    };
    var config1 = {
        //type: "line",
        //type: "bar",
        type: chart_type,
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: data_array_1a,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    lineTension: 0.1
                }
            ]
        },
        options: options1
    };
    return config1;
}

function myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label) {

    // var timeFormat = 'yyyy/MM/dd H:mm:ss';
    var timeFormat = 'yyyy/MM/dd';
    // var timeFormat = 'H:mm';
    var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    var a = [];
    var b = [];
    for (let i = 0; i < labels.length; i++) {
        b = { x: labels[i], y: values[i] };
        a.push(b);
    }
    var data_array_1a = a;

    var a = [];
    var b = [];
    for (let i = 0; i < labels.length; i++) {
        b = { x: labels[i], y: ids[i] };
        a.push(b);
    }
    var data_array_2a = a;

    var owStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    var datetime2 = "LastSync: " + nowStr;

    var xA = {
        type: "time",
        time: {
            // format: timeFormat,
            displayFormats: {
                'millisecond': 'MMM dd',
                'second': 'MMM dd',
                'minute': 'H:mm',
                'hour': 'H:mm',
                'day': 'dd/MM',
                'week': 'MMM dd',
                'month': 'MMM dd',
                'quarter': 'MMM dd',
                'year': 'MMM dd',
            },
            unit: unit,
            parser: 'yyyy-MM-dd H:m:s'
        },
        scaleLabel: {
            display: true,
            labelString: datetime2
        }
    };
    var yA = {
        scaleLabel: {
            display: true,
            labelString: values_unit
        }
    };
    var scales1 = {
        xAxes: xA,
        yAxes: yA
    };

    var options1 = {
        // responsive: true,
        scales: scales1,
        plugins: {
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    // reverse: true
                },
                title: {
                    text: title,
                    display: true
                }
            },
            zoom: zoom_plugin()

            // {
            //     pan: {
            //         enabled: true,
            //         mode: 'xy',
            //         threshold: 10
            //     },
            //     zoom: {
            //         wheel: {
            //             enabled: true,
            //             modifierKey: 'shift'
            //         },
            //         pinch: {
            //             enabled: true
            //         },
            //         mode: 'xy',
            //     }
            // }
        }
    };
    var config1 = {
        //type: "line",
        //type: "bar",
        type: chart_type,
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: data_array_1a,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    lineTension: 0.1
                },
                {
                    label: label,
                    data: data_array_2a,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    hidden: true
                }
            ]
        },
        options: options1
    };
    return config1;
}

function myConfig_2_datasets(
    title,
    labels1, values1, chart_type1,
    labels2, values2, chart_type2,
    unit) {
    // var timeFormat = 'yyyy/MM/dd H:mm:ss';
    var timeFormat = 'yyyy/MM/dd';

    var data1 = [];
    for (let i = 0; i < labels1.length; i++) {
        let b = { x: labels1[i], y: values1[i] };
        data1.push(b);
    }

    var data2 = [];
    for (let i = 0; i < labels2.length; i++) {
        let b = { x: labels2[i], y: values2[i] };
        data2.push(b);
    }

    var xA = {
        id: "bubble",
        type: "time",
        time: {
            unit: unit,
            // format: timeFormat,
            displayFormats: {
                day: "DD"
            },
            parser: 'yyyy-MM-dd H:m:s'
        },
        offset: true,
        type: "category",
        distribution: "series",

        // gridLines: {
        //     offsetGridLines: false,
        //     drawTicks: true,
        //     display: true
        // },
        //stacked: true
    };
    // {
    //     id: "bar",
    //     offset: true,
    //     type: "time",
    //     type: "category",
    //     distribution: "series",
    // }


    var yA = {
        ticks: {
            beginAtZero: true,
        },
        scaleLabel: {
            display: true,
            labelString: 'value'
        }
    };
    // {
    //     id: 'ps4_5min',
    //     scaleLabel: {
    //         display: true,
    //         labelString: 'value'
    //     }
    // }

    var scales1 = {
        xAxes: xA,
        yAxes: yA
    };

    var options = {
        scales: scales1,
        // responsive: true,
        // legend: {
        //     position: 'top',
        // },
        // elements: {
        //     rectangle: {
        //         borderWidth: 2,
        //         borderColor: 'rgb(0, 255, 0)',
        //         borderSkipped: 'bottom'
        //     }
        // }
    };
    //console.log(options);
    var config = {
        //type: "line",
        type: "bar",
        data: {
            labels: labels2,
            datasets: [
                {
                    barPercentage: .7,
                    //     // categoryPercentage: .5,
                    //     //type: chart_type2,
                    xAxisID: "bar",
                    yAxisID: 'ps4_5min',
                    label: "ps4 x5min",
                    data: data2,
                    backgroundColor: "green",
                    borderColor: "black",
                    borderWidth: 1,
                    width: 55,
                    order: 2
                    //     // fill: false
                    //     //lineTension: 0.1
                },
                {
                    label: "ps4 up/down",
                    type: chart_type1,
                    data: data1,
                    xAxisID: "bubble",
                    backgroundColor: "orange",
                    borderColor: "orange",
                    fill: false,
                    //lineTension: 0.1,
                    order: 1,
                }
            ]
        },
        options: options,
    };
    // console.log(config);
    return config;
}

function myConfig_2_datasets2(
    title,
    labels1, values1, chart_type1,
    labels2, values2, chart_type2,
    unit) {
    var timeFormat = 'yyyy/MM/dd';

    var data1 = [];
    for (let i = 0; i < labels1.length; i++) {
        let b = { x: labels1[i], y: values1[i] };
        data1.push(b);
    }

    var data2 = [];
    // for (i = 0; i < labels2.length; i++) {
    //     b = { x: labels2[i], y: values2[i] };
    //     data2.push(b);
    // }

    var xA = {
        id: "xAxis_ID1",
        type: "time",
        time: {
            unit: unit,
            // format: timeFormat,
            displayFormats: {
                day: "DD"
            },
            parser: 'yyyy-MM-dd H:m:s'
        },
        offset: true,
        type: "category",
        distribution: "series",

        // gridLines: {
        //     offsetGridLines: false,
        //     drawTicks: true,
        //     display: true
        // },
        //stacked: true
    };
    // ,
    // {
    //     id: "night_ID",
    //     offset: true,
    //     type: "time",
    //     type: "category",
    //     distribution: "series",
    // }

    var yA = {
        ticks: {
            beginAtZero: true,
        },
        scaleLabel: {
            display: true,
            labelString: 'Y1'
        }
    };
    var scales1 = {
        xAxes: xA,
        yAxes: yA
    };

    var options = {
        scales: scales1,
        responsive: true,
        // elements: {
        //     rectangle: {
        //         borderWidth: 2,
        //         borderColor: 'rgb(0, 255, 0)',
        //         borderSkipped: 'bottom'
        //     }
        // }
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                // reverse: true
            },
            title: {
                text: title,
                display: true
            }
        }

    };
    //console.log(options);
    var config = {
        type: "line",
        data: {
            labels: labels2,
            datasets: [
                {
                    label: "Delta Day",
                    // barPercentage: .7,
                    //     // categoryPercentage: .5,
                    //     //type: chart_type2,
                    // xAxisID: "xAxis_ID",
                    // yAxisID: 'yAxis_ID',
                    // label: "my label",
                    // backgroundColor: "green",
                    borderColor: "green",
                    // borderWidth: 1,
                    // // width: 55,
                    order: 1,
                    //     // fill: false,
                    //     //lineTension: 0.1,
                    data: data1
                },
                {
                    label: "Delta Night",
                    // type: "line",
                    // xAxisID: "xAxis_ID2",
                    borderColor: "orange",
                    // backgroundColor: "orange",
                    // borderColor: "orange",
                    // // fill: false,
                    // //lineTension: 0.1,
                    order: 2,
                    data: data2
                }
            ]
        },
        options: options,
    };
    // console.log(config);
    return config;
}



// values = JSON.parse('{{ frigo_1h_chart.values | tojson }}');
// //console.log(values);
// values_unit = "{{ frigo_1h_chart.values_unit|safe }}"
// labels = JSON.parse('{{ frigo_1h_chart.labels | tojson }}');
// title = "{{ frigo_1h_chart.title|safe }}"
// chart_type = "{{ frigo_1h_chart.chart_type|safe }}"
// unit = "{{ frigo_1h_chart.unit|safe }}"
// label = "{{ frigo_1h_chart.label|safe }}"

// var a = [];
// for (i = 0; i < labels.length; i++) {
//     b = { x: labels[i], y: values[i] };
//     a.push(b);
//     // console.log(b);
// }
// data32 = a;

// // var timeFormat = 'dd/MM/yyyy';
// var timeFormat = 'yyyy-MM-dd hh:mm:ss';
// var data31 = [{
//     x: "04/01/2014", y: 175
// }, {
//     x: "10/01/2014", y: 175
// }, {
//     x: "04/01/2015", y: 178
// }, {
//     x: "10/01/2015", y: 178
// }];
// var chart_data32 = {
//     datasets: [
//         {
//             label: "US Dates",
//             // data: data31,
//             data: data32,
//             fill: false,
//             borderColor: 'red'
//         },
//         {
//             label: "UK Dates2 ",
//             data: data32,
//             fill: false,
//             borderColor: 'blue'
//         }
//     ]
// };
// // console.log(data3);
// var options32 = {
//     responsive: true,
//     title: {
//         display: true,
//         text: "canvas32"
//     },
//     scales: {
//         xAxes: {
//             type: "time",

//             time: {
//                 // format: timeFormat,

//                 displayFormats: {
//                     'millisecond': 'MMM dd',
//                     'second': 'MMM dd',
//                     'minute': 'H:mm',
//                     'hour': 'H:mm',
//                     'day': 'dd/MM',
//                     'week': 'MMM dd',
//                     'month': 'MMM dd',
//                     'quarter': 'MMM dd',
//                     'year': 'MMM dd',
//                 },
//                 unit: unit,
//                 parser: 'yyyy-MM-dd H:m:s'
//             },
//             scaleLabel: {
//                 display: true,
//                 labelString: 'Date3'
//             }
//         },
//         yAxes: {
//             scaleLabel: {
//                 display: true,
//                 labelString: 'value'
//             }
//         }
//     }
// };
// // var config32 = {
// //     type: 'line',
// //     data: chart_data32,
// //     options: options32
// //     // options: {}
// // };

// // const myChart32 = new Chart(
// //     document.getElementById('canvas32'),
// //     config32
// // );

// // var mycanvas32 = document.getElementById("canvas32");
// // mycanvas32.onclick = function (evt) {
// //     var activePoints = myChart32.getElementsAtEvent(evt);
// //     if (activePoints[0]) {
// //         console.log("start");
// //         obj = activePoints[0];
// //         console.log('Item: %o', obj);
// //         var chartData = activePoints[0]['_chart'].config.data;
// //         console.log('chartData: %o', chartData);
// //         var idx = activePoints[0]['_index'];
// //         console.log('idx: %o', idx);
// //         var label = chartData.labels[idx];
// //         console.log('label: %o', label);
// //         var value = chartData.datasets[0].data[idx];
// //         console.log('value: %o', value);

// //         var url = "http://example.com/?label=" + label + "&value=" + value;
// //         // console.log(url);
// //         // alert(url);
// //     }
// // };

// get_scales1 ==================================================

function get_scales1(unit, values_unit) {
    var timeFormat = 'yyyy-MM-dd hh:mm:ss';
    var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    var datetime2 = "LastSync: " + nowStr;

    var xA = {
        type: "time",
        time: {
            // format: timeFormat,
            displayFormats: {
                'millisecond': 'MMM dd',
                'second': 'MMM dd',
                'minute': 'H:mm',
                'hour': 'H:mm',
                'day': 'dd/MM',
                'week': 'MMM dd',
                'month': 'MMM dd',
                'quarter': 'MMM dd',
                'year': 'MMM dd',
            },
            unit: unit,
            parser: 'yyyy-MM-dd H:m:s'
        },
        scaleLabel: {
            display: true,
            labelString: datetime2
        }
    };
    var yA = {
        scaleLabel: {
            display: true,
            labelString: values_unit
        }
    };
    var scales1 = {
        xAxes: xA,
        yAxes: yA
    };
    return scales1;
}

var scales1 = get_scales1(unit, values_unit);


// horizontalArbitraryLinePlugin =======================================

const horizontalArbitraryLinePlugin = {
    id: 'horizontalArbitraryLinePlugin',
    beforeDraw(chart, args, options) {
        // console.log("in beforeDraw of %s", chart.canvas.id);
        // console.log("chart: %o", chart)
        // console.log("canvas: %s", chart.canvas.id)
        const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { xAxes, yAxes } } = chart;
        ctx.save();

        // console.log("yAxes : %o",yAxes)

        var ypix = yAxes.getPixelForValue(3);
        ctx.strokeStyle = 'green';
        ctx.strokeRect(left, ypix, left + width, 0);

        var ypix = yAxes.getPixelForValue(1.5);
        ctx.strokeStyle = 'green';
        ctx.strokeRect(left, ypix, left + width, 0);

        // ctx.beginPath();
        // ctx.moveTo(left, 100);
        // ctx.lineTo(left+width, 100);
        // ctx.strokeStyle = 'green';
        // ctx.stroke();
    },
    // afterDraw(chart, args, options) {
    //     console.log("in afterDraw of %s", chart.canvas.id);
    // }
}

// this is to register this plugin for ALL chart, not only for one instance
// Chart.register(horizontalArbitraryLinePlugin);

// get_rawdata ===================================================
// kind can be {"normal_1h", "smart_1h", "10h", "24h", "pool_ph", "pool_cl", "power_day", "power_night"}

function get_rawdata(kind) {

    var values, values_unit, labels, title, chart_type, unit, label, ids;
    ids = [];
    switch (kind) {
        case "normal_1h":
            values = JSON.parse('{{ frigo_1h_chart.values | tojson }}');
            //console.log(values);
            values_unit = "{{ frigo_1h_chart.values_unit|safe }}"
            labels = JSON.parse('{{ frigo_1h_chart.labels | tojson }}');
            title = "{{ frigo_1h_chart.title|safe }}"
            chart_type = "{{ frigo_1h_chart.chart_type|safe }}"
            unit = "{{ frigo_1h_chart.unit|safe }}"
            label = "{{ frigo_1h_chart.label|safe }}"
            break;
        case "smart_1h":
            values = JSON.parse('{{ frigo_1h_smart_chart.values | tojson }}');
            //console.log(values);
            values_unit = "{{ frigo_1h_smart_chart.values_unit|safe }}"
            labels = JSON.parse('{{ frigo_1h_smart_chart.labels | tojson }}');
            title = "{{ frigo_1h_smart_chart.title|safe }}"
            chart_type = "{{ frigo_1h_smart_chart.chart_type|safe }}"
            unit = "{{ frigo_1h_smart_chart.unit|safe }}"
            label = "{{ frigo_1h_smart_chart.label|safe }}"
            break;
        case "10h":
            values = JSON.parse('{{ frigo_10h_chart.values | tojson }}');
            values_unit = "{{ frigo_10h_chart.values_unit|safe }}"
            labels = JSON.parse('{{ frigo_10h_chart.labels | tojson }}');
            title = "{{ frigo_10h_chart.title|safe }}"
            chart_type = "{{ frigo_10h_chart.chart_type|safe }}"
            unit = "{{ frigo_10h_chart.unit|safe }}"
            label = "{{ frigo_10h_chart.label|safe }}"
            break;
        case "24h":
            values = JSON.parse('{{ frigo_24h_chart.values | tojson }}');
            values_unit = "{{ frigo_24h_chart.values_unit|safe }}"
            labels = JSON.parse('{{ frigo_24h_chart.labels | tojson }}');
            title = "{{ frigo_24h_chart.title|safe }}"
            chart_type = "{{ frigo_24h_chart.chart_type|safe }}"
            unit = "{{ frigo_24h_chart.unit|safe }}"
            label = "{{ frigo_24h_chart.label|safe }}"
            break;
        case "pool_ph":
            values = JSON.parse('{{ pool_ph_chart.values | tojson }}');
            ids = JSON.parse('{{ pool_ph_chart.ids | tojson }}');
            labels = JSON.parse('{{ pool_ph_chart.labels | tojson }}');
            values_unit = "{{ pool_ph_chart.values_unit | safe }}"
            title = "{{ pool_ph_chart.title|safe }}"
            chart_type = "{{ pool_ph_chart.chart_type|safe }}"
            unit = "{{ pool_ph_chart.unit|safe }}"
            label = "{{ pool_ph_chart.label|safe }}"
            break;
        case "pool_cl":
            values = JSON.parse('{{ pool_cl_chart.values | tojson }}');
            ids = JSON.parse('{{ pool_cl_chart.ids | tojson }}');
            labels = JSON.parse('{{ pool_cl_chart.labels | tojson }}');
            values_unit = "{{ pool_cl_chart.values_unit | safe }}"
            title = "{{ pool_cl_chart.title|safe }}"
            chart_type = "{{ pool_cl_chart.chart_type|safe }}"
            unit = "{{ pool_cl_chart.unit|safe }}"
            label = "{{ pool_cl_chart.label|safe }}"
            break;
        case "power_day":
            values = JSON.parse('{{ power_day_chart.values | tojson }}');
            ids = JSON.parse('{{ power_day_chart.ids | tojson }}');
            labels = JSON.parse('{{ power_day_chart.labels | tojson }}');
            values_unit = "{{ power_day_chart.values_unit | safe }}"
            title = "{{ power_day_chart.title|safe }}"
            chart_type = "{{ power_day_chart.chart_type|safe }}"
            unit = "{{ power_day_chart.unit|safe }}"
            label = "{{ power_day_chart.label|safe }}"
            break;
        case "power_night":
            values = JSON.parse('{{ power_night_chart.values | tojson }}');
            ids = JSON.parse('{{ power_night_chart.ids | tojson }}');
            labels = JSON.parse('{{ power_night_chart.labels | tojson }}');
            values_unit = "{{ power_night_chart.values_unit | safe }}"
            title = "{{ power_night_chart.title|safe }}"
            chart_type = "{{ power_night_chart.chart_type|safe }}"
            unit = "{{ power_night_chart.unit|safe }}"
            label = "{{ power_night_chart.label|safe }}"
            break;
        case "power_day_delta":
            values = JSON.parse('{{ power_day_delta_chart.values | tojson }}');
            labels = JSON.parse('{{ power_day_delta_chart.labels | tojson }}');
            values_unit = "{{ power_day_delta_chart.values_unit | safe }}"
            title = "{{ power_day_delta_chart.title|safe }}"
            chart_type = "{{ power_day_delta_chart.chart_type|safe }}"
            unit = "{{ power_day_delta_chart.unit|safe }}"
            label = "{{ power_day_delta_chart.label|safe }}"
            break;
        case "power_night_delta":
            values = JSON.parse('{{ power_night_delta_chart.values | tojson }}');
            labels = JSON.parse('{{ power_night_delta_chart.labels | tojson }}');
            values_unit = "{{ power_night_delta_chart.values_unit | safe }}"
            title = "{{ power_night_delta_chart.title|safe }}"
            chart_type = "{{ power_night_delta_chart.chart_type|safe }}"
            unit = "{{ power_night_delta_chart.unit|safe }}"
            label = "{{ power_night_delta_chart.label|safe }}"
            break;
        default:
            alert("get_rawdata - kind : " + kind);
            break;
    }

    var data_array = [];
    for (let i = 0; i < labels.length; i++) {
        let b = { x: labels[i], y: values[i] };
        data_array.push(b);
    }
    return { values, values_unit, labels, title, chart_type, unit, label, data_array, ids }
}

// chart config for frigo_normal_smart ==============================

function get_data_frigo_normal_smart(data_normal, data_smart) {
    var data_frigo_normal_smart = {
        datasets: [
            {
                label: "Normal",
                data: data_normal,
                fill: false,
                borderColor: 'red'
            },
            {
                label: "Smart2",
                data: data_smart,
                fill: false,
                borderColor: 'blue'
            }
        ]
    };
    // console.log(data3);
    return data_frigo_normal_smart;

}

function options_frigo_normal_smart(title) {
    return options_frigo_normal_smart = {
        scales: scales1,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                // reverse: true
            },
            title: {
<<<<<<< HEAD
                text: title,
=======
                text: "Frigo 1h normal vs. smart2",
>>>>>>> bce80b72223a99939c6019e88b0b9298e460425d
                display: true
            }
        }
    };
}

// chart config for pool_ph_cl ==============================

function get_data_pool_ph_cl(data_pool_ph, data_pool_cl) {
    var data_pool_ph_cl = {
        datasets: [
            {
                label: "pH",
                data: data_pool_ph,
                fill: false,
                borderColor: 'red'
            },
            {
                label: "Cl",
                data: data_pool_cl,
                fill: false,
                borderColor: 'blue'
            }
        ]
    };
    // console.log(data3);
    return data_pool_ph_cl;

}

function options_pool_ph_cl(title) {
    return options_pool_ph_cl = {
        scales: scales1,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                // reverse: true
            },
            title: {
                text: title,
                display: true
            },
            zoom: zoom_plugin()
        }



    };
}


// frigo_normal_smart ===============================================

var raw_data, values, values_unit, labels, title, chart_type, unit, label, data_normal, data_smart, data_array, ids;

raw_data = get_rawdata("normal_1h");
values = raw_data.values;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_normal = raw_data.data_array;

raw_data = get_rawdata("smart_1h");
data_smart = raw_data.data_array;

var data_frigo_normal_smart = get_data_frigo_normal_smart(data_normal, data_smart);

var config_frigo_normal_smart = {
    type: 'line',
    data: data_frigo_normal_smart,
    options: options_frigo_normal_smart("Frigo Normal vs. Smart"),
    plugins: [horizontalArbitraryLinePlugin]
};

new Chart(
    document.getElementById('canvas_frigo_with_smart'),
    config_frigo_normal_smart
);

// // frigo_10h ===============================================

// raw_data = get_rawdata("10h");

// values = raw_data.values;
// values_unit = raw_data.values_unit;
// labels = raw_data.labels;
// title = raw_data.title;
// chart_type = raw_data.chart_type;
// unit = raw_data.unit;
// label = raw_data.label;
// data_array = raw_data.data_array;

// var config = myConfig2(title, values, values_unit, labels, chart_type, unit, label);

// var ctx = document.getElementById("canvas_frigo_10h").getContext("2d");
// var lineChart_frigo_10h = new Chart(ctx, config);

// // allows to swipe up and down on smartPhone/touchScreen
// lineChart_frigo_10h.canvas.style.touchAction = "pan-y";

// frigo_24h ========================================================

raw_data = get_rawdata("24h");

values = raw_data.values;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2(title, values, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_frigo_24h").getContext("2d");
var lineChart_frigo_24h = new Chart(ctx, config);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_frigo_24h.canvas.style.touchAction = "pan-y";


// pool_ph ========================================================

raw_data = get_rawdata("pool_ph");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_pool_ph").getContext("2d");
var lineChart_pool_ph = new Chart(ctx, config);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_pool_ph.canvas.style.touchAction = "pan-y";

var canvas_pool_ph = document.getElementById("canvas_pool_ph");
enable_deletion(canvas_pool_ph, lineChart_pool_ph);

// pool_cl ========================================================

raw_data = get_rawdata("pool_cl");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_pool_cl").getContext("2d");
var lineChart_pool_cl = new Chart(ctx, config);

// allows to swipe up and down on smartclone/touchScreen
lineChart_pool_cl.canvas.style.touchAction = "pan-y";

var canvas_pool_cl = document.getElementById("canvas_pool_cl");
enable_deletion(canvas_pool_cl, lineChart_pool_cl);

// pool_ph_cl ========================================================

raw_data = get_rawdata("pool_ph");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
var data_array_pool_ph = raw_data.data_array;

for (let i = 0; i < data_array_pool_ph.length; i++) {
    data_array_pool_ph[i].y *= 100;
}


raw_data = get_rawdata("pool_cl");
var data_array_pool_cl = raw_data.data_array;

var data_pool_ph_cl = get_data_pool_ph_cl(data_array_pool_ph, data_array_pool_cl);

var config_pool_ph_cl = {
    type: 'line',
    data: data_pool_ph_cl,
    options: options_pool_ph_cl("Pool pH/Cl"),
    // plugins: [horizontalArbitraryLinePlugin]
};

var ctx = document.getElementById("canvas_pool_ph_cl").getContext("2d");
var lineChart_pool_ph_cl = new Chart(ctx, config_pool_ph_cl);

// allows to swipe up and down on smartclone/touchScreen
lineChart_pool_ph_cl.canvas.style.touchAction = "pan-y";

var canvas_pool_ph_cl = document.getElementById("canvas_pool_ph_cl");
enable_deletion(canvas_pool_ph_cl, lineChart_pool_ph_cl);


// power_day ========================================================

raw_data = get_rawdata("power_day");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_power_day").getContext("2d");
var lineChart_power_day = new Chart(ctx, config);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_power_day.canvas.style.touchAction = "pan-y";

var canvas_power_day = document.getElementById("canvas_power_day");
enable_deletion(canvas_power_day, lineChart_power_day);

// // power_day_delta ========================================================

raw_data = get_rawdata("power_day_delta");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_power_day_delta").getContext("2d");
var lineChart_power_day_delta = new Chart(ctx, config);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_power_day_delta.canvas.style.touchAction = "pan-y";

var canvas_power_day_delta = document.getElementById("canvas_power_day_delta");
enable_deletion(canvas_power_day_delta, lineChart_power_day_delta);


// power_night ========================================================

raw_data = get_rawdata("power_night");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_power_night").getContext("2d");
var lineChart_power_night = new Chart(ctx, config);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_power_night.canvas.style.touchAction = "pan-y";

var canvas_power_night = document.getElementById("canvas_power_night");
enable_deletion(canvas_power_night, lineChart_power_night);


// power_night_delta =====================================================

raw_data = get_rawdata("power_night_delta");

values = raw_data.values;
ids = raw_data.ids;
values_unit = raw_data.values_unit;
labels = raw_data.labels;
title = raw_data.title;
chart_type = raw_data.chart_type;
unit = raw_data.unit;
label = raw_data.label;
data_array = raw_data.data_array;

var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_power_night_delta").getContext("2d");
var lineChart_power_night_delta = new Chart(ctx, config);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_power_night_delta.canvas.style.touchAction = "pan-y";

var canvas_power_night_delta = document.getElementById("canvas_power_night_delta");
enable_deletion(canvas_power_night_delta, lineChart_power_night_delta);


// ps4 =====================================================

values = JSON.parse('{{ ps4_chart.values | tojson }}');
labels = JSON.parse('{{ ps4_chart.labels | tojson }}');
// values = {{ ps4_chart.values | safe }}
// labels = {{ ps4_chart.labels | safe }}
values_unit = "{{ ps4_chart.values_unit|safe }}"
title = "{{ ps4_chart.title|safe }}"
chart_type = "{{ ps4_chart.chart_type|safe }}"
unit = "{{ ps4_chart.unit|safe }}"
label = "{{ ps4_chart.label|safe }}"

var config = myConfig2(title, values, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_ps4").getContext("2d");
var lineChart = new Chart(ctx, config);

// ps4_2 =====================================================

title = "{{ ps4_chart.title|safe }}"
values = JSON.parse('{{ ps4_2_chart.values | tojson }}');
labels = JSON.parse('{{ ps4_2_chart.labels | tojson }}');
// values = {{ ps4_2_chart.values | safe }}
// labels = {{ ps4_2_chart.labels | safe }}
values_unit = "{{ ps4_2_chart.values_unit|safe }}"
chart_type = "{{ ps4_2_chart.chart_type|safe }}"
unit = "{{ ps4_chart.unit|safe }}"
label = "{{ ps4_chart.label|safe }}"

var config = myConfig2(title, values, values_unit, labels, chart_type, unit, label);

var ctx = document.getElementById("canvas_ps4_2").getContext("2d");
var lineChart = new Chart(ctx, config);


// canvas_bar =====================================================

var config_canvas_bar = {
    type: 'bar',
    data: barChartData,
    options: {
        elements: {
            rectangle: {
                borderWidth: 2,
                borderColor: 'rgb(0, 255, 0)',
                borderSkipped: 'bottom'
            }
        },
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart'
        },
        scales: {
            xAxes: {
                // grid: {
                //     color: (context) => {
                //         console.log("context.tick : %o",context);
                //         // if (context.tick.value === 12) {
                //         //     return 'rgba(75,192,192,1)';
                //         // } else {
                //         //     return 'rgba(0,0,0,0.1)';
                //         // }
                //     }
                // },
                type: 'time',
                offset: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Year-Month'
                },
                time: {
                    // min: '2014-12-01' ,
                    // max: '2015-12-01',
                    unit: 'month',
                    displayFormats: {
                        month: "MMM yy"
                    }
                },
                gridLines: {
                    offsetGridLines: false,
                    drawTicks: true,
                    display: true
                },
                stacked: true
            },
            yAxes: {
                ticks: {
                    beginAtZero: true
                },
                stacked: true
            }
        }
    }
};

var barChartData = {
    labels: ["2015-01-01", "2015-02-01", "2015-03-01", "2015-04-01", "2015-05-01", "2015-07-01"],
    datasets: [{/*from  w w w  . de mo 2 s . com*/
        categoryPercentage: .5,
        barPercentage: 1,
        label: 'Dataset 1',
        backgroundColor: "rgba(220,220,220,0.5)",
        data: [10, 4, 5, 7, 2, 3]
    }]
};
var ctx = document.getElementById("canvas_bar").getContext("2d");
var my_bar_chart = new Chart(ctx, config_canvas_bar);

var canvas_bar = document.getElementById("canvas_bar");
canvas_bar.onclick = function (evt) {
    index = 2;
    console.log("my_bar_chart : %o", my_bar_chart);
    console.log("my_bar_chart.data: %o", my_bar_chart.data);
    alert("test");
    console.log("popping index %i", index);
    console.log("popping element with value %i and label %s", my_bar_chart.data.datasets[0].data[index], my_bar_chart.data.datasets[0].label[index]);
    console.log('before : datasets[0].data : %', my_bar_chart.data.datasets[0].data);
    //console.log("popped : %o", my_bar_chart.data.datasets[0].data.pop(index));
    console.log("splicing");
    var spliced = my_bar_chart.data.datasets[0].data.splice(index, 1);
    var spliced = my_bar_chart.data.labels.splice(index, 1);
    console.log("index : %o", index);

    // datasets[0].data.pop(index);
    console.log('after : datasets[0].data : %', my_bar_chart.data.datasets[0].data);
    my_bar_chart.update();
    console.log("chart updated ?");
};

// canvas_bar =====================================================

title = "{{ ps4_2_datasets_chart.title|safe }}"
values1 = JSON.parse('{{ ps4_2_datasets_chart.values1 | tojson }}');
labels1 = JSON.parse('{{ ps4_2_datasets_chart.labels1 | tojson }}');
// labels1 = {{ ps4_2_datasets_chart.labels1 | safe }}
// values1 = {{ ps4_2_datasets_chart.values1 | safe }}
chart_type1 = "{{ ps4_2_datasets_chart.chart_type1|safe }}"

values2 = JSON.parse('{{ ps4_2_datasets_chart.values2 | tojson }}');
labels2 = JSON.parse('{{ ps4_2_datasets_chart.labels2 | tojson }}');
// labels2 = {{ ps4_2_datasets_chart.labels2 | safe }}
// values2 = {{ ps4_2_datasets_chart.values2 | safe }}
chart_type2 = "{{ ps4_2_datasets_chart.chart_type2|safe }}"

unit = "{{ ps4_2_datasets_chart.unit|safe }}"

var config = myConfig_2_datasets(
    title,
    labels1, values1, chart_type1,
    labels2, values2, chart_type2,
    unit);
//console.log(config);

var ctx = document.getElementById("canvas_ps4_2_datasets").getContext("2d");
var lineChart = new Chart(ctx, config);


// canvas_bar2 - stocks =====================================================

const dailyStock = [
    { x: "2017-07-25", y: 1 },
    { x: "2017-08-25", y: 3 },
    { x: "2017-09-10", y: 7 },
    { x: "2017-09-28", y: 0 },
    { x: "2017-10-02", y: 3 },
    { x: "2017-10-24", y: 2 },
    { x: "2017-12-01", y: 1 },
    { x: "2017-12-30", y: 0 },
];

const monthlyTotal = [
    { x: "2017-08-01", y: 1 },
    { x: "2017-09-01", y: 10 },
    { x: "2017-10-01", y: 5 },
    { x: "2017-12-01", y: 6 },
];

var config_canvas_bar2 = {
    type: "bar",
    data: {
        //labels: ["2017-08", "2017-09", "2017-10", "2017-11", "2017-12"],
        datasets: [
            {
                barPercentage: .7,
                // xAxisID: "bar",
                // label: "sales",
                data: monthlyTotal,
                // backgroundColor: "green",
                // borderColor: "black",
                // borderWidth: 1,
                // width: 55,
                // order: 2,
            },
            {
                label: "stock",
                type: "line",
                data: dailyStock,
                backgroundColor: "orange",
                borderColor: "orange",
                fill: false,
                order: 1,
            },
        ],
    },
    options: {
        scales: {
            xAxes: {
                grid: {
                    color: (context) => {
                        // console.log("context.tick : %o",context);
                        // if (context.tick.value === 12) {
                        //     return 'rgba(75,192,192,1)';
                        // } else {
                        //     return 'rgba(0,0,0,0.1)';
                        //      return 'green';
                        // }
                    }
                },
                // gridLines: {
                //     // offsetGridLines: false,
                //     drawTicks: true,
                //     display: true
                // },

                // id: "line",
                type: "time",
                // time: {
                //     unit: "month",
                //     displayFormats: {
                //         month: "MMM",
                //     },
                // },
                // distribution: "linear",
            },
            // {
            //     id: "bar",
            //     offset: true,
            //     type: "category",
            //     distribution: "series",
            // }
            yAxes: {
                ticks: {
                    beginAtZero: true,
                },
            },
        },
        plugins: {
            zoom: zoom_plugin
        }
    },
};

var ctx = document.getElementById("canvas_bar2").getContext("2d");
var myChart = new Chart(ctx, config_canvas_bar2);

// allows to swipe up and down on smartPhone/touchScreen
lineChart_frigo_10h.canvas.style.touchAction = "pan-y";


// dailyStock2 =====================================================

const dailyStock2 = [
    { x: "2017-08-02 10:00", y: 1 },
    { x: "2017-08-02 11:00", y: 3 },
    { x: "2017-08-02 15:00", y: 7 },
    { x: "2017-08-03 09:00", y: 0 },
    { x: "2017-08-03 10:00", y: 3 },
    { x: "2017-08-03 10:30", y: 2 },
    { x: "2017-08-04 10:45", y: 1 },
    { x: "2017-08-10 17:00", y: 0 },
];

const monthlyTotal2 = [
    { x: "2017-08-02", y: 1 },
    { x: "2017-08-03", y: 10 },
    { x: "2017-08-04", y: 5 },
    { x: "2017-08-10", y: 5 },
];

var ctx2 = document.getElementById("canvas_bar3").getContext("2d");
var myChart2 = new Chart(ctx2, {
    type: "bar",
    data: {
        labels: ["2017-08-02", "2017-08-03", "2017-08-04", "2017-08-10"],
        datasets: [
            {
                barPercentage: .7,
                xAxisID: "bar",
                label: "sales",
                data: monthlyTotal2,
                backgroundColor: "green",
                borderColor: "black",
                borderWidth: 1,
                width: 55,
                order: 2,
            },
            {
                label: "stock",
                type: "line",
                data: dailyStock2,
                backgroundColor: "orange",
                borderColor: "orange",
                fill: false,
                order: 1,
            },
        ],
    },
    options: {
        scales: {
            xAxes: {
                id: "line",
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        month: "DD",
                    },
                },
                distribution: "linear",
            },
            // {
            //     id: "bar",
            //     offset: true,
            //     type: "category",
            //     distribution: "series",
            // }
            yAxes:
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    },
});
