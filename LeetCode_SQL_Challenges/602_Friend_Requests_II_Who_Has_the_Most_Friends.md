# LeetCode Challenge 602: Friend Requests II: Who Has the Most Friends

**Source:** [View challenge](https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `RequestAccepted`

~~~text
+----------------+---------+
| Column Name    | Type    |
+----------------+---------+
| requester_id   | int     |
| accepter_id    | int     |
| accept_date    | date    |
+----------------+---------+
(requester_id, accepter_id) is the primary key (combination of columns with unique values) for this table.
This table contains the ID of the user who sent the request, the ID of the user who received the request, and the date when the request was accepted.
~~~

Write a solution to find the people who have the most friends and the most friends number.

The test cases are generated so that only one person has the most friends.

The result format is in the following example.

**Example 1:**

~~~text
Input:
RequestAccepted table:
+--------------+-------------+-------------+
| requester_id | accepter_id | accept_date |
+--------------+-------------+-------------+
| 1            | 2           | 2016/06/03  |
| 1            | 3           | 2016/06/08  |
| 2            | 3           | 2016/06/08  |
| 3            | 4           | 2016/06/09  |
+--------------+-------------+-------------+
Output:
+----+-----+
| id | num |
+----+-----+
| 3  | 3   |
+----+-----+
Explanation:
The person with id 3 is a friend of people 1, 2, and 4, so he has three friends in total, which is the most number than any others.
~~~

**Follow up:** In the real world, multiple people could have the same most number of friends. Could you find all these people in this case?

## SQL Solution #1

~~~sql
WITH friend_count_table AS (
        SELECT
            requester_id AS id,
            COUNT(accepter_id) AS num
        FROM requestaccepted
        GROUP BY requester_id

            UNION ALL

        SELECT
            accepter_id AS id,
            COUNT(requester_id) AS num
        FROM requestaccepted
        GROUP BY accepter_id
),
    most_friend_table AS (
        SELECT
            id,
            SUM(num) AS num
        FROM friend_count_table
        GROUP BY id
)
SELECT
    id, num
FROM (
        SELECT
            *,
            DENSE_RANK() OVER(ORDER BY num DESC) AS rank_num
        FROM most_friend_table
) AS t1
WHERE rank_num = 1
;
~~~

_Dialect: MySQL_
