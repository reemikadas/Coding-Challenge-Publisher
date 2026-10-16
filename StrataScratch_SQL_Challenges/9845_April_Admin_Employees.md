# StrataScratch Challenge 9845: April Admin Employees

**Source:** [View challenge](https://platform.stratascratch.com/coding/9845-find-the-number-of-employees-working-in-the-admin-department)

## Challenge

Find the number of employees working in the Admin department that joined in April or later, in any year.

## SQL Solution #1

~~~sql
SELECT
    COUNT(*) AS num_of_emp
FROM worker
WHERE department = 'Admin'
AND MONTH(joining_date) >= 4
;
~~~

_Dialect: MySQL_
