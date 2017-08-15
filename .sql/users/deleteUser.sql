DELETE
FROM flow.administrators
WHERE username = $(username);

COMMIT;