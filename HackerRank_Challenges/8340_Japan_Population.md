# Challenge 8340: Japan Population

**Source:** [View challenge](https://www.hackerrank.com/challenges/japan-population/problem?isFullScreen=true)

## Challenge

Query the sum of the populations for all Japanese cities in **CITY**. The *COUNTRYCODE* for Japan is **JPN**.

### Input Format

The **CITY** table is described as follows:
<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

## SQL Solution #1

~~~sql
SELECT
    SUM(population) AS total_jpn_population
FROM city
WHERE countrycode = "JPN"
~~~

_Dialect: MySQL_
