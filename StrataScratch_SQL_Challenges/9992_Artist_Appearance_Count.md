# StrataScratch Challenge 9992: Artist Appearance Count

**Source:** [View challenge](https://platform.stratascratch.com/coding/9992-find-artists-that-have-been-on-spotify-the-most-number-of-times)

## Challenge

A music analytics team wants to identify which artists appear most frequently in Spotify’s worldwide song rankings. Count the number of times each artist appears in the ranking data.

Output the artist name and the corresponding number of appearances.

## SQL Solution #1

~~~sql
SELECT
    artist,
    COUNT(*) AS n_occurences
FROM spotify_worldwide_daily_song_ranking
GROUP BY artist
ORDER BY COUNT(*) DESC
;
~~~

_Dialect: MySQL_
