# LeetCode Challenge 1907: Count Salary Categories

**Source:** [View challenge](https://leetcode.com/problems/count-salary-categories/description/?envType=study-plan-v2&envId=top-sql-50)

## Challenge

Table: `Accounts`

~~~text
+-------------+------+
| Column Name | Type |
+-------------+------+
| account_id  | int  |
| income      | int  |
+-------------+------+
account_id is the primary key (column with unique values) for this table.
Each row contains information about the monthly income for one bank account.
~~~

Write a solution to calculate the number of bank accounts for each salary category. The salary categories are:

- `"Low Salary"`: All the salaries **strictly less** than `$20000`.

- `"Average Salary"`: All the salaries in the **inclusive** range `[$20000, $50000]`.

- `"High Salary"`: All the salaries **strictly greater** than `$50000`.

The result table **must** contain all three categories. If there are no accounts in a category, return `0`.

Return the result table in **any order**.

The result format is in the following example.

**Example 1:**

~~~text
Input:
Accounts table:
+------------+--------+
| account_id | income |
+------------+--------+
| 3          | 108939 |
| 2          | 12747  |
| 8          | 87709  |
| 6          | 91796  |
+------------+--------+
Output:
+----------------+----------------+
| category       | accounts_count |
+----------------+----------------+
| Low Salary     | 1              |
| Average Salary | 0              |
| High Salary    | 3              |
+----------------+----------------+
Explanation:
Low Salary: Account 2.
Average Salary: No accounts.
High Salary: Accounts 3, 6, and 8.
~~~

## SQL Solution #1

~~~sql
WITH salary_categories AS (
    SELECT 'Low Salary' AS category
        UNION ALL
    SELECT 'Average Salary' AS category
        UNION ALL
    SELECT 'High Salary' AS category
),
    bank_account_counts AS (
        SELECT
            CASE
                WHEN income < 20000 THEN 'Low Salary'
                WHEN income BETWEEN 20000 AND 50000 THEN 'Average Salary'
                ELSE 'High Salary'
            END AS category,
            COUNT(account_id) AS accounts_count
        FROM accounts
        GROUP BY category
    )
SELECT
    c.category,
    IFNULL(accounts_count, 0) AS accounts_count
FROM salary_categories c
LEFT JOIN bank_account_counts b ON c.category = b.category
;
~~~

_Dialect: MySQL_
