# DataLemur Challenge 177: Pharmacy Analytics (Part 2)

**Source:** [View challenge](https://datalemur.com/questions/non-profitable-drugs)

## Challenge

CVS Health is analyzing its pharmacy sales data, and how well different products are selling in the market. Each drug is exclusively manufactured by a single manufacturer.

Write a query to identify the manufacturers associated with the drugs that resulted in losses for CVS Health and calculate the total amount of losses incurred. 

Output the manufacturer's name, the number of drugs associated with losses, and the total losses in absolute value. Display the results sorted in descending order with the highest losses displayed at the top.

If you like this question, try out [Pharmacy Analytics (Part 3)](https://datalemur.com/questions/total-drugs-sales)!

### `pharmacy_sales` Table:
|**Column Name**|**Type**|
|:----|:----|
|product_id|integer|
|units_sold|integer|
|total_sales|decimal|
|cogs|decimal|
|manufacturer|varchar|
|drug|varchar|

### `pharmacy_sales` Example Input:
|**product_id**|**units_sold**|**total_sales**|**cogs**|**manufacturer**|**drug**|
|:----|:----|:----|:----|:----|:----|
|156|89514|3130097.00|3427421.73|Biogen|Acyclovir|
|25|222331|2753546.00|2974975.36|AbbVie|Lamivudine and Zidovudine|
|50|90484|2521023.73|2742445.90|Eli Lilly|Dermasorb TA Complete Kit|
|98|110746|813188.82|140422.87|Biogen|Medi-Chord|

### Example Output:
|**manufacturer**|**drug_count**|**total_loss**|
|:----|:----|:----|
|Biogen|1|297324.73|
|AbbVie|1|221429.36|
|Eli Lilly|1|221422.17|

### Explanation:
The first three rows indicate that some drugs resulted in losses. Among these, Biogen had the highest losses, followed by AbbVie and Eli Lilly. However, the Medi-Chord drug manufactured by Biogen reported a profit and was excluded from the result.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH filtered_table AS (
  SELECT
    drug,
    manufacturer
  FROM pharmacy_sales
  GROUP BY drug, manufacturer
  HAVING COUNT(*) = 1
),
  loss_table AS (
    SELECT
      drug,
      manufacturer,
      ABS(SUM(total_sales) - SUM(cogs)) AS total_loss
    FROM pharmacy_sales
    WHERE drug IN (SELECT drug FROM filtered_table)
    AND manufacturer IN (SELECT manufacturer FROM filtered_table)
    GROUP BY drug, manufacturer
    HAVING SUM(total_sales) - SUM(cogs) < 0
    ORDER BY manufacturer, drug
  )
SELECT
  manufacturer,
  COUNT(*) AS drug_count,
  SUM(total_loss) AS total_loss
FROM loss_table
GROUP BY manufacturer
ORDER BY SUM(total_loss) DESC
;
~~~

_Dialect: MySQL_
