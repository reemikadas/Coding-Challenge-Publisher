# DataLemur Challenge 311: Fizz Buzz Sum

**Source:** [View challenge](https://datalemur.com/questions/python-fizz-buzz-sum)

## Challenge

Write a function `fizz_buzz_sum` to find the sum of all multiples of 3 or 5 below a target value.

For example, if the target value was 10, the multiples of 3 or 5 below 10 are 3, 5, 6, and 9. 

Because $3 + 5 + 6 + 9 = 23$, our function would return 23.

## Python Solution #1

~~~python
def fizz_buzz_sum(target):
  num_below_target = []
  multiple_of_three_and_five = []

  for n in range(1, target):
    num_below_target.append(n)
  
  for num in num_below_target:
    
    if num % 3 == 0 or num % 5 == 0:
      
      multiple_of_three_and_five.append(num)
    
  return sum(multiple_of_three_and_five)
~~~

_Runtime: Python 3_
