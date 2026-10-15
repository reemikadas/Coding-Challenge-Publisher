# StrataScratch Challenge 9917: Average Salaries

**Source:** [View challenge](https://platform.stratascratch.com/coding/9917-average-salaries?code_type=3)

## Challenge

Compare each employee's salary with the average salary of the corresponding department.
Output the department, first name, and salary of employees along with the average salary of that department.

## SQL Solution #1

~~~sql
SELECT
    department,
    first_name,
    salary,
    AVG(salary) OVER(PARTITION BY department) AS average_salary
FROM employee
;
~~~

_Dialect: MySQL_
