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
            console.log('datasets: %o', datasets);

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


// function myConfig(labels, values, chart_type, unit, values_unit, date_last_data) {
//     // var timeFormat = 'yyyy/MM/dd H:mm:ss';
//     var timeFormat = 'yyyy/MM/dd';

//     var a = [];
//     for (let i = 0; i < labels.length; i++) {
//         let b = { x: labels[i], y: values[i] };
//         a.push(b);
//     }
//     var data_array_1a = a;


//     var options1 = {
//         responsive: true,
//         scales: get_scales1(unit, values_unit, date_last_data),
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'top',
//                 align: 'center',
//                 // reverse: true
//             },
//             title: {
//                 text: "Chart.js Time Scale",
//                 display: true
//             }
//         }

//     };
//     var config1 = {
//         //type: "line",
//         //type: "bar",
//         type: chart_type,
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: "temperature2",
//                     data: data_array_1a,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     lineTension: 0.1
//                 }
//             ]
//         },
//         options: options1
//     };
//     return config1;
// }

// function myConfig2(raw_data) {
//     var raw_data, values, values_unit, labels, title, chart_type, unit, label, date_last_data;

//     values = raw_data.values;
//     // ids = raw_data.ids;
//     values_unit = raw_data.values_unit;
//     labels = raw_data.labels;
//     title = raw_data.title;
//     chart_type = raw_data.chart_type;
//     unit = raw_data.unit;
//     label = raw_data.label;

//     // var timeFormat = 'yyyy/MM/dd H:mm:ss';
//     var timeFormat = 'yyyy/MM/dd';
//     // var timeFormat = 'H:mm';
//     var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

//     var a = [];
//     for (let i = 0; i < labels.length; i++) {
//         let b = { x: labels[i], y: values[i] };
//         a.push(b);
//     }
//     var data_array_1a = a;

//     var options1 = {
//         responsive: true,
//         scales: get_scales1(unit, values_unit, date_last_data),
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'top',
//                 align: 'center',
//                 // reverse: true
//             },
//             title: {
//                 text: title + " (" + date_last_data + ")",
//                 display: true
//             },
//             zoom: zoom_plugin()
//         }
//     };
//     var config1 = {
//         //type: "line",
//         //type: "bar",
//         type: chart_type,
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: label,
//                     data: data_array_1a,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     lineTension: 0.1
//                 }
//             ]
//         },
//         options: options1
//     };
//     return config1;
// }


function myConfig_1_dataset(raw_data, nb_mins) {

    var config = {
        type: 'line',
        data: get_data_1_dataset(raw_data, nb_mins),
        options: options_1_dataset(raw_data),
    };
    return config;
}


function myConfig(raw_data, nb_mins) {

    var raw_data, values, values_unit, labels, title, chart_type, unit, label, data_normal,
        data_smart, data_array, ids, date_last_data;

    values = raw_data.values;
    ids = raw_data.ids;
    values_unit = raw_data.values_unit;
    labels = raw_data.labels;
    title = raw_data.title;
    chart_type = raw_data.chart_type;
    unit = raw_data.unit;
    label = raw_data.label;


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

    if (data_array_1a.length > 0) {
        date_last_data = data_array_1a[data_array_1a.length - 1].x;
    } else {
        date_last_data = "1900-01-01";
    }

    var a = [];
    var b = [];
    for (let i = 0; i < labels.length; i++) {
        b = { x: labels[i], y: ids[i] };
        a.push(b);
    }
    var data_array_2a = a;

    // var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    var options1 = {
        // responsive: true,
        scales: get_scales1(unit, values_unit, date_last_data),
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                // reverse: true
            },
            title: {
                text: title + " (" + date_last_data + ")",
                display: true
            },
            zoom: zoom_plugin()
        }
    };
    var config1 = {
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


    if (is_older_than_mins(date_last_data, nb_mins)) {
        config1.data.datasets[0].borderColor = 'red';

    }

    // config1.options.scales.x.min="2022-05-26 22:00:00";

    return config1;
}



// function myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label, date_last_data) {

//     // var timeFormat = 'yyyy/MM/dd H:mm:ss';
//     var timeFormat = 'yyyy/MM/dd';
//     // var timeFormat = 'H:mm';
//     var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

//     var a = [];
//     var b = [];
//     for (let i = 0; i < labels.length; i++) {
//         b = { x: labels[i], y: values[i] };
//         a.push(b);
//     }
//     var data_array_1a = a;

//     var a = [];
//     var b = [];
//     for (let i = 0; i < labels.length; i++) {
//         b = { x: labels[i], y: ids[i] };
//         a.push(b);
//     }
//     var data_array_2a = a;

//     // var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

//     var options1 = {
//         // responsive: true,
//         scales: get_scales1(unit, values_unit, date_last_data),
//         plugins: {
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'top',
//                     align: 'center',
//                     // reverse: true
//                 },
//                 title: {
//                     text: title + " (" + date_last_data + ")",
//                     display: true
//                 }
//             },
//             zoom: zoom_plugin()
//         }
//     };
//     var config1 = {
//         type: chart_type,
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: label,
//                     data: data_array_1a,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     lineTension: 0.1
//                 },
//                 {
//                     label: label,
//                     data: data_array_2a,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     hidden: true
//                 }
//             ]
//         },
//         options: options1
//     };
//     return config1;
// }

// function myConfig3_with_ids(raw_data, nb_mins) {

//     var raw_data, values, values_unit, labels, title, chart_type, unit, label, data_normal, 
//     data_smart, data_array, ids, date_last_data;


//     values = raw_data.values;
//     ids = raw_data.ids;
//     values_unit = raw_data.values_unit;
//     labels = raw_data.labels;
//     title = raw_data.title;
//     chart_type = raw_data.chart_type;
//     unit = raw_data.unit;
//     label = raw_data.label;
//     data_array = raw_data.data_array;
//     date_last_data = data_array[data_array.length-1].x;
    

//     // var timeFormat = 'yyyy/MM/dd H:mm:ss';
//     var timeFormat = 'yyyy/MM/dd';
//     // var timeFormat = 'H:mm';
//     var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

//     var a = [];
//     var b = [];
//     for (let i = 0; i < labels.length; i++) {
//         b = { x: labels[i], y: values[i] };
//         a.push(b);
//     }
//     var data_array_1a = a;

