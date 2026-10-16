# StrataScratch Challenge 9943: Olympics Events List By Age

**Source:** [View challenge](https://platform.stratascratch.com/coding/9943-winter-olympics-events-list-by-height)

## Challenge

Find the lowest, average, and the highest ages of athletes across all Olympics. HINT: If athlete participated in more than one discipline at one Olympic games, consider it as a separate athlete, no need to remove such edge cases.

## SQL Solution #1

~~~sql
SELECT
    MIN(age) AS lowest_age,
    AVG(age) AS mean_age,
    MAX(age) AS highest_age
FROM olympics_athletes_events
WHERE age IS NOT NULL
;
~~~

_Dialect: MySQL_
