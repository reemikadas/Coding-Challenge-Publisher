# StrataScratch Challenge 10299: Finding Updated Records

**Source:** [View challenge](https://platform.stratascratch.com/coding/10299-finding-updated-records)

## Challenge

We have a table with employees and their salaries; however, some of the records are old and contain outdated salary information. Since there is no timestamp, assume salary is non-decreasing over time. You can consider the current salary for an employee is the largest salary value among their records. If multiple records share the same maximum salary, return any one of them. Output their id, first name, last name, department ID, and current salary. Order your list by employee ID in ascending order.

## SQL Solution #1

~~~sql
WITH updated_salary AS (
        SELECT
            *,
            ROW_NUMBER() OVER(
                PARTITION BY id
                ORDER BY salary DESC
            ) AS rn
        FROM ms_employee_salary
)
SELECT
    id,
    first_name,
    last_name,
    department_id,
    salary
FROM updated_salary
WHERE rn = 1
ORDER BY id
;
~~~

_Dialect: PostgreSQL_
