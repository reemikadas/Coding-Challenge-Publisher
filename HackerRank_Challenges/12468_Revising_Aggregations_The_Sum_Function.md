# Challenge 12468: Revising Aggregations - The Sum Function

**Source:** [View challenge](https://www.hackerrank.com/challenges/revising-aggregations-sum/problem?isFullScreen=true)

## Challenge

Query the total population of all cities in **CITY** where *District* is **California**.

### Input Format

The **CITY** table is described as follows:
<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

## SQL Solution #1

~~~sql
SELECT SUM(population) AS total_population
FROM city
WHERE district = "California";
~~~

_Dialect: MySQL_
