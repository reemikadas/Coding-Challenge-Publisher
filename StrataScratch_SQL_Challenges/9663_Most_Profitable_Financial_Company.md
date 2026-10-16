# StrataScratch Challenge 9663: Most Profitable Financial Company

**Source:** [View challenge](https://platform.stratascratch.com/coding/9663-find-the-most-profitable-company-in-the-financial-sector-of-the-entire-world-along-with-its-continent)

## Challenge

Find the most profitable company from the financial sector. Output the result along with the continent.

## SQL Solution #1

~~~sql
SELECT
    company,
    continent
FROM forbes_global_2010_2014
WHERE sector = 'Financials'
AND profits = (SELECT MAX(profits) FROM forbes_global_2010_2014)
;
~~~

_Dialect: MySQL_
