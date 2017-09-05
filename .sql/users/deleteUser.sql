DELETE
FROM flow.administrators
WHERE administratorid = $(userid);

COMMIT;