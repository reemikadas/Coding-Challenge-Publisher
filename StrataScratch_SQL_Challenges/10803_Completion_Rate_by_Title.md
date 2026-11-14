# StrataScratch Challenge 10803: Completion Rate by Title

**Source:** [View challenge](https://platform.stratascratch.com/coding/10803-completion-rate-by-title)

## Challenge

The Product Analytics team at a streaming service wants to know which titles viewers actually finish. For each title with at least 100 viewing sessions, calculate the completion rate: the percentage of its sessions that were completed. Count every session toward the total, including sessions with zero or missing watch time. Round the rate to 1 decimal place.

Output the title name and the completion rate.

## SQL Solution #1

~~~sql
SELECT
    title_name,
    ROUND(100.0 * num_of_completed / num_of_session, 1) AS completion_pct
FROM
(SELECT
    t.title_name,
    COUNT(session_id) AS num_of_session,
    COUNT(CASE WHEN s.completed = 1 THEN session_id END) AS num_of_completed
FROM stream_sessions s
JOIN stream_titles t ON s.title_id = t.title_id
GROUP BY t.title_name
HAVING COUNT(session_id) >= 100) AS t1
;
~~~

_Dialect: PostgreSQL_
