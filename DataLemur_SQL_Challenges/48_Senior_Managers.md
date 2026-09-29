# DataLemur Challenge 48: Senior Managers

**Source:** [View challenge](https://datalemur.com/questions/senior-managers-reportees)

## Challenge

Assume we have a table of Google employees with their corresponding managers. 

A manager is an employee with a direct report. A senior manager is an employee who manages at least one manager, but none of their direct reports is senior managers themselves. Write a query to find the senior managers and their direct reports.

Output the senior manager's name and the count of their direct reports. The senior manager with the most direct reports should be the first result.

Assumption:
- An employee can report to two senior managers.

### `employees` Table:
|Column Name|Type|
|:----|:----|
|emp_id|integer|
|manager_id|integer|
|manager_name |string|

### `employees` Example Input:
|emp_id|manager_id|manager_name|
|:----|:----|:----|
|1|101 |Duyen  |
|101|1001  |Rick  |
|103|1001 |Rick   |
|1001|1008 |John  |

### Example Output:
|manager_name|direct_reportees|
|:----|:----|
|Rick|1|

Rick is a senior manager who has one manager directly reporting to him, which is employee id 101.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH reporting_table AS (
    SELECT DISTINCT
      e.emp_id AS reporting_manager_id,
      e.manager_id AS senior_manager_id,
      e.manager_name AS senior_manager_name
    FROM employees e
    JOIN employees m ON e.emp_id = m.manager_id
    WHERE e.manager_id IS NOT NULL
),
  exclude_senior_manager_list AS (
  SELECT senior_manager_id FROM reporting_table
  WHERE reporting_manager_id IN (SELECT DISTINCT senior_manager_id
                      FROM reporting_table)
)
SELECT
  senior_manager_name AS manager_name,
  COUNT(*) AS direct_reportees
FROM reporting_table
WHERE senior_manager_id NOT IN (SELECT * FROM exclude_senior_manager_list)
GROUP BY senior_manager_name
ORDER BY direct_reportees DESC
;
~~~

_Dialect: PostgreSQL_
