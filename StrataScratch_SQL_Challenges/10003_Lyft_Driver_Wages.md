# StrataScratch Challenge 10003: Lyft Driver Wages

**Source:** [View challenge](https://platform.stratascratch.com/coding/10003-lyft-driver-wages)

## Challenge

Find all Lyft drivers who earn either equal to or less than 30k USD or equal to or more than 70k USD.
Output all details related to retrieved records.

## SQL Solution #1

~~~sql
SELECT
    *
FROM lyft_drivers
WHERE yearly_salary <= 30000
OR yearly_salary >= 70000
;
~~~

_Dialect: MySQL_
