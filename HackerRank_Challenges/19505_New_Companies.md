# Challenge 19505: New Companies

**Source:** [View challenge](https://www.hackerrank.com/challenges/the-company/problem?isFullScreen=true)

## Challenge

Amber's conglomerate corporation just acquired some new companies. Each of the companies follows this hierarchy: <img src="https://s3.amazonaws.com/hr-challenge-images/19505/1458531031-249df3ae87-ScreenShot2016-03-21at8.59.56AM.png"/>

Given the table schemas below, write a query to print the _company\_code_, _founder_ name, total number of _lead_ managers, total number of _senior_ managers, total number of _managers_, and total number of _employees_. Order your output by ascending _company\_code_.

**Note:**

- The tables may contain duplicate records.
- The _company\_code_ is string, so the sorting should not be **numeric**. For example, if the _company\_codes_ are _C\_1_, _C\_2_, and _C\_10_, then the ascending _company\_codes_ will be _C\_1_, _C\_10_, and _C\_2_.

----

### Input Format

The following tables contain company data:

- _Company:_ The _company\_code_ is the code of the company and _founder_ is the founder of the company. <img src="https://s3.amazonaws.com/hr-challenge-images/19505/1458531125-deb0a57ae1-ScreenShot2016-03-21at8.50.04AM.png"/>

- _Lead\_Manager:_ The _lead\_manager\_code_ is the code of the lead manager, and the _company\_code_ is the code of the working company. <img src="https://s3.amazonaws.com/hr-challenge-images/19505/1458534960-2c6d764e3c-ScreenShot2016-03-21at8.50.12AM.png"/>

- _Senior\_Manager:_ The _senior\_manager\_code_ is the code of the senior manager, the _lead\_manager\_code_ is the code of its lead manager, and the _company\_code_ is the code of the working company. <img src="https://s3.amazonaws.com/hr-challenge-images/19505/1458534973-6548194998-ScreenShot2016-03-21at8.50.21AM.png"/>

- _Manager:_ The _manager\_code_ is the code of the manager, the _senior\_manager\_code_ is the code of its senior manager, the _lead\_manager\_code_ is the code of its lead manager, and the _company\_code_ is the code of the working company. <img src="https://s3.amazonaws.com/hr-challenge-images/19505/1458534988-7fc0af46ce-ScreenShot2016-03-21at8.50.29AM.png"/>

- _Employee:_ The _employee\_code_ is the code of the employee, the _manager\_code_ is the code of its manager, the _senior\_manager\_code_ is the code of its senior manager, the _lead\_manager\_code_ is the code of its lead manager, and the _company\_code_ is the code of the working company. <img src="https://s3.amazonaws.com/hr-challenge-images/19505/1458535002-d47f63cbb4-ScreenShot2016-03-21at8.50.41AM.png"/>

----

## SQL Solution #1

~~~sql
SELECT
    c.company_code,
    c.founder,
    COUNT(DISTINCT lm.lead_manager_code) AS total_lm,
    COUNT(DISTINCT sm.senior_manager_code) AS total_sm,
    COUNT(DISTINCT m.manager_code) AS total_m,
    COUNT(DISTINCT e.employee_code) AS total_e
FROM company c
LEFT JOIN lead_manager lm ON lm.company_code = c.company_code
LEFT JOIN senior_manager sm ON sm.lead_manager_code = lm.lead_manager_code
LEFT JOIN manager m ON m.senior_manager_code = sm.senior_manager_code
LEFT JOIN employee e ON e.manager_code = m.manager_code
GROUP BY c.company_code, c.founder
ORDER BY c.company_code;
~~~

_Dialect: MySQL_
