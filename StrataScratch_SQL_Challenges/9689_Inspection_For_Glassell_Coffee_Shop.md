# StrataScratch Challenge 9689: Inspection For Glassell Coffee Shop

**Source:** [View challenge](https://platform.stratascratch.com/coding/9689-inspection-for-glassell-coffee-shop)

## Challenge

A health department wants to pull every inspection record tied to a specific restaurant owner. Find all inspection records for facilities owned by 'GLASSELL COFFEE SHOP LLC'.

Output all columns for these inspection records.

## SQL Solution #1

~~~sql
SELECT
    *
FROM los_angeles_restaurant_health_inspections
WHERE owner_name = 'GLASSELL COFFEE SHOP LLC'
;
~~~

_Dialect: MySQL_