//     var a = [];
//     var b = [];
//     for (let i = 0; i < labels.length; i++) {
//         b = { x: labels[i], y: ids[i] };
//         a.push(b);
//     }
//     var data_array_2a = a;

//     // var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

//     var options1 = {
//         // responsive: true,
//         scales: get_scales1(unit, values_unit, date_last_data),
//         plugins: {
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'top',
//                     align: 'center',
//                     // reverse: true
//                 },
//                 title: {
//                     text: title + " (" + date_last_data + ")",
//                     display: true
//                 }
//             },
//             zoom: zoom_plugin()
//         }
//     };
//     var config1 = {
//         type: chart_type,
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: label,
//                     data: data_array_1a,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     lineTension: 0.1
//                 },
//                 {
//                     label: label,
//                     data: data_array_2a,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     hidden: true
//                 }
//             ]
//         },
//         options: options1
//     };


//     if (is_older_than_mins(date_last_data, 30)) {
//         config1.data.datasets[0].borderColor = 'red';
//     }
    

//     return config1;
// }



// function myConfig_2_datasets(
//     title,
//     labels1, values1, chart_type1,
//     labels2, values2, chart_type2,
//     unit) {
//     // var timeFormat = 'yyyy/MM/dd H:mm:ss';
//     var timeFormat = 'yyyy/MM/dd';

//     var data1 = [];
//     for (let i = 0; i < labels1.length; i++) {
//         let b = { x: labels1[i], y: values1[i] };
//         data1.push(b);
//     }

//     var data2 = [];
//     for (let i = 0; i < labels2.length; i++) {
//         let b = { x: labels2[i], y: values2[i] };
//         data2.push(b);
//     }

//     var xA = {
//         id: "bubble",
//         type: "time",
//         time: {
//             unit: unit,
//             // format: timeFormat,
//             displayFormats: {
//                 day: "DD"
//             },
//             parser: 'yyyy-MM-dd H:m:s'
//         },
//         offset: true,
//         type: "category",
//         distribution: "series",

//         // gridLines: {
//         //     offsetGridLines: false,
//         //     drawTicks: true,
//         //     display: true
//         // },
//         //stacked: true
//     };
//     // {
//     //     id: "bar",
//     //     offset: true,
//     //     type: "time",
//     //     type: "category",
//     //     distribution: "series",
//     // }


//     var yA = {
//         ticks: {
//             beginAtZero: true,
//         },
//         title: {
//             display: true,
//             text: 'value'
//         }
//     };
//     // {
//     //     id: 'ps4_5min',
//     //     title: {
//     //         display: true,
//     //         text: 'value'
//     //     }
//     // }

//     var scales1 = {
//         x: xA,
//         y: yA
//     };

//     var options = {
//         scales: scales1,
//     };

//     var config = {
//         type: "bar",
//         data: {
//             labels: labels2,
//             datasets: [
//                 {
//                     barPercentage: .7,
//                     //     // categoryPercentage: .5,
//                     //     //type: chart_type2,
//                     xAxisID: "bar",
//                     yAxisID: 'ps4_5min',
//                     label: "ps4 x5min",
//                     data: data2,
//                     backgroundColor: "green",
//                     borderColor: "black",
//                     borderWidth: 1,
//                     width: 55,
//                     order: 2
//                     //     // fill: false
//                     //     //lineTension: 0.1
//                 },
//                 {
//                     label: "ps4 up/down",
//                     type: chart_type1,
//                     data: data1,
//                     xAxisID: "bubble",
//                     backgroundColor: "orange",
//                     borderColor: "orange",
//                     fill: false,
//                     //lineTension: 0.1,
//                     order: 1,
//                 }
//             ]
//         },
//         options: options,
//     };
//     // console.log(config);
//     return config;
// }

// function myConfig_2_datasets2(
//     title,
//     labels1, values1, chart_type1,
//     labels2, values2, chart_type2,
//     unit) {
//     var timeFormat = 'yyyy/MM/dd';

//     var data1 = [];
//     for (let i = 0; i < labels1.length; i++) {
//         let b = { x: labels1[i], y: values1[i] };
//         data1.push(b);
//     }

//     var data2 = [];
//     // for (i = 0; i < labels2.length; i++) {
//     //     b = { x: labels2[i], y: values2[i] };
//     //     data2.push(b);
//     // }

//     var xA = {
//         id: "xAxis_ID1",
//         type: "time",
//         time: {
//             unit: unit,
//             // format: timeFormat,
//             displayFormats: {
//                 day: "DD"
//             },
//             parser: 'yyyy-MM-dd H:m:s'
//         },
//         offset: true,
//         type: "category",
//         distribution: "series",

//         // gridLines: {
//         //     offsetGridLines: false,
//         //     drawTicks: true,
//         //     display: true
//         // },
//         //stacked: true
//     };
//     // ,
//     // {
//     //     id: "night_ID",
//     //     offset: true,
//     //     type: "time",
//     //     type: "category",
//     //     distribution: "series",
//     // }

//     var yA = {
//         ticks: {
//             beginAtZero: true,
//         },
//         title: {
//             display: true,
//             text: 'Y1'
//         }
//     };
//     var scales1 = {
//         x: xA,
//         y: yA
//     };

//     var options = {
//         scales: scales1,
//         responsive: true,
//         // elements: {
//         //     rectangle: {
//         //         borderWidth: 2,
//         //         borderColor: 'rgb(0, 255, 0)',
//         //         borderSkipped: 'bottom'
//         //     }
//         // }
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'top',
//                 align: 'center',
//                 // reverse: true
//             },
//             title: {
//                 text: title,
//                 display: true
//             }
//         }

