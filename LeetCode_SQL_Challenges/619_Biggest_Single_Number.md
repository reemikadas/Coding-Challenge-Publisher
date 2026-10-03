# LeetCode Challenge 619: Biggest Single Number

**Source:** [View challenge](https://leetcode.com/problems/biggest-single-number/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `MyNumbers`

~~~text
+-------------+------+
| Column Name | Type |
+-------------+------+
| num         | int  |
+-------------+------+
This table may contain duplicates (In other words, there is no primary key for this table in SQL).
Each row of this table contains an integer.
~~~

A **single number** is a number that appeared only once in the `MyNumbers` table.

Find the largest **single number**. If there is no **single number**, report `null`.

The result format is in the following example.

**Example 1:**

~~~text
Input:
MyNumbers table:
+-----+
| num |
+-----+
| 8   |
| 8   |
| 3   |
| 3   |
| 1   |
| 4   |
| 5   |
| 6   |
+-----+
Output:
+-----+
| num |
+-----+
| 6   |
+-----+
Explanation: The single numbers are 1, 4, 5, and 6.
Since 6 is the largest single number, we return it.
~~~

**Example 2:**

~~~text
Input:
MyNumbers table:
+-----+
| num |
+-----+
| 8   |
| 8   |
| 7   |
| 7   |
| 3   |
| 3   |
| 3   |
+-----+
Output:
+------+
| num  |
+------+
| null |
+------+
Explanation: There are no single numbers in the input table so we return null.
~~~

## SQL Solution #1

~~~sql
WITH number_occurrence AS (
        SELECT
            num,
            COUNT(*) AS cnt
        FROM mynumbers
        GROUP BY num
)
SELECT
    MAX(num) AS num
FROM
    (SELECT
        n.num
    FROM mynumbers m
    LEFT JOIN number_occurrence n ON m.num = n.num and n.cnt = 1) AS t1

;
~~~

_Dialect: MySQL_
