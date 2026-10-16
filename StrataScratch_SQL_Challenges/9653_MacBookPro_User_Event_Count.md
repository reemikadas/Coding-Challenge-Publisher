# StrataScratch Challenge 9653: MacBookPro User Event Count

**Source:** [View challenge](https://platform.stratascratch.com/coding/9653-count-the-number-of-user-events-performed-by-macbookpro-users)

## Challenge

A product analytics team wants to understand which events are most commonly performed on MacBook Pro devices. Count the number of times each event was performed using a MacBook Pro.

Output the event name and its event count.

## SQL Solution #1

~~~sql
SELECT
    event_name,
    COUNT(*) AS event_count
FROM playbook_events
WHERE device = 'macbook pro'
GROUP BY event_name
;
~~~

_Dialect: MySQL_
