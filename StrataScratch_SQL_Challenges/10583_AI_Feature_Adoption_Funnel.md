# StrataScratch Challenge 10583: AI Feature Adoption Funnel

**Source:** [View challenge](https://platform.stratascratch.com/coding/10583-ai-feature-adoption-funnel)

## Challenge

The Data Science and Analytics team wants to see how many users progress through each stage of an AI writing feature's adoption funnel: `impression` (saw the feature), `first_use` (tried it at least once), and `repeat_use` (used it more than once). Count the unique users at each stage.

Because of a tracking gap, some users have a `repeat_use` event but no `first_use` event; they must still count toward `first_use`.

Output the stage and its number of unique users.

## SQL Solution #1

~~~sql
WITH impression_table AS (
    SELECT
        'impression' AS funnel_stage,
        COUNT(DISTINCT user_id) AS unique_user
    FROM ai_funnel_events
    WHERE event_type = 'impression'
),
    first_use_table AS (
    SELECT
        'first_use' AS funnel_stage,
        COUNT(DISTINCT user_id) AS unique_user
    FROM ai_funnel_events
    WHERE event_type = 'first_use'
    OR event_type = 'repeat_use'
),
    repeat_use_table AS (
        SELECT
            'repeat_use' AS funnel_stage,
            COUNT(DISTINCT user_id) AS unique_user
        FROM ai_funnel_events
        WHERE event_type = 'repeat_use'
)
SELECT * FROM impression_table
UNION
SELECT * FROM first_use_table
UNION
SELECT * FROM repeat_use_table
;
~~~

_Dialect: PostgreSQL_