//     };
//     //console.log(options);
//     var config = {
//         type: "line",
//         data: {
//             labels: labels2,
//             datasets: [
//                 {
//                     label: "Delta Day",
//                     // barPercentage: .7,
//                     //     // categoryPercentage: .5,
//                     //     //type: chart_type2,
//                     // xAxisID: "xAxis_ID",
//                     // yAxisID: 'yAxis_ID',
//                     // label: "my label",
//                     // backgroundColor: "green",
//                     borderColor: "green",
//                     // borderWidth: 1,
//                     // // width: 55,
//                     order: 1,
//                     //     // fill: false,
//                     //     //lineTension: 0.1,
//                     data: data1
//                 },
//                 {
//                     label: "Delta Night",
//                     // type: "line",
//                     // xAxisID: "xAxis_ID2",
//                     borderColor: "orange",
//                     // backgroundColor: "orange",
//                     // borderColor: "orange",
//                     // // fill: false,
//                     // //lineTension: 0.1,
//                     order: 2,
//                     data: data2
//                 }
//             ]
//         },
//         options: options,
//     };
//     // console.log(config);
//     return config;
// }


// get_scales1 ==================================================

function get_scales1(unit, values_unit, date_last_data) {
    var timeFormat = 'yyyy-MM-dd hh:mm:ss';
    var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    var datetime2 = "LastSync: " + date_last_data;

    var scales1 = {
        x: {
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
            title: {
                display: true,
                text: datetime2
            }
        },
        y: {
            title: {
                display: true,
                text: values_unit
            }
        }
    };
    return scales1;
}

// function get_scales_1_dataset(unit, values_unit, date_last_data) {
function get_scales_1_dataset(raw_data) {
    var timeFormat = 'yyyy-MM-dd hh:mm:ss';
    var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    var datetime2 = "LastSync: " + raw_data.date_last_data;

    var scales = {
        x: {
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
                unit: raw_data.unit,
                // unit: 'day',
                // displayFormats: {
                //     month: "MMM yy"
                // }

                parser: 'yyyy-MM-dd H:m:s'
            },
            title: {
                display: true,
                text: datetime2
            }
        },
        y: {
            display: true,
            text: raw_data.values_unit,
            position: 'left'
        }
    };
    return scales;
}

