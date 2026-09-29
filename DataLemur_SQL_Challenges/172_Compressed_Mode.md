# DataLemur Challenge 172: Compressed Mode

**Source:** [View challenge](https://datalemur.com/questions/alibaba-compressed-mode)

## Challenge

You're given a table containing the item count for each order on Alibaba, along with the frequency of orders that have the same item count. Write a query to retrieve the mode of the order occurrences. Additionally, if there are multiple item counts with the same mode, the results should be sorted in ascending order.

Clarifications:
- `item_count`: Represents the number of items sold in each order.
- `order_occurrences`: Represents the frequency of orders with the corresponding number of items sold per order.
- For example, if there are 800 orders with 3 items sold in each order, the record would have an `item_count` of 3 and an `order_occurrences` of 800.

*Effective June 14th, 2023, the problem statement has been revised and additional clarification have been added for clarity.*

### `items_per_order` Table:
|Column Name|Type|
|:----|:----|
|item_count|integer|
|order_occurrences|integer|

### `items_per_order` Example Input:
| item_count | order_occurrences | 
|:----|:----|
| 1 | 500| 
| 2 | 1000| 
| 3 | 800| 

### Example Output:
|mode|
|:----|
|2|

### Explanation:

Based on the example output, the `order_occurrences` value of 1000 corresponds to the highest frequency among all item counts. This means that item count of 2 has occurred 1000 times, making it the mode of order occurrences.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH mode_table AS (
  SELECT
    *,
    DENSE_RANK() OVER(ORDER BY order_occurrences DESC) AS dr
  FROM items_per_order
)
SELECT
  item_count AS mode
FROM mode_table
WHERE dr = 1
ORDER BY item_count
;
~~~

_Dialect: PostgreSQL_
