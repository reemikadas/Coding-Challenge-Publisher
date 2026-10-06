# LeetCode Challenge 176: Second Highest Salary

**Source:** [View challenge](https://leetcode.com/problems/second-highest-salary/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Employee`

~~~text
+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| salary      | int  |
+-------------+------+
id is the primary key (column with unique values) for this table.
Each row of this table contains information about the salary of an employee.
~~~

Write a solution to find the second highest **distinct** salary from the `Employee` table. If there is no second highest salary, return `null (return None in Pandas)`.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Employee table:
+----+--------+
| id | salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
Output:
+---------------------+
| SecondHighestSalary |
+---------------------+
| 200                 |
+---------------------+
~~~

**Example 2:**

~~~text
Input:
Employee table:
+----+--------+
| id | salary |
+----+--------+
| 1  | 100    |
+----+--------+
Output:
+---------------------+
| SecondHighestSalary |
+---------------------+
| null                |
+---------------------+
~~~

## SQL Solution #1

~~~sql
WITH distinct_salary AS (
    SELECT
        DISTINCT salary
    FROM employee
),
    second_highest_sal AS (
        SELECT
            salary,
            ROW_NUMBER() OVER(ORDER BY salary DESC) AS rn
        FROM distinct_salary
)
SELECT
    MAX(salary) AS SecondHighestSalary
FROM second_highest_sal
WHERE rn = 2
;
~~~

_Dialect: MySQL_
