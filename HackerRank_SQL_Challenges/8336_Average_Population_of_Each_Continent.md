# Challenge 8336: Average Population of Each Continent

**Source:** [View challenge](https://www.hackerrank.com/challenges/average-population-of-each-continent/problem?isFullScreen=true)

## Challenge

Given the **CITY** and **COUNTRY** tables, query the names of all the continents (*COUNTRY.Continent*) and their respective average city populations (*CITY.Population*) rounded *down* to the nearest integer.

**Note:** *CITY.CountryCode* and *COUNTRY.Code* are matching key columns.

### Input Format

The **CITY** and **COUNTRY** tables are described as follows:

<img src="https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg" title="CITY.jpg" />

<img src="https://s3.amazonaws.com/hr-challenge-images/8342/1449769013-e54ce90480-Country.jpg" title="Country.jpg" />

## SQL Solution #1

~~~sql
SELECT
    co.continent,
    FLOOR(AVG(ci.population)) AS average_city_population
FROM city ci
INNER JOIN country co ON ci.countrycode = co.code
GROUP BY co.continent;
~~~

_Dialect: MySQL_
