# Challenge 9337: Weather Observation Station 2

**Source:** [View challenge](https://www.hackerrank.com/challenges/weather-observation-station-2/problem?isFullScreen=true)

## Challenge

Query the following two values from the **STATION** table: 

1. The sum of all values in *LAT\_N* rounded to a scale of $2$ decimal places.
2. The sum of all values in *LONG\_W* rounded to a scale of $2$ decimal places.

### Input Format

The **STATION** table is described as follows:

![Station.jpg](https://s3.amazonaws.com/hr-challenge-images/9336/1449345840-5f0a551030-Station.jpg)

where *LAT\_N* is the northern latitude and *LONG\_W* is the western longitude.

### Output Format

Your results must be in the form:

	lat lon
    
where $lat$ is the sum of all values in *LAT\_N* and $lon$ is the sum of all values in *LONG\_W*. Both results must be rounded to a scale of $2$ decimal places.

## SQL Solution #1

~~~sql
SELECT
    ROUND(SUM(lat_n), 2) AS total_lat_n,
    ROUND(SUM(long_w), 2) AS total_long_w
FROM station;
~~~

_Dialect: MySQL_
