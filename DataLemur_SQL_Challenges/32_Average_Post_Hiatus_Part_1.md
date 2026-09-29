# DataLemur Challenge 32: Average Post Hiatus (Part 1)

**Source:** [View challenge](https://datalemur.com/questions/sql-average-post-hiatus-1)

## Challenge

Given a table of Facebook posts, for each user who posted at least twice in 2021, write a query to find the number of days between each user’s first post of the year and last post of the year in the year 2021. Output the user and number of the days between each user's first and last post. 

p.s. If you've read the [Ace the Data Science Interview](https://www.amazon.com/dp/0578973839?ref_=pe_3052080_397514860) and liked it, consider writing us a review?

### `posts` Table:
|Column Name|Type|
|:----|:----|
|user_id|integer|
|post_id|integer|
|post_content|text|
|post_date|timestamp|

### `posts` Example Input:
|user_id|post_id|post_content|post_date
|:----|:----|:----|:----|
|151652|599415|Need a hug|07/10/2021 12:00:00|
|661093|624356|Bed. Class 8-12. Work 12-3. Gym 3-5 or 6. Then class 6-10. Another day that's gonna fly by. I miss my girlfriend|07/29/2021 13:00:00|
|004239|784254|Happy 4th of July!|07/04/2021 11:00:00|
|661093|442560|Just going to cry myself to sleep after watching Marley and Me.|07/08/2021 14:00:00|
|151652|111766|I'm so done with covid - need travelling ASAP!|07/12/2021 19:00:00|

### Example Output:
|user_id|days_between|
|:----|:----|
|151652|2|
|661093|21|

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
SELECT
  user_id,
  DATEDIFF(MAX(post_date), MIN(post_date)) AS days_between
FROM posts
WHERE YEAR(post_date) = '2021'
AND user_id IN (
                  SELECT user_id FROM posts
                  WHERE YEAR(post_date) = '2021'
                  GROUP BY user_id
                  HAVING COUNT(*) >= 2
                )
GROUP BY user_id
;
~~~

_Dialect: MySQL_
