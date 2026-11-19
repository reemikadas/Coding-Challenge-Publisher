# StrataScratch Challenge 10553: Finding Purchases

**Source:** [View challenge](https://platform.stratascratch.com/coding/10553-finding-purchases)

## Challenge

Identify returning active users by finding users who made a repeat purchase within 7 days or less of their previous transaction, excluding same-day purchases. Output a list of these `user_id`.

## SQL Solution #1

~~~sql
WITH week_transaction_table AS (
    SELECT
        *,
        DATEDIFF(curr_trans_date, prev_trans_date) AS difference
    FROM
        (SELECT
            user_id,
            created_at AS curr_trans_date,
            LAG(created_at) OVER(
                PARTITION BY user_id ORDER BY created_at) AS prev_trans_date
        FROM amazon_transactions) t1
    WHERE prev_trans_date IS NOT NULL
    AND prev_trans_date != curr_trans_date
)
SELECT
    DISTINCT user_id
FROM week_transaction_table
WHERE difference <= 7
ORDER BY user_id
;
~~~

_Dialect: PostgreSQL_
