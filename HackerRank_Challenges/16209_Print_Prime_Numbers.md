# Challenge 16209: Print Prime Numbers

**Source:** [View challenge](https://www.hackerrank.com/challenges/print-prime-numbers/problem?isFullScreen=true)

## Challenge

Write a query to print all prime numbers less than or equal to . Print your result on a single line, and use the ampersand (&) character as your separator (instead of a space).

For example, the output for all prime numbers ≤ 10 would be:
	
    2&3&5&7

## SQL Solution #1

~~~sql
WITH RECURSIVE numbers AS (
    SELECT 2 AS n
    
    UNION ALL
    
    SELECT n + 1
    FROM numbers
    WHERE n < 1000
)
SELECT GROUP_CONCAT(n ORDER BY n SEPARATOR '&')
FROM numbers AS candidate
WHERE NOT EXISTS(
    SELECT 1
    FROM numbers AS divisor
    WHERE divisor.n BETWEEN 2 AND FLOOR(SQRT(candidate.n))
    AND MOD(candidate.n, divisor.n) = 0
);
~~~

_Dialect: MySQL_
