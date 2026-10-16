# StrataScratch Challenge 9913: Order Details

**Source:** [View challenge](https://platform.stratascratch.com/coding/9913-order-details)

## Challenge

Find order details made by Jill and Eva.
Consider the Jill and Eva as first names of customers.
Output the order date, details and cost along with the first name.
Order records based on the customer id in ascending order.

## SQL Solution #1

~~~sql
SELECT
    c.first_name,
    o.order_date,
    o.order_details,
    o.total_order_cost
FROM customers c
INNER JOIN orders o ON c.id = o.cust_id
WHERE c.first_name IN ('Jill', 'Eva')
ORDER BY c.id
;
~~~

_Dialect: MySQL_
