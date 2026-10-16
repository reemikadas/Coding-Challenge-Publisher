# StrataScratch Challenge 2167: High Earners in Support Departments

**Source:** [View challenge](https://platform.stratascratch.com/coding/2167-high-earners-in-support-departments)

## Challenge

The HR team is reviewing compensation packages for employees in support functions. They want to identify high earners in the HR and Admin departments for a salary benchmarking study.

Find all employees who earn more than $80,000 and work in either the HR or Admin department. Return `first name`, `last name`, `department`, and `salary`.

## SQL Solution #1

~~~sql
SELECT
    first_name,
    last_name,
    department,
    salary
FROM techcorp_workforce
WHERE department IN ('HR', 'Admin')
AND salary > 80000
;
~~~

_Dialect: MySQL_
