# LeetCode Challenge 626: Exchange Seats

**Source:** [View challenge](https://leetcode.com/problems/exchange-seats/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Seat`

~~~text
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| student     | varchar |
+-------------+---------+
id is the primary key (unique value) column for this table.
Each row of this table indicates the name and the ID of a student.
The ID sequence always starts from 1 and increments continuously.
~~~

Write a solution to swap the seat id of every two consecutive students. If the number of students is odd, the id of the last student is not swapped.

Return the result table ordered by `id` **in ascending order**.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Seat table:
+----+---------+
| id | student |
+----+---------+
| 1  | Abbot   |
| 2  | Doris   |
| 3  | Emerson |
| 4  | Green   |
| 5  | Jeames  |
+----+---------+
Output:
+----+---------+
| id | student |
+----+---------+
| 1  | Doris   |
| 2  | Abbot   |
| 3  | Green   |
| 4  | Emerson |
| 5  | Jeames  |
+----+---------+
Explanation:
Note that if the number of students is odd, there is no need to change the last one's seat.
~~~

## SQL Solution #1

~~~sql
SELECT
    CASE
        WHEN id % 2 = 0 THEN id - 1
        WHEN id = (SELECT MAX(id) FROM seat) AND id % 2 <> 0 THEN id
        WHEN id % 2 <> 0 THEN id + 1
    END AS id,
    student
FROM seat
ORDER BY id
;
~~~

_Dialect: MySQL_
