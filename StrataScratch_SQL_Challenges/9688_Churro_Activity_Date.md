# StrataScratch Challenge 9688: Churro Activity Date

**Source:** [View challenge](https://platform.stratascratch.com/coding/9688-churro-activity-date)

## Challenge

A city health department wants to review underperforming food vendors for follow-up action. Find all health inspection records for facilities named 'STREET CHURROS' that received an inspection score below 95. Output the inspection date and the risk category (`pe_description`) for each matching record.

## SQL Solution #1

~~~sql
SELECT
    activity_date,
    pe_description
FROM los_angeles_restaurant_health_inspections
WHERE facility_name = 'STREET CHURROS'
AND score < 95
;
~~~

_Dialect: MySQL_
