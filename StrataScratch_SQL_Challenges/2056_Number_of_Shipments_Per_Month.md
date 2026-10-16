# StrataScratch Challenge 2056: Number of Shipments Per Month

**Source:** [View challenge](https://platform.stratascratch.com/coding/2056-number-of-shipments-per-month)

## Challenge

Write a query that will calculate the number of shipments per month. The unique key for one shipment is a combination of `shipment_id` and `sub_id`. Output the `year_month` in format `YYYY-MM` and the number of shipments in that month.

## SQL Solution #1

~~~sql
SELECT
    DATE_FORMAT(shipment_date, '%Y-%m') AS date_ym,
    COUNT(DISTINCT shipment_id, sub_id) AS num_of_shipments
FROM amazon_shipment
GROUP BY DATE_FORMAT(shipment_date, '%Y-%m')
;
~~~

_Dialect: MySQL_
