var express = require('express'),
    router = express.Router(),

    sortBy = require('lodash.sortby'),
    data = require(__dirname + '/../data/requests.json'),
    timeSeriesWrapper = require(__dirname + '/../lib/timeSeriesWrapper'),
    googleChartApiDataGenerator = require(__dirname + '/../lib/googleChartApiDataGenerator');

router.get('/', function (req, res, next) {
    var cloudWatchData = sortBy(data['Datapoints'], 'Timestamp'),
        timeSeriesData,
        originalChartUrl,
        smoothedChartUrl,
        hoursToPredict = [
            13, // 13:00, 10th May (actual 8709)
            20, // 20:00, 10th May (actual 16255)
            25, // 01:00, 11th May (actual 886)
            32, // 08:00, 11th May (actual 9670)
            40, // 16:00, 11th May (actual 15143)
            72  // 00:00, 13th May (actual 716)
        ],
        originalDataPoints,
        smoothedDataPoints,
        forecastDataPoints;

    // Load and preserve original data for charts
    timeSeriesData = timeSeriesWrapper.loadTimeSeriesFromCloudWatchData(cloudWatchData);
    originalDataPoints = timeSeriesWrapper.convertTimeSeriesToArray(timeSeriesData);
    originalChartUrl = timeSeriesWrapper.getTimeSeriesMainChart(timeSeriesData);

    // Smooth series to remove noise
    smoothedChartUrl = timeSeriesWrapper.getSmoothedTimeSeriesChart(timeSeriesData, 0.45);
    smoothedDataPoints = timeSeriesWrapper.convertTimeSeriesToArray(timeSeriesData);

    // Generate and retrieve forecast
    forecastDataPoints = timeSeriesWrapper.generateForecastData(timeSeriesData, hoursToPredict);

    res.render('index', {
        title: 'Time Series Analysis - Einstein Prediction',
        originalDataChart: originalChartUrl,
        smoothedDataChart: smoothedChartUrl,
        chartDataPoints: JSON.stringify(
            googleChartApiDataGenerator.getDataInChartApiFormat(
                originalDataPoints,
                smoothedDataPoints,
                forecastDataPoints
            )
        )
    });
});

module.exports = router;
