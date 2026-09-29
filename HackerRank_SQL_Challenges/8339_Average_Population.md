# Challenge 8339: Average Population

**Source:** [View challenge](https://www.hackerrank.com/challenges/average-population/problem?isFullScreen=true)

## Challenge

Query the average population for all cities in **CITY**, rounded *down* to the nearest integer.

### Input Format

The **CITY** table is described as follows:
<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

## SQL Solution #1

~~~sql
SELECT FLOOR(AVG(population)) AS average_population
FROM city;
~~~

_Dialect: MySQL_
