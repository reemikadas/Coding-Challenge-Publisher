# DataLemur Challenge 330: IBM db2 Product Analytics

**Source:** [View challenge](https://datalemur.com/questions/sql-ibm-db2-product-analytics)

## Challenge

IBM is analyzing how their employees are utilizing the Db2 database by tracking the SQL queries executed by their employees. The objective is to generate data to populate a histogram that shows the number of unique queries run by employees during the third quarter of 2023 (July to September). Additionally, it should count the number of employees who did not run any queries during this period.

Display the number of unique queries as histogram categories, along with the count of employees who executed that number of unique queries.

### `queries` Schema:
|Column Name|Type|Description|
|:----|:----|:----|
|employee_id|integer|The ID of the employee who executed the query.|
|query_id|integer|The unique identifier for each query (Primary Key).|
|query_starttime|datetime|The timestamp when the query started.|
|execution_time|integer|The duration of the query execution in seconds.|

### `queries` Example Input:
Assume that the table below displays all queries made from July 1, 2023 to 31 July, 2023:

|employee_id|query_id|query_starttime|execution_time|
|:----|:----|:----|:----|
|226|856987|07/01/2023 01:04:43|2698|
|132|286115|07/01/2023 03:25:12|2705|
|221|33683|07/01/2023 04:34:38|91|
|240|17745|07/01/2023 14:33:47|2093|
|110|413477|07/02/2023 10:55:14|470|

### `employees` Schema:
Assume that the table below displays all employees in the table: 

|Column Name|Type|Description|
|:----|:----|:----|
|employee_id|integer|The ID of the employee who executed the query.|
|full_name|string|The full name of the employee.|
|gender|string|The gender of the employee. |

### `employees` Example Input:
|employee_id|full_name|gender|
|:----|:----|:----|
|1|Judas Beardon|Male|
|2|Lainey Franciotti|Female|
|3|Ashbey Strahan|Male|

### Example Output:
|unique_queries|employee_count|
|:----|:----|
|0|191|
|1|46|
|2|12|
|3|1|

The output indicates that 191 employees did not run any queries, 46 employees ran exactly 1 unique queries, 12 employees ran 2 unique queries, and so on.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
WITH query_count AS (
  SELECT
    e.employee_id,
    COUNT(DISTINCT q.query_id) AS unique_queries
  FROM employees e
  LEFT JOIN queries q ON q.employee_id = e.employee_id
    AND q.query_starttime::DATE
        BETWEEN DATE '2023-07-01' AND DATE '2023-09-30'
  GROUP BY e.employee_id
  )
SELECT
  unique_queries,
  COUNT(*) AS employee_count
FROM query_count
GROUP BY unique_queries
ORDER BY unique_queries
;
~~~

_Dialect: PostgreSQL_
