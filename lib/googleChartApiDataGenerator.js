module.exports = {
    // Takes three collections of datapoints and fills blank indexes if they exist with null
    // todo: add logic to choose the longest array
    getDataInChartApiFormat: function (seriesOne, seriesTwo, seriesThree) {
        var data = [];

        for (var i = 0; i < seriesThree.length; i++) {
            data.push([
                i,
                seriesOne[i] || null,
                seriesTwo[i] || null,
                seriesThree[i] || null
            ]);
        }

        return data;
    }
};
