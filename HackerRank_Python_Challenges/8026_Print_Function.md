# Challenge 8026: Print Function

**Source:** [View challenge](https://www.hackerrank.com/challenges/python-print/problem?isFullScreen=true)

## Challenge

<sub>Check [Tutorial](https://www.hackerrank.com/challenges/python-print/tutorial) tab to know how to to solve.</sub>  
 
The included code stub will read an integer, $n$, from STDIN.

Without using any string methods, try to print the following:  

$123\cdots n$  

Note that "$\dots$" represents the consecutive values in between.

**Example**  
$n = 5$

Print the string $12345$.

### Input Format

The first line contains an integer $n$.

### Constraints

$1 \le n \le 150$

### Output Format

Print the list of integers from $1$ through $n$ as a string, without spaces.

## Python Solution #1

~~~python
if __name__ == '__main__':
    n = int(input())
    for i in range(1, n+1):
       print(i, end="")
~~~

_Runtime: Python 3_
