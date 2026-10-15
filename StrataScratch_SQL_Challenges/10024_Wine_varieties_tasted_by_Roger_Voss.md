# StrataScratch Challenge 10024: Wine varieties tasted by 'Roger Voss'

**Source:** [View challenge](https://platform.stratascratch.com/coding/10024-wine-varieties-tasted-by-roger-voss)

## Challenge

Find wine varieties tasted by 'Roger Voss' and with a value in the 'region_1' column of the dataset. Output unique variety names only.

## SQL Solution #1

~~~sql
SELECT
    DISTINCT variety
FROM winemag_p2
WHERE taster_name = 'Roger Voss'
AND region_1 IS NOT NULL
;
~~~

_Dialect: MySQL_
