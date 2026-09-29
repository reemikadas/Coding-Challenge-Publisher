# Challenge 12890: Occupations

**Source:** [View challenge](https://www.hackerrank.com/challenges/occupations/problem?isFullScreen=true)

## Challenge

[Pivot](https://en.wikipedia.org/wiki/Pivot_table) the *Occupation* column in **OCCUPATIONS** so that each *Name* is sorted alphabetically and displayed underneath its corresponding *Occupation*. The output should consist of four columns (*Doctor*, *Professor*, *Singer*, and *Actor*) in that specific order, with their respective names listed alphabetically under each column.

**Note:** Print **NULL** when there are no more names corresponding to an occupation.

### Input Format

The **OCCUPATIONS** table is described as follows:

<img src="https://s3.amazonaws.com/hr-challenge-images/12889/1443816414-2a465532e7-1.png" />

*Occupation* will only contain one of the following values: **Doctor**, **Professor**, **Singer** or **Actor**.

## SQL Solution #1

~~~sql
WITH pivot_table AS (
SELECT
    rn,
    MAX(CASE WHEN occupation="Doctor" THEN name END) AS "Doctor",
    MAX(CASE WHEN occupation="Professor" THEN name END) AS "Professor",
    MAX(CASE WHEN occupation="Singer" THEN name END) AS "Singer",
    MAX(CASE WHEN occupation="Actor" THEN name END) AS "Actor"
FROM
    (SELECT
        *,
        ROW_NUMBER() OVER(PARTITION BY occupation ORDER BY name) AS rn
    FROM occupations) AS t1
GROUP BY rn
)
SELECT
    Doctor,
    Professor,
    Singer,
    Actor
FROM pivot_table
ORDER BY rn
;
~~~

_Dialect: MySQL_
