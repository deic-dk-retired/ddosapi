UPDATE flow.administrators
SET valid = 'active'
WHERE administratorid = $(userid);

COMMIT;