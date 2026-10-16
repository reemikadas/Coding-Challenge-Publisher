# StrataScratch Challenge 9805: Find drafts which contains the word 'optimism'

**Source:** [View challenge](https://platform.stratascratch.com/coding/9805-find-drafts-which-contains-the-word-optimism)

## Challenge

A workplace file-storage system wants to help users quickly locate their own draft files related to a specific topic. Find all files whose name starts with "draft" (regardless of case) and whose content includes "optimism" anywhere within it, also regardless of case. Output all columns for these files.

## SQL Solution #1

~~~sql
SELECT
    *
FROM google_file_store
WHERE filename LIKE 'draft%'
AND contents LIKE '%optimism%'
;
~~~

_Dialect: MySQL_
