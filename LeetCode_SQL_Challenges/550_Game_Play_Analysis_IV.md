# LeetCode Challenge 550: Game Play Analysis IV

**Source:** [View challenge](https://leetcode.com/problems/game-play-analysis-iv/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Activity`

~~~text
+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| player_id    | int     |
| device_id    | int     |
| event_date   | date    |
| games_played | int     |
+--------------+---------+
(player_id, event_date) is the primary key (combination of columns with unique values) of this table.
This table shows the activity of players of some games.
Each row is a record of a player who logged in and played a number of games (possibly 0) before logging out on someday using some device.
~~~

Write a solution to report the **fraction** of players that logged in again on the day after the day they first logged in, **rounded to 2 decimal places**. In other words, you need to determine the number of players who logged in on the day immediately following their initial login, and divide it by the number of total players.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Activity table:
+-----------+-----------+------------+--------------+
| player_id | device_id | event_date | games_played |
+-----------+-----------+------------+--------------+
| 1         | 2         | 2016-03-01 | 5            |
| 1         | 2         | 2016-03-02 | 6            |
| 2         | 3         | 2017-06-25 | 1            |
| 3         | 1         | 2016-03-02 | 0            |
| 3         | 4         | 2018-07-03 | 5            |
+-----------+-----------+------------+--------------+
Output:
+-----------+
| fraction  |
+-----------+
| 0.33      |
+-----------+
Explanation:
Only the player with id 1 logged back in after the first day he had logged in so the answer is 1/3 = 0.33
~~~

## SQL Solution #1

~~~sql
WITH first_login_table AS (
    SELECT
        player_id,
        event_date AS first_event_date,
        ROW_NUMBER() OVER(PARTITION BY player_id ORDER BY event_date) AS first_login
    FROM activity
),
    first_login_filter AS (
        SELECT player_id, first_event_date
        FROM first_login_table
        WHERE first_login = 1
    )
SELECT
    ROUND(COUNT(a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM activity),
            2) AS fraction
FROM activity a
JOIN first_login_filter f ON a.player_id = f.player_id
                        AND a.event_date = DATE_ADD(f.first_event_date, INTERVAL 1 DAY)
;
~~~

_Dialect: MySQL_
