UPDATE flow.administrators
SET valid = 'active'
WHERE uuid_administratorid = $(userid);

COMMIT;