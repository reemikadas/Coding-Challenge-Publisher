# DataLemur Challenge 378: Another One

**Source:** [View challenge](https://datalemur.com/questions/python-add-another-one)

## Challenge

We're trying to create a digital clone of DJ Khaled. No fancy AI or alorithms needed. 

Just take a number and add another one:

![](https://api.datalemur.com/assets/2742b208-5125-4f7d-9e80-191e3066917b)

More specifically, you are given an integer array `digits`, where each `digits[i]` is the ith digit of positive whole number. It is ordered from most significant to least significant digit. 

Return an array of digits of the number after adding **another one** to the input. 

### **Example #1**  

**Input:**  `digits = [1, 2, 3]`  

**Output:**  `[1, 2, 4]`  

### **Example #2**  

**Input:**  `digits = [6, 9]`  

**Output:**  `[7, 0]`

## Python Solution #1

~~~python
def another_one(digits):
  digit = []
  
  for d in digits:
    digit.append(str(d))
    
  result = "".join(digit)
  result = str(int(result) + 1)
  result = list(map(int, result))
  
  return result
~~~

_Runtime: Python 3_