// function get_scales_2_datasets(unit, values_unit, date_last_data) {
function get_scales_2_datasets(raw_data1, raw_data2) {
    var timeFormat = 'yyyy-MM-dd hh:mm:ss';
    var nowStr = (new Date()).toLocaleTimeString("fr-BE", { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    var datetime2 = "LastSync: " + raw_data1.date_last_data + " - " + raw_data2.date_last_data;

    var scales1 = {
        x: {
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
                unit: raw_data1.unit,
                parser: 'yyyy-MM-dd H:m:s'
            },
            title: {
                display: true,
                text: datetime2
            }
        },
        y: {
            display: true,
            text: raw_data1.values_unit,
            position: 'left'
        },
        y2: {
            display: true,
            text: raw_data2.values_unit,
            position: 'right'
        }
    };
    return scales1;
}

// horizontalLinePlugin =======================================
const horizontalLinePlugin = {
    id: 'horizontalLinePlugin',
    // afterDraw: function (chartInstance) {
    afterDraw(chartInstance) {
        // alert("test in horizontalLinePlugin");
        const { _, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chartInstance;
        var yScale = chartInstance.scales["y"];
        var canvas = chartInstance.canvas;
        var ctx = chartInstance.ctx;
        var index;
        var line;
        var style;
        var yValue;
        if (chartInstance.options.horizontalLine) {
            for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {

                line = chartInstance.options.horizontalLine[index];
                // console.log("line : %o", line);
                // console.log("line y : %o", line.y);

                yValue = yScale.getPixelForValue(line.y);
                if (!line.style) {
                    style = "rgba(169,169,169, .6)";
                } else {
                    style = line.style;
                }
                ctx.lineWidth = 1;
                if (yValue) {
                    ctx.beginPath();
                    ctx.moveTo(left, yValue);
                    ctx.lineTo(right, yValue);
                    ctx.strokeStyle = style;
                    ctx.stroke();
                }
                if (line.text) {
                    ctx.fillStyle = style;
                    ctx.fillText(line.text, left, yValue - 8);
                }
            }
            return;
        };
    }
};


const verticalLineOnStepPlugin = {

    id: 'verticalLineOnStepPlugin',
    // afterDraw: function (chartInstance) {
    afterDraw(chartInstance) {

        function verticalLine(ctx, xValue, bottom, top) {
            ctx.lineWidth = 2;
            style = "green";
            if (xValue >= left && xValue <= right) {
                ctx.beginPath();
                ctx.moveTo(xValue, bottom);
                ctx.lineTo(xValue, top);
                ctx.strokeStyle = style;
                ctx.stroke();
            }
        };

        // alert("test2 vertical on days");
        var xScale = chartInstance.scales["x"];
        var ctx = chartInstance.ctx;
        var style;
        const { _, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chartInstance;
        // console.log("chartInstance : %o", chartInstance);
        // console.log("xScale: %o", chartInstance.scales["x"]);
        // console.log("len: ", xScale.ticks.length);

        var nb_ticks = xScale.ticks.length;
        // for (var i = 0; i < nb_ticks; i

        // var minLabel = xScale.ticks[0].label;
        // var maxLabel = xScale.ticks[nb_ticks - 1].label;


        var minValue = xScale.ticks[0].value;
        var maxValue = xScale.ticks[nb_ticks - 1].value;

        // javascript Date is expressed in milliseconds since 1970/01/01 GMT)
        // we need to add the GMT offset to get the equivalent milliseconds our time zone
        let now = new Date();
        let GMTdiff = (now.getTimezoneOffset()) * 60 * 1000; // minutes converted to milliseconds


        // var a = new Date(minValue);
        // console.log("before = %o", a);

        minValue -= GMTdiff;
        maxValue -= GMTdiff;

        // var a = new Date(minValue);
        // console.log("after = %o", a);

        var step = (chartInstance.options.verticalLineOnStep_step ? chartInstance.options.verticalLineOnStep_step : 'day');

        // steps in milliseconds
        var steps_mils = { 'day': 1000 * 60 * 60 * 24, '12hours': 1000 * 60 * 60 * 12, 'hour': 1000 * 60 * 60, '15minutes': 1000 * 60 * 15, 'minute': 1000 * 60 }
        var step_mils = steps_mils[step]
        var next_tick;
        next_tick = minValue - step_mils;
        if (next_tick % step_mils != 0) {
            next_tick = (minValue + step_mils) - (minValue + step_mils) % step_mils;
        }
        // console.log("next tick : %o", next_tick);
        for (let i = next_tick; i < maxValue + step_mils; i += step_mils) {
            // console.log("next tick : %o", i);
            verticalLine(ctx, xScale.getPixelForValue(i + GMTdiff), bottom, top);
        }

        // millisecs = new Date("2022-05-20 12:00");
        // var noon = xScale.getPixelForValue(millisecs);
        // console.log("noon : ", noon);                   

        // verticalLine(ctx, noon, bottom, top);
    }
}


function add_plugin(config, plugin, step) {
    if (config.plugins == null) { config.plugins = [] };
    config.plugins.push(plugin);
    if (plugin === verticalLineOnStepPlugin) config.options.verticalLineOnStep_step = step;
}



function get_rawdata(kind) {
    // get_rawdata ===================================================
    // kind can be {"normal_1h", "smart_1h", "10h", "24h", "pool_ph", "pool_cl", "power_day", "power_night"}

    var values, values_unit, labels, title, chart_type, unit, label, ids;
    ids = [];
    switch (kind) {
        case "normal_1h":
            values = JSON.parse('{{ frigo_1h_chart.values | tojson }}');
            //console.log(values);
            ids = JSON.parse('{{ frigo_1h_chart.ids | tojson }}');
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
            ids = JSON.parse('{{ frigo_1h_chart.ids | tojson }}');
            values_unit = "{{ frigo_1h_smart_chart.values_unit|safe }}"
            labels = JSON.parse('{{ frigo_1h_smart_chart.labels | tojson }}');
            title = "{{ frigo_1h_smart_chart.title|safe }}"
            chart_type = "{{ frigo_1h_smart_chart.chart_type|safe }}"
            unit = "{{ frigo_1h_smart_chart.unit|safe }}"
            label = "{{ frigo_1h_smart_chart.label|safe }}"
            break;
        case "24h":
            values = JSON.parse('{{ frigo_24h_chart.values | tojson }}');
            ids = JSON.parse('{{ frigo_24h_chart.ids | tojson }}');
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
            // console.log("labels : %o", labels);
            // console.log("values : %o", values);
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
            ids = [];
            labels = JSON.parse('{{ power_day_delta_chart.labels | tojson }}');
            values_unit = "{{ power_day_delta_chart.values_unit | safe }}"
            title = "{{ power_day_delta_chart.title|safe }}"
            chart_type = "{{ power_day_delta_chart.chart_type|safe }}"
            unit = "{{ power_day_delta_chart.unit|safe }}"
            label = "{{ power_day_delta_chart.label|safe }}"
            break;
        case "power_night_delta":
            values = JSON.parse('{{ power_night_delta_chart.values | tojson }}');
            ids = [];
            labels = JSON.parse('{{ power_night_delta_chart.labels | tojson }}');
            values_unit = "{{ power_night_delta_chart.values_unit | safe }}"
            title = "{{ power_night_delta_chart.title|safe }}"
            chart_type = "{{ power_night_delta_chart.chart_type|safe }}"
            unit = "{{ power_night_delta_chart.unit|safe }}"
            label = "{{ power_night_delta_chart.label|safe }}"
            break;
        case "ps4":
            values = JSON.parse('{{ ps4_chart.values | tojson }}');
            ids = JSON.parse('{{ ps4_chart.ids | tojson }}');
            labels = JSON.parse('{{ ps4_chart.labels | tojson }}');
            values_unit = "{{ ps4_chart.values_unit | safe }}"
            title = "{{ ps4_chart.title|safe }}"
            chart_type = "{{ ps4_chart.chart_type|safe }}"
            unit = "{{ ps4_chart.unit|safe }}"
            label = "{{ ps4_chart.label|safe }}"
            break;
        case "ps4_2":
            values = JSON.parse('{{ ps4_2_chart.values | tojson }}');
            ids = JSON.parse('{{ ps4_2_chart.ids | tojson }}');
            labels = JSON.parse('{{ ps4_2_chart.labels | tojson }}');
            values_unit = "{{ ps4_2_chart.values_unit | safe }}"
            title = "{{ ps4_2_chart.title|safe }}"
            chart_type = "{{ ps4_2_chart.chart_type|safe }}"
            unit = "{{ ps4_2_chart.unit|safe }}"
            label = "{{ ps4_2_chart.label|safe }}"
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

    data_array.sort((a, b) => a.x.localeCompare(b.x));

    if (data_array.length > 0) {
        var date_last_data = data_array[data_array.length - 1].x;
    } else {
        date_last_data = "1900-01-01";
    }

    var ids_array = [];
    for (let i = 0; i < labels.length; i++) {
        let b = { x: labels[i], y: ids[i] };
        ids_array.push(b);
    }

    return { values, values_unit, labels, title, chart_type, unit, label, data_array, ids, ids_array, date_last_data }
}

// chart config for frigo_normal_smart ==============================

// function get_data_frigo_normal_smart(data_normal, data_smart) {
//     var data_frigo_normal_smart = {
//         datasets: [
//             {
//                 label: "Normal",
//                 data: data_normal,
//                 fill: false,
//                 borderColor: 'green'
//             },
//             {
//                 label: "Smart2",
//                 data: data_smart,
//                 fill: false,
//                 borderColor: 'blue'
//             }
//         ]
//     };
//     // console.log(data3);
//     return data_frigo_normal_smart;
// }

function get_data_1_dataset(raw_data, nb_mins) {
    var data = {
        datasets: [
            {
                label: raw_data.label,
                data: raw_data.data_array,
                fill: false,
                borderColor: 'green',
                yAxisID: 'y'

            }
        ]
    };
    // console.log(data3);

    if (is_older_than_mins(raw_data.date_last_data, nb_mins)) {
        data.datasets[0].borderColor = 'red';
    }

    return data;
}

function get_data_1_dataset_with_ids(raw_data, nb_mins) {
    var data = {
        datasets: [
            {
                label: raw_data.label,
                data: raw_data.data_array,
                fill: false,
                borderColor: 'green',
                yAxisID: 'y'

            },
            {
                label: raw_data.label,
                data: raw_data.ids_array,
                fill: false,
                borderColor: 'green',
                yAxisID: 'y',
                hidden: true

            }
        ]
    };
    // console.log(data3);

    if (is_older_than_mins(raw_data.date_last_data, nb_mins)) {
        data.datasets[0].borderColor = 'red';
    }

    return data;
}

function get_data_2_datasets(raw_data1, raw_data2, nb_mins) {
    var data = {
        datasets: [
            {
                label: raw_data1.label,
                data: raw_data1.data_array,
                fill: false,
                borderColor: 'green',
                yAxisID: 'y'

            },
            {
                label: raw_data2.label,
                data: raw_data2.data_array,
                fill: false,
                borderColor: 'blue',
                yAxisID: 'y2'

            }
        ]
    };

    if (is_older_than_mins(raw_data1.date_last_data, nb_mins)) {
        data.datasets[0].borderColor = 'red';
    }

    if (is_older_than_mins(raw_data2.date_last_data, nb_mins)) {
        data.datasets[1].borderColor = 'red';
    }


    return data;
}

function get_data_smart(raw_data1) {
    var data = {
        datasets: [
            {
                label: raw_data1.label,
                data: raw_data1.data_array,
                fill: false,
                borderColor: 'green'
            }
        ]
    };
    // console.log(data3);
    return data;
}

function options_frigo_normal_smart(title, unit, values_unit, date_last_data) {
    return options_frigo_normal_smart = {
        // scales: get_scales1(unit, values_unit, date_last_data),
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                // reverse: true
            },
            title: {
                text: title,
                display: true
            }
        }
    };
}

function options_1_dataset(raw_data) {
    var options = {
        // scales: get_scales_2_datasets(raw_data1.unit, raw_data1.values_unit, raw_data1.date_last_data),
        scales: get_scales_1_dataset(raw_data),
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                // reverse: true
            },
            title: {
                text: raw_data.title,
                display: true
            },
            zoom: zoom_plugin()


        }
    };
    return options;
}

