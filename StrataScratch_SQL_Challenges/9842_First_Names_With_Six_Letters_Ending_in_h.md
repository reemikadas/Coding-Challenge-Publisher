# StrataScratch Challenge 9842: First Names With Six Letters Ending in 'h'

**Source:** [View challenge](https://platform.stratascratch.com/coding/9842-find-all-workers-whose-first-name-contains-6-letters-and-also-ends-with-the-letter-h)

## Challenge

Find all workers whose first name contains 6 letters and also ends with the letter 'h'.

Display all information about the workers in output.

## SQL Solution #1

~~~sql
SELECT
    *
FROM worker
WHERE CHAR_LENGTH(first_name) = 6
AND first_name LIKE '%h'
;
~~~

_Dialect: MySQL_
