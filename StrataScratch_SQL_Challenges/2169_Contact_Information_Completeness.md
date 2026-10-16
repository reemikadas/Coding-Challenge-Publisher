# StrataScratch Challenge 2169: Contact Information Completeness

**Source:** [View challenge](https://platform.stratascratch.com/coding/2169-contact-information-completeness)

## Challenge

The data quality team is auditing employee records to assess the completeness of contact information. Calculate and return the ratio of employees who have a `NULL` phone number.

## SQL Solution #1

~~~sql
SELECT
    missing_phone_cnt / total_emp_cnt AS null_phone_ratio
FROM
    (SELECT
        COUNT(
            CASE
                WHEN phone_number IS NULL
                THEN id
            END
        ) missing_phone_cnt,
        COUNT(id) AS total_emp_cnt 
    FROM techcorp_workforce) AS t1
;
~~~

_Dialect: MySQL_
