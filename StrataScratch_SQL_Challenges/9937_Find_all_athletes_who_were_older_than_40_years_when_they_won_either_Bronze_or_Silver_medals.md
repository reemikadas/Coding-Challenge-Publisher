# StrataScratch Challenge 9937: Find all athletes who were older than 40 years when they won either Bronze or Silver medals

**Source:** [View challenge](https://platform.stratascratch.com/coding/9937-find-all-athletes-who-were-older-than-40-years-when-they-won-either-bronze-or-silver-medals)

## Challenge

Find all athletes who were older than 40 years when they won either Bronze or Silver medals.

## SQL Solution #1

~~~sql
SELECT
    name
FROM olympics_athletes_events
WHERE age > 40
AND medal IN ('Bronze', 'Silver')
;
~~~

_Dialect: MySQL_
