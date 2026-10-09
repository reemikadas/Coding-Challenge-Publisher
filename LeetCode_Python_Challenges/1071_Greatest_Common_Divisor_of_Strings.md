# LeetCode Challenge 1071: Greatest Common Divisor of Strings

**Source:** [View challenge](https://leetcode.com/problems/greatest-common-divisor-of-strings/description/?envType=study-plan-v2&envId=leetcode-75)

## Challenge

For two strings `s` and `t`, we say "`t` divides `s`" if and only if `s = t + t + t + ... + t + t` (i.e., `t` is concatenated with itself one or more times).

Given two strings `str1` and `str2`, return *the largest string *`x`* such that *`x`* divides both *`str1`* and *`str2`.

**Example 1:**

**Input:** str1 = "ABCABC", str2 = "ABC"

**Output:** "ABC"

**Example 2:**

**Input:** str1 = "ABABAB", str2 = "ABAB"

**Output:** "AB"

**Example 3:**

**Input:** str1 = "LEET", str2 = "CODE"

**Output:** ""

**Example 4:**

**Input:** str1 = "AAAAAB", str2 = "AAA"

**Output:** ""​​​​​​​

**Constraints:**

- `1 <= str1.length, str2.length <= 1000`

- `str1` and `str2` consist of English uppercase letters.

## Python Solution #1

~~~python
class Solution(object):
    def gcdOfStrings(self, str1, str2):
        """
        :type str1: str
        :type str2: str
        :rtype: str
        """
        merge_str_12 = str1 + str2
        merge_str_21 = str2 + str1

        if merge_str_12 == merge_str_21:
        
            num_chr_1 = len(str1)
            num_chr_2 = len(str2)
            
            while num_chr_2 != 0:
                num_chr_1, num_chr_2 = num_chr_2, num_chr_1 % num_chr_2
            
            gcd = num_chr_1
        
            return str1[:gcd]
    
        else:

            return ""
~~~

_Runtime: Python 3_
