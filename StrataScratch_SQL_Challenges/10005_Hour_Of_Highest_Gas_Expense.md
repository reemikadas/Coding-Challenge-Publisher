# StrataScratch Challenge 10005: Hour Of Highest Gas Expense

**Source:** [View challenge](https://platform.stratascratch.com/coding/10005-hour-of-highest-gas-expense)

## Challenge

Find the hour of the single ride with the highest gasoline cost. Assume only one ride has this maximum, so exactly one hour qualifies.

## SQL Solution #1

~~~sql
SELECT
    hour
FROM lyft_rides
WHERE gasoline_cost = (SELECT MAX(gasoline_cost) FROM lyft_rides)
;
~~~

_Dialect: MySQL_
