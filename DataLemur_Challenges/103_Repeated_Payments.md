# DataLemur Challenge 103: Repeated Payments

**Source:** [View challenge](https://datalemur.com/questions/repeated-payments)

## Challenge

Sometimes, payment transactions are repeated by accident; it could be due to user error, API failure or a retry error that causes a credit card to be charged twice.

Using the transactions table, identify any payments made at the same merchant with the same credit card for the same amount within 10 minutes of each other. Count such repeated payments.

**Assumptions:**
- The first transaction of such payments should not be counted as a repeated payment. This means, if there are two transactions performed by a merchant with the same credit card and for the same amount within 10 minutes, there will only be 1 repeated payment. 

### `transactions` Table:
|**Column Name**|**Type**|
|:----|:----|
|transaction_id|integer|
|merchant_id|integer|
|credit_card_id|integer|
|amount|integer|
|transaction_timestamp|datetime|

### `transactions` Example Input:
|**transaction_id**|**merchant_id**|**credit_card_id**|**amount**|**transaction_timestamp**|
|:----|:----|:----|:----|:----|
|1|101|1|100|09/25/2022 12:00:00|
|2|101|1|100|09/25/2022 12:08:00|
|3|101|1|100|09/25/2022 12:28:00|
|4|102|2|300|09/25/2022 12:00:00|
|6|102|2|400|09/25/2022 14:00:00|

### Example Output:
|**payment_count**|
|:----|
|1|

### Explanation
Within 10 minutes after Transaction 1, Transaction 2 is conducted at Merchant 1 using the same credit card for the same amount. This is the only instance of repeated payment in the given sample data. 

Since Transaction 3 is completed after Transactions 2 and 1, each of which occurs after 20 and 28 minutes, respectively hence it does not meet the repeated payments' conditions. Whereas, Transactions 4 and 6 have different amounts.  

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution

~~~sql
WITH repeated_transaction AS (
    SELECT
      merchant_id,
      credit_card_id,
      amount,
      transaction_timestamp::TIME AS current_transaction_time,
      LAG(transaction_timestamp::TIME)
        OVER(
          PARTITION BY merchant_id, credit_card_id, amount
          ORDER BY transaction_timestamp
        ) AS previous_transaction_time
    FROM transactions
),
 ten_minute_interval AS (
    SELECT
      *,
      EXTRACT(EPOCH FROM
        (current_transaction_time - previous_transaction_time)) AS difference
    FROM repeated_transaction
    WHERE previous_transaction_time IS NOT NULL
)
SELECT COUNT(*) AS payment_count 
FROM ten_minute_interval
WHERE difference <= 600
;
~~~

_Dialect: PostgreSQL_
