# StrataScratch Challenge 10789: Busiest Restaurants in June 2025

**Source:** [View challenge](https://platform.stratascratch.com/coding/10789-busiest-restaurants-in-june-2025)

## Challenge

The Merchant team at a food delivery marketplace wants to spotlight its busiest restaurants in the June 2025 partner newsletter. Find the top 5 restaurants by number of delivered orders placed in June 2025. Count only orders that were delivered, and assign each order to the month in which it was placed. If restaurants tie at the cutoff, include all tied restaurants, so the result can contain more than 5 rows.

Output the restaurant ID, restaurant name, and number of delivered orders.

## SQL Solution #1

~~~sql
WITH order_deliver_table AS (
    SELECT
        o.restaurant_id,
        r.name,
        COUNT(o.order_id) AS delivered_orders
    FROM fooddelivery_orders o
    LEFT JOIN fooddelivery_restaurants r ON o.restaurant_id = r.restaurant_id
    WHERE o.status = 'delivered'
    AND EXTRACT(YEAR FROM o.placed_at) = '2025' 
    AND EXTRACT(MONTH FROM o.placed_at) = '06'
    GROUP BY o.restaurant_id, r.name
)
SELECT
    restaurant_id,
    name,
    delivered_orders
FROM
    (SELECT
        *,
        DENSE_RANK() OVER(ORDER BY delivered_orders DESC) AS order_rank
    FROM order_deliver_table) t1
WHERE order_rank <= 5
;
~~~

_Dialect: PostgreSQL_
