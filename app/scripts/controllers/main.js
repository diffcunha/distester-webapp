'use strict';

var distester = angular.module('distester');
  
distester.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    
    $scope.tickers = [
        { name: 'BTC/USD' },
        { name: 'USD/EUR' }
    ];

    $scope.frequencies = [
        { name: 'Daily' },
        { name: 'Hourly' },
        { name: 'Monthly' }
    ];

    $scope.ticker = $scope.tickers[0];

    $scope.beginDate = new Date();
    $scope.endDate = new Date();

    $scope.beginDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.beginDateOpened = true;
    };

    $scope.endDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endDateOpened = true;
    };

    // --

    $scope.indicators = [{
        name: 'Moving Average',
        parameters: [{
            name: 'Short',
            min: 1,
            max: 20,
            step: 0.01
        }, {
            name: 'Long',
            min: 10,
            max: 30,
            step: 0.01
        }, {
            name: 'Up',
            min: -1,
            max: 0,
            step: 0.001
        }, {
            name: 'Down',
            min: 0,
            max: 1,
            step: 0.001
        }]
    }, {
        name: 'MACD',
        parameters: [{
            name: 'Short',
            min: 0,
            max: 100,
            step: 0.1
        }, {
            name: 'Long',
            min: 0,
            max: 100,
            step: 0.1
        }, {
            name: 'Up',
            min: -1,
            max: 0,
            step: 0.001
        }, {
            name: 'Down',
            min: 0,
            max: 1,
            step: 0.001
        }]
    }];

    $scope.addIndicator = function(indicator) {
        if(indicator) {
            $scope.backtest.indicators.push(angular.copy(indicator));
        }
    }

    $scope.candles = [];
    $scope.events = [];
    $scope.profit = 0;

    $scope.backtest = {
        indicators: []
    };

    $http.get('http://www.quandl.com/api/v1/datasets/BITCOIN/BITSTAMPUSD.json?auth_token=bkrvsVRUJsmiWfRqid5z&trim_start=2013-01-01&sort_order=asc').success(function(data, status, headers, config) {
        var tmp = [];
        for(var i = 0; i < data.data.length; i++) {
            var tick = data.data[i];
            var dateParts = tick[0].split("-");
            tmp.push({
                date: new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])),
                open: tick[1],
                close: tick[4],
                high: tick[2],
                low: tick[3],
                volume: tick[6],
                price: tick[7]
            });
        }
        $scope.candles = tmp;
    });

    $scope.run = function() {
        var backtester = new Distester($scope.candles);
        backtester.iteration(function onIteration(obj) {
            var events = [];
            for(var i = 0; i < obj.trades.length; i++) {
                if(obj.trades[i].op == "buy") {
                    events.push({
                        date: obj.trades[i].date,
                        type: "arrowUp",
                        backgroundColor: "#00CC00",
                        graph: "g1"
                    });
                } else {
                    events.push({
                        date: obj.trades[i].date,
                        type: "arrowDown",
                        backgroundColor: "#CC0000",
                        graph: "g1"
                    });
                }
            }
            $scope.$apply(function() {
                $scope.events = events;
                $scope.profit = obj.profit
            });
        });
    };

}]);
