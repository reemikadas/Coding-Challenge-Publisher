# DataLemur Challenge 51: Advertiser Status

**Source:** [View challenge](https://datalemur.com/questions/updated-status)

## Challenge

You're provided with two tables: the `advertiser` table contains information about advertisers and their respective payment status, and the `daily_pay` table contains the current payment information for advertisers, and it only includes advertisers who have made payments.

Write a query to update the payment status of Facebook advertisers based on the information in the `daily_pay` table. The output should include the user ID and their current payment status, sorted by the user id.

The payment status of advertisers can be classified into the following categories:
- New: Advertisers who are newly registered and have made their first payment.
- Existing: Advertisers who have made payments in the past and have recently made a current payment.
- Churn: Advertisers who have made payments in the past but have not made any recent payment.
- Resurrect: Advertisers who have not made a recent payment but may have made a previous payment and have made a payment again recently.

Before proceeding with the question, it is important to understand the possible transitions in the advertiser's status based on the payment status. The following table provides a summary of these transitions:

|#|Current Status|Updated Status|Payment on Day T|
|:----|:----|:----|:----|
|1|NEW|EXISTING|Paid|
|2|NEW|CHURN|Not paid|
|3|EXISTING|EXISTING|Paid|
|4|EXISTING|CHURN|Not paid|
|5|CHURN|RESURRECT|Paid|
|6|CHURN|CHURN|Not paid|
|7|RESURRECT|EXISTING|Paid|
|8|RESURRECT|CHURN|Not paid|

- "Current Status" column: Represents the advertiser's current status.
- "Payment Status" column: Represents the updated payment status based on the conditions
- "Payment on Day T" column: Indicates whether the advertiser made a payment on a specific day (T) or not.

The transitions between payment statuses in the provided table can be summarized as follows:
- Rows 2, 4, 6, and 8: If an advertiser does not make a payment on day T, regardless of their previous status, their payment status transitions to "CHURN" as the updated status.
- Rows 1, 3, 5, and 7: If an advertiser makes a payment on day T, the status is updated to either "EXISTING" or "RESURRECT" based on their previous status. If the previous status was "CHURN," the updated status is "RESURRECT." For any other previous status, the updated status is "EXISTING."

### `advertiser` Table: 
|Column Name|Type|
|:----|:----|
|user_id |string|
|status   |string|

### `advertiser` Example Input:
|user_id|status|
|:----|:----|
|bing|NEW|
|yahoo|NEW|
|alibaba|EXISTING|

### `daily_pay` Table:
|Column Name|Type|
|:----|:----|
|user_id |string|
|paid   |decimal|

### `daily_pay` Example Input:
|user_id|paid|
|:----|:----|
|yahoo|45.00|
|alibaba|100.00|
|target|13.00|

### Example Output:
|user_id|new_status|
|:----|:----|
|bing|CHURN|
|yahoo|EXISTING|
|alibaba|EXISTING|

### Explanation:
- The advertiser "bing" is classified as "CHURN" because no payment record is found in the `daily_pay` table.
- The advertiser "yahoo" is labeled as "EXISTING" since they have made a recent payment, as indicated by the presence of their payment record.
- Similarly, the advertiser "alibaba" is also classified as "EXISTING" due to their recent payment.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH full_outer_table AS (
    SELECT
      a.user_id AS user_id,
      a.status AS current_status,
      d.paid
    FROM advertiser a
    LEFT JOIN daily_pay d ON a.user_id = d.user_id
    
    UNION
    
    SELECT
      d.user_id AS user_id,
      a.status AS current_status,
      d.paid
    FROM advertiser a
    RIGHT JOIN daily_pay d ON a.user_id = d.user_id
    WHERE a.user_id IS NULL
),
  payment_status AS (
    SELECT
      user_id,
      current_status,
      CASE
          WHEN paid IS NULL THEN 'Not paid'
          ELSE 'Paid'
        END AS payment_on_day_t
    FROM full_outer_table
)
SELECT
  user_id,
  CASE
    WHEN payment_on_day_t = 'Not Paid' THEN 'CHURN'
    WHEN payment_on_day_t = 'Paid' AND current_status IS NULL
      THEN 'NEW'
    WHEN payment_on_day_t = 'Paid' AND current_status = 'CHURN'
      THEN 'RESURRECT'
    ELSE 'EXISTING'
  END AS new_status
FROM payment_status
ORDER BY user_id
;
~~~

_Dialect: MySQL_
