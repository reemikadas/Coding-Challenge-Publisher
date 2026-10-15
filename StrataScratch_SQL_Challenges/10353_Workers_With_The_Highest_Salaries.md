# StrataScratch Challenge 10353: Workers With The Highest Salaries

**Source:** [View challenge](https://platform.stratascratch.com/coding/10353-workers-with-the-highest-salaries)

## Challenge

A company wants to review compensation only for workers who have an official job title on record, since pay can't be properly benchmarked against a role that isn't documented. Find the job titles of the workers with the highest salary among those who have a matching record in the `title` table. If multiple workers share the highest salary, include all of their job titles.

Output the job title(s), sorted alphabetically.

## SQL Solution #1

~~~sql
WITH highest_paid_title AS (
        SELECT
            w.worker_id,
            w.salary,
            t.worker_title,
            DENSE_RANK() OVER(
                ORDER BY w.salary DESC
            ) AS dr
        FROM worker w
        JOIN title t ON w.worker_id = t.worker_ref_id
)
SELECT
    worker_title
FROM highest_paid_title
WHERE dr = 1
ORDER BY worker_title
;
~~~

_Dialect: PostgreSQL_
