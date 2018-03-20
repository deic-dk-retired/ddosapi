SELECT
f.username,
f.valid
FROM flow.administrators f
WHERE f.username = $(username)