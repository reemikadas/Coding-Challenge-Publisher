# Challenge 12887: Type of Triangle

**Source:** [View challenge](https://www.hackerrank.com/challenges/what-type-of-triangle/problem?isFullScreen=true)

## Challenge

Write a query identifying the *type* of each record in the **TRIANGLES** table using its three side lengths. Output one of the following statements for each record in the table:

- **Equilateral**: It's a triangle with $3$ sides of equal length.
- **Isosceles**: It's a triangle with $2$ sides of equal length.
- **Scalene**: It's a triangle with $3$ sides of differing lengths.
- **Not A Triangle**: The given values of *A*, *B*, and *C* don't form a triangle.

### Input Format

The **TRIANGLES** table is described as follows:

<img src="https://s3.amazonaws.com/hr-challenge-images/12887/1443815629-ac2a843fb7-1.png" />

Each row in the table denotes the lengths of each of a triangle's three sides.

## SQL Solution #1

~~~sql
SELECT
    CASE
        WHEN ((A+B) <= C) OR ((A+C) <= B) OR ((B+C) <= A)
            THEN "Not A Triangle"
        WHEN (A=B AND B=C) THEN "Equilateral"
        WHEN (A=B OR A=C OR B=C) THEN "Isosceles"
        WHEN (A <> B AND B <> C AND A <> C) THEN "Scalene"
    END AS status
FROM triangles;
~~~

_Dialect: MySQL_
