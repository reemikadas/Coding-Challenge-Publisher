# DataLemur Challenge 29: Histogram of Users and Purchases

**Source:** [View challenge](https://datalemur.com/questions/histogram-users-purchases)

## Challenge

This is the same question as problem #13 in the SQL Chapter of [Ace the Data Science Interview](https://amzn.to/3kF79Fx)!

Assume you're given a table on Walmart user transactions. Based on their most recent transaction date, write a query that retrieve the users along with the number of products they bought. 

Output the user's most recent transaction date, user ID, and the number of products, sorted in chronological order by the transaction date.

### `user_transactions` Table:
|Column Name|Type|
|:----|:----|
|product_id|integer|
|user_id|integer|
|spend|decimal|
|transaction_date|timestamp|

### `user_transactions` Example Input:
|product_id|user_id|spend|transaction_date|
|:----|:----|:----|:----|
|3673|123|68.90|07/08/2022 12:00:00|
|9623|123|274.10|07/08/2022 12:00:00|
|1467|115|19.90|07/08/2022 12:00:00|
|2513|159|25.00|07/08/2022 12:00:00|
|1452|159|74.50|07/10/2022 12:00:00|

### Example Output:
|transaction_date|user_id | purchase_count|
|:----|:----|:----|
|07/08/2022 12:00:00|115|1|
|07/08/2022 12:00:000|123|2|
|07/10/2022 12:00:00|159|1|

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH recent_transaction AS (
  SELECT
    user_id,
    product_id,
    transaction_date,
    DENSE_RANK()
      OVER(PARTITION BY user_id ORDER BY transaction_date DESC) AS dr
  FROM user_transactions
)
SELECT
  transaction_date,
  user_id,
  COUNT(product_id) AS purchase_count
FROM recent_transaction
WHERE dr = 1
GROUP BY transaction_date, user_id
ORDER BY transaction_date
;
~~~

_Dialect: MySQL_
