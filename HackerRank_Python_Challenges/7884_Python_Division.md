# Challenge 7884: Python: Division

**Source:** [View challenge](https://www.hackerrank.com/challenges/python-division/problem?isFullScreen=true)

## Challenge

<sub>Check the [Tutorial](https://www.hackerrank.com/challenges/python-division/tutorial) tab to know learn about division operators.</sub>  

**Task**  
The provided code stub reads two integers, $a$ and $b$, from STDIN.  

Add logic to print two lines. The first line should contain the result of integer division, $a$ // $b$. The second line should contain the result of float division, $a$ / $b$.  

No rounding or formatting is necessary.

**Example**  
$a = 3$  
$b = 5$  

- The result of the integer division $3//5 = 0$.  
- The result of the float division is $3/5 = 0.6$.  

Print:
<pre>
0
0.6
</pre>

### Input Format

The first line contains the first integer, $a$.  
The second line contains the second integer, $b$.

### Output Format

Print the two lines as described above.

## Python Solution #1

~~~python
if __name__ == '__main__':
    a = int(input())
    b = int(input())
    
    # Integer division
    print(a // b)
    
    # Float division
    print(a / b)
~~~

_Runtime: Python 3_
