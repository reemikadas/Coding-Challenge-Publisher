# DataLemur Challenge 52: Signup Activation Rate

**Source:** [View challenge](https://datalemur.com/questions/signup-confirmation-rate)

## Challenge

New TikTok users sign up with their emails. They confirmed their signup by replying to the text confirmation to activate their accounts. Users may receive multiple text messages for account confirmation until they have confirmed their new account. 

A senior analyst is interested to know the activation rate of specified users in the `emails` table. Write a query to find the activation rate. Round the percentage to 2 decimal places.

Definitions:
- `emails` table contain the information of user signup details.
- `texts` table contains the users' activation information. 

Assumptions:
- The analyst is interested in the activation rate of specific users in the `emails` table, which may not include all users that could potentially be found in the `texts` table.
- For example, user 123 in the `emails` table may not be in the `texts` table and vice versa.

*Effective April 4th 2023, we added an assumption to the question to provide additional clarity.*

### `emails` Table:
|**Column Name**|**Type**|
|:----|:----|
|email_id|integer|
|user_id|integer|
|signup_date|datetime|

### `emails` Example Input:
|**email_id**|**user_id**|**signup_date**|
|:----|:----|:----|
|125|7771|06/14/2022 00:00:00| 
|236|6950|07/01/2022 00:00:00| 
|433|1052|07/09/2022 00:00:00| 

### `texts` Table:
|**Column Name**|**Type**|
|:----|:----|
|text_id|integer|
|email_id|integer|
|signup_action|varchar|

### `texts` Example Input:
|**text_id**|**email_id**|**signup_action**|
|:----|:----|:----|
|6878|125|Confirmed|
|6920|236|Not Confirmed|
|6994|236|Confirmed|

'Confirmed' in `signup_action` means the user has activated their account and successfully completed the signup process.

### Example Output:
|**confirm_rate**|
|:----|
|0.67|

### Explanation:

67% of users have successfully completed their signup and activated their accounts. The remaining 33% have not yet replied to the text to confirm their signup.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH total_user_count AS(
  SELECT 
    COUNT(DISTINCT e.user_id) AS total_user
  FROM emails e
  LEFT JOIN texts t ON t.email_id = e.email_id
)
SELECT
  ROUND(1.0 * COUNT(DISTINCT e.user_id) / 
  (SELECT total_user FROM total_user_count), 2) AS activation_rate
FROM emails e
INNER JOIN texts t ON t.email_id = e.email_id
WHERE t.signup_action = 'Confirmed'
;
~~~

_Dialect: PostgreSQL_
