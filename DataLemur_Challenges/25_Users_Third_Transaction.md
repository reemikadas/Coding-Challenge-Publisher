# DataLemur Challenge 25: User's Third Transaction

**Source:** [View challenge](https://datalemur.com/questions/sql-third-transaction)

## Challenge

This is the same question as problem #11 in the SQL Chapter of [Ace the Data Science Interview](https://amzn.to/3kF79Fx)!

Assume you are given the table below on Uber transactions made by users. Write a query to obtain the third transaction of every user. Output the user id, spend and transaction date.

### `transactions` Table:
|**Column Name**|**Type**|
|:----|:----|
|user_id|integer|
|spend|decimal|
|transaction_date|timestamp|

### `transactions` Example Input:
|**user_id**|**spend**|**transaction_date**|
|:----|:----|:----|
|111|100.50|01/08/2022 12:00:00|
|111|55.00|01/10/2022 12:00:00|
|121|36.00|01/18/2022 12:00:00|
|145|24.99|01/26/2022 12:00:00|
|111|89.60|02/05/2022 12:00:00|

### Example Output:
|**user_id**|**spend**|**transaction_date**|
|:----|:----|:----|
|111|89.60|02/05/2022 12:00:00|

The dataset you are querying against may have different input & output - **this is just an example**!

p.s. for more Uber SQL interview tips & problems, check out the [Uber SQL Interview Guide](https://datalemur.com/blog/uber-sql-interview-questions)

## SQL Solution #1

~~~sql
WITH uber_table AS (
  SELECT
    *,
    ROW_NUMBER()
      OVER(PARTITION BY user_id ORDER BY transaction_date) AS rn
  FROM transactions
)
SELECT
  user_id,
  spend,
  transaction_date
FROM uber_table
WHERE rn = 3
;
~~~

_Dialect: MySQL_
