# DataLemur Challenge 62: Data Science Skills

**Source:** [View challenge](https://datalemur.com/questions/matching-skills)

## Challenge

Given a table of candidates and their skills, you're tasked with finding the candidates best suited for an open Data Science job. You want to find candidates who are proficient in Python, Tableau, and PostgreSQL.

Write a query to list the candidates who possess all of the required skills for the job. Sort the output by candidate ID in ascending order.

**Assumption:**
- There are no duplicates in the `candidates` table.

### `candidates` Table:
|**Column Name**|**Type**|
|:----|:----|
|candidate_id|integer|
|skill|varchar|

### `candidates` Example Input:
|**candidate_id**|**skill**|
|:----|:----|
|123 | Python|
|123 | Tableau|
|123 | PostgreSQL|
|234 | R|
|234 | PowerBI|
|234 | SQL Server|
|345 | Python|
|345 | Tableau|

### Example Output:
|**candidate_id**|
|:----|
|123|

### Explanation
Candidate 123 is displayed because they have Python, Tableau, and PostgreSQL skills. 345 isn't included in the output because they're missing one of the required skills: PostgreSQL.

The dataset you are querying against may have different input & output - **this is just an example**!


p.s. give the hints below a try if you're stuck and don't know where to start! 

p.p.s if you find this problem too tricky, even after the hints, check out my [30-day SQL learning roadmap](https://datalemur.com/blog/learn-sql-in-30-days-roadmap), which features my favorite **free** resources to learn SQL! After you strengthen your SQL foundations, I'm sure you'll be more than ready to tackle this question!

## SQL Solution #1

~~~sql
SELECT
  candidate_id
FROM candidates
WHERE skill IN ('Python', 'Tableau', 'PostgreSQL')
GROUP BY candidate_id
HAVING COUNT(*) = 3
ORDER BY candidate_id
;
~~~

_Dialect: MySQL_
