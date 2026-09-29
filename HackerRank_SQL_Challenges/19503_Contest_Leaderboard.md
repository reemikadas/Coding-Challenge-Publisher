# Challenge 19503: Contest Leaderboard

**Source:** [View challenge](https://www.hackerrank.com/challenges/contest-leaderboard/problem?isFullScreen=true)

## Challenge

You did such a great job helping Julia with her last coding contest challenge that she wants you to work on this one, too! 

The total score of a hacker is the sum of their maximum scores for all of the challenges. Write a query to print the _hacker\_id_, _name_, and total score of the hackers ordered by the descending score. If more than one hacker achieved the same total score, then sort the result by ascending _hacker\_id_. Exclude all hackers with a total score of $0$ from your result.

### Input Format

The following tables contain contest data:

- _Hackers:_ The _hacker\_id_ is the id of the hacker, and _name_ is the name of the hacker.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19503/1458522826-a9ddd28469-ScreenShot2016-03-21at6.40.27AM.png"/>

- _Submissions:_ The _submission\_id_ is the id of the submission, _hacker\_id_ is the id of the hacker who made the submission, _challenge\_id_ is the id of the challenge for which the submission belongs to, and _score_ is the score of the submission.

  <img src="https://s3.amazonaws.com/hr-challenge-images/19503/1458523022-771511df90-ScreenShot2016-03-21at6.40.37AM.png"/>

## SQL Solution #1

~~~sql
WITH max_score AS (
SELECT
    h.hacker_id,
    h.name,
    s.challenge_id,
    MAX(s.score) AS max_score
FROM hackers h
INNER JOIN submissions s ON s.hacker_id = h.hacker_id
GROUP BY h.hacker_id, h.name, s.challenge_id
)
SELECT
    hacker_id,
    name,
    SUM(max_score) AS total_score
FROM max_score
GROUP BY hacker_id, name
HAVING SUM(max_score) > 0
ORDER BY SUM(max_score) DESC, hacker_id
;
~~~

_Dialect: MySQL_
