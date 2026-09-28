# Challenge 12888: Binary Tree Nodes

**Source:** [View challenge](https://www.hackerrank.com/challenges/binary-search-tree-1/problem?isFullScreen=true)

## Challenge

You are given a table, <em>BST</em>, containing two columns: <em>N&nbsp;</em>and <em>P,</em>&nbsp;where <em>N</em> represents the value of a node in <em>Binary Tree</em>, and <em>P</em> is the parent of <em>N</em>.

<img src="https://s3.amazonaws.com/hr-challenge-images/12888/1443818507-5095ab9853-1.png" />

Write a query to find the node type of <em>Binary Tree</em> ordered by the value of the node. Output one of the following for each node:

<ul>
	<li><em>Root</em>: If node is root node.</li>
	<li><em>Leaf</em>: If node is leaf node.</li>
	<li><em>Inner</em>: If node is neither root nor leaf node.</li>
</ul>

__Sample Input__

<img src="https://s3.amazonaws.com/hr-challenge-images/12888/1443818467-30644673f6-2.png" />

__Sample Output__

    1 Leaf
    2 Inner
    3 Leaf
    5 Root
    6 Leaf
    8 Inner
    9 Leaf

<br>
__Explanation__

The <em>Binary Tree</em> below illustrates the sample:

<img src="https://s3.amazonaws.com/hr-challenge-images/12888/1443773633-f9e6fd314e-simply_sql_bst.png" />

## SQL Solution #1

~~~sql
SELECT 
    N,
    CASE
        WHEN P IS NULL THEN "Root"
        WHEN N IN (SELECT N FROM bst WHERE N NOT IN 
            (SELECT DISTINCT P FROM bst WHERE P IS NOT NULL)
            ) THEN "Leaf"
        ELSE "Inner"
    END AS node_type
FROM bst
ORDER BY N;
~~~

_Dialect: MySQL_
