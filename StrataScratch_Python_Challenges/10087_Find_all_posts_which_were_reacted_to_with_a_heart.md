# StrataScratch Challenge 10087: Find all posts which were reacted to with a heart

**Source:** [View challenge](https://platform.stratascratch.com/coding/10087-find-all-posts-which-were-reacted-to-with-a-heart)

## Challenge

Find all posts which were reacted to with a heart. For such posts output all columns from facebook_posts table.

## Python Solution #1

~~~python
SELECT
  DISTINCT fp.*
FROM facebook_reactions fr
JOIN facebook_posts fp ON fr.post_id = fp.post_id
WHERE fr.reaction = 'heart'
;
~~~

_Runtime: Python 3_
