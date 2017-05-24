DELETE
FROM flow.administrators
WHERE username = ${usr};

COMMIT;