# DataLemur Challenge 89: Marketing Touch Streak

**Source:** [View challenge](https://datalemur.com/questions/marketing-touch-streak)

## Challenge

As a Data Analyst on Snowflake's Marketing Analytics team, your objective is to analyze customer relationship management (CRM) data and identify contacts that satisfy two conditions:
1) Contacts who had a marketing touch for three or more consecutive weeks.
2) Contacts who had at least one marketing touch of the type 'trial_request'.

Marketing touches, also known as touch points, represent the interactions or points of contact between a brand and its customers. 

Your goal is to generate a list of email addresses for these contacts.

### `marketing_touches` Table:
|**Column Name**|**Type**|
|:----|:----|
|event_id |integer|
|contact_id |integer|
|event_type|string ('webinar', 'conference_registration', 'trial_request')|
|event_date|date|

### `marketing_touches` Example Input:
|event_id |contact_id |event_type | event_date |
|:----|:----|:----|:----|
 |1 | 1 | webinar | 4/17/2022 |
 |2 | 1 | trial_request | 4/23/2022 |
 |3 | 1 | whitepaper_download | 4/30/2022 |
 |4 | 2 | handson_lab | 4/19/2022 |
 |5 | 2 | trial_request | 4/23/2022 |
 |6 | 2 | conference_registration | 4/24/2022 |
 |7 | 3 | whitepaper_download | 4/30/2022 |
 |8 | 4 |  trial_request | 4/30/2022 |
 |9 | 4 | webinar | 5/14/2022 |

### `crm_contacts` Table:
|**Column Name**|**Type**|
|:----|:----|
|contact_id  |integer|
|email  |string|

### `crm_contacts` Example Input:
|**contact_id**|**email**|
|:----|:----|
|1 | andy.markus@att.net |
|2 | rajan.bhatt@capitalone.com|
|3 | lissa_rogers@jetblue.com |
|4 | kevinliu@square.com |

### Example Output:
|**email**|
|:----|
|andy.markus@att.net | 

### Explanation:
Among the contacts, only Contact ID 1 (andy.markus@att.net) satisfies both conditions specified in the problem. Contact ID 1 had a marketing touch with an event type of 'trial_request' and the marketing touch points occurred consecutively over a period of 3 weeks. This meets both conditions of having a marketing touch for three or more consecutive weeks.

On the other hand, Contact ID 2 (rajan.bhatt@capitalone.com) is not included in the generated list. Although they had a marketing touch with the event type 'trial_request', their touch points took place within the same week. Consequently, this does not meet the requirement of consecutive marketing touches for 3 weeks.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution

~~~sql
WITH distinct_week_table AS (
    SELECT DISTINCT
      contact_id,
      DATE_SUB(event_date, INTERVAL WEEKDAY(event_date) DAY) AS current_week
    FROM marketing_touches
    ORDER BY contact_id, event_date
),
  consecutive_week_table AS (
    SELECT
      contact_id,
      LAG(current_week) OVER(PARTITION BY contact_id ORDER BY current_week) AS previous_week,
      current_week,
      LEAD(current_week) OVER(PARTITION BY contact_id ORDER BY current_week) AS next_week
    FROM distinct_week_table  
)
SELECT
  t2.email
FROM consecutive_week_table t1
JOIN crm_contacts t2 ON t1.contact_id = t2.contact_id
WHERE (t1.current_week - t1.previous_week = 7
        AND t1.next_week - t1.current_week = 7)
AND t1.contact_id IN (SELECT DISTINCT contact_id FROM marketing_touches 
                    WHERE event_type = 'trial_request')
;
~~~

_Dialect: MySQL_
