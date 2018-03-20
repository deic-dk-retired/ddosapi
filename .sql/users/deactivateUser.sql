UPDATE flow.administrators
SET valid = 'inactive'
WHERE administratorid = $(userid);

COMMIT;