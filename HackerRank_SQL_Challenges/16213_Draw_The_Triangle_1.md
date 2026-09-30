# Challenge 16213: Draw The Triangle 1

**Source:** [View challenge](https://www.hackerrank.com/challenges/draw-the-triangle-1/problem?isFullScreen=true)

## Challenge

_P(R)_ represents a pattern drawn by Julia in _R_ rows. The following pattern represents _P(5)_:


    * * * * * 
    * * * * 
    * * * 
    * * 
    *

Write a query to print the pattern _P(20)_.

## SQL Solution #1

~~~sql
WITH RECURSIVE p_r AS (
    SELECT 1 AS r
    
    UNION ALL
    
    SELECT r + 1
    FROM p_r
    WHERE r < 20
)
SELECT REPEAT("* ", r)
FROM p_r
ORDER BY r DESC
;
~~~

_Dialect: MySQL_
