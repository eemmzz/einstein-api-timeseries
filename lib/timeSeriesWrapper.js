var timeSeries = require('timeseries-analysis');

module.exports = {
    // Loads json object into time series object
    loadTimeSeriesFromCloudWatchData: function (json) {
        return new timeSeries.main(
            timeSeries.adapter.fromDB(json, {
                date: 'Timestamp',
                value: 'Sum'
            })
        );
    },

    // Returns a chart URL for the original data series
    // timeSeriesData: The time series data to use
    getTimeSeriesMainChart: function (timeSeriesData) {
        return timeSeriesData.chart({ main: true });
    },

    // Returns a chart URL showing the smoothed data series (Instantaneous Trend Line)
    // timeSeriesData: The time series data to use
    getSmoothedTimeSeriesChart: function (timeSeriesData, alpha) {
        return timeSeriesData
            .dsp_itrend({ alpha: alpha })
            .smoother({ period: 2 })
            .chart({ main: true });
    },

    // timeSeriesData: The time series data to use
    // indexOfHourToPredict: The index of the hour, is continuous so day 2 starts from index 24
    calculateForecast: function (timeSeriesData, indexOfHourToPredict) {
        var forecast = 0,
            hoursToGoBack = 6,
            dataSliceMaxIndex = indexOfHourToPredict - 1,
            dataSliceMinIndex = dataSliceMaxIndex - hoursToGoBack,
            dataset = timeSeriesData.data.slice(dataSliceMinIndex, dataSliceMaxIndex),
            coefficientValues = timeSeriesData.ARMaxEntropy(dataset);

        for (var i = 0; i < coefficientValues.length; i++) {
            forecast -= timeSeriesData.data[(indexOfHourToPredict - 1) - i][1] * coefficientValues[i];

            // Explanation:
            // timeSeriesData.data is the current dataset [ [date, value], [date,value], ... etc ]
            // For each coefficient, we subtract from forecast the value of the N - x, multiplied by the coefficient,
            // (where N is the last known datapoint value, and x is the coefficient's index)
        }

        return Math.round(forecast);
    },

    // Return forecast datapoints based on time series data
    // timeSeriesData: The time series data to use
    // hoursToPredict: An array containing the points to predict
    generateForecastData: function (timeSeriesData, hoursToPredict) {
        var currentIndex,
            data = [];

        for (var i = 0; i <= Math.max.apply(Math, hoursToPredict); i++) {
            currentIndex = hoursToPredict.indexOf(i);

            if (currentIndex > -1) {
                // Run prediction algorithm for this hour
                data.push(
                    this.calculateForecast(timeSeriesData, hoursToPredict[currentIndex])
                );
            } else {
                // Add null value to data table for chart API
                data.push(null);
            }
        }

        return data;
    },

    // Convert time series data object to an array
    // timeSeriesData: The time series data to use
    convertTimeSeriesToArray: function (timeSeriesData) {
        var output = timeSeriesData.output(),
            data = [];

        for (var i = 0; i < output.length; i++) {
            data.push(output[i][1]);
        }

        return data;
    }
};
