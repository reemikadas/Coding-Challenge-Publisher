# LeetCode Challenge 180: Consecutive Numbers

**Source:** [View challenge](https://leetcode.com/problems/consecutive-numbers/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Logs`

~~~text
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| num         | varchar |
+-------------+---------+
In SQL, id is the primary key for this table.
id is an autoincrement column starting from 1.
~~~

Find all numbers that appear at least three times consecutively.

Return the result table in **any order**.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Logs table:
+----+-----+
| id | num |
+----+-----+
| 1  | 1   |
| 2  | 1   |
| 3  | 1   |
| 4  | 2   |
| 5  | 1   |
| 6  | 2   |
| 7  | 2   |
+----+-----+
Output:
+-----------------+
| ConsecutiveNums |
+-----------------+
| 1               |
+-----------------+
Explanation: 1 is the only number that appears consecutively for at least three times.
~~~

## SQL Solution #1

~~~sql
WITH consecutive_table AS (
        SELECT
            *,
            LAG(num) OVER(ORDER BY id) AS lag_1,
            LAG(num, 2) OVER(ORDER BY id) AS lag_2
        FROM logs
)
SELECT DISTINCT num AS ConsecutiveNums
FROM consecutive_table
WHERE lag_2 IS NOT NULL
AND (num = lag_1 AND lag_1 = lag_2)
;
~~~

_Dialect: MySQL_
