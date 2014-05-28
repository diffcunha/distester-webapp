var distester = angular.module('distester');

distester.directive('amcharts', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chartdiv" style="width: 100%; height: 350px"></div>',
        scope: {
            ngModel: '=',
            events: '='
        },
        require: '^ngModel',
        link: function($scope, element, attrs) {
            var chart = false;

            $scope.$watch('ngModel', function(value) {
                if(chart && value) {
                    chart.dataSets[0].dataProvider = value;
                    chart.validateData();
                }
            });
            $scope.$watch('events', function(value) {
                if(chart && value) {
                    chart.dataSets[0].stockEvents = value;
                    chart.validateData();
                }
            });

            var initChart = function() {
                if (chart) chart.destroy();

                chart = AmCharts.makeChart("chartdiv", {
                    type: "stock",
                    theme: "none",
                    pathToImages: "http://www.amcharts.com/lib/3/images/",
                    dataSets: [{
                        fieldMappings: [{
                            fromField: "open",
                            toField: "open"
                        }, {
                            fromField: "close",
                            toField: "close"
                        }, {
                            fromField: "high",
                            toField: "high"
                        }, {
                            fromField: "low",
                            toField: "low"
                        }, {
                            fromField: "volume",
                            toField: "volume"
                        }, {
                            fromField: "value",
                            toField: "value"
                        }],
                        dataProvider: [],
                        stockEvents: [],
                        title: "BTC/USD Price",
                        //color: "#7f8da9",
                        categoryField: "date"
                        //stockEvents: rawEvents
                    }],
                    panels: [{
                        title: "Value",
                        showCategoryAxis: false,
                        percentHeight: 70,
                        valueAxes: [{
                            dashLength: 5
                        }],
                        categoryAxis: {
                            dashLength: 5
                        },
                        stockGraphs: [{
                            type: "candlestick",
                            id: "g1",
                            openField: "open",
                            closeField: "close",
                            highField: "high",
                            lowField: "low",
                            valueField: "close",
                            lineColor: "#7f8da9",
                            fillColors: "#7f8da9",
                            negativeLineColor: "#db4c3c",
                            negativeFillColors: "#db4c3c",
                            fillAlphas: 1,
                            useDataSetColors: false,
                            comparable: true,
                            compareField: "value",
                            showBalloon: false
                        }],
                        stockLegend: {
                            valueTextRegular: undefined,
                            periodValueTextComparing: "[[percents.value.close]]%"
                        }
                    }],
                    chartScrollbarSettings: {
                        graph: "g1",
                        graphType: "line",
                        usePeriod: "WW"
                    },
                    chartCursorSettings: {
                        valueBalloonsEnabled: true,
                        graphBulletSize: 1
                    },
                    /*
                    periodSelector: {
                        periods: [{
                            period: "DD",
                            count: 10,
                            label: "10 days"
                        }, {
                            period: "MM",
                            count: 1,
                            label: "1 month"
                        }, {
                            period: "YYYY",
                            count: 1,
                            label: "1 year"
                        }, {
                            period: "YTD",
                            label: "YTD"
                        }, {
                            period: "MAX",
                            label: "MAX"
                        }]
                    },
                    */
                    panelsSettings: {
                        usePrefixes: true
                    }
                });

                
            };
            initChart();
        }
    }
});