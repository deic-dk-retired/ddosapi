UPDATE flow.administrators
SET valid = 'inactive'
WHERE uuid_administratorid = $(userid);

COMMIT;