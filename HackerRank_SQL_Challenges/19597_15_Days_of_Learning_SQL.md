# Challenge 19597: 15 Days of Learning SQL

**Source:** [View challenge](https://www.hackerrank.com/challenges/15-days-of-learning-sql/problem?isFullScreen=true)

## Challenge

Julia conducted a $15$ days of learning SQL contest. The start date of the contest was _March 01, 2016_ and the end date was _March 15, 2016_. 

Write a query to print total number of unique hackers who made at least $1$ submission each day (starting on the first day of the contest), and find the _hacker\_id_ and _name_ of the hacker who made maximum number of submissions each day. If more than one such hacker has a maximum number of submissions, print the lowest *hacker\_id*. The query should print this information for each day of the contest, sorted by the date.

----

### Input Format

The following tables hold contest data:

- _Hackers:_ The _hacker\_id_ is the id of the hacker, and _name_ is the name of the hacker.<img src="https://s3.amazonaws.com/hr-challenge-images/19597/1458511164-12adec3b8b-ScreenShot2016-03-21at3.26.47AM.png"/>

- _Submissions:_ The _submission\_date_ is the date of the submission, _submission\_id_ is the id of the submission, _hacker\_id_ is the id of the hacker who made the submission, and _score_ is the score of the submission. <img src="https://s3.amazonaws.com/hr-challenge-images/19597/1458511251-0b534030b9-ScreenShot2016-03-21at3.26.56AM.png"/>

## SQL Solution #1

~~~sql
WITH submission_per_hacker AS (
        SELECT
            submission_date, 
            hacker_id,
            COUNT(*) AS num_of_submission
        FROM submissions
        GROUP BY submission_date, hacker_id
),
    hacker_submission_each_day AS (
        SELECT
            *,
            ROW_NUMBER() OVER(
                PARTITION BY hacker_id
                ORDER BY submission_date
            ) AS day_rank,
            DAY(submission_date) AS calendar_day
        FROM submission_per_hacker
),
    unique_hackers AS (
        SELECT
            submission_date,
            COUNT(DISTINCT hacker_id) AS total_unique_hackers
        FROM hacker_submission_each_day
        WHERE day_rank = calendar_day
        GROUP BY submission_date   
),
    max_submission AS (
        SELECT
            *,
            ROW_NUMBER()
                OVER(
                    PARTITION BY submission_date
                    ORDER BY num_of_submission DESC, hacker_id
                ) AS rn
        FROM submission_per_hacker
)
SELECT
    ms.submission_date,
    uh.total_unique_hackers,
    ms.hacker_id,
    h.name
FROM max_submission ms
JOIN unique_hackers uh ON ms.submission_date = uh.submission_date
JOIN hackers h ON ms.hacker_id = h.hacker_id
WHERE ms.rn = 1
ORDER BY ms.submission_date
;
~~~

_Dialect: MySQL_
