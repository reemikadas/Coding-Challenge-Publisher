# Challenge 12892: Symmetric Pairs

**Source:** [View challenge](https://www.hackerrank.com/challenges/symmetric-pairs/problem?isFullScreen=true)

## Challenge

You are given a table, <em>Functions</em>, containing two columns: <em>X&nbsp;</em>and <em>Y</em>.

<img src="https://s3.amazonaws.com/hr-challenge-images/12892/1443818798-51909e977d-1.png" />

Two pairs <em>(X<sub>1</sub>, Y<sub>1</sub>)</em> and <em>(X<sub>2</sub>, Y<sub>2</sub>)</em> are said to be <em>symmetric</em> <em>pairs</em> if&nbsp;<em>X<sub>1</sub> = Y<sub>2</sub></em> and <em>X<sub>2</sub> = Y<sub>1</sub></em>.

Write a query to output all such <em>symmetric</em> <em>pairs</em> in ascending order by the value of <em>X</em>.  List the rows such that <em>X<sub>1</sub> &le; Y<sub>1</sub></em>.  

__Sample Input__

<img src="https://s3.amazonaws.com/hr-challenge-images/12892/1443818693-b384c24e35-2.png" />

__Sample Output__

    20 20
    20 21
    22 23

## SQL Solution #1

~~~sql
SELECT
    x,
    y
FROM functions
GROUP BY x, y
HAVING count(*) > 1

UNION

SELECT
    f1.x,
    f1.y
FROM functions f1
JOIN functions f2 ON f1.x = f2.y 
                AND f1.y = f2.x
                AND f1.x < f1.y

ORDER BY x
;
~~~

_Dialect: MySQL_
