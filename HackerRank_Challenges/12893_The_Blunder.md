# Challenge 12893: The Blunder

**Source:** [View challenge](https://www.hackerrank.com/challenges/the-blunder/problem?isFullScreen=true)

## Challenge

Samantha was tasked with calculating the average monthly salaries for all employees in the **EMPLOYEES** table, but did not realize her keyboard's $0$ key was broken until after completing the calculation. She wants your help finding the difference between her miscalculation (using salaries with any zeros removed), and the actual average salary.

Write a query calculating the amount of error (i.e.: $actual - miscalculated$ average monthly salaries), and round it up to the next integer.

### Input Format

The **EMPLOYEES** table is described as follows:

<img src="https://s3.amazonaws.com/hr-challenge-images/12893/1443817108-adc2235c81-1.png" />

**Note:**  *Salary* is per month.

### Constraints

$1000 \lt \text{Salary} \lt 10^5$.

## SQL Solution #1

~~~sql
SELECT
    CEIL(AVG(salary) - AVG(CAST(REPLACE(salary, '0', '') AS UNSIGNED)))
FROM employees;
~~~

_Dialect: MySQL_
