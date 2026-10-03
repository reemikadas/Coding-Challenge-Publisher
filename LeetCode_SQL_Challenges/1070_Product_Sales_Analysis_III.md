# LeetCode Challenge 1070: Product Sales Analysis III

**Source:** [View challenge](https://leetcode.com/problems/product-sales-analysis-iii/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Sales`

~~~text
+-------------+-------+
| Column Name | Type  |
+-------------+-------+
| sale_id     | int   |
| product_id  | int   |
| year        | int   |
| quantity    | int   |
| price       | int   |
+-------------+-------+
(sale_id, year) is the primary key (combination of columns with unique values) of this table.
Each row records a sale of a product in a given year.
A product may have multiple sales entries in the same year.
Note that the per-unit price.
~~~

Write a solution to find all sales that occurred in the **first year** each product was sold.

-
	For each `product_id`, identify the earliest `year` it appears in the `Sales` table.

-
	Return **all** sales entries for that product in that year.

Return a table with the following columns: **product_id**,** first_year**, **quantity, **and** price**.**
Return the result in any order.

**Example 1:**

~~~text
Input:
Sales table:
+---------+------------+------+----------+-------+
| sale_id | product_id | year | quantity | price |
+---------+------------+------+----------+-------+
| 1       | 100        | 2008 | 10       | 5000  |
| 2       | 100        | 2009 | 12       | 5000  |
| 7       | 200        | 2011 | 15       | 9000  |
+---------+------------+------+----------+-------+

Output:
+------------+------------+----------+-------+
| product_id | first_year | quantity | price |
+------------+------------+----------+-------+
| 100        | 2008       | 10       | 5000  |
| 200        | 2011       | 15       | 9000  |
+------------+------------+----------+-------+
~~~

## SQL Solution #1

~~~sql
WITH first_year_table AS (
    SELECT
        *,
        DENSE_RANK() OVER(PARTITION BY product_id ORDER BY year) AS first_year_num
    FROM sales
)
SELECT
    product_id,
    year AS first_year,
    quantity,
    price
FROM first_year_table
WHERE first_year_num = 1
;
~~~

_Dialect: MySQL_
