UPDATE flow.administrators
SET lastlogin = now()
WHERE username = $(username)
RETURNING *;

COMMIT;