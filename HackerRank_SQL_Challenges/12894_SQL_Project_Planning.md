# Challenge 12894: SQL Project Planning

**Source:** [View challenge](https://www.hackerrank.com/challenges/sql-projects/problem?isFullScreen=true)

## Challenge

You are given a table, <em>Projects</em>, containing three columns: <em>Task_ID</em>, <em>Start_Date</em> and <em>End_Date</em>. It is guaranteed that the difference between the <em>End_Date</em> and the <em>Start_Date</em> is equal to <em>1</em> day for each row in the table.

<img src="https://s3.amazonaws.com/hr-challenge-images/12894/1443819551-639948acc0-1.png" />

If the <em>End_Date</em> of the tasks are consecutive, then they are part of the same project. Samantha is interested in finding the total number of different projects completed.

Write a query to output the start and&nbsp;end dates of projects listed by the number of days it took to complete the project in ascending order. If there is more than one project that have the same number of completion days, then order by the start date of the project.

__Sample Input__

<img src="https://s3.amazonaws.com/hr-challenge-images/12894/1443819440-1c40e943a1-2.png" />

__Sample Output__

    2015-10-28 2015-10-29
    2015-10-30 2015-10-31
    2015-10-13 2015-10-15
    2015-10-01 2015-10-04

<br>
__Explanation__

The example describes following <em>four</em> projects:

<ul>
	<li><em>Project 1</em>: Tasks <em>1</em>, <em>2</em> and <em>3</em> are completed on consecutive days, so these are part of the project. Thus start date of project is <em>2015-10-01</em> and end date is <em>2015-10-04</em>, so it took <em>3 days</em> to complete the project.</li>
	<li><em>Project 2</em>: Tasks <em>4</em>&nbsp;and&nbsp;<em>5</em>&nbsp;are completed on consecutive days, so these are part of the project. Thus, the start date of project is&nbsp;<em>2015-10-13</em>&nbsp;and end date is&nbsp;<em>2015-10-15</em>, so it took&nbsp;<em>2 days</em>&nbsp;to complete the project.</li>
	<li><em>Project 3</em>: Only task <em>6</em>&nbsp;is part of the project. Thus, the start date of project is&nbsp;<em>2015-10-28</em>&nbsp;and end date is&nbsp;<em>2015-10-29</em>, so it took&nbsp;<em>1 day</em>&nbsp;to complete the project.</li>
	<li><em>Project 4</em>: Only task&nbsp;<em>7</em>&nbsp;is part of the project. Thus, the start date of project is&nbsp;<em>2015-10-30</em>&nbsp;and end date is&nbsp;<em>2015-10-31</em>, so it took&nbsp;<em>1 day</em>&nbsp;to complete the project.</li>
</ul>

## SQL Solution #1

~~~sql
WITH consecutive_day_table AS (
    SELECT
        *,
        LAG(end_date) OVER(ORDER BY start_date) AS previous_end_date
    FROM projects
),
    new_project_table AS (
        SELECT
            *,
            CASE
            WHEN previous_end_date IS NULL THEN 1
            WHEN start_date <> previous_end_date THEN 1
            ELSE 0
            END AS new_project_flag
        FROM consecutive_day_table        
),
    project_planning AS (
        SELECT
            start_date,
            end_date,
            SUM(new_project_flag) OVER(
                ORDER BY start_date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS project_assignment
        FROM new_project_table
)
SELECT
    MIN(start_date) AS start_date,
    MAX(end_date) AS end_date
FROM project_planning
GROUP BY project_assignment
ORDER BY MAX(end_date) - MIN(start_date), start_date
;
~~~

_Dialect: MySQL_
