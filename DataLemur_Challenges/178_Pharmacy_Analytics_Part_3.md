# DataLemur Challenge 178: Pharmacy Analytics (Part 3)

**Source:** [View challenge](https://datalemur.com/questions/total-drugs-sales)

## Challenge

CVS Health wants to gain a clearer understanding of its pharmacy sales and the performance of various products.

Write a query to calculate the total drug sales for each manufacturer. Round the answer to the nearest million and report your results in descending order of total sales. In case of any duplicates, sort them alphabetically by the manufacturer name.

Since this data will be displayed on a dashboard viewed by business stakeholders, please format your results as follows: "$36 million".

If you like this question, try out [Pharmacy Analytics (Part 4)](https://datalemur.com/questions/top-drugs-sold)!

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
|94|132362|2041758.41|1373721.70|Biogen|UP and UP|
|9|37410|293452.54|208876.01|Eli Lilly|Zyprexa|
|50|90484|2521023.73|2742445.9|Eli Lilly|Dermasorb|TA Complete Kit|
|61|77023|500101.61|419174.97|Biogen|Varicose Relief|
|136|144814|1084258.00|1006447.73|Biogen|Burkhart|

### Example Output:
|**manufacturer**|**sale**|
|:----|:----|
|Biogen|$4 million|
|Eli Lilly|$3 million|

### Explanation
The total sales for Biogen is \$4 million (\$2,041,758.41 + \$500,101.61 + \$1,084,258.00 = \$3,626,118.02) and for Eli Lilly is \$3 million (\$293,452.54 + \$2,521,023.73 = \$2,814,476.27).

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
SELECT
  manufacturer,
  CONCAT('$', ROUND(SUM(total_sales) / 1000000), ' million') AS sale
FROM pharmacy_sales
GROUP BY manufacturer
ORDER BY SUM(total_sales) DESC, manufacturer
;
~~~

_Dialect: MySQL_
