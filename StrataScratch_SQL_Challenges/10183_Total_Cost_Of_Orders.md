# StrataScratch Challenge 10183: Total Cost Of Orders

**Source:** [View challenge](https://platform.stratascratch.com/coding/10183-total-cost-of-orders)

## Challenge

Find the total cost of each customer's orders. Output customer's id, first name, and the total order cost. Order records by customer's first name alphabetically.

## SQL Solution #1

~~~sql
SELECT
    c.id,
    c.first_name,
    SUM(o.total_order_cost) AS total_order_cost
FROM customers c
JOIN orders o ON c.id = o.cust_id
GROUP BY c.id, c.first_name
ORDER BY c.first_name
;
~~~

_Dialect: PostgreSQL_
