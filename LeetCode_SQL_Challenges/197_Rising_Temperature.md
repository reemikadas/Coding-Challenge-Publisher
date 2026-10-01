# LeetCode Challenge 197: Rising Temperature

**Source:** [View challenge](https://leetcode.com/problems/rising-temperature/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Weather`

~~~text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| id            | int     |
| recordDate    | date    |
| temperature   | int     |
+---------------+---------+
id is the column with unique values for this table.
There are no different rows with the same recordDate.
This table contains information about the temperature on a certain day.
~~~

Write a solution to find all dates' `id` with higher temperatures compared to its previous dates (yesterday).

Return the result table in **any order**.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Weather table:
+----+------------+-------------+
| id | recordDate | temperature |
+----+------------+-------------+
| 1  | 2015-01-01 | 10          |
| 2  | 2015-01-02 | 25          |
| 3  | 2015-01-03 | 20          |
| 4  | 2015-01-04 | 30          |
+----+------------+-------------+
Output:
+----+
| id |
+----+
| 2  |
| 4  |
+----+
Explanation:
In 2015-01-02, the temperature was higher than the previous day (10 -> 25).
In 2015-01-04, the temperature was higher than the previous day (20 -> 30).
~~~

## SQL Solution #1

~~~sql
WITH temp_comparison AS (
    SELECT
        id,
        recordDate AS current_day,
        LAG(recordDate) OVER(ORDER BY recordDate) AS previous_day,
        temperature AS current_day_temperature,
        LAG(temperature) OVER(ORDER BY recordDate) AS previous_day_temperature
    FROM weather
)
SELECT
    id
FROM temp_comparison
WHERE DATEDIFF(current_day, previous_day) = 1
AND current_day_temperature > previous_day_temperature
;
~~~

_Dialect: MySQL_
