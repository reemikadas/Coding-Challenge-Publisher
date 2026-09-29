# Challenge 12891: The Report

**Source:** [View challenge](https://www.hackerrank.com/challenges/the-report/problem?isFullScreen=true)

## Challenge

You are given two tables:&nbsp;<em>Students</em>&nbsp;and <em>Grades</em>.&nbsp;<em>Students</em>&nbsp;contains three columns <em>ID</em>, <em>Name</em> and <em>Marks</em>.

<img src="https://s3.amazonaws.com/hr-challenge-images/12891/1443818166-a5c852caa0-1.png" />

<em>Grades</em> contains the following data:

<img src="https://s3.amazonaws.com/hr-challenge-images/12891/1443818137-69b76d805c-2.png" />

<em>Ketty</em> gives <em>Eve</em> a task to generate a report containing three columns: <em>Name</em>, <em>Grade</em> and <em>Mark</em>. <em>Ketty</em> doesn't want the NAMES of those students who received a grade lower than <em>8</em>. The report must be in descending order by grade -- i.e.  higher grades are entered first. If there is more than one student with the same grade (8-10) assigned to them, order those particular students by their name alphabetically. Finally, if the grade is lower than 8, use "NULL" as their name and list them by their grades in descending order. If there is more than one student with the same grade (1-7) assigned to them, order those particular students by their marks in ascending order.

Write a query to help Eve.

__Sample Input__

<img src="https://s3.amazonaws.com/hr-challenge-images/12891/1443818093-b79f376ec1-3.png" />

__Sample Output__

    Maria 10 99
    Jane 9 81
    Julia 9 88 
    Scarlet 8 78
    NULL 7 63
    NULL 7 68

<br>
__Note__

Print &quot;NULL&quot;&nbsp; as the name if the grade is less than 8.

__Explanation__

Consider the following table with the grades assigned to the students:

<img src="https://s3.amazonaws.com/hr-challenge-images/12891/1443818026-0b3af8db30-4.png" />

So, the following students got <em>8</em>, <em>9</em> or <em>10</em> grades:

<ul>
	<li><em>Maria (grade 10)</em></li>
	<li><em>Jane (grade 9)</em></li>
	<li><em>Julia (grade 9)</em></li>
	<li><em>Scarlet (grade 8)</em></li>
</ul>

## SQL Solution #1

~~~sql
SELECT
    CASE
        WHEN g.grade >= 8 THEN s.name
        ELSE NULL
    END AS name,
    g.grade,
    s.marks
FROM students s
LEFT JOIN grades g ON g.min_mark <= s.marks AND g.max_mark >= s.marks
ORDER BY g.grade DESC, name ASC;
~~~

_Dialect: MySQL_
