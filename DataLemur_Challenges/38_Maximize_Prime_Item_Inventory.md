# DataLemur Challenge 38: Maximize Prime Item Inventory

**Source:** [View challenge](https://datalemur.com/questions/prime-warehouse-storage)

## Challenge

*Effective April 3rd 2024, we have updated the problem statement to provide additional clarity.*

Amazon wants to maximize the storage capacity of its 500,000 square-foot warehouse by prioritizing a specific batch of prime items. The specific prime product batch detailed in the `inventory` table must be maintained.

So, if the prime product batch specified in the `item_category` column included 1 laptop and 1 side table, that would be the base batch. We could not add another laptop without also adding a side table; they come all together as a batch set.

After prioritizing the maximum number of prime batches, any remaining square footage will be utilized to stock non-prime batches, which also come in batch sets and cannot be separated into individual items.

Write a query to find the maximum number of prime and non-prime batches that can be stored in the 500,000 square feet warehouse based on the following criteria:

- Prioritize stocking prime batches
- After accommodating prime items, allocate any remaining space to non-prime batches

Output the `item_type` with `prime_eligible` first followed by `not_prime`, along with the maximum number of batches that can be stocked.

Assumptions:
- Again, products must be stocked in batches, so we want to find the largest available quantity of prime batches, and then the largest available quantity of non-prime batches
- Non-prime items must always be available in stock to meet customer demand, so the non-prime item count should never be zero.
- Item count should be whole numbers (integers). 


### `inventory` table:
|Column Name|Type|
|:----|:----|
|item_id|integer|
|item_type|string|
|item_category|string|
|square_footage|decimal|

### `inventory` Example Input: 
|item_id|item_type|item_category|square_footage|
|:----|:----|:----|:----|
|1374|prime_eligible|mini refrigerator|68.00|
|4245|not_prime|standing lamp|26.40|
|2452|prime_eligible|television|85.00|
|3255|not_prime|side table|22.60|
|1672|prime_eligible|laptop|8.50|

### Example Output: 
|item_type|item_count|
|:----|:----|
|prime_eligible|9285|
|not_prime|6|

The dataset you are querying against may have different input & output - **this is just an example**!

### Practice Other Amazon SQL Interview Questions:

To get more insight into the Amazon SQL interview process, practice these [Amazon SQL interview questions](https://datalemur.com/blog/amazon-sql-interview-questions):
![Amazon SQL Interview Guide](https://api.datalemur.com/assets/74d0a619-2138-4e73-bd02-91d5c02d208e)

## SQL Solution #1

~~~sql
WITH batch_summary AS (
    SELECT
      item_type,
      SUM(square_footage) AS batch_area,
      COUNT(*) AS items_per_batch
    FROM inventory
    GROUP BY item_type
),
  prime_batch AS (
    SELECT
      *,
      FLOOR(500000 / batch_area) AS number_of_batches,
      (FLOOR(500000 / batch_area) * batch_area) AS occupied_area,
      (FLOOR(500000 / batch_area) * items_per_batch) AS total_prime_items
    FROM batch_summary
    WHERE item_type = 'prime_eligible'  
),
  not_prime_batch AS (
    SELECT
      *,
      (500000 - (SELECT occupied_area FROM prime_batch)) AS remaining_area,
      FLOOR(((500000 - (SELECT occupied_area FROM prime_batch)))/
      batch_area) AS number_of_batches,
      (FLOOR(((500000 - (SELECT occupied_area FROM prime_batch)))/
      batch_area) * items_per_batch) AS total_not_prime_items
    FROM batch_summary
    WHERE item_type = 'not_prime'  
)
SELECT
  item_type,
  total_prime_items AS item_count
FROM prime_batch

UNION ALL

SELECT
  item_type,
  total_not_prime_items AS item_count
FROM not_prime_batch

ORDER BY item_type DESC
;
~~~

_Dialect: PostgreSQL_
