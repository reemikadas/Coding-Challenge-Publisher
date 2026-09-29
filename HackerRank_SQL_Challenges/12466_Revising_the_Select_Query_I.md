# Challenge 12466: Revising the Select Query I

**Source:** [View challenge](https://www.hackerrank.com/challenges/revising-the-select-query/problem?isFullScreen=true)

## Challenge

Query all columns for all American cities in the **CITY** table with populations larger than `100000`. The **CountryCode** for America is `USA`. 

The **CITY** table is described as follows:  

![CITY.jpg](https://s3.amazonaws.com/hr-challenge-images/8137/1449729804-f21d187d0f-CITY.jpg)

## SQL Solution #1

~~~sql
SELECT * FROM city
WHERE population > 100000
AND countrycode = "USA";
~~~

_Dialect: MySQL_
