# DataLemur Challenge 317: Factorial Formula

**Source:** [View challenge](https://datalemur.com/questions/python-factorial-formula)

## Challenge

Given a number $n$, write a formula that returns $n!$. 

In case you forgot the factorial formula, $ n! = n * (n-1) * (n-2) * ..... 2 * 1$. 

For example, $5! = 5 * 4 * 3 * 2 * 1 = 120$ so we'd return 120. 

Assume is $n$ is a non-negative integer. 

p.s. if this problem seems too trivial, try the follow-up Microsoft interview problem [Factorial Trailing Zeroes](https://datalemur.com/questions/python-factorial-trailing-zeroes)

## Python Solution #1

~~~python
def factorial(n):
  factorial_result = 1

  for i in range(n):
    factorial_result *= (n - i)

  return factorial_result
~~~

_Runtime: Python 3_
