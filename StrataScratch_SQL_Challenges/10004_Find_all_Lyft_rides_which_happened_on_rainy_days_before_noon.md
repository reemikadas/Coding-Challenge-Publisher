# StrataScratch Challenge 10004: Find all Lyft rides which happened on rainy days before noon

**Source:** [View challenge](https://platform.stratascratch.com/coding/10004-find-all-lyft-rides-which-happened-on-rainy-days-before-noon)

## Challenge

Find all Lyft rides which happened on rainy days before noon.

## SQL Solution #1

~~~sql
SELECT
    *
FROM lyft_rides
WHERE weather = 'rainy'
AND hour < 12
;
~~~

_Dialect: MySQL_
