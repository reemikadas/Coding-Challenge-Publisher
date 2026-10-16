# StrataScratch Challenge 2168: Users Missing Phone Numbers

**Source:** [View challenge](https://platform.stratascratch.com/coding/2168-users-missing-phone-numbers)

## Challenge

The product team is launching a new WhatsApp notification feature and needs to identify users who haven't provided their phone numbers yet. These users will be shown a prompt to add their contact information.

Find all users who have not provided a phone number. Return the `user ID` and `name`.

## SQL Solution #1

~~~sql
SELECT
    user_id,
    user_name
FROM fintech_app_users
WHERE phone_number IS NULL
;
~~~

_Dialect: MySQL_
