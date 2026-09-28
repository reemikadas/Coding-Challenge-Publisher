# Challenge 8342: Population Census

**Source:** [View challenge](https://www.hackerrank.com/challenges/asian-population/problem?isFullScreen=true)

## Challenge

Given the **CITY** and **COUNTRY** tables, query the sum of the populations of all cities where the *CONTINENT* is *'Asia'*.
    
**Note:** *CITY.CountryCode* and *COUNTRY.Code* are matching key columns.

### Input Format

The **CITY** and **COUNTRY** tables are described as follows:

<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

<img src="https://s3.amazonaws.com/hr-challenge-images/8342/1449769013-e54ce90480-Country.jpg" title="Country.jpg" />

## SQL Solution #1

~~~sql
SELECT 
    SUM(ci.population) AS total_asia_population
FROM city ci
INNER JOIN country co ON ci.countrycode = co.code
WHERE co.continent = "Asia";
~~~

_Dialect: MySQL_
