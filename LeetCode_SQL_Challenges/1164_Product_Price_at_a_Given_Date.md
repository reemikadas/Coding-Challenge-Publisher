# LeetCode Challenge 1164: Product Price at a Given Date

**Source:** [View challenge](https://leetcode.com/problems/product-price-at-a-given-date/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Products`

~~~text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| product_id    | int     |
| new_price     | int     |
| change_date   | date    |
+---------------+---------+
(product_id, change_date) is the primary key (combination of columns with unique values) of this table.
Each row of this table indicates that the price of some product was changed to a new price at some date.
~~~

Initially, all products have price 10.

Write a solution to find the prices of all products on the date `2019-08-16`.

Return the result table in **any order**.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Products table:
+------------+-----------+-------------+
| product_id | new_price | change_date |
+------------+-----------+-------------+
| 1          | 20        | 2019-08-14  |
| 2          | 50        | 2019-08-14  |
| 1          | 30        | 2019-08-15  |
| 1          | 35        | 2019-08-16  |
| 2          | 65        | 2019-08-17  |
| 3          | 20        | 2019-08-18  |
+------------+-----------+-------------+
Output:
+------------+-------+
| product_id | price |
+------------+-------+
| 2          | 50    |
| 1          | 35    |
| 3          | 10    |
+------------+-------+
~~~

## SQL Solution #1

~~~sql
WITH product_filter AS (
        SELECT
            *,
            ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY change_date DESC) AS rn
        FROM products
        WHERE change_date <= '2019-08-16'
)
SELECT
    p.product_id,
    IFNULL(f.new_price, 10) AS price
FROM (SELECT DISTINCT product_id FROM products) p
LEFT JOIN product_filter f ON p.product_id = f.product_id AND f.rn=1
;
~~~

_Dialect: MySQL_
