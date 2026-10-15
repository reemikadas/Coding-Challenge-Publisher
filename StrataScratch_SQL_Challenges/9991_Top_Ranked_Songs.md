# StrataScratch Challenge 9991: Top Ranked Songs

**Source:** [View challenge](https://platform.stratascratch.com/coding/9991-top-ranked-songs)

## Challenge

A music analytics team wants to see which songs dominate the charts by reaching the very top of the daily, region-level rankings. Find songs that have held the top position at least once. Count every day a song was #1 in a given region as a separate occurrence. For example, a song hitting #1 in five countries on the same day counts as 5.

Output the track name and the number of times it ranked at the top.

## SQL Solution #1

~~~sql
SELECT
    trackname,
    COUNT(*) AS times_top1
FROM spotify_worldwide_daily_song_ranking
WHERE position = 1
GROUP BY trackname
ORDER BY COUNT(*) DESC
;
~~~

_Dialect: MySQL_
