(function() {
    'use strict';

    let requires = [];
    requires.push('as.sortable');
    //requires.push('angles');          // angles.js
    requires.push('chart.js');          // angular-chart.js
    //requires.push('chartjs');           // angular-chartjs.js
    //requires.push('chartjs-directive'); // chartjs-directive.js

    angular.module('app', requires);
})();