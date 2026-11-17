# StrataScratch Challenge 10322: Finding User Purchases

**Source:** [View challenge](https://platform.stratascratch.com/coding/10322-finding-user-purchases)

## Challenge

Identify returning active users by finding users who made a second purchase within 1 to 7 days after their first purchase. Ignore same-day purchases. Output a list of these `user_ids`.

## SQL Solution #1

~~~sql
WITH purchase_tank_table AS (
    SELECT
        user_id,
        created_at AS curr_purchase_date,
        ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY created_at) AS purchase_rank,
        LAG(created_at) OVER(PARTITION BY user_id ORDER BY created_at) AS prev_purchase_date
    FROM amazon_transactions
)
SELECT
    user_id
FROM purchase_tank_table
WHERE purchase_rank = 2
AND DATEDIFF(curr_purchase_date, prev_purchase_date) BETWEEN 1 AND 7
;
~~~

_Dialect: PostgreSQL_
