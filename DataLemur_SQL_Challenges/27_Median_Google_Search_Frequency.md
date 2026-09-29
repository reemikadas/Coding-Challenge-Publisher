# DataLemur Challenge 27: Median Google Search Frequency

**Source:** [View challenge](https://datalemur.com/questions/median-search-freq)

## Challenge

Google's marketing team is making a Superbowl commercial and needs a simple statistic to put on their TV ad: the median number of searches a person made last year.

However, at Google scale, querying the 2 trillion searches is too costly. Luckily, you have access to the summary table which tells you the number of searches made last year and how many Google users fall into that bucket.

Write a query to report the median of searches made by a user. Round the median to one decimal point.

### `search_frequency` Table: 
|Column Name|Type|
|:----|:----|
|searches|integer|
|num_users|integer|

### `search_frequency` Example Input: 
|searches|num_users|
|:----|:----|
|1|2|
|2|2|
|3|3|
|4|1|

### Example Output: 
|median|
|:----|
|2.5|

By expanding the search_frequency table, we get [1, 1, 2, 2, 3, 3, 3, 4] which has a median of 2.5 searches per user.

The dataset you are querying against may have different input & output - **this is just an example**!

p.s. here's more [Google SQL Interview Questions](https://datalemur.com/blog/google-sql-interview-questions) to practice!

## SQL Solution #1

~~~sql
WITH RECURSIVE expand_searches AS (
    SELECT searches, num_users, 1 AS counter
    FROM search_frequency
    
    UNION ALL
    
    SELECT searches, num_users, counter+1
    FROM expand_searches
    WHERE counter < num_users
),
  median_table AS (
    SELECT
      searches, 
      ROW_NUMBER() OVER() AS rn,
      COUNT(*) OVER() AS total_counts
    FROM expand_searches
    ORDER BY searches
)
SELECT
  ROUND(AVG(searches),1) AS median
FROM median_table
WHERE rn = FLOOR((total_counts + 1) / 2)
OR rn = CEIL((total_counts + 1) / 2)
;
~~~

_Dialect: MySQL_
