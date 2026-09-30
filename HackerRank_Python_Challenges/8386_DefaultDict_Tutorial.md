# Challenge 8386: DefaultDict Tutorial

**Source:** [View challenge](https://www.hackerrank.com/challenges/defaultdict-tutorial/problem?isFullScreen=true)

## Challenge

The *defaultdict* tool is a container in the collections class of Python. It's similar to the usual dictionary (*dict*) container, but the only difference is that a defaultdict will have a _default_ value if that key has not been set yet. If you didn't use a defaultdict you'd have to check to see if that key exists, and if it doesn't, set it to what you want.    
**For example:**

    from collections import defaultdict
    d = defaultdict(list)
    d['python'].append("awesome")
    d['something-else'].append("not relevant")
    d['python'].append("language")
    for i in d.items():
    	print i
        
This prints:

	('python', ['awesome', 'language'])
	('something-else', ['not relevant'])
    
In this challenge, you will be given $2$ integers, $n$ and $m$. There are $n$ words, which might repeat, in word group $A$. There are $m$ words belonging to word group $B$. For each  $m$ words, check whether the word has appeared in group $A$ or not. Print the indices of each occurrence of $m$ in group $A$. If it does not appear, print $-1$.

**Example**  

Group A contains 'a', 'b', 'a'
Group B contains 'a', 'c'

For the first word in group B, 'a', it appears at positions $1$ and $3$ in group A.
The second word, 'c', does not appear in group A, so print $-1$.

Expected output:

    1 3
    -1

### Input Format

The first line contains integers, $n$ and $m$ separated by a space.  
The next $n$ lines contains the words belonging to group $A$.  
The next $m$ lines contains the words belonging to group $B$.

### Constraints

$1\le n\le 10000$  
$1\le m\le 100$  
$1\le\ length\ of\ each\ word\ in\ the\ input\le100$

### Output Format

Output $m$ lines.  
The $i^{th}$ line should contain the $1$-indexed positions of the occurrences of the $i^{th}$ word separated by spaces.

## Python Solution #1

~~~python
# Enter your code here. Read input from STDIN. Print output to STDOUT

from collections import defaultdict
n,m = map(int, input().split())

d = defaultdict(list)

for i in range(n):
    word = input()
    d[word].append(i+1)

for t in range(m):
    word = input()
    if word in d:
        print(*d[word])
    else:
        print(-1)
~~~

_Runtime: Python 3_