function options_2_datasets(title, raw_data1, raw_data2) {
    var options = {
        // scales: get_scales_2_datasets(raw_data1.unit, raw_data1.values_unit, raw_data1.date_last_data),
        scales: get_scales_2_datasets(raw_data1, raw_data2),
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                // reverse: true
            },
            title: {
                text: title,
                display: true
            }
        }
    };
    return options;
}

function options_smart(title, raw_data1) {
    var options = {
        scales: get_scales1(raw_data1.unit, raw_data1.values_unit, raw_data1.date_last_data),
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                // reverse: true
            },
            title: {
                text: title,
                display: true
            }
        }
    };
    return options;
}

// chart config for pool_ph_cl ==============================

function get_data_pool_ph_cl(data_pool_ph, data_pool_cl) {
    var data_pool_ph_cl = {
        datasets: [
            {
                label: "pH",
                data: data_pool_ph,
                fill: false,
                borderColor: 'green'
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


function options_pool_ph_cl(title, unit, values_unit, date_last_data) {
    return options_pool_ph_cl = {
        scales: get_scales1(unit, values_unit, date_last_data),
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
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


// returns true if date_str is older than mins minutes ago
function is_older_than_mins(date_str, mins) {
    var now = new Date();
    // console.log("now: %s",now.toString());


    // this trick is necessary because Safari doesn't recognise format "YYYY-MM-DD hh:mm:ss" and recognises "YYYY-MM-DDThh:mm:ss" instead
    var date_dt = new Date(date_str.replace(/\s/, 'T'));
    // console.log("date_last: %s",date_last_data_dt.toString());

    // difference in milliseconds between now and the given date
    var diffInSecs = (now - date_dt) / 1000;
    // console.log("diff : %o",diffInSecs);
    // alert(date_dt.toString());

    // alert("now:"+now.toString()+" date_dt: " + date_dt.toString() + "  diffInSecs: "+ diffInSecs.toString() + "  typeof:" + typeof(diffInSecs));

    // var last_date_should_be_at_least = now - 60*30;
    // console.log("date_last_at_least: %s",last_date_should_be_at_least.toString());

    // console.log("diff in mins : %d", diffInSecs/60)
    // console.log("diff in secs : %d", diffInSecs)

    // return true if delta in ms is bigger than the nb of milliseconds
    return (diffInSecs > 60 * mins);
}


function myConfig_2_datasets(title, raw_data1, raw_data2) {
    var options = options_2_datasets(title, raw_data1, raw_data2);
    var config = {
        type: 'line',
        data: get_data_2_datasets(raw_data1, raw_data2),
        options: options,
        // plugins: [horizontalgArbitraryLinePlugin]
    };
    return config;
}


function myConfig_smart(title, raw_data1) {
    var options = options_smart(title, raw_data1);
    var config = {
        type: 'line',
        data: get_data_smart(raw_data1),
        options: options,
        // plugins: [horizontalArbitraryLinePlugin]
    };
    console.log("options : %o", options);
    return config;
}


function frigo_smart() {
    var raw_data_smart_1h = get_rawdata("smart_1h");

    var config_frigo_smart = myConfig_smart("Frigo Smart", raw_data_smart_1h);

    var ctx = document.getElementById("canvas_frigo_smart").getContext("2d");
    var lineChart_frigo_smart = new Chart(ctx, config_frigo_smart);

    // // allows to swipe up and down on smartclone/touchScreen
    // lineChart_frigo_normal_smart.canvas.style.touchAction = "pan-y";

}

function options_horizontalLine(y_list) {

    var extended_options = []
    for (let i in y_list) {
        extended_options.push({
            "y": y_list[i].y,
            "style": "green",
            // "style": "rgba(255, 0, 0, .4)",
            "text": y_list[i].text
        });
    }
    return extended_options;
}


function frigo_normal_smart() {
    var raw_data1 = get_rawdata("normal_1h");
    var raw_data2 = get_rawdata("smart_1h");
    var title = "Frigo Normal vs. Smart";

    var config = {
        type: 'line',
        data: get_data_2_datasets(raw_data1, raw_data2),
        options: options_2_datasets(title, raw_data1, raw_data2),
    };

    config.options.horizontalLine = options_horizontalLine([{ y: 1.5, text: "min" }, { y: 3, text: "max" }]);
    add_plugin(config, horizontalLinePlugin);

    add_plugin(config, verticalLineOnStepPlugin, '15minutes');

    var ctx = document.getElementById("canvas_frigo_with_smart").getContext("2d");
    var myChart = new Chart(ctx, config);

    // // allows to swipe up and down on smartclone/touchScreen
    // myChart.canvas.style.touchAction = "pan-y";

    myChart.options.scales.x.min = '2022-06-05';
    // myChart.options.scales.x.max = '2022-06-04 22:20';
    myChart.update();
}

function frigo_24h() {
    var raw_data = get_rawdata("24h");

    var config = myConfig(raw_data, 10);

    var ctx = document.getElementById("canvas_frigo_24h").getContext("2d");
    var lineChart_frigo_24h = new Chart(ctx, config);

    // allows to swipe up and down on smartPhone/touchScreen
    lineChart_frigo_24h.canvas.style.touchAction = "pan-y";

    var canvas_frigo_24h = document.getElementById("canvas_frigo_24h");
    enable_deletion(canvas_frigo_24h, lineChart_frigo_24h);
}

function pool_ph() {
    var raw_data = get_rawdata("pool_ph");

    // var config = myConfig(raw_data, 30);
    var config = {
        type: 'line',
        data: get_data_1_dataset_with_ids(raw_data, 30),
        options: options_1_dataset(raw_data),
    };

    // var options_horizontalLine = [{
    //     "y": 7.40,
    //     "style": "green",
    //     // "style": "rgba(255, 0, 0, .4)",
    //     "text": "max"
    // }, {
    //     "y": 7.10,
    //     "text": "min",
    //     "style": "green",
    // }];

    add_plugin(config, horizontalLinePlugin);
    config.options.horizontalLine = options_horizontalLine([{ y: 7.4, text: "max" }, { y: 7.1, text: "min" }]);


    // config.options.horizontalLine = options_horizontalLine;
    // config.plugins = [horizontalLinePlugin];

    // add_plugin(config, horizontalLinePlugin, null);
    add_plugin(config, verticalLineOnStepPlugin, '12hours');

    var ctx = document.getElementById("canvas_pool_ph").getContext("2d");
    var my_chart = new Chart(ctx, config);

    // my_chart.options.scales.x.min = "2022-06-01"
    // my_chart.options.scales.x.max = "2022-06-03"

    // allows to swipe up and down on smartPhone/touchScreen
    my_chart.canvas.style.touchAction = "pan-y";

    var canvas_pool_ph = document.getElementById("canvas_pool_ph");
    enable_deletion(canvas_pool_ph, my_chart);

}

function pool_cl() {
    var raw_data = get_rawdata("pool_cl");
    // var config = myConfig(raw_data, 30);

    var config = {
        type: 'line',
        data: get_data_1_dataset_with_ids(raw_data, 30),
        options: options_1_dataset(raw_data),
    };


    // var options_horizontalLine = [{
    //     "y": 750,
    //     "style": "green",
    //     // "style": "rgba(255, 0, 0, .4)",
    //     "text": "max"
    // }, {
    //     "y": 640,
    //     "text": "min",
    //     "style": "green",

    // }];

    add_plugin(config, horizontalLinePlugin);
    config.options.horizontalLine = options_horizontalLine([{ y: 750, text: "max" }, { y: 640, text: "min" }]);


    // add_plugin(config, horizontalLinePlugin, null);
    add_plugin(config, verticalLineOnStepPlugin, '12hours');

    var ctx = document.getElementById("canvas_pool_cl").getContext("2d");
    var lineChart_pool_cl = new Chart(ctx, config);

    // allows to swipe up and down on smartclone/touchScreen
    lineChart_pool_cl.canvas.style.touchAction = "pan-y";

    var canvas_pool_cl = document.getElementById("canvas_pool_cl");
    enable_deletion(canvas_pool_cl, lineChart_pool_cl);
}

function pool_ph_cl() {

    var raw_data1 = get_rawdata("pool_ph");
    var raw_data2 = get_rawdata("pool_cl");
    var title = "Pool pH/Cl";

    // multiply ph by 100 to have it on the same scale as Cl;
    // to be replaced by a proper double independant scale for ph and cl

    for (let i = 0; i < raw_data1.data_array.length; i++) {
        raw_data1.data_array[i].y *= 100;
    }

    var config = {
        type: 'line',
        data: get_data_2_datasets(raw_data1, raw_data2),
        options: options_2_datasets(title, raw_data1, raw_data2),
        // data: get_data_pool_ph_cl(raw_data_ph.data_array, raw_data_cl.data_array),
        // options: options_pool_ph_cl(title),
        // // plugins: [horizontalArbitraryLinePlugin]
    };

    add_plugin(config, verticalLineOnStepPlugin, 'day');

    var ctx = document.getElementById("canvas_pool_ph_cl").getContext("2d");
    var myChart = new Chart(ctx, config);

    // allows to swipe up and down on smartclone/touchScreen
    myChart.canvas.style.touchAction = "pan-y";

    // myChart.options.scales.x.min = (new Date(myChart.options.scales.x.max) - 1000*60*60*24*3).toString();
    console.log("min : %o", myChart.options.scales.x.min);
    console.log("max : %o", myChart.options.scales.x.max);
    myChart.options.scales.x.min = "2022-06-01";
    var myOptions = JSON.parse(JSON.stringify(myChart.options));
    console.log("myOptions : %o", myOptions);

    // myChart.options.scales.x.min = new Date(new Date(myChart.options.scales.x.max) - 1000*60*60*24*3) ;
    myChart.update();

}

function power_day() {
    var raw_data = get_rawdata("power_day");

    // var config = myConfig(raw_data, 30);

    var config = {
        type: 'line',
        data: get_data_1_dataset_with_ids(raw_data, 30),
        options: options_1_dataset(raw_data),
    };

    add_plugin(config, verticalLineOnStepPlugin, 'day');

    var ctx = document.getElementById("canvas_power_day").getContext("2d");
    var lineChart_power_day = new Chart(ctx, config);

    // allows to swipe up and down on smartPhone/touchScreen
    lineChart_power_day.canvas.style.touchAction = "pan-y";

    var canvas_power_day = document.getElementById("canvas_power_day");
    enable_deletion(canvas_power_day, lineChart_power_day);
}

function power_day_delta() {
    var raw_data = get_rawdata("power_day_delta");

    // var config = myConfig(raw_data, 30);
    var config = {
        type: 'line',
        data: get_data_1_dataset(raw_data, 30),
        options: options_1_dataset(raw_data),
    };

    add_plugin(config, horizontalLinePlugin);
    config.options.horizontalLine = options_horizontalLine([{ y: 0, text: "min2" }, { y: 1.5, text: "" }]);

    var ctx = document.getElementById("canvas_power_day_delta").getContext("2d");
    var lineChart_power_day_delta = new Chart(ctx, config);

    // allows to swipe up and down on smartPhone/touchScreen
    lineChart_power_day_delta.canvas.style.touchAction = "pan-y";

    var canvas_power_day_delta = document.getElementById("canvas_power_day_delta");
    enable_deletion(canvas_power_day_delta, lineChart_power_day_delta);
}


function power_night() {
    var raw_data = get_rawdata("power_night");

    // var config = myConfig(raw_data, 30);
    var config = {
        type: 'line',
        data: get_data_1_dataset_with_ids(raw_data, 30),
        options: options_1_dataset(raw_data),
    };

    add_plugin(config, verticalLineOnStepPlugin, 'day');

    var ctx = document.getElementById("canvas_power_night").getContext("2d");
    var lineChart_power_night = new Chart(ctx, config);

    // allows to swipe up and down on smartPhone/touchScreen
    lineChart_power_night.canvas.style.touchAction = "pan-y";

    var canvas_power_night = document.getElementById("canvas_power_night");
    enable_deletion(canvas_power_night, lineChart_power_night);
}

function power_night_delta() {

    var raw_data = get_rawdata("power_night_delta");

    // var config = myConfig(raw_data, 30);
    var config = myConfig_1_dataset(raw_data, 30);

    var ctx = document.getElementById("canvas_power_night_delta").getContext("2d");
    var lineChart_power_night_delta = new Chart(ctx, config);

    // allows to swipe up and down on smartPhone/touchScreen
    lineChart_power_night_delta.canvas.style.touchAction = "pan-y";

    var canvas_power_night_delta = document.getElementById("canvas_power_night_delta");
    enable_deletion(canvas_power_night_delta, lineChart_power_night_delta);
}


function ps4() {
    var raw_data = get_rawdata("ps4");

    var config = myConfig(raw_data, 60 * 24 * 10);

    // var config = myConfig2_with_ids(title, values, ids, values_unit, labels, chart_type, unit, label, date_last_data);

    var ctx = document.getElementById("canvas_ps4").getContext("2d");
    var lineChart = new Chart(ctx, config);
}

function ps4_2() {
    var raw_data = get_rawdata("ps4_2");

    // var config = myConfig2(raw_data);
    var config = myConfig(raw_data, 60 * 24 * 10);

    var ctx = document.getElementById("canvas_ps4_2").getContext("2d");
    var lineChart = new Chart(ctx, config);
}

function canvas_bar() {
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
                x: {
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
                    title: {
                        display: true,
                        text: 'Year-Month'
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
                y: {
                    ticks: {
                        beginAtZero: true
                    },
                    stacked: true
                }
            }
        }
    };

    var ctx = document.getElementById("canvas_bar").getContext("2d");
    var my_bar_chart = new Chart(ctx, config_canvas_bar);

    my_bar_chart.options.scales.x.min = "2015-04-01"
    my_bar_chart.options.scales.x.max = "2015-05-30"


    var myOptions2 = JSON.parse(JSON.stringify(my_bar_chart.options));
    console.log("myOptions2 bar_chart : %o", myOptions2);


    var my_bar_chart3 = Object.create(my_bar_chart);
    console.log("my_bar_chart3 : %o", my_bar_chart3);



    ctx.strokeStyle = 'red';
    ctx.strokeRect(50, 50, 200, 5);
    my_bar_chart.update();

    var canvas_bar = document.getElementById("canvas_bar");
    canvas_bar.onclick = function (evt) {

        console.log("evt : %o", evt);
        var activePoints = my_bar_chart.getElementsAtEventForMode(evt, 'index', { intersect: true }, false);

        console.log("my_bar_chart : %o", my_bar_chart);

        if (activePoints[0]) {
            // console.log("start");
            var obj = activePoints[0];
            // console.log('activePoints[0]: %o', activePoints[0]);
            var index = activePoints[0].index;

            // var index = 2;
            console.log("my_bar_chart : %o", my_bar_chart);
            console.log("my_bar_chart.data: %o", my_bar_chart.data);
            alert("test");
            console.log("popping index %i", index);
            console.log("popping element with value %i and label %s", my_bar_chart.data.datasets[0].data[index], my_bar_chart.data.datasets[0].label[index]);
            console.log('before : datasets[0].data : %', my_bar_chart.data.datasets[0].data);
            //console.log("popped : %o", my_bar_chart.data.datasets[0].data.pop(index));
            console.log("splicing");
            console.log("index : %o", index);

            var myOptions = JSON.parse(JSON.stringify(my_bar_chart.options));
            console.log("myOptions bar_chart : %o", myOptions);

            // datasets[0].data.pop(index);
            console.log('after : datasets[0].data : %', my_bar_chart.data.datasets[0].data);
            my_bar_chart.options.scales.x.min = "2015-03-01"
            my_bar_chart.options.scales.x.max = "2015-05-30"

            var myChart2 = Object.create(my_bar_chart);
            console.log("myChart2 : %o", myChart2);

            var myOptions2 = JSON.parse(JSON.stringify(my_bar_chart.options));
            console.log("myOptions2 bar_chart : %o", myOptions);

            my_bar_chart.update();
            console.log("chart updated ?");
        } else {
            console.log("no active points found");
            console.log("options 2 : %o", my_bar_chart.options);

            var activePoints = my_bar_chart.getElementsAtEventForMode(evt, 'nearest', { intersect: false }, false);
            var obj = activePoints;
            // console.log('Item: %o', obj);

            if (activePoints[0]) {
                var mychart = my_bar_chart.$context.chart;

                console.log("my_bar_chart : %o", mychart);
                console.log("options : %o", mychart.options);
                console.log("scales : %o", mychart.scales);
                console.log('datasets[0].data : %', my_bar_chart.data.datasets[0].data);

                var index = activePoints[0].index;
                console.log("index of nearest point : %d", index);

                // my_bar_chart.options.scales.x.min = "2015-01-01"
                // my_bar_chart.options.scales.x.max = "2015-03-05"
                // my_bar_chart.update(); 

                const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = my_bar_chart;
                console.log("top, right, bottom, left, width, height : %d %d %d %d %d %d", top, right, bottom, left, width, height)
                // console.log("y : %o",y)

                var ypix = y.getPixelForValue(1);
                ctx.strokeStyle = 'green';
                ctx.strokeRect(left, ypix, left + width, 0);
                ctx.strokeRect(50, 50, 200, 5);

                my_bar_chart.update();

                // var ypix = y.getPixelForValue('2015-02-01');
                // ctx.strokeStyle = 'green';
                // ctx.strokeRect(left, ypix, left + width, 0);

                // console.log("data.datasets[0].data : %o", my_bar_chart.data.datasets[0].data);
                // console.log("labels : %o", my_bar_chart.data.labels);
                var label = mychart.data.labels[index];
                var value = mychart.data.datasets[0].data[index];
                console.log("label, value : %o %o", label, value);

                // var x = mychart.scales.x;
                // var y = mychart.scales.y;
                // console.log("x : getpixelforValue %d : %d ", label, x.getPixelForValue(label));
                // console.log("y : getpixelforValue %d : %d", value, y.getPixelForValue(value));
                // console.log("x : %o", x);
                // console.log("getpixelforTick 1: %d", x.getPixelForTick(index))
                // console.log("getpixelforvalue : %d", x.getPixelForValue('2015-02-01'))
            }
        }
        console.log("evt (x,y) : (%d,%d)", evt.offsetY, evt.offsetY);
    };
}

//------------------------------------------------------------------

// function canvas_bar2() {
//     var barChartData = {
//         labels: ["2015-01-01", "2015-02-01", "2015-03-01", "2015-04-01", "2015-05-01", "2015-07-01"],
//         datasets: [{/*from  w w w  . de mo 2 s . com*/
//             categoryPercentage: .5,
//             barPercentage: 1,
//             label: 'Dataset 1',
//             backgroundColor: "rgba(220,220,220,0.5)",
//             data: [10, 4, 5, 7, 2, 3]
//         }]
//     };

//     var config_canvas_bar2 = {
//         type: 'bar',
//         data: barChartData,
//         options: {
//             elements: {
//                 rectangle: {
//                     borderWidth: 2,
//                     borderColor: 'rgb(0, 255, 0)',
//                     borderSkipped: 'bottom'
//                 }
//             },
//             responsive: true,
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Chart.js Bar Chart'
//             },
//             scales: {
//                 x: {
//                     // grid: {
//                     //     color: (context) => {
//                     //         console.log("context.tick : %o",context);
//                     //         // if (context.tick.value === 12) {
//                     //         //     return 'rgba(75,192,192,1)';
//                     //         // } else {
//                     //         //     return 'rgba(0,0,0,0.1)';
//                     //         // }
//                     //     }
//                     // },
//                     type: 'time',
//                     offset: true,
//                     title: {
//                         display: true,
//                         text: 'Year-Month'
//                     },
//                     time: {
//                         // min: '2014-12-01' ,
//                         // max: '2015-12-01',
//                         unit: 'month',
//                         displayFormats: {
//                             month: "MMM yy"
//                         }
//                     },
//                     gridLines: {
//                         offsetGridLines: false,
//                         drawTicks: true,
//                         display: true
//                     },
//                     stacked: true
//                 },
//                 y: {
//                     ticks: {
//                         beginAtZero: true
//                     },
//                     stacked: true
//                 }
//             }
//         }
//     };

//     var ctx = document.getElementById("canvas_bar2").getContext("2d");
//     var my_bar_chart = new Chart(ctx, config_canvas_bar2);
// }

//------------------------------------------------------------------

function daily_stock() {
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

    var config_daily_stock = {
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
                x: {
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
                y: {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            },
            plugins: {
                zoom: zoom_plugin()
            }
        },
    };
    var ctx2 = document.getElementById("canvas_daily_stock").getContext("2d");
    var myChart2 = new Chart(ctx2, config_daily_stock);

    // myChart2.options.scales.x.min = '2017-06-01';
    // myChart2.options.scales.x.max = '2017-08-30';
    // myChart2.update();

}


function daily_stock2() {
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

    var config_daily_stock2 = {
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
                x: {
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
                y:
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            },
        },
    };

    var ctx2 = document.getElementById("canvas_daily_stock2").getContext("2d");
    var myChart2 = new Chart(ctx2, config_daily_stock2);
}



function test() {
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

    var config_test = {
        type: "bar",
        data: {
            labels: ["2017-08-02", "2017-08-03", "2017-08-04", "2017-08-10"],
            datasets: [
                {
                    barPercentage: .7,
                    xAxisID: "bar_x",
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
            plugins: {
                title: {
                    text: "test config",
                    display: true
                }
            },
            scales: {
                x: {
                    id: "line",
                    type: "time",
                    time: {
                        unit: "hour",
                        displayFormats: {
                            month: "DD",
                        },
                    },
                    distribution: "linear",
                    ticks : { color: 'yellow' },
                    min: "2017-08-03",
                    max: "2017-08-04",
                    
                },
                bar: {
                    id: "bar_x",
                    type: "time",
                    time: {
                        unit: "day",
                        displayFormats: {
                            month: "DD",
                        },
                    },
                    distribution: "linear",
                    ticks : { color: 'red' }
                },
                y:
                {
                    ticks: {
                        beginAtZero: true,
                        color: 'blue'
                    },
                },
            },
        },
    };

    var ctx2 = document.getElementById("canvas_test").getContext("2d");
    var myChart_test = new Chart(ctx2, config_test);
}


// frigo_smart();
frigo_normal_smart();
frigo_24h();
pool_ph();
pool_cl();
pool_ph_cl();
power_day();
power_day_delta();
power_night();
power_night_delta();
ps4();
ps4_2();
canvas_bar();
daily_stock();
daily_stock2();
test();
