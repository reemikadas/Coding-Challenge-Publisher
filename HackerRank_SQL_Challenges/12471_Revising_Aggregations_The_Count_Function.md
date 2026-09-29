# Challenge 12471: Revising Aggregations - The Count Function

**Source:** [View challenge](https://www.hackerrank.com/challenges/revising-aggregations-the-count-function/problem?isFullScreen=true)

## Challenge

Query a *count* of the number of cities in **CITY** having a *Population* larger than $100,000$.

### Input Format

The **CITY** table is described as follows:
<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

## SQL Solution #1

~~~sql
SELECT COUNT(*) FROM city
WHERE population > 100000;
~~~

_Dialect: MySQL_
