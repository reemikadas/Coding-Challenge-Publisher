# StrataScratch Challenge 9728: Number of violations

**Source:** [View challenge](https://platform.stratascratch.com/coding/9728-inspections-that-resulted-in-violations)

## Challenge

You are given a dataset of health inspections that includes details about violations. Each row represents an inspection, and if an inspection resulted in a violation, the `violation_id` column will contain a value.

Count the total number of violations that occurred at **'Roxanne Cafe'** for each year, based on the inspection date. Output the year and the corresponding number of violations in ascending order of the year.

## SQL Solution #1

~~~sql
SELECT
    YEAR(inspection_date),
    COUNT(*) AS number_of_violations
FROM sf_restaurant_health_violations
WHERE violation_id IS NOT NULL
AND business_name = 'Roxanne Cafe'
GROUP BY YEAR(inspection_date)
ORDER BY YEAR(inspection_date)
;
~~~

_Dialect: MySQL_
