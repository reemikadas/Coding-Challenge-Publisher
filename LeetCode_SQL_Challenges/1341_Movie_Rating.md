# LeetCode Challenge 1341: Movie Rating

**Source:** [View challenge](https://leetcode.com/problems/movie-rating/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Movies`

~~~text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| movie_id      | int     |
| title         | varchar |
+---------------+---------+
movie_id is the primary key (column with unique values) for this table.
title is the name of the movie.
Each movie has a unique title.
~~~

Table: `Users`

~~~text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| user_id       | int     |
| name          | varchar |
+---------------+---------+
user_id is the primary key (column with unique values) for this table.
The column 'name' has unique values.
~~~

Table: `MovieRating`

~~~text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| movie_id      | int     |
| user_id       | int     |
| rating        | int     |
| created_at    | date    |
+---------------+---------+
(movie_id, user_id) is the primary key (column with unique values) for this table.
This table contains the rating of a movie by a user in their review.
created_at is the user's review date.
~~~

Write a solution to:

- Find the name of the user who has rated the greatest number of movies. In case of a tie, return the lexicographically smaller user name.

- Find the movie name with the **highest average** rating in `February 2020`. In case of a tie, return the lexicographically smaller movie name.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Movies table:
+-------------+--------------+
| movie_id    |  title       |
+-------------+--------------+
| 1           | Avengers     |
| 2           | Frozen 2     |
| 3           | Joker        |
+-------------+--------------+
Users table:
+-------------+--------------+
| user_id     |  name        |
+-------------+--------------+
| 1           | Daniel       |
| 2           | Monica       |
| 3           | Maria        |
| 4           | James        |
+-------------+--------------+
MovieRating table:
+-------------+--------------+--------------+-------------+
| movie_id    | user_id      | rating       | created_at  |
+-------------+--------------+--------------+-------------+
| 1           | 1            | 3            | 2020-01-12  |
| 1           | 2            | 4            | 2020-02-11  |
| 1           | 3            | 2            | 2020-02-12  |
| 1           | 4            | 1            | 2020-01-01  |
| 2           | 1            | 5            | 2020-02-17  |
| 2           | 2            | 2            | 2020-02-01  |
| 2           | 3            | 2            | 2020-03-01  |
| 3           | 1            | 3            | 2020-02-22  |
| 3           | 2            | 4            | 2020-02-25  |
+-------------+--------------+--------------+-------------+
Output:
+--------------+
| results      |
+--------------+
| Daniel       |
| Frozen 2     |
+--------------+
Explanation:
Daniel and Monica have rated 3 movies ("Avengers", "Frozen 2" and "Joker") but Daniel is smaller lexicographically.
Frozen 2 and Joker have a rating average of 3.5 in February but Frozen 2 is smaller lexicographically.
~~~

## SQL Solution #1

~~~sql
WITH movie_table AS (
        SELECT
            mr.movie_id,
            m.title,
            mr.user_id,
            u.name,
            mr.rating,
            mr.created_at
        FROM movierating mr
        LEFT JOIN movies m ON mr.movie_id = m.movie_id
        LEFT JOIN users u ON mr.user_id = u.user_id
),
    user_by_high_movie_count AS (
        SELECT
            user_id,
            name,
            COUNT(movie_id) AS movie_cnt,
            ROW_NUMBER() OVER(ORDER BY COUNT(movie_id) DESC, name) AS rn
        FROM movie_table
        GROUP BY user_id, name
    ),
    highest_average_rating_title AS (
        SELECT
            title AS results
        FROM movie_table
        WHERE YEAR(created_at) = '2020' AND MONTH(created_at) = '2'
        GROUP BY title
        ORDER BY AVG(rating) DESC, title
        LIMIT 1
    )
 SELECT name AS results
 FROM user_by_high_movie_count
 WHERE rn = 1
 
    UNION ALL
 
 SELECT * FROM highest_average_rating_title
;
~~~

_Dialect: MySQL_
