# StrataScratch Challenge 2024: Unique Users Per Client Per Month

**Source:** [View challenge](https://platform.stratascratch.com/coding/2024-unique-users-per-client-per-month)

## Challenge

Write a query that returns the number of unique users per client for each month. Assume all events occur within the same year, so only month needs to be be in the output as a number from 1 to 12.

## SQL Solution #1

~~~sql
SELECT
    client_id,
    MONTH(time_id) AS month,
    COUNT(DISTINCT user_id) AS users_num
FROM fact_events
GROUP BY client_id, MONTH(time_id)
;
~~~

_Dialect: MySQL_
