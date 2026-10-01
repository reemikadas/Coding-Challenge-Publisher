# DataLemur Challenge 299: Intersection of Two Lists

**Source:** [View challenge](https://datalemur.com/questions/python-intersection-of-two-lists)

## Challenge

Write a function to get the intersection of two lists.

For example, if A = [1, 2, 3, 4, 5], and B = [0, 1, 3, 7] then you should return [1, 3].

p.s. this is the same as question 9.1 in [Ace the Data Science Interview](https://amzn.to/3kF79Fx).

## Python Solution #1

~~~python
def intersection(a, b):
  result = []
  for num in a:
    if num in b:
      result.append(num)
  
  return result
~~~

_Runtime: Python 3_
