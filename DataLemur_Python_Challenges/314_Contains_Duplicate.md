# DataLemur Challenge 314: Contains Duplicate

**Source:** [View challenge](https://datalemur.com/questions/python-contains-duplicate)

## Challenge

Given an list of integers called `input`, return `True` if any value appears at least twice in the array.
Return `False` if every element in the input list is distinct.

For example, if the input list was `[1,3,5,7,1]`, then return `True` because the number 1 shows up twice.

However, if the input was `[1,3,5,7]` then return `False`, because every element of the list is distinct.

## Python Solution #1

~~~python
def contains_duplicate(input)-> bool:
  unique_input_element = set()

  for i in input:
    unique_input_element.add(i)
  
  if len(input) != len(unique_input_element):
    return True
  
  else:
    return False
~~~

_Runtime: Python 3_
