# DataLemur Challenge 354: Same Stripes

**Source:** [View challenge](https://datalemur.com/questions/python-same-stripes)

## Challenge

You are given an `m x n` matrix. Your task is to determine if the matrix has diagonal stripes where all elements in each diagonal from top-left to bottom-right are **of the same stripe**—that is, they are identical.

In this context, each diagonal stripe runs from the top-left corner to the bottom-right corner of the matrix. Check if every diagonal stripe consists entirely of the same number.

Return `True` if all diagonal stripes are of the same stripe, otherwise return `False`.

### Example #1

![Same Stripe DataLemur Example 1](https://api.datalemur.com/assets/93c76464-31db-40cc-8079-db73b098b5ec)

**Input:**  matrix = `[[42, 7, 13, 99], [6, 42, 7, 13], [1, 6, 42, 7]]`

**Output:** `True`

**Explanation:**  
In this grid, the diagonals are:
- `[1]`
- `[6, 6]`
- `[42, 42, 42]`
- `[7, 7, 7]`
- `[13, 13]`
- `[99]`

All elements in each diagonal ar identical. Thus, the answer is `True`.

### Example #2

**Input:**  matrix = `[[8, 23], [69, 1]]`

**Output:** `False`

![Same Stripe DataLemur Example 2]![](https://api.datalemur.com/assets/ca10c9ad-b59b-4ee9-920c-1ef4a8fd14a4)

**Explanation:**  
The diagonal `[8, 1]` does not consist of elements of the same stripe.

## Python Solution #1

~~~python
def is_same_stripes(matrix):
  m = len(matrix) # number of rows
  n = len(matrix[0]) # number of columns
  
  for row in range(m-1):
    for column in range(n-1):
      if matrix[row][column] != matrix[row + 1][column+1]:
        return False
  
  return True
~~~

_Runtime: Python 3_
