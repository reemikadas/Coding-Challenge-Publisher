# LeetCode Challenge 577: Employee Bonus

**Source:** [View challenge](https://leetcode.com/problems/employee-bonus/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Employee`

~~~text
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| empId       | int     |
| name        | varchar |
| supervisor  | int     |
| salary      | int     |
+-------------+---------+
empId is the column with unique values for this table.
Each row of this table indicates the name and the ID of an employee in addition to their salary and the id of their manager.
~~~

Table: `Bonus`

~~~text
+-------------+------+
| Column Name | Type |
+-------------+------+
| empId       | int  |
| bonus       | int  |
+-------------+------+
empId is the column of unique values for this table.
empId is a foreign key (reference column) to empId from the Employee table.
Each row of this table contains the id of an employee and their respective bonus.
~~~

Write a solution to report the name and bonus amount of each employee who satisfies either of the following:

- The employee has a bonus **less than** `1000`.

- The employee did not get any bonus.

Return the result table in **any order**.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Employee table:
+-------+--------+------------+--------+
| empId | name   | supervisor | salary |
+-------+--------+------------+--------+
| 3     | Brad   | null       | 4000   |
| 1     | John   | 3          | 1000   |
| 2     | Dan    | 3          | 2000   |
| 4     | Thomas | 3          | 4000   |
+-------+--------+------------+--------+
Bonus table:
+-------+-------+
| empId | bonus |
+-------+-------+
| 2     | 500   |
| 4     | 2000  |
+-------+-------+
Output:
+------+-------+
| name | bonus |
+------+-------+
| Brad | null  |
| John | null  |
| Dan  | 500   |
+------+-------+
~~~

## SQL Solution #1

~~~sql
SELECT
    e.name,
    b.bonus
FROM employee e
LEFT JOIN bonus b ON e.empId = b.empId
WHERE b.bonus < 1000
OR b.bonus IS NULL
;
~~~

_Dialect: MySQL_
