SELECT
  f.username
FROM flow.administrators f
WHERE f.username = $(username)