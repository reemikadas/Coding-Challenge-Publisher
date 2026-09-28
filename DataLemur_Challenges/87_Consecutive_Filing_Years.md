# DataLemur Challenge 87: Consecutive Filing Years

**Source:** [View challenge](https://datalemur.com/questions/consecutive-filing-years)

## Challenge

Intuit, a company known for its tax filing products like TurboTax and QuickBooks, offers multiple versions of these products. 

Write a query that identifies the user IDs of individuals who have filed their taxes using any version of TurboTax for three or more consecutive years. Each user is allowed to file taxes once a year using a specific product. Display the output in the ascending order of user IDs.

### `filed_taxes` Table:
|**Column Name**|**Type**|
|:----|:----|
| filing_id| integer |
| user_id | varchar|
| filing_date | datetime|
| product |varchar|

### `filed_taxes` Example Input:
|**filing_id**|**user_id**|**filing_date**|**product**|
|:----|:----|:----|:----|
| 1| 1 | 4/14/2019 | TurboTax Desktop 2019 |
| 2 | 1 | 4/15/2020 | TurboTax Deluxe |
| 3 | 1 | 4/15/2021 | TurboTax Online |
| 4 | 2 | 4/07/2020 | TurboTax Online |
| 5 | 2 | 4/10/2021 | TurboTax Online |
| 6 | 3 | 4/07/2020 | TurboTax Online |
| 7 | 3 | 4/15/2021 | TurboTax Online |
| 8 | 3 | 3/11/2022 | QuickBooks Desktop Pro |
| 9 | 4 | 4/15/2022 | QuickBooks Online |

### Example Output:
|**user_id**|
|:----|
| 1 |

### Explanation:
User 1 has consistently filed their taxes using TurboTax for 3 consecutive years. User 2 is excluded from the results because they missed filing in the third year and User 3 transitioned to using QuickBooks in their third year.

The dataset you are querying against may have different input & output - **this is just an example**!

## SQL Solution #1

~~~sql
SELECT
  DISTINCT f1.user_id
FROM filed_taxes f1
JOIN filed_taxes f2 ON f1.user_id = f2.user_id
                  AND f1.filing_date < f2.filing_date
JOIN filed_taxes f3 ON f2.user_id = f3.user_id
                  AND f2.filing_date < f3.filing_date
WHERE (f1.product LIKE '%TurboTax%'
  AND f2.product LIKE '%TurboTax%'
  AND f3.product LIKE '%TurboTax%')
AND (EXTRACT(YEAR FROM f1.filing_date) + 1 = EXTRACT(YEAR FROM f2.filing_date)
  AND EXTRACT(YEAR FROM f2.filing_date) + 1 = EXTRACT(YEAR FROM f3.filing_date)
  )
;
~~~

_Dialect: PostgreSQL_
