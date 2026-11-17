# StrataScratch Challenge 10285: Acceptance Rate By Date

**Source:** [View challenge](https://platform.stratascratch.com/coding/10285-acceptance-rate-by-date)

## Challenge

A social platform's growth team wants to understand how often friend requests result in accepted connections. For each date when friend requests were sent, calculate the proportion of those requests that were accepted.

A request is considered accepted when a matching acceptance record exists for the same sender and receiver. If no matching acceptance record exists, treat the request as not accepted. The acceptance may occur on any date after the request was sent.

Exclude dates on which none of the requests sent were accepted.

Output the request date and the acceptance rate, sorted by date in ascending order.

## SQL Solution #1

~~~sql
WITH request_sent_table AS (
    SELECT * 
    FROM fb_friend_requests
    WHERE action = 'sent'
),
request_accepted_table AS (
    SELECT * 
    FROM fb_friend_requests
    WHERE action = 'accepted'
)
SELECT
    t1.date,
    (1.0 * t2.acceptance_num / t1.total_sent_count) AS percentage_acceptance
FROM
(SELECT date, COUNT(*) AS total_sent_count
FROM request_sent_table
GROUP BY date) t1
JOIN (
    SELECT
        s.date,
        COUNT(*) AS acceptance_num
    FROM request_sent_table s
    INNER JOIN request_accepted_table a
        ON s.user_id_sender = a.user_id_sender
        AND s.user_id_receiver = a.user_id_receiver
    GROUP BY s.date
) t2 ON t1.date = t2.date
ORDER BY t1.date
;
~~~

_Dialect: PostgreSQL_
