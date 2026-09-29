# Challenge 8341: Population Density Difference

**Source:** [View challenge](https://www.hackerrank.com/challenges/population-density-difference/problem?isFullScreen=true)

## Challenge

Query the difference between the maximum and minimum populations in **CITY**.

### Input Format

The **CITY** table is described as follows:
<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

## SQL Solution #1

~~~sql
SELECT
    MAX(population) - MIN(population) AS difference
FROM city;
~~~

_Dialect: MySQL_
