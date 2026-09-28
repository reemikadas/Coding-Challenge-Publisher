# Challenge 19631: Top Earners

**Source:** [View challenge](https://www.hackerrank.com/challenges/earnings-of-employees/problem?isFullScreen=true)

## Challenge

We define an employee's *total earnings* to be their monthly $salary \times  months$ worked, and the *maximum total earnings* to be the maximum total earnings for any employee in the **Employee** table. Write a query to find the _maximum total earnings_ for all employees as well as the total number of employees who have maximum total earnings. Then print these values as $2$ space-separated integers.

### Input Format

The **Employee** table containing employee data for a company is described as follows: 

<img src="https://s3.amazonaws.com/hr-challenge-images/19629/1458557872-4396838885-ScreenShot2016-03-21at4.27.13PM.png"/>

where _employee\_id_ is an employee's ID number, _name_ is their name, _months_ is the total number of months they've been working for the company, and _salary_ is the their monthly salary.

## SQL Solution #1

~~~sql
SELECT
    months * salary AS total_earnings,
    COUNT(*) AS employee_count
FROM employee
GROUP BY total_earnings
ORDER BY total_earnings DESC
LIMIT 1
;
~~~

_Dialect: MySQL_
