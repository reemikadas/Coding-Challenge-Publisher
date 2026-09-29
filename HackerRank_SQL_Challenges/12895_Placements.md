# Challenge 12895: Placements

**Source:** [View challenge](https://www.hackerrank.com/challenges/placements/problem?isFullScreen=true)

## Challenge

You are given three&nbsp;tables:&nbsp;<em>Students</em>,<em> Friends </em>and<em> Packages.</em>&nbsp;<em>Students</em> contains two columns: <em>ID</em>&nbsp;and <em>Name</em>. <em>Friends</em> contains two columns: <em>ID</em> and <em>Friend_ID</em> (<em>ID</em> of the ONLY best friend). <em>Packages</em>&nbsp;contains two columns: <em>ID</em> and <em>Salary</em> (offered salary in $&nbsp;thousands&nbsp;per month).

<img src="https://s3.amazonaws.com/hr-challenge-images/12895/1443820186-2a9b4939a8-1.png" />

Write a query to output the names of those students whose&nbsp;best friends got offered a higher salary than them. Names must be ordered by the salary amount offered to the best friends. It is guaranteed that no two students got same salary offer.

__Sample Input__

<img src="https://s3.amazonaws.com/hr-challenge-images/12895/1443820079-9bd1e231b1-2_1.png" />
<img src="https://s3.amazonaws.com/hr-challenge-images/12895/1443820100-adb691b2f5-2_2.png" />

__Sample Output__

    Samantha
    Julia
    Scarlet

<br>
__Explanation__

See the following table:

<img src="https://s3.amazonaws.com/hr-challenge-images/12895/1443819966-c37c146d27-3.png" />

Now,

<ul>
	<li><em>Samantha&#39;s</em> best friend got offered a higher salary than her at 11.55</li>
	<li><em>Julia&#39;s</em> best friend got offered a higher salary than her at 12.12</li>
	<li><em>Scarlet&#39;s</em> best friend got offered a higher salary than her at 15.2</li>
    <li><em>Ashley&#39;s</em> best friend did NOT get offered a higher salary than her</li>
</ul>

The name output, when ordered by the salary offered to their friends, will be:

<ul>
	<li><em>Samantha</em></li>
	<li><em>Julia</em></li>
	<li><em>Scarlet</em></li>
</ul>

## SQL Solution #1

~~~sql
SELECT
    s.name
FROM students s
JOIN friends f ON s.id = f.id
JOIN packages p1 ON f.id = p1.id
JOIN packages p2 ON f.friend_id = p2.id
WHERE p2.salary > p1.salary
ORDER BY p2.salary
;
~~~

_Dialect: MySQL_
