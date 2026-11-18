# StrataScratch Challenge 10304: Risky Projects

**Source:** [View challenge](https://platform.stratascratch.com/coding/10304-risky-projects)

## Challenge

You are given a set of projects and employee data. Each project has a name, a budget, and a specific duration, while each employee has an annual salary and may be assigned to one or more projects for particular periods. The task is to identify which projects are overbudget. A project is considered overbudget if the prorated cost of all employees assigned to it exceeds the project’s budget.

To solve this, you must prorate each employee's annual salary based on the exact period they work on a given project, relative to a full year. For example, if an employee works on a six-month project, only half of their annual salary should be attributed to that project. Sum these prorated salary amounts for all employees assigned to a project and compare the total with the project’s budget.

Your output should be a list of overbudget projects, where each entry includes the project’s name, its budget, and the total prorated employee expenses for that project. The total expenses should be rounded up to the nearest dollar. Assume all years have 365 days and disregard leap years.

## SQL Solution #1

~~~sql
WITH metadata_table AS (
    SELECT
        p.title,
        p.budget,
        ep.emp_id,
        e.salary,
        DATEDIFF(p.end_date, p.start_date) AS num_of_days
    FROM linkedin_projects p
    LEFT JOIN linkedin_emp_projects ep ON p.id = ep.project_id
    LEFT JOIN linkedin_employees e ON ep.emp_id = e.id
),
prorated_sal_table AS (
    SELECT
        *,
        (salary * num_of_days / 365.0) AS prorated_salary
    FROM metadata_table
)
SELECT
    title,
    budget,
    CEIL(SUM(prorated_salary)) AS prorated_employee_expense
FROM prorated_sal_table
GROUP BY title, budget
HAVING budget < CEIL(SUM(prorated_salary))
ORDER BY title
;
~~~

_Dialect: PostgreSQL_
