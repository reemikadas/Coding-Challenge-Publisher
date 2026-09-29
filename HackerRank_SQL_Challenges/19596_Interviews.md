# Challenge 19596: Interviews

**Source:** [View challenge](https://www.hackerrank.com/challenges/interviews/problem?isFullScreen=true)

## Challenge

Samantha interviews many candidates from different colleges using coding challenges and contests. Write a query to print the _contest\_id_, _hacker\_id_, _name_, and the sums of _total\_submissions_, _total\_accepted\_submissions_, _total\_views_, and _total\_unique\_views_ for each contest sorted by _contest\_id_. Exclude the contest from the result if all four sums are $0$.

**Note:** A specific contest can be used to screen candidates at more than one college, but each college only holds $1$ screening contest.

----

### Input Format

The following tables hold interview data:

- _Contests:_ The _contest\_id_ is the id of the contest, _hacker\_id_ is the id of the hacker who created the contest, and _name_ is the name of the hacker.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19596/1458517426-e017c3460e-ScreenShot2016-03-21at4.57.47AM.png"/>

- _Colleges:_ The _college\_id_ is the id of the college, and _contest\_id_ is the id of the contest that Samantha used to screen the candidates.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19596/1458517503-fd4aa63111-ScreenShot2016-03-21at4.57.56AM.png"/>

- _Challenges:_ The _challenge\_id_ is the id of the challenge that belongs to one of the contests whose contest_id Samantha forgot, and _college\_id_ is the id of the college where the challenge was given to candidates.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19596/1458517661-a642f750ce-ScreenShot2016-03-21at4.58.04AM.png"/>

- _View\_Stats:_ The _challenge\_id_ is the id of the challenge, _total\_views_ is the number of times the challenge was viewed by candidates, and _total\_unique\_views_ is the number of times the challenge was viewed by unique candidates.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19596/1458517983-b4302286a8-ScreenShot2016-03-21at4.58.15AM.png"/>

- _Submission\_Stats:_ The _challenge\_id_ is the id of the challenge, _total\_submissions_ is the number of submissions for the challenge, and _total\_accepted\_submission_ is the number of submissions that achieved full scores.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19596/1458518090-80983c916a-ScreenShot2016-03-21at4.58.27AM.png"/>

----

## SQL Solution #1

~~~sql
WITH submission_stats_agg AS
        (SELECT
            challenge_id,
            SUM(total_submissions) AS total_submissions,
            SUM(total_accepted_submissions) AS total_accepted_submissions
        FROM submission_stats
        GROUP BY challenge_id),
    view_stats_agg AS
        (SELECT
            challenge_id,
            SUM(total_views) AS total_views,
            SUM(total_unique_views) AS total_unique_views
        FROM view_stats
        GROUP BY challenge_id)
SELECT
    c.contest_id,
    c.hacker_id,
    c.name,
    SUM(ss.total_submissions) AS total_submissions,
    SUM(ss.total_accepted_submissions) AS total_accepted_submissions,
    SUM(vs.total_views) AS total_views,
    SUM(vs.total_unique_views) AS total_unique_views
FROM contests c
LEFT JOIN colleges co ON co.contest_id = c.contest_id
LEFT JOIN challenges ch ON ch.college_id = co.college_id
LEFT JOIN view_stats_agg vs ON vs.challenge_id = ch.challenge_id
LEFT JOIN submission_stats_agg ss ON ss.challenge_id = ch.challenge_id
GROUP BY c.contest_id, c.hacker_id, c.name
HAVING SUM(ss.total_submissions) +
    SUM(ss.total_accepted_submissions) +
    SUM(vs.total_views) +
    SUM(vs.total_unique_views) <> 0
ORDER BY c.contest_id
;
~~~

_Dialect: MySQL_
