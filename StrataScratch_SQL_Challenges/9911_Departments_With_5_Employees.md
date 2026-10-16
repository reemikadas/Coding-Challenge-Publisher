# StrataScratch Challenge 9911: Departments With 5 Employees

**Source:** [View challenge](https://platform.stratascratch.com/coding/9911-departments-with-5-employees)

## Challenge

Find departments with at more than or equal 5 employees.

## SQL Solution #1

~~~sql
SELECT
    department
FROM employee
GROUP BY department
HAVING COUNT(id) >= 5
;
~~~

_Dialect: MySQL_
