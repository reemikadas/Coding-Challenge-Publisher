# DataLemur Challenge 58: User Shopping Sprees

**Source:** [View challenge](https://datalemur.com/questions/amazon-shopping-spree)

## Challenge

In an effort to identify high-value customers, Amazon asked for your help to obtain data about users who go on shopping sprees. A shopping spree occurs when a user makes purchases on 3 or more consecutive days. 

List the user IDs who have gone on at least 1 shopping spree in ascending order.

### `transactions` Table:
|**Column Name**|**Type**|
|:----|:----|
|user_id|integer|
|amount|float|
|transaction_date|timestamp|

### `transactions` Example Input:
|user_id|amount|transaction_date|
|:----|:----|:----|
|1|9.99|08/01/2022 10:00:00|
|1|55|08/17/2022 10:00:00|
|2|149.5|08/05/2022 10:00:00|
|2|4.89|08/06/2022 10:00:00|
|2|34|08/07/2022 10:00:00|

### Example Output:
|user_id|
|:----|
|2|

### Explanation
In this example, `user_id` 2 is the only one who has gone on a shopping spree.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH row_num_table AS (
  SELECT
    user_id,
    transaction_date::DATE AS trans_date,
    ROW_NUMBER()
      OVER(PARTITION BY user_id ORDER BY transaction_date::DATE) AS rn
  FROM transactions
),
  consecutive_day_table AS (
  SELECT
    user_id,
    trans_date::DATE - rn::INT AS date_diff,
    COUNT(*) AS shop_spree_count
  FROM row_num_table
  GROUP BY user_id, date_diff
  HAVING COUNT(*) >= 3
  ORDER BY user_id  
)
SELECT user_id FROM consecutive_day_table
;
~~~

_Dialect: PostgreSQL_
