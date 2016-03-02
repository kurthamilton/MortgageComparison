(function() {
    'use strict';

    angular.module('app').factory('ChartData', () => ChartData);

    function ChartData() {
        this.labels = [];
        this.datasets = [];
        this.data = [];
        this.series = [];
    }

    ChartData.prototype.addDataset = function(label, data) {
            this.datasets.push({
                label: label,
                data: data
            });
            this.series.push(label);
            this.data.push(data);
    };

    ChartData.prototype.addLabel = function(label) {
        this.labels.push(label);
    };
})();