# DataLemur Challenge 199: Patient Support Analysis (Part 4)

**Source:** [View challenge](https://datalemur.com/questions/long-calls-growth)

## Challenge

UnitedHealth Group (UHG) has a program called Advocate4Me, which allows policy holders (or, members) to call an advocate and receive support for their health care needs – whether that's claims and benefits support, drug coverage, pre- and post-authorisation, medical records, emergency assistance, or member portal services.

To analyze the performance of the program, write a query to determine the month-over-month growth rate specifically for long-calls. A long-call is defined as any call lasting more than 5 minutes (300 seconds). 

Output the year and month in numerical format and chronological order, along with the growth percentage rounded to 1 decimal place. 

### `callers` Table:
|**Column Name**|**Type**|
|:----|:----|
|policy_holder_id|integer|
|case_id|varchar|
|call_category|varchar|
|call_date|timestamp|
|call_duration_secs|integer|

### `callers` Example Input:
|policy_holder_id|case_id|call_category|call_date|call_duration_secs|
|:----|:----|:----|:----|:----|
|1|f1d012f9-9d02-4966-a968-bf6c5bc9a9fe|emergency assistance|04/13/2023 19:16:53|144|
|1|41ce8fb6-1ddd-4f50-ac31-07bfcce6aaab|authorisation|05/25/2023 09:09:30|815|
|2|8471a3d4-6fc7-4bb2-9fc7-4583e3638a9e|emergency assistance|03/09/2023 10:58:54|128|
|2|38208fae-bad0-49bf-99aa-7842ba2e37bc|benefits|06/05/2023 07:35:43|619|
|3|f0e7a8e3-df93-40f3-9b5e-fadff9ebe072|provider network|01/12/2023 04:53:41|483|
|3|b72f91e6-c3f8-4358-a1f2-c9507e8dcba4|member portal|04/04/2023 20:03:22|275|
|3|3acbe22d-22b3-4144-954d-74c127bc49ea|benefits|04/12/2023 00:05:29|329|
|3|e32b61c2-a90d-4371-a5ee-6bc44fa49bbd|benefits|05/25/2023 06:07:41|512|
|3|6099f469-b5d6-4447-9acf-d936355eae7c|emergency assistance|06/11/2023 12:04:21|33|

### Example Output:
|yr|mth|long_calls_growth_pct|
|:----|:----|:----|
|2023|1|NULL|
|2023|2|0.0|
|2023|2|100.0|
|2023|4|200.0|
|2023|5|-33.3|
|2023|6|0.0|

### Explanation:
Call counts: Jan - 1 call; Feb - 0 call; Mar - 1 call; Apr - 3 calls; May - 2 calls; Jun - 2 calls

- January: With no previous month's call information, the growth percentage is shown as NULL.
- February: The absence of calls compared to January results in a 0.0% growth rate.
- March: Witnessing an increase of 1 call compared to February, the growth percentage is +100.0%.
- April: Experiencing a surge of 3 calls compared to March, the growth percentage is +200.0%.
- May: With a decrease of 1 call compared to April, the growth percentage is -33.3%.
- June: Maintaining the same number of calls as May, the growth percentage remains at 0.0%.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution

~~~sql
WITH long_calls_table AS (
    SELECT
      EXTRACT(YEAR FROM call_date) AS yr,
      EXTRACT(MONTH FROM call_date) AS mth,
      COUNT(call_duration_secs) AS long_calls_count
    FROM callers
    WHERE call_duration_secs >= 300
    GROUP BY yr, mth
    ORDER BY yr, mth
),
  mth_growth_table AS (
    SELECT
      *,
      LAG(long_calls_count) OVER() AS previous_call_count
    FROM long_calls_table
)
SELECT
  yr,
  mth,
  ROUND(100.0 * (long_calls_count - previous_call_count)
      / previous_call_count, 1) AS long_calls_growth_pct
FROM mth_growth_table
;
~~~

_Dialect: MySQL_
