# LeetCode Challenge 1768: Merge Strings Alternately

**Source:** [View challenge](https://leetcode.com/problems/merge-strings-alternately/description/?envType=study-plan-v2&envId=leetcode-75)

## Challenge

You are given two strings `word1` and `word2`. Merge the strings by adding letters in alternating order, starting with `word1`. If a string is longer than the other, append the additional letters onto the end of the merged string.



Return *the merged string.*





**Example 1:**




~~~text
Input: word1 = "abc", word2 = "pqr"
Output: "apbqcr"
Explanation: The merged string will be merged as so:
word1:  a   b   c
word2:    p   q   r
merged: a p b q c r
~~~



**Example 2:**




~~~text
Input: word1 = "ab", word2 = "pqrs"
Output: "apbqrs"
Explanation: Notice that as word2 is longer, "rs" is appended to the end.
word1:  a   b 
word2:    p   q   r   s
merged: a p b q   r   s
~~~



**Example 3:**




~~~text
Input: word1 = "abcd", word2 = "pq"
Output: "apbqcd"
Explanation: Notice that as word1 is longer, "cd" is appended to the end.
word1:  a   b   c   d
word2:    p   q 
merged: a p b q c   d
~~~





**Constraints:**





- `1 <= word1.length, word2.length <= 100`

- `word1` and `word2` consist of lowercase English letters.

## Python Solution #1

~~~python
class Solution(object):
    def mergeAlternately(self, word1, word2):
        """
        :type word1: str
        :type word2: str
        :rtype: str
        """
        alt_chr = ""

        for i in range(min(len(word1), len(word2))):
            alt_chr += word1[i] + word2[i]
        
        m = min(len(word1), len(word2))

        if len(word1) > len(word2):
            leftover_chr = word1[m:]
        else:
            leftover_chr = word2[m:]
        
        result = alt_chr + leftover_chr

        return result
~~~

_Runtime: Python 3_
