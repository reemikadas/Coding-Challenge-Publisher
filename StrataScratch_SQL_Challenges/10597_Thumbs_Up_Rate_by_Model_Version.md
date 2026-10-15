# StrataScratch Challenge 10597: Thumbs-Up Rate by Model Version

**Source:** [View challenge](https://platform.stratascratch.com/coding/10597-thumbs-up-rate-by-model-version)

## Challenge

The Applied Product team wants to compare how well users receive each model version. Calculate, for each model version, the percentage of rated responses that received a thumbs-up. Responses that were never rated are not counted, and model versions with no rated responses should not appear.

Feedback can be sent more than once for the same response, so count each response only once.

Output the model version and its thumbs-up percentage.

## SQL Solution #1

~~~sql
WITH distinct_feedback AS (
        SELECT DISTINCT
            response_id,
            model_version,
            feedback
        FROM ai_response_feedback
        WHERE feedback IS NOT NULL
)
SELECT
    model_version,
    100 * (COUNT(CASE WHEN feedback = 'thumbs_up' THEN response_id END) /
    COUNT(*)) AS thumbs_up_pct
FROM distinct_feedback
GROUP BY model_version
;
~~~

_Dialect: MySQL_
