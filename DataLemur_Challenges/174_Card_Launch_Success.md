# DataLemur Challenge 174: Card Launch Success

**Source:** [View challenge](https://datalemur.com/questions/card-launch-success)

## Challenge

Your team at JPMorgan Chase is soon launching a new credit card. You are asked to estimate how many cards you'll issue in the first month.

Before you can answer this question, you want to first get some perspective on how well new credit card launches typically do in their first month. 

Write a query that outputs the name of the credit card, and how many cards were issued in its launch month. The launch month is the earliest record in the `monthly_cards_issued` table for a given card. Order the results starting from the biggest issued amount.
 
### `monthly_cards_issued` Table:
|Column Name|Type|
|:----|:----|
|issue_month|integer|
|issue_year|integer|
|card_name|string|
|issued_amount|integer|

### `monthly_cards_issued` Example Input:
|issue_month | issue_year | card_name | issued_amount|
|:----|:----|:----|:----|
|1 | 2021 | Chase Sapphire Reserve | 170000|
|2 | 2021 | Chase Sapphire Reserve | 175000|
|3 | 2021 | Chase Sapphire Reserve | 180000|
|3 | 2021 | Chase Freedom Flex | 65000|
|4 | 2021 | Chase Freedom Flex | 70000|

### Example Output:
|card_name|issued_amount|
|:----|:----|
|Chase Sapphire Reserve | 170000|
|Chase Freedom Flex | 65000|

### Explanation

Chase Sapphire Reserve card was launched on 1/2021 with an issued amount of 170,000 cards and the Chase Freedom Flex card was launched on 3/2021 with an issued amount of 65,000 cards. 

The dataset you are querying against may have different input & output - **this is just an example**!

**Hint**: Try using a [window functio](https://datalemur.com/blog/sql-window-functions-interview-questions)n 👀

## SQL Solution #1

~~~sql
WITH launch_month_table AS (
  SELECT
    *,
    ROW_NUMBER() 
      OVER(PARTITION BY card_name ORDER BY issue_year, issue_month) AS rn
  FROM monthly_cards_issued
)
SELECT
  card_name,
  issued_amount
FROM launch_month_table
WHERE rn = 1
ORDER BY issued_amount DESC
;
~~~

_Dialect: MySQL_
