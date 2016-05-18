# Einstein API Timeseries Test
A prototype to use basic time series smoothing to forecast the number of requests to our API.

This is using a very limited dataset for the traning data (request count per hour from CloudWatch), in the future I'd like to automate the collection of this data rather than just use a static file.

Credit to: [26medias/timeseries-analysis](https://github.com/26medias/timeseries-analysis) for smoothing library.

<img src="https://raw.githubusercontent.com/eemmzz/einstein-api-timeseries/master/public/images/einstein.png" width="200px" />
